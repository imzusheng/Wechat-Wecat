<template>
  <div>
    <div class="Avatar_container" v-if="$store.state.chatObj.length > 0">
      <figure>
        <img :src=$store.state.globe.navigation.contactList.nameList[$store.state.chatObj].friendInfo.avatar alt=""
             draggable="false"/>
      </figure>
    </div>
    <div class="Avatar_Info" v-if="$store.state.chatObj.length > 0">
      <div class="Avatar_name">
        {{ $store.state.globe.navigation.contactList.nameList[$store.state.chatObj].friendInfo.nickName }}
      </div>
      <div class="Avatar_outline">你抡我啊！</div>
    </div>
    <ul class="personal_Info" v-if="$store.state.chatObj.length > 0">
      <li>
        <div class="info_position_title">
          <i class="el-icon-thumb"></i>
          <span>最近登录：</span>
        </div>
        <div class="info_position">
          {{ $store.state.globe.navigation.contactList.nameList[$store.state.chatObj].friendInfo.RecentlyTime }}
        </div>
      </li>
      <li>
        <div class="info_phone_title">
          <i class="el-icon-chat-dot-round"></i>
          <span>最近聊天：</span>
        </div>
        <div class="info_phone">
          {{ currentChat }}
        </div>
      </li>
      <li>
        <div class="info_email_title">
          <i class="el-icon-s-promotion"></i>
          <span>登录地点：</span>
        </div>
        <div class="info_email">
          {{ address }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'friendInfo',
  data () {
    return {}
  },
  mounted () {
  },
  methods: {},
  computed: {
    currentChat () {
      let chat = ''
      if (this.$store.state.globe.navigation.historyList.nameList[this.$store.state.chatObj]) {
        chat = this.$store.state.globe.navigation.historyList.nameList[this.$store.state.chatObj].chat
        return chat[chat.length - 1].time
      } else {
        return ''
      }
    },
    address () { // 需要做复杂逻辑判断
      const friendInfo = this.$store.state.globe.navigation.contactList.nameList[this.$store.state.chatObj].friendInfo
      return friendInfo.address
        ? friendInfo.address.Country + ' - ' +
        friendInfo.address.Province + ' - ' +
        friendInfo.address.City : '暂无'
    }
  }
}
</script>

<style scoped>
.Avatar_container {
  width: 100%;
  margin-top: 90px;
  height: 150px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.Avatar_container figure {
  height: 150px;
  width: 150px;
  position: absolute;
  border-radius: 50%;
  border: 1px solid #cccccc;
}

.Avatar_container figure img {
  height: 100%;
  width: 100%;
}

.Avatar_Info {
  padding: 20px 20px;
  text-align: center;
}

.Avatar_name {
  font-size: 32px;
  padding-bottom: 15px;
}

.Avatar_outline {
  width: 100%;
  padding-bottom: 36px;
  border-bottom: 1px solid #cccccc;
}

.personal_Info {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.personal_Info li {
  height: 40px;
  width: 100%;
  line-height: 40px;
  font-size: 13px;
  display: flex;
}

.personal_Info i {
  display: inline-block;
  margin: 0 6px;
}

.info_position_title,
.info_phone_title,
.info_email_title {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999999;
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow: ellipsis;
}

.info_position_title img {
  height: 18px;
  width: 18px;
  margin: 2px;
}

.info_phone_title img {
  height: 22px;
  width: 22px;
}

.info_email_title img {
  height: 20px;
  width: 20px;
  margin: 1px;
}

.info_position,
.info_phone,
.info_email {
  padding: 0 20px;
  line-height: 40px;
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow: ellipsis;
}

.info_position img,
.info_phone img,
.info_email img {
  height: 12px;
  width: 12px;
}
</style>
