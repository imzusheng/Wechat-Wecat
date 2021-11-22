<template>
  <ul class="list" @click="selectFriend">
    <li v-for="(item, i) in $store.state.globe.navigation.contactList.nameList" :key="i">
      <figure><img :src="avatarSrc(item)" alt="" draggable="false"/></figure>
      <div class="friName">{{ item.Friend }}</div>
    </li>
  </ul>
</template>

<script>

import config from '@/assets/js/config'

export default {
  name: 'contacts',
  data () {
    return {
      chatObj: ''
    }
  },
  methods: {
    selectFriend (e) {
      if (e.target.nodeName === 'DIV' && this.chatObj !== e.target.innerHTML) {
        this.chatObj = e.target.innerHTML
        this.$store.commit('chatObjChange', this.chatObj)
        // 选中该好友时，清除该好友的未读消息列表
        if (this.$store.state.globe.unReadMsg[this.chatObj] > 0) this.$store.commit('clearUnRead', this.chatObj)
      }
    }
  },
  computed: {
    avatarSrc () {
      return function (params) {
        return `${config.server.httpServer}/static?filename=${params.friendInfo.avatar}`
      }
    }
  }
}
</script>

<style scoped>
.list {
  height: 100%;
  width: 100%;
  --img-height: 50px; /*头像高度*/
}

.list li {
  height: 50px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 calc(var(--logo-height) / 5);
  display: flex;
  justify-content: space-between;
  transition: background-color .16s;
}

.list li:hover {
  cursor: pointer;
  background: rgba(190, 200, 200, .6);
}

.list li figure,
.list li figure img {
  height: var(--img-height);
  width: var(--img-height);
  border-radius: 50%;
  box-sizing: border-box;
  overflow: hidden;
}

.friName {
  height: 100%;
  width: calc(100% - var(--img-height));
  font-size: 16px;
  color: #333;
  display: flex;
  box-sizing: border-box;
  padding-left: 20px;
  justify-content: start;
  align-items: center;
}
</style>
