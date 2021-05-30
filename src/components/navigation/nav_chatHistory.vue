<template>
  <ul class="chatList" @click="selectFriend">
    <li v-for="(item, i) in $store.state.globe.navigation.historyList.sortList" :key="i">
      <input type="radio" name="chatListRadio" v-model="$store.state.globe.navigation.historyList.picked" :value="item"
             :data-friend-name="item">
      <div class="chatListContent">
        <figure>
          <img
            :src="$store.state.globe.navigation.historyList.nameList[item].friendInfo.avatar"
            draggable="false"
            alt=""/>
          <span class="unReadMsg" v-if="$store.state.globe.unReadMsg[item] > 0">{{ $store.state.globe.unReadMsg[item] }}</span>
        </figure>
        <div class="group">
          <div class="friName">{{ $store.state.globe.navigation.historyList.nameList[item].friendInfo.email }}</div>
          <div class="tempChat"><span v-html="tempChatFilter(item)"></span></div>
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
  mounted () {
  },
  methods: {
    selectFriend (e) {
      if (e.target.nodeName === 'INPUT' && this.chatObj !== e.target.attributes['data-friend-name'].value) {
        // this.$store.state.globe.chatObjChangeFlag = true
        // setTimeout(() => {
        this.chatObj = e.target.attributes['data-friend-name'].value
        // this.$store.state.globe.chat.chatList = []
        this.$store.commit('chatObjChange', this.chatObj)
        if (this.$store.state.globe.unReadMsg[this.chatObj] > 0) {
          // 选中该好友时，清除该好友的未读消息列表
          this.$store.commit('clearUnRead', this.chatObj)
          // 清除服务器未读消息列表
          this.sendMsg(this.chatObj)
        }
        //   this.$store.state.globe.chatObjChangeFlag = false
        // }, 0)
      }
    },
    sendMsg (chatObj) {
      this.$store.state.ws.sendMsg({
        to: window.sessionStorage.getItem('uid') || this.$store.state.uid,
        type: 'clearUnReadMsg',
        from: chatObj
      }, data => this.$store.commit('wsMsgGHandler', data))
    },
    /** 显示最近聊天记录，当最近聊天记录时图片时，显示为[图片消息] */
    tempChatFilter (item) {
      if (!item) return ''
      const chat = this.$store.state.globe.navigation.historyList.nameList[item].chat
      if (!chat[chat.length - 1].type) chat[chat.length - 1].type = 'chat'
      return chat[chat.length - 1].type === 'file' ? '[文件]' : chat[chat.length - 1].msg
    }
  },
  computed: {},
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
