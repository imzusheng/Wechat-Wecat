<template>
  <div
    id="login"
    :style="{'pointer-events': login.axiosStatus || login.pwdStatus? 'none' : 'all'}">
    <messageTips :style="{display: login.uidStatus ? 'none' : 'block'}"/>
    <transition name="fade">
      <div class="login_container"
           v-if="!login.pwdStatus">
        <LoadingLine v-if="login.axiosStatus"/>
        <catTitle/>
        <div class="login_container_mask"
             :style="{transform: ['sign', 'forget', 'emailCheck'].includes($route.name) ?
          'translateX(0%)' : (login.uidStatus ? 'translateX(-66.66%)' : 'translateX(-33.33%)'),
             opacity: login.axiosStatus || login.pwdStatus? 0.5 : 1}">
          <div class="common_from">
            <router-view @axiosStatusChange="axiosStatusChange"/>
          </div>
          <div class="login_form_uid" @keydown.enter='sendData'>
            <div class="title">
              <p>登录</p>
              <p>使用您的 weCat 账号</p>
            </div>
            <!-- 登录表单ID/密码输入框  -->
            <div class="login_uid_container">
              <input
                type="text"
                id="login_uid"
                name="uid"
                autocomplete="off"
                ref="inputUID"
                :disabled="login.axiosStatus || login.uidStatus || $store.state.login.uidDisabled"
                v-model="uid"
                @focus="pwdFocus"
                @blur="pwdBlur">
              <div class="uid_border"
                   :class="{'border_notActive' : !uid || login.tipsActive, 'border_Active' : uid  || login.tipsActive, 'border_error' : login.errStatus}"></div>
              <span class="login_uid_tips"
                    :class="{'tips_notActive' : !uid || login.tipsActive, 'tips_Active' : uid || login.tipsActive, 'font_error' : login.errStatus}">电子邮箱或用户名</span>
              <span class="login_uid_tips_bg"
                    :style="{visibility : login.tipsActive || uid ? 'visible' : 'hidden'}"></span>
            </div>
            <div class="errInfo" v-if="login.errStatus">{{ login.errInfo }}</div>
            <!--  end 登录表单ID/密码输入框  -->
            <div class="login_forget">
              <span @click="goForget">忘记账号或密码？</span>
            </div>
            <div class="login_create">
              <span @click="goSign">创建账号</span>
            </div>
            <div class="login_next">
              <button @click='sendData'>下一步</button>
            </div>
          </div>
          <div class="login_form_pwd" @keydown.enter='sendData'>
            <div class="title">
              <p>欢迎</p>
              <p @click="returnUid">{{ uid }}</p>
            </div>
            <div class="login_pwd_container">
              <input
                type="password"
                id="login_pwd"
                name="pwd"
                autocomplete="off"
                ref="inputPWD"
                v-model="pwd"
                :disabled="login.axiosStatus || $store.state.login.pwdDisabled"
                @focus="pwdFocus"
                @blur="pwdBlur">
              <div class="pwd_border"
                   :class="{'border_notActive' : !pwd || login.tipsActive, 'border_Active' : pwd || login.tipsActive, 'border_error' : login.errStatus}"></div>
              <span class="login_pwd_tips"
                    :class="{'tips_notActive' : !pwd || login.tipsActive, 'tips_Active' : pwd || login.tipsActive, 'font_error' : login.errStatus}">输入您的密码</span>
              <span class="login_pwd_tips_bg"
                    :style="{'visibility' : login.tipsActive || pwd ? 'visible' : 'hidden'}"></span>
            </div>
            <div class="errInfo">{{ login.errInfo }}</div>
            <div class="login_forget">
              <a href="#" @click="goForget">忘记密码？</a>
            </div>
            <div class="login_next_pwd">
              <button @click='sendData'>登录</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <catsBg/>
  </div>
</template>

<script>
import LoadingLine from '../components/login/login_loading_line'
import catsBg from '../components/login/login_cats_bg'
import catTitle from '../components/login/login_cat_title'
import axios from 'axios'
import messageTips from '@/components/globe/message_tips'

