<template>
  <ul class="chatList" @click="selectFriend">
    <li v-for="(item, i) in $store.state.globe.navigation.historyList.nameList" :key="i">
      <input type="radio" name="chatListRadio" :data-friend-name="item">
      <div class="chatListContent">
        <figure>
          <img :src="$store.state.globe.navigation.historyList.chat[item].friendInfo.avatar" draggable="false" alt=""/>
          <span class="unReadMsg" v-if="$store.state.unReadMsg[item] > 0">{{ $store.state.unReadMsg[item] }}</span>
        </figure>
        <div class="group">
          <div class="friName">{{ item }}</div>
          <div class="tempChat"><span>{{
              $store.state.globe.navigation.historyList.chat[item].chat[$store.state.globe.navigation.historyList.chat[item].chat.length - 1].msg
            }}</span></div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>

export default {
  name: 'chatHistory',
  data () {
    return {
      chatObj: ''
    }
  },
  methods: {
    selectFriend (e) {
      if (e.target.nodeName === 'INPUT' && this.chatObj !== e.target.attributes['data-friend-name'].value) {
        this.$store.state.globe.chatObjChangeFlag = true
        setTimeout(() => {
          this.chatObj = e.target.attributes['data-friend-name'].value
          setTimeout(() => this.$store.commit('chatObjChange', this.chatObj), 0)
          this.$store.commit('scrollRec') // 收到或发送消息时，滚动条自动到达底部
          if (this.$store.state.unReadMsg[this.chatObj] > 0) {
            // 选中该好友时，清除该好友的未读消息列表
            this.$store.commit('clearUnRead', this.chatObj)
            // 清除服务器未读消息列表
            this.sendMsg(this.chatObj)
          }
          this.$store.state.globe.chatObjChangeFlag = false
        }, 300)
      }
    },
    sendMsg (chatObj) {
      this.$store.state.ws.sendMsg({
        chatObj: chatObj,
        type: 'clearUnReadMsg',
        uid: window.sessionStorage.getItem('uid') || this.$store.state.uid
      }, data => this.$store.commit('wsMsgGHandler', data))
    }
  },
  watch: {
    '$store.state.unReadMsg': () => {
    }
  }
}
</script>

<style scoped>
.chatList {
  height: 100%;
  width: 100%;
  /*头像高度*/
  --img-height: 50px;
}

.chatList li {
  height: 70px;
  width: 100%;
  position: relative;
}

.chatList li input[name=chatListRadio] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 3;
  cursor: pointer;
}

.chatList li input[name=chatListRadio]:checked + .chatListContent {
  background: rgba(190, 200, 200, .6);
}

.chatList li input[name=chatListRadio]:hover + .chatListContent {
  background: rgba(190, 200, 200, .6);
}

.chatListContent {
  box-sizing: border-box;
  padding: 10px calc(var(--logo-height) / 5);
  display: flex;
  justify-content: space-between;
  transition: background-color .16s;
  height: 100%;
  width: 100%;
}

.chatList li figure,
.chatList li figure img {
  height: var(--img-height);
  width: var(--img-height);
  border-radius: 50%;
  box-sizing: border-box;
}

.chatList li figure {
  position: relative;
}

.group {
  height: var(--img-height);
  width: calc(100% - var(--img-height) - 20px);
}

.friName {
  height: 50%;
  width: 100%;
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: start;
  font-weight: 600;
}

.tempChat {
  box-sizing: border-box;
  height: 50%;
  width: 100%;
  font-size: 13px;
  padding-top: 2px;
  opacity: .5;
  overflow: hidden;
}

.tempChat span {
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unReadMsg {
  position: absolute;
  height: 18px;
  width: 18px;
  background: #FF3B30;
  top: -10px;
  right: -10px;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
  color: #FFFFFF;
  font-size: 10px;
}
</style>
