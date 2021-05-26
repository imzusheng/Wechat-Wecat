import Vue from 'vue'
import Vuex from 'vuex'
import { WsServer } from '../assets/js/wsServer'
import { Notification, Message } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: () => ({
    wsAddress: process.env.NODE_ENV === 'production' ? 'wss://zusheng.club/wsServerV2' : 'ws://localhost:4800',
    chatObj: '', // 聊天对象
    inputStatus: false, // 好友输入状态
    uid: window.sessionStorage.getItem('uid'), // 用户名
    apply: [], // 好友申请
    applyList: [],
    friends: [], // 返回的好友数组
    refs: {},
    unReadMsg: {}, // 保存未读消息的数量 {用户名：未读数量}
    ws: {}, // WebSocket 对象
    maxMsg: 50, // 聊天框显示消息的最大数量
    friendInfo: '',
    addFriState: false,
    globe: {
      navigation: {
        searchResult: [], // nav搜索返回的结果
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
      mainPanelMask: false, // 拖动文件进来时触发
      chat: { // 聊天面板用的
        befScroll: 0,
        curScroll: 0,
        chatList: '',
        total: '',
        current: 1// 当前页数
      },
      userConfig: {
        timeSwitch: true, // 设置面板中显示消息时间开关
        friendInfoPanel: true, // 好友信息面板
        sendKeyCode: false, // 设置菜单 - 使用组合键发送
        pageSize: 5, // 每页加载的消息数量
        previewImgHeight: 400
      },
      chatObjChangeFlag: false
    }
  }),
  mutations: {
    // 更新全局聊天对象
    chatObjChange (state, playLoad) {
      state.chatObj = playLoad // 这句是本函数主要功能，不能少
      state.inputStatus = false // 好友输入状态要初始化
      state.globe.chat.current = 1
      state.globe.chat.befScroll = 0
      state.globe.chat.curScroll = 0
      this.commit('loadChat')
      // console.log(state.globe.chat.chatList[state.globe.chat.chatList.length - 1].msg)
    },
    navInit (state, res) {
      const type = res.navInitType
      switch (type) {
        case 'historyList':
          state.globe.navigation.historyList.nameList = res.data.result
          state.globe.navigation.historyList.sortList = [] // push之前先重置一下，防止出事
          Object.keys(res.data.result).forEach(obj => {
            state.globe.navigation.historyList.sortList.push(obj)
          })
          break
        case 'contact':
          state.globe.navigation.contactList.nameList = res.data.result
          break
      }
    },
    // 模拟懒加载聊天记录
    loadChat (state) {
      state.globe.chat.total = state.globe.navigation.historyList.nameList[state.chatObj].chat.length // 聊天记录总数
      // 当剩余聊天记录总数大于一页时
      if (state.globe.chat.total > state.globe.userConfig.pageSize * state.globe.chat.current) {
        state.globe.chat.chatList = state.globe.navigation.historyList.nameList[state.chatObj].chat
          .slice(state.globe.chat.total - state.globe.chat.current * state.globe.userConfig.pageSize, state.globe.chat.total) // 裁剪部分展示
        setTimeout(() => {
          if (state.globe.chat.current >= 2) { // 当前页数在第二页及以上时
            state.globe.chat.curScroll = state.refs.msgContentBox.scrollHeight // 保存当前的滚动条总高度
            state.refs.msgContentBox.scrollTop = state.globe.chat.curScroll - state.globe.chat.befScroll // 利用计算后的滚动条高度差，使更新后用户界面仍在原来位置
            state.globe.chat.befScroll = state.refs.msgContentBox.scrollHeight // 使用后
          } else { // 当前页数在第一页时，作特殊处理
            state.globe.chat.befScroll = state.refs.msgContent.offsetHeight
            state.refs.msgContentBox.scrollTop = state.refs.msgContent.offsetHeight
          }
        }, 0)
      } else { // 当剩余聊天记录总数不满一页时
        state.globe.chat.chatList = state.globe.navigation.historyList.nameList[state.chatObj].chat
        setTimeout(() => {
          state.globe.chat.curScroll = state.refs.msgContentBox.scrollHeight
          state.refs.msgContentBox.scrollTop = state.globe.chat.curScroll - state.globe.chat.befScroll // 利用计算后的滚动条高度差，使更新后用户界面仍在原来位置
        }, 0)
      }
    },
    // 滚动条自动到底底部
    scrollRec (state, refs) {
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
        state.globe.navigation.historyList.chat[playLoad.from].chat.push({
          msg: playLoad.msg.content,
          say: 'you',
          time: playLoad.msg.time,
          type: playLoad.file ? 'file' : 'chat'
        })
        // if (state.chatObj) {
        //   state.globe.chat.chatList.push({ // 困扰了超级久的bug，忘记了聊天记录面板循环的state.globe.chat.chatList,而不是原来的history
        //     msg: playLoad.msg.content,
        //     say: 'you',
        //     time: playLoad.msg.time,
        //     type: playLoad.file ? 'file' : 'chat'
        //   })
        // }
      }
      state.globe.chat.current = 1
      state.globe.chat.befScroll = 0
      state.globe.chat.curScroll = 0
      this.commit('loadChat')
    },
    wsMsgGHandler (state, data) {
      const msgObj = typeof data.data === 'object' ? data.data : JSON.parse(data.data)
      switch (msgObj.type) {
        case 'chat':
          this.commit('chatRecordAdd', msgObj)
          // 重置滚动条到底部
          this.commit('scrollRec')
          // 收到消息时，如果为未读状态则更新store未读消息unReadMsg
          if (msgObj.from !== state.chatObj) {
            this.commit('unReadMsg', msgObj.from)
          }
          break
        case 'inputStatus':
          state.inputStatus = msgObj.inputStatus
          break
        case 'exit':
          return this.$message({
            type: 'success',
            message: '退出登录'
          })
        case 'addFriend':
          /** 好友请求发送成功后 */
          Message({
            type: msgObj.error ? 'error' : 'success',
            message: msgObj.message
          })
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
