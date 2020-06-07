<template>
  <div id="login" @keydown.enter='sendData' @keydown.delete="del"
       :style="{'pointer-events': axiosStatus ? 'none' : 'all'}">
    <div class="login_container">
      <LoadingLine v-if="axiosStatus"></LoadingLine>
      <div class="logo_container">
        <figure class="logo"></figure>
      </div>
      <div class="login_container_mask" :style="{opacity: axiosStatus ? 0.5 : 1}">
        <div class="login_form_uid" :style="{transform: uidStatus ? 'translateX(-100%)' : 'translateX(0)'}">
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
              :disabled="axiosStatus"
              v-model="uid"
              @focus="tipsActive = true"
              @blur="tipsActive = false">
            <div class="uid_border"
                 :class="{border_notActive : !uid || tipsActive, border_Active : uid || tipsActive, border_error : errStatus}"></div>
            <span class="login_uid_tips"
                  :class="{tips_notActive : !uid || tipsActive, tips_Active : uid || tipsActive, font_error : errStatus}">电子邮箱或用户名</span>
            <span class="login_uid_tips_bg" :style="{visibility : tipsActive || uid ? 'visible' : 'hidden'}"></span>
          </div>
          <div class="errInfo">{{errInfo}}</div>
          <!--  end 登录表单ID/密码输入框  -->
          <div class="login_forget">
            <a href="#">忘记账号或密码？</a>
          </div>
          <div class="login_create">
            <a href="#">创建账号</a>
          </div>
          <div class="login_next">
            <button @click='sendData'>下一步</button>
          </div>
        </div>
        <div class="login_form_pwd" :style="{transform: uidStatus ? 'translateX(0%)' : 'translateX(100%)'}">
          <div class="title">
            <p>欢迎</p>
            <p>{{uid}}</p>
          </div>
          <div class="login_pwd_container">
            <input
              type="password"
              id="login_pwd"
              name="pwd"
              autocomplete="off"
              ref="inputPWD"
              :disabled="axiosStatus"
              v-model="pwd"
              @focus="tipsActive = true"
              @blur="tipsActive = false">
            <div class="pwd_border"
                 :class="{border_notActive : !pwd || tipsActive, border_Active : pwd || tipsActive, border_error : errStatus}"></div>
            <span class="login_pwd_tips"
                  :class="{tips_notActive : !pwd || tipsActive, tips_Active : pwd || tipsActive, font_error : errStatus}">输入您的密码</span>
            <span class="login_pwd_tips_bg" :style="{visibility : tipsActive || pwd ? 'visible' : 'hidden'}"></span>
          </div>
          <div class="errInfo">{{errInfo}}</div>
          <div class="login_forget">
            <a href="#">忘记账号或密码？</a>
          </div>
          <div class="login_next_pwd">
            <button @click='sendData'>登录</button>
          </div>
        </div>
      </div>
    </div>
    <ul class="login_cats">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import LoadingLine from '../components/loading_line'

axios.defaults.headers['Content-Type'] = 'application/json'

export default {
  name: 'login',
  components: { LoadingLine },
  data () {
    return {
      uid: '',
      pwd: '',
      type: '', // 验证类型
      uidStatus: false, // 账号验证状态
      pwdStatus: false, // 密码验证状态
      axiosStatus: false, // 发送请求状态
      tipsActive: false, // 输入框内提示内容状态（电子邮箱或用户名是否缩小）
      errStatus: false, // 服务器返回错误时为true
      errInfo: ''
    }
  },
  mounted () {
  },
  methods: {
    del () { // 当输入框中的内容被删除完时，红色框框的错误提示取消
      if (this.uid.length <= 1) {
        this.errStatus = false
        this.errInfo = ''
      } else if (this.uidStatus && this.uid.length > 1 && this.pwd.length <= 1) {
        this.errStatus = false
        this.errInfo = ''
      }
    },
    sendData () {
      this.axiosStatus = true
      this.pwd ? this.type = 'pwd' : this.type = 'uid'
      const Url = 'http://localhost:3000/api/login'
      axios({
        method: 'post',
        url: Url,
        data: {
          uid: this.uid,
          pwd: this.pwd,
          type: this.type
        }
      }).then(data => this.dataHandler(data)).catch(err => this.dataHandler(err.response))
    },
    dataHandler (data) {
      console.log(data)
      const _that = this
      this.loadingTimer = setTimeout(() => {
        _that.axiosStatus = false // 请求结束
        if (data.status === 200) {
          data.data.type === 'uid' ? _that.uidStatus = true : _that.pwdStatus = true
        } else if (data.status === 401) {
          _that.errStatus = true
          _that.errInfo = data.data
        }
        // 异步让input获取焦点
        setTimeout(() => {
          _that.pwd ? _that.$refs.inputPWD.focus() : _that.$refs.inputUID.focus()
        }, 0)
        clearTimeout(_that.loadingTimer)
      }, 2000)
    }
  }
}
</script>