export default {
  name: 'login',
  components: {
    messageTips,
    LoadingLine, // 加载动画模板
    catsBg, // 背景
    catTitle // 标题logo
  },
  data () {
    return {
      uid: '',
      pwd: '',
      login: {
        type: '', // 验证类型
        uidStatus: false, // 账号验证状态
        pwdStatus: false, // 密码验证状态
        axiosStatus: false, // 发送请求状态
        tipsActive: false, // 输入框内提示内容状态（电子邮箱或用户名是否缩小）
        errStatus: false, // 服务器返回错误时为true
        errInfo: '',
        checkRepeatLoginFlag: false// 是否重复登录
      }
    }
  },
  created () {
  },
  mounted () {
    this.$store.commit('restore')
  },
  methods: {
    goSign () { // 跳转到注册页
      this.$store.commit('setSign')
      this.$store.commit('goSign')
      this.$router.push('sign')
    },
    goForget () { // 忘记密码
      this.$store.commit('setForget')
      this.$store.commit('goSign')
      this.$router.push('forget')
    },
    axiosStatusChange (status) {
      this.login.axiosStatus = status
    },
    /**
     * 查询有无重复登录
     */
    checkRepeatLogin () {
      return axios({
        method: 'get',
        url: '/login/checkRepeatLogin',
        params: {
          uid: this.uid,
          type: 'checkRepeatLogin'
        }
      })
    },
    /**
     * 发送请求验证账号密码
     * 回调函数 dataHandler()
     */
    async sendData () {
      this.login.axiosStatus = true
      if (!this.login.uidStatus) {
        await this.checkRepeatLogin().then(data => {
          this.$store.commit('wsMsgGHandler', data)
          this.checkRepeatLoginFlag = data.data.flag
        })
        // 如果重复登录则直接返回
        if (this.checkRepeatLoginFlag) {
          this.login.axiosStatus = false
          return
        }
      }
      this.login.uidStatus ? this.login.type = 'pwd' : this.login.type = 'uid' // id验证通过则验证密码
      axios({
        method: 'post',
        url: '/login',
        data: {
          uid: this.uid,
          pwd: this.pwd,
          type: this.login.type // 通过上面this.login.uidStatus的状态判断验证的类型：uid/pwd
        }
      }).then(data => this.dataHandler(data)).catch(err => this.dataHandler(err.response))
    },
    /**
     * @param data  //服务器返回数据
     */
    dataHandler (data) {
      const response = data.data // 提取数据
      const _that = this // 暂存this
      this.loadingTimer = setTimeout(() => {
        _that.login.axiosStatus = false // 请求结束
        clearTimeout(_that.loadingTimer)
        if (response.type === 'err') return _that.loginErr(response, _that)
        _that.loginSuc(response, _that)
      }, 1200)
    },
    /**
     * @param response
     * @param _that
     */
    loginSuc (response, _that) {
      _that.login[`${response.type}Status`] = true
      if (response.type === 'uid') {
        // ID验证成功，密码输入框获得焦点
        setTimeout(() => _that.$refs.inputPWD.focus(), 300)
      } else if (response.type === 'pwd') {
        /** 登录成功，更新数据库最近登录时间 */
        axios({
          method: 'post',
          url: '/updateTime',
          data: {
            email: response.email
          }
        }).then()
        // 修改全局uid为登录用户
        _that.$store.commit('loginSuc', response)
        // 保存服务器传回token、uid到sessionStorage
        sessionStorage.setItem('nickName', response.nickName)
        sessionStorage.setItem('email', response.email)
        sessionStorage.setItem('avatar', response.avatar)
        sessionStorage.setItem('token', response.token)
        sessionStorage.setItem('uid', _that.uid)
        // 路由跳转到home，500ms为动画时间
        setTimeout(() => _that.$router.replace('home'), 500)
      }
    },
    loginErr (response, _that) {
      // 报错
      _that.login.errStatus = true
      _that.login.errInfo = response.msg
      // 异步让input获取焦点
      setTimeout(() => {
        if (!_that.pwd) _that.$refs.inputUID.focus() // 登录错误时自动让ID登录框获取焦点
      }, 0)
    },
    returnUid () { // 返回到上一步
      this.login.uidStatus = false
      this.login.errStatus = false
      this.login.errInfo = ''
      this.pwd = ''
    },
    /**
     * 焦点及失焦的状态改变，执行相应的动画笑效果
     */
    pwdFocus () {
      this.login.tipsActive = true
    },
    pwdBlur () {
      this.login.tipsActive = false
      this.login.errStatus = false
      this.login.errInfo = ''
    }
  },
  watch: {
    // '$route' (to, from) {
    //   const toDepth = to.path.split('/').length
    //   const fromDepth = from.path.split('/').length
    //   console.log(toDepth, fromDepth)
    //   this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    // },
    uid (newVal, oldVal) {
      if (oldVal.length - newVal.length !== 0) {
        this.login.errStatus = false
        this.login.errInfo = ''
      }
    },
    pwd (newVal, oldVal) {
      if (oldVal.length - newVal.length !== 0) {
        this.login.errStatus = false
        this.login.errInfo = ''
      }
    }
  }
}
</script>

<style>
input:hover {
  will-change: auto;
}

