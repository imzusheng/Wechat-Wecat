import Vue from 'vue'
import Vuex from 'vuex'
import { WsServer } from '../assets/js/wsServer'
import { Message, Notification } from 'element-ui'
import { apiService } from '@/assets/js/Functions'
import { API_COMMON } from '@/assets/js/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: () => ({
    wsAddress: process.env.NODE_ENV === 'production' ? 'wss://zusheng.club/wsServerV2' : 'ws://localhost:4800',
    chatObj: '', // 全局聊天对象
    uid: window.sessionStorage.getItem('uid'), // 用户名
    refs: {}, // $refs
    ws: {}, // WebSocket 对象
    globe: {
      unReadMsg: {}, // 保存未读消息的数量 {用户名：未读数量}
      inputStatus: false, // 好友输入状态
      mainPanelMask: false, // 拖动文件进来时触发
      addFriend: { // 添加好友相关
        applyList: [], // 所有好友请求
        friendInfo: '', // 当前将要发送好友请求的那位好友信息
        addFriPanelState: false // 是否展开好友申请面板
      },
      navigation: {
        searchResult: [], // nav搜索返回的结果
        unReadMessage: [], // 未读消息
        historyList: {
          historyListStatus: false, // historyList 是否已经从服务器获取到了数据
          nameList: [],
          sortList: [], // 仅包含好友姓名，为了排序好友
          picked: '' // 选中的好友
        },
        contactList: {
          contactListStatus: false,
          nameList: []
        },
        groupList: []
      },
      chat: { // 聊天面板用的
        befScroll: 0,
        curScroll: 0,
        chatList: [],
        total: '',
        current: 1// 当前页数
      },
      userConfig: { // 设置面板
        timeSwitch: true, // 设置面板中显示消息时间开关
        friendInfoPanel: true, // 好友信息面板
        sendKeyCode: false, // 设置菜单 - 使用组合键发送
        pageSize: 5, // 每页加载的消息数量
        previewImgHeight: 100,
        loadingChat: true // 是否懒加载
      },
      chatObjChangeFlag: false // 原本用来触发切换好友时消息气泡动画的，暂时废弃
    }
  }),
  mutations: {
    /** 初始化数据 */
    navInit (state, res) {
      /** 获取聊天记录数据 */
      apiService.getData(API_COMMON.GET_COMMON_CHAT_HISTORY, {
        email: window.sessionStorage.getItem('uid')
      }).then(res => {
        state.globe.navigation.historyList.nameList = res.data.result
        state.globe.navigation.historyList.sortList = [] // push之前先重置一下，防止出事
        Object.keys(res.data.result).forEach(obj => {
          state.globe.navigation.historyList.sortList.push(obj)
        })
        state.globe.navigation.historyList.historyListStatus = true
      })
      /** 获取联系人数据 */
      apiService.getData(API_COMMON.GET_COMMON_CONTACT, {
        email: window.sessionStorage.getItem('uid')
      }).then(res => {
        state.globe.navigation.contactList.nameList = res.data.result
        state.globe.navigation.contactList.contactListStatus = true
      })
    },
    /** 改变全局聊天对象 */
    chatObjChange (state, playLoad) {
      state.chatObj = playLoad // 这句是本函数主要功能，不能少
      state.inputStatus = false // 好友输入状态要初始化
      state.globe.chat.current = 1
      state.globe.chat.befScroll = 0
      state.globe.chat.curScroll = 0
      if (!state.globe.navigation.historyList.nameList[state.chatObj]) { // 如果当前好友没有聊天记录
        state.globe.chat.chatList = []
      } else {
        state.globe.userConfig.loadingChat ? this.commit('loadChat') : this.commit('loadOnceChat')
      }
    },
    /** 一次性加载 */
    loadOnceChat (state) {
      if (!state.chatObj) return
      state.globe.chat.chatList = state.globe.navigation.historyList.nameList[state.chatObj].chat
      state.globe.chat.total = state.globe.navigation.historyList.nameList[state.chatObj].chat.length
    },
    /** 模拟懒加载聊天记录 */
    loadChat (state, chatObj) {
      if (!state.chatObj) { // 这时候刚上线还没有主动点击聊天对象,收到消息时触发chanObj为空,因此直接return
        return
        // state.chatObj = chatObj
        // state.globe.navigation.historyList.picked = chatObj
      }
      state.globe.chat.total = state.globe.navigation.historyList.nameList[state.chatObj].chat.length // 聊天记录总数
      // 当剩余聊天记录总数大于一页时
      if (state.globe.chat.total > state.globe.userConfig.pageSize * state.globe.chat.current) {
        state.globe.chat.chatList = state.globe.navigation.historyList.nameList[state.chatObj].chat
          .slice(state.globe.chat.total - state.globe.chat.current * state.globe.userConfig.pageSize, state.globe.chat.total) // 裁剪部分展示
      } else { // 当剩余聊天记录总数不满一页时
        state.globe.chat.chatList = state.globe.navigation.historyList.nameList[state.chatObj].chat
      }
    },
    // 建立WebSocket连接
    linkWsServer (state) {
      state.ws = new WsServer(state.wsAddress, (data) => {
        this.commit('wsMsgGHandler', data)
      })
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
    // 更新未读消息
    unReadMsg (state, chatObj) {
      if (!state.globe.unReadMsg[chatObj]) {
        state.globe.unReadMsg[chatObj] = 1
      } else {
        state.globe.unReadMsg[chatObj]++
      }
    },
    // 清除未读消息
    clearUnRead (state, chatObj) {
      Vue.set(state.globe.unReadMsg, chatObj, 0)
      // 可以触发更新，不然nav_chatHistory中的未读消息数量不会消除
      // state.globe.unReadMsg = JSON.parse(JSON.stringify(state.globe.unReadMsg))
    },
    // 更新聊天记录
    chatRecordAdd (state, playLoad) {
      if (playLoad.type === 'send') { // 发送消息
        state.globe.navigation.historyList.nameList[state.chatObj].chat.push(playLoad.chat)
        if (state.globe.navigation.historyList.sortList[0] !== state.chatObj) { // 发消息给谁，就把这个人置顶
          state.globe.navigation.historyList.sortList.forEach((value, index) => {
            if (value === state.chatObj) state.globe.navigation.historyList.sortList.splice(index, 1)
          })
          state.globe.navigation.historyList.sortList.unshift(state.chatObj)
          state.globe.navigation.historyList.picked = state.chatObj
        }
      } else { // 收到消息
        Notification.success({
          title: playLoad.from,
          message: playLoad.file ? '收到一条图片消息' : playLoad.msg.content
        })
        state.globe.navigation.historyList.nameList[playLoad.from].chat.push({
          msg: playLoad.msg.content,
          say: 'you',
          msgID: 'you' + state.uid + Date.now() + state.chatObj,
          rawName: playLoad.rawName,
          file: playLoad.file,
          postfix: playLoad.postfix,
          time: playLoad.msg.time,
          type: playLoad.file ? 'file' : 'chat'
        })
      }
      state.globe.chat.current = 1
      state.globe.chat.befScroll = 0
      state.globe.chat.curScroll = 0
      state.globe.userConfig.loadingChat ? this.commit('loadChat', playLoad.from) : this.commit('loadOnceChat')
    },
    wsMsgGHandler (state, data) {
      const msgObj = typeof data.data === 'object' ? data.data : JSON.parse(data.data)
      switch (msgObj.type) {
        /** 聊天 */
        case 'chat':
          this.commit('chatRecordAdd', msgObj)
          // 收到消息时，如果为未读状态则更新store未读消息unReadMsg
          if (msgObj.from !== state.chatObj) {
            this.commit('unReadMsg', msgObj.from)
          }
          break
        /** 输入状态更新 */
        case 'inputStatus':
          if (state.chatObj === msgObj.from) state.globe.inputStatus = msgObj.inputStatus
          break
        /** 退出登录 */
        case 'exit':
          return this.$message({
            type: 'success',
            message: '退出登录'
          })
        /** 添加好友 */
        case 'addFriend':
          /** 好友请求发送成功后 */
          Message({
            type: msgObj.error ? 'error' : 'success',
            message: msgObj.message
          })
          break
        /** 处理好友请求结果，拒绝或同意 */
        case 'handleApply':
          /** 收到好友请求 */
          state.globe.addFriend.applyList.push(msgObj)
          break
        case 'reload': // 添加好友成功，重新加载菜单数据
        case 'addFriendReply':
          this.commit('navInit')
          Message({
            type: msgObj.error ? 'error' : 'success',
            message: msgObj.message
          })
          break
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
