<template>
  <div class="wrap">
    <friendApply :style="{visibility: $store.state.addFriState?'visible':'hidden'}"/>
    <handleApply :style="{visibility: $store.state.applyList.length?'visible':'hidden'}"/>
    <messageTips/>

    <indexNav :class="{'wrap_slide_left' : bgFade}"/>
    <mainPanel class="mainPanel" :class="{'wrap_scale' : bgFade}" v-if="this.$store.state.chatObj.length > 0"
               @sendMsg="sendMsg"/>
    <friendInfo class="friendInfo" :class="{'wrap_slide_left' : bgFade}" v-if="this.$store.state.chatObj.length > 0"/>
    <catsBg :bgFade="bgFade"/>
  </div>
</template>

<script>
import catsBg from '../components/login/login_cats_bg'
import indexNav from '../components/navigation/nav'
import mainPanel from '../components/main_middlePanel'
import friendInfo from '../components/main_friendInfo'
import friendApply from '../components/globe/friend_apply'
import handleApply from '../components/globe/handle_apply'
import messageTips from '@/components/globe/message_tips'

export default {
  name: 'home',
  components: {
    messageTips,
    catsBg,
    mainPanel,
    friendInfo,
    indexNav,
    friendApply,
    handleApply
  },
  data () {
    return {
      uid: '',
      bgFade: false,
      mainPanelFade: false
    }
  },
  mounted () {
    this.uid = window.sessionStorage.getItem('uid') || this.$store.state.uid
    this.bgFade = true
  },
  methods: {
    sendMsg (input, chatObj, msgType) {
      console.log('index.vue_sendMsg-------发送消息')
      this.$store.state.ws.sendMsg({
        msg: input,
        chatObj: chatObj,
        uid: this.uid,
        type: msgType,
        time: this.formatDate()
      }, this.wsMsgGHandler)
    },
    wsMsgGHandler (data) {
      this.$store.commit('wsMsgGHandler', data)
    },
    /**
     * 获取格式化的时间
     * @returns {string}
     */
    formatDate () {
      const date = new Date()
      const format = date => date < 10 ? `0${date}` : date
      const month = format(date.getMonth() + 1)
      const day = format(date.getDate())
      const h = format(date.getHours())
      const m = format(date.getMinutes())
      const s = format(date.getSeconds())
      return `${date.getFullYear()}年${month}月${day}日 ${h}:${m}:${s}`
    }
  },
  computed: {
    getchatObj () {
      return this.$store.getters.getchatObj
    }
  }
}
</script>

<style scoped>
  .wrap {
    min-height: 480px;
    height: 100vh;
    width: 100vw;
    position: relative;
    display: flex;
    /*overflow: auto;*/
    /*边框高度*/
    --common-margin: 0px;
    /*logo高度*/
    --logo-height: 90px;
    /*分类菜单高度*/
    --classIcon-height: 40px;
    /*主面板圆角*/
    --common-radius: 0px;
  }

  .wrap_scale {
    animation: wrap_scale .5s forwards;
  }

  .wrap_slide_left {
    animation: wrap_slide_left .4s forwards;
  }

  @keyframes wrap_slide_left {
    0% {
      opacity: 0;
      transform: translateX(-10%);
    }
    100% {
      opacity: 1;
      transform: translateX(0%);
    }
  }

  @keyframes wrap_scale {
    0% {
      opacity: 0;
      transform: scale(0.96);
      transform-origin: center;
    }
    100% {
      opacity: 1;
      transform: scale(1);
      transform-origin: center;
    }
  }

  .mainPanel {
    min-width: 480px;
    width: 56%;
    height: calc(100% - var(--common-margin) * 2);
    margin: var(--common-margin) var(--common-margin) var(--common-margin) 0;
    border-radius: var(--common-radius);
    position: relative;
    z-index: 2;
  }

  .friendInfo {
    height: 100%;
    width: calc(100% - calc(22% - var(--common-margin)) - 56%);
    background: #F7F9FA;
    box-shadow: -4px 4px 20px #cecece,
    4px -4px 20px #ffffff;
    z-index: 2;
    position: relative;
  }

  @media screen and (max-width: 1200px) {
    .friendInfo {
      display: none;
    }

    .mainPanel {
      min-width: 480px;
      width: calc(100% - (22% - var(--common-margin)));
      height: calc(100% - var(--common-margin) * 2);
      margin: var(--common-margin) var(--common-margin) var(--common-margin) 0;
      border-radius: var(--common-radius);
      position: relative;
      z-index: 2;
    }
  }
</style>