#login {
  height: 100vh;
  width: 100vw;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  /*--common-color: #95e1d3;*/
  --common-color: #1A73E8;
  --error-color: #f25022;
  --loginCont-height: 580px;
}

.login_container {
  height: 520px;
  width: var(--loginCont-height);
  min-width: 580px;
  min-height: 530px;
  border-radius: 20px;
  position: relative;
  padding-top: 50px;
  z-index: 2;
  overflow: hidden;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6));
  box-shadow: 10px 10px 30px rgb(235, 235, 235),
  -10px -10px 30px rgba(235, 235, 235, 0.3);
}

.errInfo {
  box-sizing: border-box;
  padding: 4px 8px;
  width: calc(32px * 10);
  position: absolute;
  margin-left: 50%;
  color: var(--error-color);
  font-size: 14px;
  transform: translateX(-50%);
}

.login_form_uid,
.login_form_pwd {
  height: calc(530px - 100px - 30px);
  width: var(--loginCont-height);
  padding-top: 30px;
  position: absolute;
}

.common_from {
  height: calc(530px - 100px - 30px);
  width: var(--loginCont-height);
  padding-top: 20px;
  position: absolute;
}

.login_form_uid {
  transform: translateX(100%);
}

.login_form_pwd {
  transform: translateX(200%);
}

.common_from {
  transform: translateX(0%);
}

.title p {
  text-align: center;
}

.title p:nth-of-type(1) {
  font-size: 26px;
  padding-bottom: 13px;
}

.login_form_uid .title p:nth-of-type(2) {
  padding: 6px 20px;
  font-size: 16px;
}

.login_form_pwd .title p:nth-of-type(2) {
  font-size: 16px;
  display: inline-block;
  padding: 6px 20px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-left: 50%;
  transform: translate(-50%);
  cursor: pointer;
}

.login_form_pwd .title p:nth-of-type(2):hover {
  border: 1px solid #333;
}

.login_uid_container,
.login_pwd_container {
  height: 80px;
  width: calc(32px * 10);
  margin: auto;
  position: relative;
}

.login_container_mask {
  position: relative;
  height: 430px;
  width: calc(var(--loginCont-height) * 3);
  transition: transform .2s;
}

.uid_border,
.pwd_border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: calc(32px * 10);
  height: 58px;
  border-radius: 4px;
  box-sizing: border-box;
  background: #ffffff;
}

.border_notActive {
  border: 1px solid #ccc;
}

.border_Active {
  border: 2px solid var(--common-color);
}

.border_error {
  border: 2px solid var(--error-color) !important;
}

.font_error {
  color: var(--error-color) !important;
}

#login_uid,
#login_pwd {
  position: absolute;
  bottom: 0;
  left: 0;
  width: calc(32px * 10);
  height: 58px;
  font-size: 18px;
  color: #333333;
  box-sizing: border-box;
  border: none;
  outline: none;
  padding-left: 12px;
  background: none;
  z-index: 3;
}

/* 自动填充样式修改 */
#login_uid:-webkit-autofill,
#login_pwd:-webkit-autofill {
}

.login_uid_tips,
.login_pwd_tips {
  position: absolute;
  top: 0;
  left: 0;
  height: 80px;
  width: 100%;
  color: #888888;
  box-sizing: border-box;
  transition: padding .15s, font-size .15s;
  z-index: 2;
}

.tips_notActive {
  font-size: 15px;
  padding: 40px 16px 0;
}

.tips_Active {
  padding: 12px 10px 0;
  font-size: 14px;
  color: var(--common-color);
}

.login_uid_tips_bg {
  background: #ffffff;
  position: absolute;
  height: 4px;
  width: 120px;
  top: 21px;
  left: 5px;
  z-index: 1;
  visibility: hidden;
}

.login_pwd_tips_bg {
  background: #ffffff;
  position: absolute;
  height: 4px;
  width: 93px;
  top: 21px;
  left: 5px;
  z-index: 1;
  visibility: hidden;
}

.login_forget {
  margin-top: 64px;
}

.login_forget,
.login_create {
  text-align: center;
  cursor: pointer;
}

.login_forget span,
.login_create span {
  display: inline-block;
  text-align: center;
  color: var(--common-color);
  font-size: 15px;
  padding-bottom: 12px;
}

.login_next {
  width: 320px;
  text-align: center;
  margin: auto;
  padding-top: 20px;
}

.login_next_pwd {
  width: 320px;
  text-align: center;
  margin: auto;
  padding-top: 20px;
}

.login_next button,
.login_next_pwd button {
  height: 36px;
  width: 100px;
  border: none;
  border-radius: 20px;
  color: #ffffff;
  cursor: pointer;
  outline: none;
  background: var(--common-color);
}
</style>
