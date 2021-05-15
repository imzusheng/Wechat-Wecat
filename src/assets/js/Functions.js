import axios from 'axios'

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
