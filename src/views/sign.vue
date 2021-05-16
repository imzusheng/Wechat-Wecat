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
        <inputZs
          :tips="G.firstNameTips"
          :type="'firstName'"
          :typeStatus="'firstNameErrInfo'"/>
        <inputZs
          :tips="G.lastNameTips"
          :type="'lastName'"
          :typeStatus="'lastNameErrInfo'"/>
      </div>
      <!--  电子邮件  -->
      <inputZs
        class="email"
        :tips="G.EmailTips"
        :type="'email'"
        :typeStatus="'emailErrInfo'"/>
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
import { apiService } from '@/assets/js/Functions'
import { API_SIGN } from '@/assets/js/api'

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
        axiosStatus: false
      }
    }
  },
  created () {
  },
  methods: {
    goLogin () {
      this.$router.replace('login')
    },
    // 检查注册信息
    checkData () {
      if (this.$store.state.signStore.data.firstName && this.$store.state.signStore.data.lastName && this.$store.state.signStore.data.email && this.$store.state.signStore.data.pwd) {
        // 当所有输入框填写完成
        return true
      } else {
        // 没有填写完
        this.$store.commit('signInputCheck', {
          type: 'all'
        })
        return false
      }
    },
    verifyData () {
      return apiService.postData(API_SIGN.POST_SIGN_VERIFY, {
        email: this.$store.state.signStore.data.email,
        nickName: this.$store.state.signStore.data.firstName
      })
    },
    sendData () {
      if (this.checkData() === true) {
        this.axiosStatusChange(true)
        this.axiosStatus = true
        this.verifyData().then(res => { // 验证昵称和邮箱是否被注册
          this.axiosStatus = false
          this.axiosStatusChange(false)
          this.$store.state.signStore.emailErrInfo = !res.data.data.email.error ? '' : res.data.data.email.msg
          this.$store.state.signStore.firstNameErrInfo = !res.data.data.nickName.error ? '' : res.data.data.nickName.msg
          if (!res.data.data.email.error && !res.data.data.nickName.error) { // 验证成功,跳转验证码
            this.$store.state.signStore.emailCode = res.data.data.code
            this.$router.replace('/emailCheck')
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请检查注册信息'
        })
      }
    },
    axiosStatusChange (switchStatus) {
      this.$emit('axiosStatusChange', switchStatus)
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
