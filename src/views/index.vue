<template>
  <div class="wrap">
    <transition name="fade">
      <friendApply v-show="$store.state.globe.addFriend.addFriPanelState"/>
    </transition>
    <transition name="fade">
      <handleApply v-show="$store.state.globe.addFriend.applyList.length"/>
    </transition>

    <!--  左侧菜单  s -->
    <indexNav class="wrap_slide_left" v-if="navFade"/>
    <!--  左侧菜单  e -->
    <!--  中间聊天面板  s -->
    <mainPanel
      v-show="$store.state.chatObj"
      class="mainPanel"
      :style="{width: $store.state.globe.userConfig.friendInfoPanel ? '100%' :'78%'}"
      :class="{'wrap_scale': $store.state.chatObj}"
      @sendMsg="sendMsg"
    />
    <!--  中间聊天面板  e -->
    <!--  好友信息面板  s -->
    <friendInfo
      v-show="$store.state.chatObj && $store.state.globe.userConfig.friendInfoPanel"
      class="friendInfo"
      :class="{'wrap_slide_left': $store.state.chatObj}"
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
import { apiService } from '@/assets/js/Functions'
import { API_COMMON } from '@/assets/js/api'

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
      bgFade: false
    }
  },
  mounted () {
    this.uid = window.sessionStorage.getItem('uid') || this.$store.state.uid
    this.bgFade = true
    setTimeout(() => {
      this.navFade = true
    }, 300)
    /** 获取未读消息列表 */
    apiService.getData(API_COMMON.GET_COMMON_UNREAD_MESSAGE, {
      uid: this.uid
    }).then(res => {
      this.$store.state.globe.unReadMsg = res.data.unReadMessage
    })
    /** 获取未读消息列表 */
    apiService.getData(API_COMMON.GET_COMMON_FRIEND_APPLY, {
      uid: this.uid
    }).then(res => {
      this.$store.state.globe.addFriend.applyList = res.data.friendApply
    })
  },
  methods: {
    sendMsg (input, chatObj, msgType) {
      this.$store.state.ws.sendMsg({
        msg: {
          content: input,
          time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        },
        msgID: 'me' + this.uid + Date.now() + this.$store.state.chatObj,
        from: this.uid,
        to: chatObj,
        type: msgType
      }, (data) => {
        this.$store.commit('wsMsgGHandler', data)
      })
    }
  },
  watch: {
    /** 监听未读消息列表，再显示到网站标题 */
    '$store.state.globe.unReadMsg': {
      handler () {
        let unReadMsgCounts = 0
        // 监听未读消息列表，再显示到网站标题
        Object.values(this.$store.state.globe.unReadMsg).forEach(value => {
          unReadMsgCounts += value
        })
        if (unReadMsgCounts > 0) {
          document.title = `WeCat - ${unReadMsgCounts}条未读消息`
        } else if (unReadMsgCounts === 0) document.title = 'WeCat - 开始聊天吧！'
      },
      deep: true
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
  /*animation-delay: .3s;*/
  /*-webkit-animation-delay: .3s; !* Safari 和 Chrome *!*/

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
  z-index: var(--mainPanel-Zindex);
}

.friendInfo {
  opacity: 0;
  height: 100%;
  width: calc(100% - calc(22% - var(--common-margin)) - 56%);
  background: #F7F9FA;
  box-shadow: -4px 4px 20px #cecece,
  4px -4px 20px #ffffff;
  z-index: var(--mainFriInfo-Zindex);
  position: relative;
}

@media screen and (max-width: 1200px) {
  .friendInfo {
    width: 0;
    display: none;
  }

  .mainPanel {
    height: calc(100% - var(--common-margin) * 2);
    margin: var(--common-margin) var(--common-margin) var(--common-margin) 0;
    border-radius: var(--common-radius);
    position: relative;
    z-index: 2;
  }
}
</style>
