export const API_LOGIN = {
  POST_LOGIN_USERID: '/login/userID', // 验证用户名
  POST_LOGIN_PWD: '/login/pwd', // 验证密码
  GET_LOGIN_CHECK_REPEAT: '/login/checkRepeatLogin', // 验证是否重复登录
  PUT_LOGIN_UPDATE: '/login/update', // 登录后更新用户信息
  POST_LOGIN_FORGET: '/login/forget', // 忘记密码
  PUT_LOGIN_MODIFY_PWD: '/login/modifyPwd', // 修改密码
  GET_LOGIN_IP_ADDRESS: '/login/userOrigin' // 返回IP
}

export const API_SIGN = {
  POST_SIGN_VERIFY: '/sign/verify',
  POST_SIGN_SUCCESS: '/sign/success'
}

export const API_COMMON = {
  GET_COMMON_STATIC: '/static',
  POST_COMMON_UPLOAD: '/common/upload',
  GET_COMMON_CHAT_HISTORY: '/common/chatHistory',
  GET_COMMON_NAV_SEARCH: '/common/navSearch',
  GET_COMMON_USER_CONFIG: '/common/userConfig',
  PUT_COMMON_USER_CONFIG: '/common/userConfig/put'
}
