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

export const API_UPLOAD = {
  POST_COMMON_BEFORE_UPLOAD: '/upload/beforeUpload', // 上传前检查
  POST_COMMON_UPLOAD_V2: '/upload/chunks',
  POST_COMMON_UPLOAD_MERGE: '/upload/merge'
}

/** 通用API */
export const API_COMMON = {
  /** 获取静态文件，需要权限 */
  GET_COMMON_STATIC: '/static',
  /** 获取聊天记录 */
  GET_COMMON_CHAT_HISTORY: '/common/chatHistory',
  /** 获取联系人和信息 */
  GET_COMMON_CONTACT: '/common/contact',
  /** 菜单栏的联系人搜索 */
  GET_COMMON_NAV_SEARCH: '/common/navSearch',
  /** 菜单中用户配置信息 */
  GET_COMMON_USER_CONFIG: '/common/userConfig',
  /** 修改菜单中用户配置信息 */
  PUT_COMMON_USER_CONFIG: '/common/userConfig/put',
  /** 清除所有聊天记录 */
  GET_COMMON_DELETE_CHAT_RECORD: '/common/deleteAllRecord',
  /** 获取未读消息 */
  GET_COMMON_UNREAD_MESSAGE: '/common/unRead',
  /** 获取好友请求消息 */
  GET_COMMON_FRIEND_APPLY: '/common/friendApply'
}
