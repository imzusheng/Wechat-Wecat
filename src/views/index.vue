<template>
  <div class="wrap">
    <friendApply :style="{visibility: $store.state.addFriState?'visible':'hidden'}"/>
    <handleApply :style="{visibility: $store.state.applyList.length?'visible':'hidden'}"/>

    <!--  左侧菜单  s -->
    <indexNav class="wrap_slide_left" v-if="navFade"/>
    <!--  左侧菜单  e -->
    <!--  中间聊天面板  s -->
    <mainPanel
      v-if="$store.state.globe.navigation.historyList.historyListStatus"
      class="mainPanel"
      :style="{width: $store.state.globe.userConfig.friendInfoPanel ? '56%' :'78%'}"
      :class="{'wrap_scale': $store.state.chatObj.length > 0}"
      @sendMsg="sendMsg"
    />
    <!--  中间聊天面板  e -->
    <!--  好友信息面板  s -->
    <friendInfo
      v-if="$store.state.globe.navigation.historyList.historyListStatus && $store.state.globe.userConfig.friendInfoPanel"
      class="friendInfo"
      :class="{'wrap_slide_left': $store.state.chatObj.length > 0}"
    />
    <!--  好友信息面板  e -->
    <!--  背景  s -->
    <staticBg :bgFade="bgFade"/>
    <!--    <catsBg :bgFade="bgFade"/>-->
    <!--  背景  e -->
  </div>
</template>

<script>
import staticBg from '@/components/login/staticBg'
// import catsBg from '../components/login/login_cats_bg'
import indexNav from '../components/navigation/nav'
import mainPanel from '../components/main_middlePanel'
import friendInfo from '../components/main_friendInfo'
import friendApply from '../components/globe/friend_apply'
import handleApply from '../components/globe/handle_apply'
import moment from 'moment'

export default {
  name: 'home',
  components: {
    // catsBg,
    staticBg,
    mainPanel,
    friendInfo,
    indexNav,
    friendApply,
    handleApply
  },
  data () {
    return {
      uid: '',
      navFade: false,
      bgFade: false,
      mainPanelFade: false
    }
  },
  mounted () {
    this.uid = window.sessionStorage.getItem('uid') || this.$store.state.uid
    this.bgFade = true
    setTimeout(() => {
      this.navFade = true
    }, 300)
  },
  methods: {
    sendMsg (input, chatObj, msgType) {
      this.$store.state.ws.sendMsg({
        msg: {
          content: input,
          time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        },
        from: this.uid,
        to: chatObj,
        type: msgType
      }, (data) => {
        this.$store.commit('wsMsgGHandler', data)
      })
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
  opacity: 0;
  min-width: 480px;
  width: 56%;
  height: calc(100% - var(--common-margin) * 2);
  margin: var(--common-margin) var(--common-margin) var(--common-margin) 0;
  border-radius: var(--common-radius);
  position: relative;
  z-index: 2;
}

.friendInfo {
  opacity: 0;
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
