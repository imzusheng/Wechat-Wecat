import Vue from 'vue'
import Vuex from 'vuex'
import { WsServer } from '../assets/js/wsServer'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    uid: '', // 用户名
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
      pwdCommon: new RegExp('^[a-zA-Z]\\w{5,17}$') // 一般密码
    }
  },
  mutations: {
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
    checkData (state, args) {
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
        console.log('检查')
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
    // 更新全局uid
    uidChange (state, playLoad) {
      state.uid = playLoad
    },
    // 更新全局聊天对象
    chatObjChange (state, playLoad) {
      state.chatObj = playLoad
    },
    // 更新聊天记录
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
      if (msgObj.type === 'navSearch') return this.commit('navSearch', data)
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
  actions: {},
  modules: {}
})
