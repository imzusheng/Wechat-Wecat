import Vue from 'vue'
import Vuex from 'vuex'
import { WsServer } from '../assets/js/wsServer'
import { Notification, Message } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: () => ({
    wsAddress: process.env.NODE_ENV === 'production' ? 'wss://zusheng.club/wsServerV2' : 'ws://localhost:4800',
    globe: {
      navigation: {
        searchResult: [], // nav搜索返回的结果
        historyList: {
          nameList: [],
          chat: {}
        },
        contactList: [],
        groupList: []
      }
    },
    chatObj: '', // 聊天对象
    uid: window.sessionStorage.getItem('uid'), // 用户名
    apply: [], // 好友申请
    applyList: [],
    friends: [], // 返回的好友数组
    refs: {},
    unReadMsg: {}, // 保存未读消息的数量 {用户名：未读数量}
    ws: {}, // WebSocket 对象
    maxMsg: 50, // 聊天框显示消息的最大数量
    timeSwitch: true, // 设置面板中显示消息时间开关
    sendKeyCode: false, // 设置菜单 - 使用组合键发送
    friendInfo: '',
    addFriState: false
  }),
  mutations: {
    // 滚动条自动到底底部
    scrollRec (state, refs) {
      if (!state.chatObj) return
      if (refs) {
        state.refs = refs
      }
      setTimeout(() => {
        state.refs.msgContentBox.scrollTop = state.refs.msgContent.offsetHeight
      }, 0)
    },
    // 建立WebSocket连接
    linkWsServer (state) {
      state.ws = new WsServer(state.wsAddress, (data) => {
        this.commit('wsMsgGHandler', data)
      })
    },
    navInit (state, chatHistoryResult) {
      if (!chatHistoryResult.data.error) {
        const friendNameList = []
        Object.keys(chatHistoryResult.data.data).forEach(value => {
          friendNameList.push(value)
        })
        state.globe.navigation.contactList = friendNameList
        state.globe.navigation.historyList.nameList = friendNameList
        state.globe.navigation.historyList.chat = chatHistoryResult.data.data
      }
    },
    // token过期时
    authHandle (state, response) {
      Vue.prototype.$alert('请重新登录', response.data.msg, {
        confirmButtonText: '确定',
        callback: () => {
          state.ws.sendMsg({
            uid: state.uid,
            type: 'exit'
          }, this.wsMsgGHandler)
          window.sessionStorage.removeItem('token')
          window.sessionStorage.removeItem('nickName')
          window.sessionStorage.removeItem('email')
          window.sessionStorage.removeItem('avatar')
          window.sessionStorage.removeItem('uid')
          window.location.reload()
        }
      })
    },
    setAddFriend (state, friendInfo) {
      state.friendInfo = friendInfo
    },
    // 更新未读消息
    unReadMsg (state, chatObj) {
      if (!state.unReadMsg[chatObj]) {
        state.unReadMsg[chatObj] = 1
      } else {
        state.unReadMsg[chatObj]++
      }
    },
    // 清除未读消息
    clearUnRead (state, chatObj) {
      state.unReadMsg[chatObj] = 0
      state.unReadMsg = JSON.parse(JSON.stringify(state.unReadMsg)) // 可以触发更新，不然nav_chatHistory中的未读消息数量不会消除
      // Vue.set(state.unReadMsg, chatObj, 0)
    },
    // 获取服务器聊天记录，并更新store的未读消息列表
    chatRecordChange (state, playLoad) {
      playLoad.forEach(value1 => {
        if (value1.chat.length > state.maxMsg) value1.chat.splice(0, value1.chat.length - state.maxMsg)
        const ObjName = value1.chatObj
        // 以下为更新未读消息，遍历chat数组中消息对象的status属性是否为false（false为未读）并计数
        value1.chat.forEach(value2 => {
          if (value2.status === false) {
            state.unReadMsg[ObjName] >= 0 ? state.unReadMsg[ObjName] += 1 : state.unReadMsg[ObjName] = 1
          }
        })
        Vue.set(state.friends, value1.chatObj, value1.chat)
      })
    },
    // 更新全局聊天对象
    chatObjChange (state, playLoad) {
      state.chatObj = playLoad
    },
    // 更新聊天记录
    chatRecordAdd (state, playLoad) {
      if (playLoad.type === 'send') {
        state.globe.navigation.historyList.chat[state.chatObj].chat.push(playLoad.chat)
      } else {
        Notification.success({
          title: playLoad.from,
          message: playLoad.msg.content
        })
        state.globe.navigation.historyList.chat[playLoad.from].chat.push({
          msg: playLoad.msg.content,
          say: 'you',
          time: playLoad.msg.time
        })
      }
    },
    wsMsgGHandler (state, data) {
      const msgObj = typeof data.data === 'object' ? data.data : JSON.parse(data.data)
      switch (msgObj.type) {
        case 'addFriend':
          /** 好友请求发送成功后 */
          Message({
            type: msgObj.error ? 'error' : 'success',
            message: msgObj.message
          })
          return
        case 'exit':
          return this.$message({
            type: 'success',
            message: '退出登录'
          })
        case 'chat':
          this.commit('chatRecordAdd', msgObj)
          // 重置滚动条到底部
          this.commit('scrollRec')
          // 收到消息时，如果为未读状态则更新store未读消息unReadMsg
          if (msgObj.from !== state.chatObj) {
            this.commit('unReadMsg', msgObj.from)
          }
      }
    }
  },
  getters: {
    returnFriends: state => {
      return state.friends
    }
  },
  modules: {
    signStore: require('./signStore')
  }
})
