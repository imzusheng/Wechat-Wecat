<template>
  <div class="sign_container"
       :style="{'pointer-events': G.axiosStatus ? 'none' : 'all', opacity:  G.axiosStatus ? 0.5 : 1}">
    <div class="title">
      <p>创建您的 weCat 账号</p>
      <p></p>
    </div>
    <main class="main">
      <!--  昵称和姓名  -->
      <div class="inline_Container">
        <inputZs :tips="G.firstNameTips" :type="'firstName'" :typeStatus="'firstNameErrInfo'"/>
        <inputZs :tips="G.lastNameTips" :type="'lastName'" :typeStatus="'lastNameErrInfo'"/>
      </div>
      <!--  电子邮件  -->
      <inputZs class="email" :tips="G.EmailTips" :type="'email'" :typeStatus="'emailErrInfo'"/>
      <!--  密码和确认密码  -->
      <div class="inline_Container">
        <inputZs :tips="G.pwdTips" :type="'pwd'" :typeStatus="'pwdErrInfo'"/>
        <inputZs :tips="G.enterTips" :type="'enter'" :typeStatus="'enterErrInfo'"/>
      </div>
    </main>
    <div class="bottom_Bar">
      <button class="submitData" @click="sendData">下一步</button>
      <span class="turnLogin"
            @click="goLogin">登录现有账号</span>
    </div>
  </div>
</template>

<script>
import inputZs from '../components/login/input_zusheng'
import axios from 'axios'

export default {
  name: 'sign',
  components: {
    inputZs
  },
  data () {
    return {
      G: {
        firstNameTips: '昵称',
        lastNameTips: '姓名',
        EmailTips: '您的电子邮件地址',
        pwdTips: '密码',
        enterTips: '确认',
        axiosStatus: false,
        emailVerification: false // 进入邮件地址验证
      }
    }
  },
  methods: {
    goLogin () {
      this.$store.commit('signInputRestore')
      this.$store.commit('restore')
      this.$store.commit('goLogin')
      this.$router.replace('login')
    },
    sendData () {
      this.G.axiosStatus = true
      this.axiosStatusChange()
      // 发送回调函数
      this.$store.commit('checkData', (firstName, lastName, pwd, email, type) => {
        if (type === true) {
          axios({
            method: 'post',
            url: '/sign',
            data: {
              uid: firstName + lastName,
              pwd: pwd,
              email: email
            }
          }).then(data => this.dataHandler(data)).catch(err => this.dataHandler(err.response))
        } else {
          this.dataHandler({
            data: {
              msg: '请检查注册信息',
              type: 'error',
              error: 1 // 假装成注册信息检测错误
            }
          })
        }
      })
    },
    dataHandler (data) {
      const _that = this
      console.log(data.data)
      if (data.data.type === 'error') {
        alert(data.data.msg)
        _that.G.axiosStatus = false
        this.axiosStatusChange()
        console.error(data)
        return
      }
      setTimeout(() => {
        _that.$store.commit('setEmailCheck')
        _that.$store.commit('setEmailCode', data.data.code)
        _that.$router.replace('/emailCheck')
        _that.G.emailVerification = true
        _that.G.axiosStatus = false
        this.axiosStatusChange()
      }, 1500)
    },
    axiosStatusChange () {
      this.$emit('axiosStatusChange', this.G.axiosStatus)
    }
  }
}
</script>

<style scoped>
.sign_container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.main {
  padding: 0 9%;
}

.inline_Container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.email {
  margin-bottom: 30px;
}

.inline_Container > div {
  width: calc(32px * 7);
}

.bottom_Bar {
  width: 100%;
  position: relative;
  margin-top: 70px;
}

.submitData {
  display: block;
  margin: auto;
  height: 36px;
  width: 100px;
  border-radius: 20px;
  color: #ffffff;
  font-size: 16px;
  letter-spacing: 0.25px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  background: var(--common-color);
}

.turnLogin {
  display: block;
  color: #1A73E8;
  font-size: 15px;
  cursor: pointer;
  position: absolute;
  height: 100%;
  top: 0;
  right: 10%;
  line-height: 36px;
}
</style>
