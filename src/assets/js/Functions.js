import axios from 'axios'
import { API_COMMON } from '@/assets/js/api'

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
   * @param file       文件对象
   * @param spark      引入spark-md5
   * @param options    配置
   *     chunkSize     每个分片的大小
   *     oneTime       一次最多发起POST请求条数
   */
  uploadPartition: (file, hash, options, cb) => {
    return new Promise(resolve => {
      const {
        postfix,
        size,
        name
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
      for (let i = 0; i < chunksTotal; i++) {
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
        formData.append('postfix', postfix)
        formData.append('hash', hash)
        formData.append('chunkIndex', i + 1)
        formData.append('chunksTotal', chunksTotal)
        formData.append('file', chunk, `${name}`)
        formDatas[i + 1] = formData
      }

      const run = () => { // 执行队列任务
        Object.keys(formDatas).forEach(index => {
          if (eventLoop < oneTime) {
            eventLoop++
            const tempData = formDatas[index]
            delete formDatas[index]
            apiService.postData(API_COMMON.POST_COMMON_UPLOAD_V2, tempData).then(res => {
              if (!res.data.error) {
                const progress = ((1 - Object.keys(formDatas).length / chunksTotal) * 100).toFixed(0)// 返回上传进度
                cb(progress)
              }
              eventLoop-- // 不管有无错误，一个请求都已经完成

              if (Object.keys(formDatas).length !== 0) {
                run()
              } else if (Object.keys(formDatas).length === 0 && eventLoop === 0) { // 上传完毕
                apiService.postData(API_COMMON.POST_COMMON_UPLOAD_MERGE, { // 合并请求
                  hash,
                  postfix
                }).then(res => { // 文件合并完成
                  resolve(res)
                })
              }
            })
          }
        })
      }

      run()
    })
  },
  beforeUpload: (postfix, hash) => {
    return new Promise(resolve => {
      apiService.postData(API_COMMON.POST_COMMON_BEFORE_UPLOAD, {
        postfix,
        hash
      }).then(res => {
        resolve(res)
      })
    })
  }
}