<style scoped>
  #login {
    height: 100vh;
    width: 100vw;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    /*--common-color: #95e1d3;*/
    --common-color: #1A73E8;
    --error-color: #F25022;
  }

  .login_container {
    height: 520px;
    width: 580px;
    min-width: 580px;
    min-height: 530px;
    border-radius: 20px;
    position: relative;
    padding-top: 50px;
    z-index: 2;
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

  .logo_container {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .logo_container:hover {
    will-change: contents;
  }

  .logo_container .logo {
    width: 200px;
    height: 100px;
    background: url("../assets/logo.svg") no-repeat 50%;
    background-size: 100%;
  }

  .login_form_uid,
  .login_form_pwd {
    height: calc(530px - 100px - 30px);
    width: 100%;
    padding-top: 30px;
    position: absolute;
    transition: transform .2s;
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
    transition: all .4s;
  }

  .login_form_uid {
    transform: translateX(0%);
  }

  .login_form_pwd {
    transform: translateX(100%);
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

  .login_uid_tips,
  .login_pwd_tips {
    position: absolute;
    top: 0;
    left: 0;
    height: 80px;
    width: 100%;
    color: #888888;
    box-sizing: border-box;
    transition: padding .2s, font-size .2s;
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
  }

  .login_forget a,
  .login_create a {
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
    border: 1px solid #ccc;
    border-radius: 20px;
    color: #ffffff;
    cursor: pointer;
    outline: none;
    background: var(--common-color);
  }

  /* -- 猫背景 开始 -- */
  .login_cats {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    --cat-width: 16px;
    --cat-heigth: 10px;
    overflow: hidden;
    perspective: 1000px;
  }

  .login_cats li {
    position: absolute;
    border-radius: 5px;
  }

  .login_cats li:nth-of-type(1) {
    height: calc(var(--cat-heigth) * 6);
    width: calc(var(--cat-width) * 6);
    background: #FDEEEC;
    top: 5%;
    left: 5%;
    transform: rotateZ(8deg);
    /*transform-style: preserve-3d;*/
    box-shadow: 3px 3px 12px #d7cac9,
    -3px -3px 12px #ffffff;
  }

  .login_cats li:nth-of-type(2) {
    height: calc(var(--cat-heigth) * 9);
    width: calc(var(--cat-width) * 9);
    background: #FBF2E4;
    top: 25%;
    left: 4%;
    transform: rotate(-8deg);
    box-shadow: 8px 8px 16px #d5cec2,
    -8px -8px 16px #ffffff;
  }

  .login_cats li:nth-of-type(3) {
    height: calc(var(--cat-heigth) * 7);
    width: calc(var(--cat-width) * 7);
    background: #BFE2F4;
    top: 9%;
    left: 21%;
    transform: rotate(-14deg);
    box-shadow: 4px 4px 16px #a2c0cf,
    -4px -4px 16px #dcffff;
  }

  .login_cats li:nth-of-type(4) {
    height: calc(var(--cat-heigth) * 10);
    width: calc(var(--cat-width) * 10);
    background: #BFE2F4;
    top: 48%;
    left: 6%;
    transform: rotate(2deg);
    box-shadow: 10px 0px 16px #a2c0cf,
    -4px -4px 16px #dcffff;
  }

  .login_cats li:nth-of-type(5) {
    height: calc(var(--cat-width) * 8);
    width: calc(var(--cat-heigth) * 10);
    background: #FDEEEC;
    top: 70%;
    left: 8%;
    transform: rotate(-6deg);
    box-shadow: 10px -6px 16px #d7cac9,
    -8px 8px 16px #ffffff;
  }

  .login_cats li:nth-of-type(6) {
    height: calc(var(--cat-heigth) * 10);
    width: calc(var(--cat-width) * 10);
    background: #DCDDE4;
    top: 80%;
    left: 22%;
    transform: rotate(8deg);
    box-shadow: 8px -8px 16px #bbbcc2,
    -8px 8px 16px #fdfeff;
  }

  .login_cats li:nth-of-type(7) {
    height: calc(var(--cat-width) * 8);
    width: calc(var(--cat-heigth) * 10);
    background: #FBF2E4;
    top: 78%;
    left: 69%;
    transform: rotate(-8deg);
    box-shadow: -8px -8px 16px #d5cec2,
    8px 8px 16px #ffffff;
  }

  .login_cats li:nth-of-type(8) {
    height: calc(var(--cat-width) * 10);
    width: calc(var(--cat-heigth) * 11);
    background: #DCDDE4;
    top: 70%;
    left: 86%;
    transform: rotate(10deg);
    box-shadow: -8px -8px 16px #bbbcc2,
    8px 8px 16px #fdfeff;
  }

  .login_cats li:nth-of-type(9) {
    height: calc(var(--cat-heigth) * 10);
    width: calc(var(--cat-width) * 10);
    background: #BFE2F4;
    top: 47%;
    left: 80%;
    transform: rotate(-16deg);
    box-shadow: -8px -8px 16px #a2c0cf,
    8px 8px 16px #dcffff;
  }

  .login_cats li:nth-of-type(10) {
    height: calc(var(--cat-heigth) * 6);
    width: calc(var(--cat-width) * 6);
    background: #BFE2F4;
    top: 5%;
    left: 86%;
    transform: rotate(6deg);
    box-shadow: -8px 8px 16px #a2c0cf,
    8px -8px 16px #dcffff;
  }

  .login_cats li:nth-of-type(11) {
    height: calc(var(--cat-heigth) * 7);
    width: calc(var(--cat-width) * 7);
    background: #FBF2E4;
    top: 7%;
    left: 70%;
    transform: rotate(-6deg);
    box-shadow: -8px 8px 16px #d5cec2,
    8px -8px 16px #ffffff;
  }

  .login_cats li:nth-of-type(12) {
    height: calc(var(--cat-heigth) * 7);
    width: calc(var(--cat-width) * 7);
    background: #FDEEEC;
    top: 25%;
    left: 83%;
    transform: rotate(-10deg);
    box-shadow: -8px 8px 16px #d7cac9,
    8px -8px 16px #ffffff;
  }

  .login_cats li::after {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
  }

  .login_cats li:nth-of-type(1)::after {
    background: url("../assets/ginger-cat/ginger-cat-715.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(2)::after {
    background: url("../assets/ginger-cat/ginger-cat-750.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(3)::after {
    background: url("../assets/ginger-cat/ginger-cat-722.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(4)::after {
    background: url("../assets/ginger-cat/ginger-cat-730.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(5)::after {
    background: url("../assets/ginger-cat/ginger-cat-729.png") no-repeat 50%;
    background-size: 140%;
  }

  .login_cats li:nth-of-type(6)::after {
    background: url("../assets/ginger-cat/ginger-cat-732.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(7)::after {
    background: url("../assets/ginger-cat/ginger-cat-733.png") no-repeat 50%;
    background-size: 100%;
  }

  .login_cats li:nth-of-type(8)::after {
    background: url("../assets/ginger-cat/ginger-cat-735.png") no-repeat 50%;
    background-size: 100%;
  }

  .login_cats li:nth-of-type(9)::after {
    background: url("../assets/ginger-cat/ginger-cat-734.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(10)::after {
    background: url("../assets/ginger-cat/ginger-cat-738.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(11)::after {
    background: url("../assets/ginger-cat/ginger-cat-740.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(12)::after {
    background: url("../assets/ginger-cat/ginger-cat-749.png") no-repeat 50%;
    background-size: 80%;
  }

  /* -- 猫背景 end -- */
</style>
