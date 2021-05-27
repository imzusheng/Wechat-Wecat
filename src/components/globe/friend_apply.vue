<template>
  <div class="friend_apply">
    <div class="friend_apply_title">添加好友</div>
    <div class="friend_info">
      <figure><img :src="$store.state.friendInfo.avatar" alt=""/></figure>
      <div class="friend_info_name">{{ $store.state.friendInfo.nickName }}</div>
      <div class="friend_info_email">{{ $store.state.friendInfo.email }}</div>
    </div>
    <div class="nick_name">
      <input type="text" name="nickName" placeholder="备注" v-model="comments"/>
      <!--      <div contenteditable="true"></div>-->
    </div>
    <div class="apply_msg">
      <input type="text" name="applyMsg" placeholder="验证信息：我是..." v-model="applyMsg">
    </div>
    <div class="handle">
      <button class="enter enter_color" @click="sendData">发送</button>
      <button class="cancel cancel_color" @click="$store.state.addFriState = false">取消</button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'friendApply',
  data () {
    return {
      applyMsg: '',
      comments: ''
    }
  },
  methods: {
    sendData () {
      this.$store.state.addFriState = false
      this.$store.state.ws.sendMsg({
        from: window.sessionStorage.getItem('email'),
        to: this.$store.state.friendInfo.email,
        applyMsg: this.$store.state.applyMsg ? this.$store.state.applyMsg : `我是${window.sessionStorage.getItem('email')}`,
        status: false, // 通过状态
        time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        type: 'addFriend'
      }, (data) => {
        this.$store.commit('wsMsgGHandler', data)
      })
    }
  }
}
</script>

<style scoped>
* {
  text-align: center;
}

.friend_apply {
  --common-color: #1A73E8;
  --error-Color: #d93025;
  width: 340px;
  height: auto;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6));
  box-shadow: 10px 10px 30px rgb(235, 235, 235),
  -10px -10px 30px rgba(235, 235, 235, 0.3);
  border-radius: 8px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: var(--friendApply-Zindex);
}

.friend_apply_title {
  height: 80px;
  width: 100%;
  line-height: 80px;
  font-size: 24px;
}

.friend_info {
  width: 100%;
  height: auto;
}

.friend_info figure, .friend_info figure img {
  height: 150px;
  width: 150px;
}

.friend_info figure {
  margin: auto;
  border-radius: 50%;
  border: 1px solid #CCCCCC;
}

.friend_info_name {
  margin-top: 10px;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
}

.friend_info_email {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #888888;
}

.nick_name, .apply_msg {
  opacity: .6;
  margin-top: 10px;
  width: 100%;
  max-height: 200px;
  box-sizing: border-box;
  padding: 12px;
  overflow: hidden;
}

/*  .nick_name div {
    height: 24px;
    font-size: 17px;
    line-height: 24px;
    text-align: left;
    width: 100px;
    margin: auto;
    position: relative;
  }

  .nick_name div::after {
    content: '备注：';
    position: absolute;
    top: 0;
    left: -36px;
    color: #888888;
    font-size: 14px;
    height: 24px;
    line-height: 24px;
  }*/

.handle {
  margin: auto;
  height: 100px;
  width: 175px;
  line-height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.enter, .cancel {
  display: block;
  width: 70px;
  box-sizing: border-box;
  padding: 10px 0;
  color: #ffffff;
  border: none;
  outline: none;
  border-radius: 5px;
  cursor: pointer;
}

.enter_color {
  background: #65C564;
}

.cancel_color {
  background: rgba(221, 0, 27, .7);
}

input[name=nickName],
input[name=applyMsg] {
  border: 1px solid #CCCCCC;
  outline: none;
  padding: 5px 10px;
  text-align: left;
  width: 150px;
  border-radius: 4px;
}
</style>
