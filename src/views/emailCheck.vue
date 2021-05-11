<template>
  <div class="emailCheck_container" :style="{ 'transform': checkSuc ? 'translateX(-50%)' : 'translateX(0%)' }">
    <!--  验证邮箱  -->
    <div class="checkEmail">
      <div class="title">
        <p>验证您的邮件地址</p>
        <p>{{$store.state.signPage.email}}</p>
      </div>
      <main class="main">
        <inputZs class="email" :tips="EmailTips" :type="'emailCheck'" :typeStatus="'emailCheckErrInfo'"/>
        <p style="text-align: center">邮件已发出，请您登录邮箱进行验证</p>
        <p style="text-align: center" class="sendEmail"><a href="#" @click="resend">没有收到邮件？重新发送</a></p>
      </main>
      <div class="bottom_Bar">
        <button class="submitData" @click="sendData">下一步</button>
      </div>
    </div>
    <!--  注册成功选择头像  -->
    <div class="checkEmailSuc">
      <div class="title">
        <p>注册成功</p>
        <p>{{$store.state.signPage.email}}</p>
      </div>
      <div class="sucImgContainer">
        <div class="prev">
          <figure @click="prev"></figure>
        </div>
        <div class="sucImg">
          <ul :style="{transform: `translateX(${transX}px)`, width: `${ulW}px`}">
            <li v-for="(item, i) in imgSrcArr" :key="i">
              <!--              <figure><img :src="'/img/ginger-cat/'+item"/></figure>-->
              <figure><img :src="item" alt=""/></figure>
            </li>
          </ul>
        </div>
        <div class="next">
          <figure @click="next"></figure>
        </div>
      </div>
      <div class="bottom_Bar2">
        <button class="submitData"
                @click="returnLogin">选择头像
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import inputZs from '../components/login/input_zusheng'

export default {
  name: 'emailCheck',
  components: {
    inputZs
  },
  data () {
    return {
      checkSuc: false,
      EmailTips: '输入您的验证码',
      transX: 0, // ul的位移
      imgSrcArr: [], // 图片文件名数组
      imgSum: 20, // 图片数量
      ulW: 150 // ul长度
    }
  },
  created () {
    let num = 713
    for (let i = 0; i <= this.imgSum; i++) {
      this.imgSrcArr.push(require(`../assets/ginger-cat/ginger-cat-${num}.png`))
      num++
    }
  },
  mounted () {
    this.ulW = this.imgSum * 150
  },
  methods: {
    returnLogin () {
      // 重置一下刚刚输入的信息已经登录页的锁定
      this.$store.commit('goLogin')
      this.$store.commit('setAvatar', this.imgSrcArr[this.transX / -150])
      axios({
        method: 'post',
        url: '/signSuc',
        data: {
          firstName: this.$store.state.signPage.firstName,
          lastName: this.$store.state.signPage.lastName,
          pwd: this.$store.state.signPage.pwd,
          email: this.$store.state.signPage.email,
          avatar: this.$store.state.signPage.avatarSrc,
          type: 'signSuc'
        }
      }).then(data => this.dataHandler(data)).catch(err => this.dataHandler(err.response))
    },
    next () {
      this.transX -= 150
      if (this.transX <= -this.imgSum * 150) this.transX = 0
    },
    prev () {
      this.transX += 150
      if (this.transX >= 0) this.transX = -this.imgSum * 150
    },
    sendData () {
      if (this.$store.state.signPage.emailCode === this.$store.state.signPage.emailCheck) {
        this.$store.commit('setEmailCodeErrInfo', '')
        this.checkSuc = true
        console.log(this.checkSuc)
      } else {
        this.$store.commit('setEmailCodeErrInfo', '验证码错误')
      }
    },
    resend () {
      axios({
        method: 'post',
        url: '/sign',
        data: {
          email: this.$store.state.signPage.email
        }
      }).then(data => this.dataHandler(data)).catch(err => console.error(err.response))
    },
    dataHandler (data) {
      console.log(data)
      if (data.data.type === 'success') {
        this.$store.commit('signInputRestore')
        this.$store.commit('restore')
        this.$router.replace('login')
      } else {
        alert('邮箱已被注册')
      }
    }
  }
}
</script>

<style scoped>
  .emailCheck_container {
    height: 100%;
    width: 200%;
    box-sizing: border-box;
    display: flex;
    transition: all .3s;
  }

  .checkEmail {
    height: 100%;
    width: 50%;
  }

  .checkEmailSuc {
    height: 100%;
    width: 50%;
  }

  .main {
    width: calc(14 * 32px);
    margin: auto;
    box-sizing: border-box;
  }

  .email {
    width: calc(9 * 32px);
    margin: 10px auto 30px;
  }

  .sendEmail {
    font-size: 13px;
    margin-top: 10px;
  }

  .bottom_Bar {
    margin-top: 100px;
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

  .sucImg {
    height: 150px;
    width: 150px;
    overflow: hidden;
    border-radius: 50%;
    border: 1px solid #ccc;
    float: left;
    box-sizing: border-box;
  }

  .sucImgContainer {
    margin: 30px auto 50px;
    height: 150px;
    width: 100%;
  }

  .sucImg ul {
    height: 150px;
    width: 150px;
  }

  .sucImg ul li {
    height: 150px;
    width: 150px;
    float: left;
  }

  .sucImg figure {
    width: 100%;
    height: 100%;
    /*background: url("../assets/ginger-cats/ginger-cats-749.png") no-repeat 50%;*/
    /*background-size: 100% auto;*/
  }

  .sucImg figure img {
    height: 100%;
    width: 100%;
  }

  .prev {
    box-sizing: border-box;
    padding-right: 30px;
    float: left;
    height: 100%;
    width: calc(50% - 75px);
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .prev figure {
    height: 50px;
    width: 50px;
    background: url("../assets/img/next.png") no-repeat 50%;
    background-size: 100% auto;
    transform: rotate(180deg);
    cursor: pointer;
    opacity: .3;
  }

  .next {
    box-sizing: border-box;
    padding-left: 30px;
    float: left;
    height: 100%;
    width: calc(50% - 75px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .next figure {
    height: 50px;
    width: 50px;
    background: url("../assets/img/next.png") no-repeat 50%;
    background-size: 100% auto;
    cursor: pointer;
    opacity: .3;
  }

  .next figure:hover,
  .prev figure:hover {
    opacity: .8;
  }
</style>
