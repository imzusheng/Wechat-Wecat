const moduleLogin = {
  state: () => ({
    data: {
      firstName: '',
      lastName: '',
      email: '',
      pwd: '',
      enter: ''
    },
    checkSuc: false, // 验证码是否验证成功,跳转到选择头像
    avatarSrc: '', // 头像链接
    emailCode: '', // 邮箱验证码
    emailCheck: '', // 用户输入的验证码
    emailCheckErrInfo: '',
    firstNameErrInfo: '',
    lastNameErrInfo: '',
    pwdErrInfo: '', // 密码输入框的错误信息
    enterErrInfo: '', // 确认密码输入框的错误信息
    emailErrInfo: '您需要验证此电子邮件地址属于您',
    regExp: { // 正则表达式
      regEmail: new RegExp('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$'), // 注册页中检查邮件地址正则表达式
      pwdStrong: new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,10}$'), // 强密码验证
      pwdCommon: new RegExp('^[a-zA-Z]\\w{5,17}') // 一般密码
    }
  }),
  mutations: {
    // 每次失去焦点时检查输入内容，正确则同步到store
    signInputCheck (state, args) {
      const FunctionRoute = {
        email,
        pwd,
        enter,
        firstName,
        lastName,
        emailCheck
      }

      if (args.type === 'all') {
        Object.keys(FunctionRoute).forEach((value) => {
          FunctionRoute[value]()
        })
        return
      }

      FunctionRoute[args.type]()

      function emailCheck () {
        state.checkSuc = true
        if (state.emailCode === state.emailCheck && state.emailCheck) {
          state.emailCheckErrInfo = ''
        } else {
          state.emailCheckErrInfo = '验证码错误'
        }
      }

      function email () {
        if (state.regExp.regEmail.test(state.data.email)) {
          state.emailErrInfo = '您需要验证此电子邮件地址属于您'
        } else {
          state.emailErrInfo = '该电子邮件地址无效'
        }
      }

      function pwd () {
        if (state.regExp.pwdCommon.test(state.data.pwd)) {
          state.pwdErrInfo = ''
        } else {
          state.pwdErrInfo = '请选择安全系数更高的密码。建议使用以字母开头，长度在6~18之间，只能包含字母、数字和下划线的组合'
        }
      }

      function enter () {
        if (state.data.pwd !== state.data.enter) {
          state.enterErrInfo = '这两个密码不一致，请重试'
        } else {
          state.enterErrInfo = ''
        }
      }

      function firstName () {
        state.firstNameErrInfo = state.data.firstName ? '' : '不能为空'
      }

      function lastName () {
        state.lastNameErrInfo = state.data.lastName ? '' : '不能为空'
      }
    }
  }
}

module.exports = moduleLogin
