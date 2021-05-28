import axios from 'axios'
import { API_COMMON, API_UPLOAD } from '@/assets/js/api'
import SparkMD5 from 'spark-md5'

export const apiService = { // 请求方式封装
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
  }
}

export const apiUpload = {
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
  // 上传前检查
  beforeUpload: (file) => {
    const {
      postfix,
      hash
    } = file
    return new Promise(resolve => {
      apiService.postData(API_UPLOAD.POST_COMMON_BEFORE_UPLOAD, {
        postfix,
        hash
      }).then(res => {
        resolve(res)
      })
    })
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
