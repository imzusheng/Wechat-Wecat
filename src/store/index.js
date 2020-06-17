import Vue from 'vue'
import Vuex from 'vuex'
import { WsServer } from '../assets/js/wsServer'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    uid: '',
    chatObj: '',
    friends: [],
    refs: {},
    unReadMsg: {}, // 保存未读消息的数量 {用户名：未读数量}
    ws: {},
    maxMsg: 50,
    searchResult: []
  },
  mutations: {
    // 搜索用户
    navSearch (state, data) {
      const res = JSON.parse(data.data)
      state.searchResult = res.resultArr
    },
    clearNavSearch (state) {
      state.searchResult = ''
    },
    // 更新未读消息
    unReadMsg (state, unReadMsgObj) {
      if (state.unReadMsg[unReadMsgObj] >= 0) {
        state.unReadMsg[unReadMsgObj] += 1
      } else {
        state.unReadMsg[unReadMsgObj] = 1
      }
    },
    // 清除未读消息
    clearUnRead (state, unReadMsgObj) {
      Vue.set(state.unReadMsg, unReadMsgObj, 0)
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
    uidChange (state, playLoad) {
      state.uid = playLoad
    },
    chatObjChange (state, playLoad) {
      state.chatObj = playLoad
    },
    chatRecordAdd (state, playLoad) {
      if (playLoad.uid) {
        state.friends[playLoad.uid].splice(0, state.friends[playLoad.uid].length - state.maxMsg) // 限制聊天记录的长度
        state.friends[playLoad.uid].push(playLoad.chat)
      } else {
        state.friends[state.chatObj].splice(0, state.friends[state.chatObj].length - state.maxMsg) // 限制聊天记录的长度
        state.friends[state.chatObj].push(playLoad.chat)
      }
    },
    // 滚动条自动到底底部
    scrollRec (state, refs) {
      if (refs) {
        state.refs = refs
      } else {
        setTimeout(() => {
          state.refs.msgContentBox.scrollTop = state.refs.msgContent.offsetHeight
        }, 0)
      }
    },
    // 建立WebSocket连接
    linkWsServer (state, args) {
      state.ws = new WsServer('ws://localhost:4000', args.uid, args.cb)
    },
    // 收到消息时的处理
    wsMsgGHandler (state, data) {
      const msgObj = JSON.parse(data.data)
      this.commit('chatRecordAdd', {
        chat: {
          msg: msgObj.msg,
          say: 'you',
          time: msgObj.time
        },
        uid: msgObj.uid
      })
      // 重置滚动条到底部
      this.commit('scrollRec')
      // 收到消息时，如果为未读状态则更新store未读消息unReadMsg
      if (msgObj.uid !== state.chatObj) {
        console.log('收到未读消息')
        this.commit('unReadMsg', msgObj.uid)
      }
    }
  },
  getters: {
    returnFriends: state => {
      return state.friends
    }
  },
  actions: {},
  modules: {}
})
