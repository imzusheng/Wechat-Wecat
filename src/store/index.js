import Vue from 'vue'
import Vuex from 'vuex'
import { WsServer } from '../assets/js/wsServer'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    globe: {
      chatObjAvatar: '',
      navigation: {
        historyList: [],
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
    // wsAddress: 'wss://zusheng.club/wsServer',
    wsAddress: 'ws://localhost:4000',
    login: {
      uidDisabled: false, // id输入框状态
      pwdDisabled: false, // 密码输入框状态
      email: '',
      avatar: '',
      nickName: '',
      applyMsg: ''
    },
    uid: window.sessionStorage.getItem('uid'), // 用户名
    apply: [], // 好友申请
    applyList: [],
    chatObj: '', // 聊天对象
    friends: [], // 返回的好友数组
    refs: {},
    unReadMsg: {}, // 保存未读消息的数量 {用户名：未读数量}
    ws: {}, // WebSocket 对象
    maxMsg: 50, // 聊天框显示消息的最大数量
    searchResult: [], // 搜索返回的结果
    timeSwitch: true, // 设置面板中显示消息时间开关
    sign: false, // 标记页面跳转到了忘记密码页
    forget: false, // 标记页面跳转到了注册页
    emailCheck: false,
    signPage: { // 注册页相关
      forgetEmail: '', // 忘记密码时输入的邮箱，被迫写在了这里
      avatarSrc: '', // 头像链接
      emailCode: '', // 邮箱验证码
      emailCheck: '', // 用户输入的验证码
      emailCheckErrInfo: '',
      firstName: '',
      lastName: '',
      email: '',
      pwd: '',
      enter: '',
      tempfirstName: '',
      templastName: '',
      tempemail: '',
      temppwd: '',
      tempenter: '',
      firstNameErrInfo: '',
      lastNameErrInfo: '',
      pwdErrInfo: '', // 密码输入框的错误信息
      enterErrInfo: '', // 确认密码输入框的错误信息
      emailErrInfo: '您需要验证此电子邮件地址属于您',
      regEmail: new RegExp('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$'), // 注册页中检查邮件地址正则表达式
      pwdStrong: new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,10}$'), // 强密码验证
      pwdCommon: new RegExp('^[a-zA-Z]\\w{5,17}') // 一般密码
    },
    friendInfo: '',
    addFriState: false
  },
  mutations: {
    navInit (state) {
      this.commit('getData', 'chatHistory')
      this.commit('getData', 'contact')
      this.commit('getData', 'group')
      this.commit('getData', 'friendApply')
    },
    getData (state, type) {
      axios({
        method: 'get',
        url: `/${type}`,
        params: {
          uid: state.uid,
          chatObj: state.chatObj
        }
      }).then(data => {
        if (data.config.method === 'get' && data.data !== 'OK') {
          if (data.data.type === 'chatHistory') {
            state.globe.navigation.historyList = data.data.resultArr
            this.commit('chatRecordChange', data.data.resultArr)
          } else if (data.data.type === 'contact') {
            state.globe.navigation.contactList = data.data.resultArr
          } else if (data.data.type === 'group') {
            state.globe.navigation.groupList = data.data.resultArr
          } else if (data.data.type === 'friendApply') {
            state.applyList = data.data.friendList
          }
        }
      })
    },
    setAddFriend (state, friendInfo) {
      state.friendInfo = friendInfo
    },
    // sign and forget 锁定输入框
    goSign (state) {
      state.login.uidDisabled = true
      state.login.pwdDisabled = true
    },
    goLogin (state) {
      state.login.uidDisabled = false
      state.login.pwdDisabled = false
    },
    setAvatar (state, src) {
      state.signPage.avatarSrc = src
    },
    setEmailCodeErrInfo (state, info) {
      state.signPage.emailCheckErrInfo = info
    },
    // 邮箱验证码
    setEmailCode (state, code) {
      state.signPage.emailCode = code
    },
    // 检查注册信息
    checkData (state, args) { // args为回调函数
      if (state.signPage.firstName && state.signPage.lastName && state.signPage.email && state.signPage.pwd) {
        args(state.signPage.firstName, state.signPage.lastName, state.signPage.pwd, state.signPage.email, true)
      } else {
        this.commit('signInputCheck', {
          type: 'all',
          data: '1'
        })
        args(state.signPage.firstName, state.signPage.lastName, state.signPage.pwd, state.signPage.email, false)
      }
    },
    // 重置注册信息
    signInputRestore (state, args) {
      const _ = state.signPage
      _.firstNameErrInfo = ''
      _.lastNameErrInfo = ''
      _.emailErrInfo = '您需要验证此电子邮件地址属于您'
      _.pwdErrInfo = ''
      _.enterErrInfo = ''
      _.tempfirstName = ''
      _.templastName = ''
      _.tempemail = ''
      _.temppwd = ''
      _.tempenter = ''
      _.firstName = ''
      _.lastName = ''
      _.email = ''
      _.pwd = ''
      _.enter = ''
    },
    // 每次失去焦点时检查输入内容，正确则同步到store
    signInputCheck (state, args) {
      const funObj = {
        email,
        pwd,
        enter,
        firstName,
        lastName,
        all,
        emailCheck
      }

      if (args.data) funObj[args.type]()

      state.signPage[`temp${args.type}`] = args.data

      function emailCheck () {
        state.signPage.emailCheck = args.data
      }

      function email () {
        if (state.signPage.regEmail.test(args.data)) {
          state.signPage.emailErrInfo = '您需要验证此电子邮件地址属于您'
          state.signPage[args.type] = args.data
        } else {
          state.signPage.emailErrInfo = '该电子邮件地址无效'
        }
      }

      function pwd () {
        if (state.signPage.pwdCommon.test(args.data)) {
          state.signPage[args.type] = args.data
          state.signPage.pwdErrInfo = ''
        } else {
          state.signPage.pwdErrInfo = '请选择安全系数更高的密码。建议使用以字母开头，长度在6~18之间，只能包含字母、数字和下划线的组合'
        }
      }

      function enter () {
        if (state.signPage.pwd !== args.data) {
          state.signPage.enterErrInfo = '这两个密码不一致，请重试'
        } else {
          state.signPage.enter = args.data
          state.signPage.enterErrInfo = ''
        }
      }

      function firstName () {
        console.log('Vuex > firstName -- 检查')
        if (args.data) {
          state.signPage.firstName = args.data
          state.signPage.firstNameErrInfo = ''
        }
      }

      function lastName () {
        if (args.data) {
          state.signPage.lastName = args.data
          state.signPage.lastNameErrInfo = ''
        }
      }

      function all () {
        const _that = state.signPage
        if (!_that.tempfirstName) _that.firstNameErrInfo = '不能为空'
        if (!_that.templastName) _that.lastNameErrInfo = '不能为空'
        if (!_that.tempemail) _that.emailErrInfo = '不能为空'
        if (!_that.temppwd) _that.pwdErrInfo = '不能为空'
        if (!_that.tempenter) _that.enterErrInfo = '不能为空'
      }
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
    // 更新全局uid
    loginSuc (state, response) {
      state.login.avatar = response.avatar
      state.login.email = response.email
      state.login.nickName = response.nickName
      state.uid = response.email
      state.globe.messageImgDisplay = true
      this.commit('showTips', {
        messageContent: response.msg,
        messageImgSrc: require('../assets/img/done.png'),
        setTime: 5000
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
    },
    // 滚动条自动到底底部
    scrollRec (state, refs) {
      if (!state.chatObj) return
      if (refs) {
        state.refs = refs
      } else {
        setTimeout(() => {
          state.refs.msgContentBox.scrollTop = state.refs.msgContent.offsetHeight
        }, 0)
      }
    },
    // 建立WebSocket连接
    linkWsServer (state) {
      const _that = this
      state.ws = new WsServer(state.wsAddress, state.uid, data => _that.commit('wsMsgGHandler', data))
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
      const msgObj = typeof data === 'object' ? data.data : JSON.parse(data.data)
      console.log('Vuex > wsMsgGHandler()', msgObj)
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
    },
    // 重置
    restore (state) {
      state.sign = false
      state.forget = false
      state.emailCheck = false
    },
    // 标记页面跳转到了忘记密码页
    setForget (state) {
      state.forget = true
    },
    // 标记页面跳转到了注册页
    setSign (state) {
      state.sign = true
    },
    setEmailCheck (state) {
      state.emailCheck = true
    }
  },
  getters: {
    returnFriends: state => {
      return state.friends
    }
  },
  actions: {
    /**
     * 显示顶部消息通知
     * @param state
     * @param args
     */
    showTips (state, args) {
      return new Promise(resolve => {
        this.state.globe.messageContent = args.time
        this.state.globe.messageImgSrc = args.messageImgSrc
        this.state.globe.messageTips = true
        state.globe.clock = setTimeout(() => {
          this.state.globe.messageTips = false
          resolve(true)
        }, args.setTime)
      })
    }
  },
  modules: {}
})
