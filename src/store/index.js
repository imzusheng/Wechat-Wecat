import Vue from 'vue'
import Vuex from 'vuex'
import { WsServer } from '../assets/js/wsServer'

Vue.use(Vuex)

export default new Vuex.Store({
  state: () => ({
    wsAddress: process.env.NODE_ENV === 'production' ? 'wss://zusheng.club/wsServer' : 'ws://localhost:4000',
    globe: {
      chatObjAvatar: '',
      navigation: {
        historyList: {
          nameList: [],
          chat: {}
        },
        contactList: [],
        groupList: []
      },
      messageImgDisplay: false,
      messageName: '',
      messageTips: false,
      messageContent: '',
      messageImgSrc: '',
      messageEventLoop: [],
      clock: {}
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
    searchResult: [], // 搜索返回的结果
    timeSwitch: true, // 设置面板中显示消息时间开关
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
      const _that = this
      state.ws = new WsServer(state.wsAddress, state.uid, data => _that.commit('wsMsgGHandler', data))
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
    getData (state, type) {
      console.log('store.js -> getData')
      /*      axios({
        method: 'get',
        url: `/${type}`,
        params: {
          uid: state.uid,
          chatObj: state.chatObj
        }
      }).then(data => {
        if (data.config.method === 'get' && data.data !== 'OK') {
          if (data.data.type === 'chatHistory') {
            state.globe.navigation.historyList = Object.keys(chatHistoryResult.data.data)
            this.commit('chatRecordChange', data.data.resultArr)
          } else if (data.data.type === 'contact') {
            state.globe.navigation.contactList = data.data.resultArr
          } else if (data.data.type === 'group') {
            state.globe.navigation.groupList = data.data.resultArr
          } else if (data.data.type === 'friendApply') {
            state.applyList = data.data.friendList
          }
        }
      }) */
    },
    // 搜索用户
    navSearch (state, data) {
      const res = JSON.parse(data.data)
      state.searchResult = res.resultArr
    },
    // 清除搜索结果
    clearNavSearch (state) {
      state.searchResult = ''
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
      state.globe.navigation.contactList.forEach(value => {
        if (value.email === state.chatObj) state.globe.chatObjAvatar = value.avatar
      })
    },
    // 更新聊天记录
    chatRecordAdd (state, playLoad) {
      if (playLoad.type) {
        if (playLoad.type === 'addFriend') return // 通过好友时的信息
        if (playLoad.type === 'agree') {
          state.friends[state.chatObj] = []
          state.friends[state.chatObj].push(playLoad.chat)
        } else if (playLoad.type === 'send') {
          // state.friends[state.chatObj] = state.friends[state.chatObj] ? state.friends[state.chatObj] : []
          if (!state.friends[state.chatObj]) Vue.set(state.friends, state.chatObj, []) // 后期为对象添加属性时要用此方法，不然无法实时渲染(没有get(),set())
          state.friends[state.chatObj].splice(0, state.friends[state.chatObj].length - state.maxMsg)
          state.friends[state.chatObj].push(playLoad.chat)
        } else {
          state.friends[playLoad.uid].splice(0, state.friends[playLoad.uid].length - state.maxMsg)
          state.friends[playLoad.uid].push(playLoad.chat)
        }
      }
    },
    // 收到消息时的处理
    /**
     * 显示顶部消息通知
     * @param state
     * @param args
     */
    showTips (state, args) {
      if (this.state.globe.messageTips) {
        clearTimeout(state.globe.clock)
      }
      state.globe.messageContent = args.messageContent
      state.globe.messageImgSrc = args.messageImgSrc
      state.globe.messageTips = true
      state.globe.clock = setTimeout(() => {
        state.globe.messageTips = false
      }, args.setTime)
    },
    wsMsgGHandler (state, data) {
      const msgObj = typeof data.data === 'object' ? data.data : JSON.parse(data.data)
      console.log('Vuex > wsMsgGHandler()', msgObj)
      if (msgObj.type === 'checkOnline') {
        return state.ws.sendMsg({
          uid: state.uid,
          type: 'checkOnline'
        }, data => this.commit('wsMsgGHandler', data))
      }
      switch (msgObj.type) {
        case 'navSearch':
          /** 搜索 */
          return this.commit('navSearch', data)
        case 'agree':
          /** 同意好友申请后 */
          msgObj.uid = msgObj.uid1
          msgObj.chatObj = msgObj.uid2
          state.globe.messageImgDisplay = true
          this.commit('navInit')
          return this.commit('showTips', {
            messageContent: msgObj.msg,
            messageImgSrc: msgObj.error ? require('../assets/img/msg_error.png') : require('../assets/img/done.png'),
            setTime: 5000
          })
        case 'addFriend':
          /** 好友请求发送成功后 */
          state.globe.messageImgDisplay = true
          return this.commit('showTips', {
            messageContent: msgObj.msg,
            messageImgSrc: msgObj.error ? require('../assets/img/msg_error.png') : require('../assets/img/done.png'),
            setTime: 5000
          })
        case 'checkRepeatLogin':
          if (msgObj.error) {
            state.globe.messageImgDisplay = true
            this.commit('showTips', {
              messageContent: msgObj.msg,
              messageImgSrc: msgObj.error ? require('../assets/img/msg_error.png') : require('../assets/img/done.png'),
              setTime: 2000
            })
          }
          return
        case 'exit':
          state.globe.messageImgDisplay = true
          return this.commit('showTips', {
            messageContent: msgObj.msg,
            messageImgSrc: msgObj.error ? require('../assets/img/msg_error.png') : require('../assets/img/done.png'),
            setTime: 2000
          })
      }
      /** 以下为msgObj.type = chat时 */
      state.globe.messageImgDisplay = false
      this.commit('showTips', {
        messageContent: msgObj.msg,
        messageImgSrc: '#',
        setTime: 3000
      })
      state.globe.messageName = msgObj.chatObj
      this.commit('chatRecordAdd', {
        chat: {
          msg: msgObj.msg,
          say: 'you',
          time: msgObj.time
        },
        type: msgObj.type,
        uid: msgObj.uid,
        chatObj: msgObj.chatObj
      })
      // 重置滚动条到底部
      this.commit('scrollRec')
      // 收到消息时，如果为未读状态则更新store未读消息unReadMsg
      if (msgObj.uid !== state.chatObj) {
        this.commit('unReadMsg', msgObj.uid)
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
