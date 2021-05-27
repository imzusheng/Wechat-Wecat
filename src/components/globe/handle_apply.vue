<template>
  <div class="friend_apply">
    <div class="friend_apply_title">好友申请</div>
    <div class="friend_info">
      <figure><img :src="avatar" alt=""/></figure>
      <div class="friend_info_name">{{nickName}}</div>
      <div class="friend_info_email">{{email}}</div>
    </div>
    <div class="apply_msg">备注： {{applyMsg}}</div>
    <div class="handle">
      <button class="enter enter_color" @click="sendData(true)">通过</button>
      <button class="cancel cancel_color" @click="sendData(false)">拒绝</button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'handle_apply',
  data () {
    return {
      avatar: '',
      nickName: '',
      email: '',
      applyMsg: ''
    }
  },
  methods: {
    sendData (flag) {
      this.$store.state.applyList.shift() /** 处理完一个请求后删除请求列表数组的第一个，处理下一个请求 */
      this.$store.state.ws.sendMsg({
        to: window.sessionStorage.getItem('uid'),
        from: this.email,
        status: flag, // 通过状态
        time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        type: 'addFriendReply'
      }, this.wsMsgGHandler)
    },
    wsMsgGHandler (data) {
      this.$store.commit('wsMsgGHandler', data)
    }
  },
  watch: {
    '$store.state.applyList.length': function () {
      if (this.$store.state.applyList.length >= 1) {
        const obj = this.$store.state.applyList[0]
        this.avatar = obj.fromInfo.avatar
        this.nickName = obj.fromInfo.nickName
        this.email = obj.fromInfo.email
        this.applyMsg = this.$store.state.applyList[0].applyMsg
      }
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
    background: linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 1));
    box-shadow: 10px 10px 30px rgb(235, 235, 235),
    -10px -10px 30px rgba(235, 235, 235, 1);
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: var(--handledApply-Zindex);
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

  .apply_msg {
    opacity: .6;
    margin-top: 10px;
    width: 100%;
  }

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
</style>
