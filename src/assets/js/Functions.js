import axios from 'axios'
import { API_UPLOAD } from '@/assets/js/api'
import SparkMD5 from 'spark-md5'

/**
 * axios 请求方式封装
 * @type {{deleteData: (function(*=, *=): AxiosPromise<any>), upload: (function(*=, *=, *): AxiosPromise<any>), updateData: (function(*=, *=): AxiosPromise<any>), postData: (function(*=, *=): AxiosPromise<any>), getData: (function(*=, *=): AxiosPromise<any>)}}
 */
export const apiService = {
  getData: (url, params) => {
    return axios({
      method: 'get',
      url: url,
      params: params
    })
  },

  postData: (url, params) => {
    return axios({
      method: 'post',
      url: url,
      timeout: 0,
      data: params
    })
  },

  deleteData: (url, params) => {
    return axios({
      method: 'delete',
      url: url,
      data: params
    })
  },

  updateData: (url, params) => {
    return axios({
      method: 'put',
      url: url,
      data: params
    })
  },
  upload: (url, params, cb) => {
    return axios({
      method: 'post',
      url: url,
      data: params,
      headers: { 'Content-type': 'multipart/form-data;' },
      onUploadProgress: function (progressEvent) {
        cb(progressEvent)
      }
    })
  }
}

export const apiUpload = {
  /**
   * 上传文件入口
   * @param file            文件对象
   * @param options         配置
   *     chunk              Boolean 是否使用分片发送
   * @param cb              回调函数
   * @returns function      根据chunk执行对应方法
   */
  async upload (file, options, cb) {
    // 获取hash
    file.hash = this.getHash(file.name + file.size + file.lastModified)
    // 取文件后缀,如 png
    file.postfix = file.name.slice(file.name.indexOf('.') + 1, file.name.length)
    // 合并参数
    const params = Object.assign(file, options)
    // 上传前查询服务器是否存在该文件
    const res = await this.beforeUpload(params)
    // exist = true则存在重复文件，返回文件名
    if (res.data.exist) {
      return res
    } else {
      // chunk 为true则采用分片发送，反之一次性发送
      return options.chunk ? await this.uploadPartition(file, options, cb) : await this.uploadOnce(file, options, cb)
    }
  },
  /**
   * 单次上传
   * @param file          文件对象
   * @param options       配置
   * @param cb            回调上传进度
   * @returns Promise
   */
  uploadOnce (file, options, cb) {
    return new Promise(resolve => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', file.name)
      formData.append('hash', file.hash)
      formData.append('postfix', file.postfix)
      apiService.upload(API_UPLOAD.POST_COMMON_UPLOAD, formData, (progress) => cb(progress)).then(res => {
        resolve(res)
      })
    })
  },
  /**
   * 上传数据分片
   * @param file       文件对象
   * @param options    配置
   *     chunkSize     每个分片的大小
   *     oneTime       一次最多发起POST请求条数
   * @param cb         回调返回文件上传进度条
   */
  uploadPartition: (file, options, cb) => {
    return new Promise(resolve => {
      const {
        postfix,
        size,
        name,
        hash
      } = file
      const {
        chunkSize,
        oneTime
      } = options
      // 切割总次数
      const chunksTotal = Math.ceil(size / chunkSize)
      // 切割的区间
      let startOffset = 0
      let endOffset = 0
      const formDatas = {} // 待发送的分片数组
      let eventLoop = 0 // 正在发送的请求
      for (let i = 0; i < chunksTotal; i++) { /// //////////////////////////////////////// 遍历切割chunk
        startOffset = chunkSize * i
        // 当剩余的大小不足再切一份时，直接赋值文件大小到尾部 endOffset
        if ((size - chunkSize * i) < chunkSize) {
          endOffset = size
        } else {
          endOffset += chunkSize
        }
        // 开始切割
        const chunk = file.slice(startOffset, endOffset)
        const formData = new FormData()
        // 切割完成，添加额外数据
        formData.append('file', chunk, `${name}`)
        formData.append('hash', hash)
        formData.append('postfix', postfix)
        formData.append('chunkIndex', i + 1)
        formData.append('chunksTotal', chunksTotal)
        formDatas[i + 1] = formData
      }

      /// /////////////////////////////////////////////////////////////////////////////// 并发控制
      const run = () => { // 执行队列任务
        Object.keys(formDatas).forEach(index => {
          if (eventLoop < oneTime) {
            eventLoop++
            const tempData = formDatas[index]
            delete formDatas[index]
            /// //////////////////////////////////////////////// 包含额外数据
            // formData.append('file', chunk, `${name}`)      // 文件，文件名
            // formData.append('hash', hash)                  // hash
            // formData.append('postfix', postfix)            // postfix 文件后缀 'png'
            // formData.append('chunkIndex', i + 1)           // 当前分片的下标
            // formData.append('chunksTotal', chunksTotal)    // 分片总数
            apiService.postData(API_UPLOAD.POST_COMMON_UPLOAD_V2, tempData).then(res => { // 发送分片
              if (!res.data.error) {
                const progress = ((1 - Object.keys(formDatas).length / chunksTotal) * 100).toFixed(0)
                // 返回上传进度
                cb(progress)
              }

              eventLoop-- // 不管有无错误，一个请求都已经完成

              if (Object.keys(formDatas).length !== 0) { // 分片集合中仍有数据，继续发送
                run()
              } else if (Object.keys(formDatas).length === 0 && eventLoop === 0) { /// /////////////////////// 上传完毕,发起合并数据的请求
                apiService.postData(API_UPLOAD.POST_COMMON_UPLOAD_MERGE, {
                  postfix,
                  name,
                  hash // 大概率不重复的hash值
                }).then(res => { // 文件合并完成
                  resolve(res) /// /////////////////////////////////////////////////////////// -> 函数终点
                })
              }
            })
          }
        })
      }

      run() // 启动！
    })
  },
  /** 上传前检查服务器是否存在文件 */
  beforeUpload: (params) => {
    const {
      postfix,
      hash,
      chunk
    } = params
    return new Promise(resolve => {
      apiService.postData(API_UPLOAD.POST_COMMON_BEFORE_UPLOAD, {
        postfix,
        hash,
        chunk
      }).then(res => {
        resolve(res)
      })
    })
  },
  getHash: (str) => {
    if (typeof str !== 'string') {
      return console.error('请导入字符串')
    }
    const spark = new SparkMD5()
    spark.append(str)
    return spark.end()
  }

}

export const getHash = (str) => {
  if (typeof str !== 'string') {
    return console.error('请导入字符串')
  }
  const spark = new SparkMD5()
  spark.append(str)
  return spark.end()
}

/** 文件处理处理相关 */
export const fileHandle = {
  /**
   * 略缩图处理，file转换为URL
   * @param file
   * @returns Promise->base64Url
   */
  readFileAsync (file) {
    return new Promise(resolve => {
      const reader = new FileReader()
      // onload是指readAsDataURL处理完后
      reader.onload = evt => resolve(evt.target.result)
      reader.readAsDataURL(file)
    })
  },

  /** 将base64转换成file文件对象 */
  /**
   * @param dataUrl base64
   * @returns {File} 文件对象
   */
  dataURLtoFile (dataUrl) {
    // 获取到base64编码
    const arr = dataUrl.split(',')
    // 将base64编码转为字符串
    const bstr = window.atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n) // 创建初始化为0的，包含length个元素的无符号整型数组
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File(
      [u8arr],
      `${Date.now()}.${arr[0].replace(new RegExp(/data:image\/|base64/g), '')}`,
      { type: arr[0].replace(new RegExp(/data:|base64/g), '') })
  }
}
