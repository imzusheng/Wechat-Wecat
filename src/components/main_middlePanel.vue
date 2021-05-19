<template>
  <div class="mainPanel_wrap"
       :disabled="loading"
       v-loading="loading"
  >
    <!--    聊天对象名字-->
    <div class="mainPanel_name" @click="faceListActive = false">
      <figure><img :src="$store.state.globe.navigation.historyList.chat[this.chatObj].friendInfo.avatar" alt="">
      </figure>
      <div class="chatObj">
        <div class="chatObjName">{{ chatObj }}</div>
        <div class="chatObjNickName">{{ chatObj }}</div>
      </div>
    </div>
    <!--    聊天记录信息面板-->
    <div
      class="mainPanel_msgContent"
      ref="msgContentBox"
      @click="faceListActive = false"
      @scroll="scrollList($event)"
    >
      <div class="msgContent" ref="msgContent">
        <div v-for="(item, i) in $store.state.globe.chat.chatList"
             :class="{My_MsgContent : item.say === 'me', You_MsgContent : item.say === 'you'}" :key="i">
          <div :class="{My_Msg : item.say === 'me', You_Msg : item.say === 'you'}">{{ item.msg }}</div>
          <div class="msgTime" v-if="$store.state.timeSwitch">{{ item.time }}</div>
        </div>
      </div>
    </div>
    <!--    表情包面板-->
    <transition name="faceListActive">
      <ul class="face-list noSelect" @click="selectFace" v-if="faceListActive">
        <li title="睁眼笑">&#x1F603;</li>
        <li title="咪眼笑">&#x1F604;</li>
        <li title="大笑">&#x1F606;</li>
        <li title="笑哭">&#x1F602;</li>
        <li title="微笑">&#x1F642;</li>
        <li title="翻脸">&#x1F643;</li>
        <li title="调皮">&#x1F609;</li>
        <li title="喜欢">&#x1F970;</li>
        <li title="喜欢2">&#x1F970;</li>
        <li title="飞吻">&#x1F618;</li>
        <li title="亲亲">&#x1F61A;</li>
        <li title="贪吃">&#x1F60B;</li>
        <li title="嘘">&#x1F92B;</li>
        <li title="思考">&#x1F914;</li>
        <li title="闭嘴">&#x1F910;</li>
        <li title="疑惑">&#x1F928;</li>
        <li title="无语">&#x1F611;</li>
        <li title="沉默">&#x1F636;</li>
        <li title="坏笑">&#x1F60F;</li>
        <li title="鄙视">&#x1F612;</li>
        <li title="白眼">&#x1F644;</li>
        <li title="假笑">&#x1F62C;</li>
        <li title="得瑟">&#x1F60C;</li>
        <li title="不开心">&#x1F614;</li>
        <li title="睡觉">&#x1F634;</li>
        <li title="生病">&#x1F637;</li>
        <li title="发烧">&#x1F912;</li>
        <li title="受伤">&#x1F915;</li>
        <li title="恶心">&#x1F922;</li>
        <li title="吐了">&#x1F92E;</li>
        <li title="流鼻涕">&#x1F927;</li>
        <li title="好热">&#x1F975;</li>
        <li title="好冷">&#x1F976;</li>
        <li title="耍酷">&#x1F60E;</li>
        <li title="研究">&#x1F9D0;</li>
        <li title="惊讶">&#x1F632;</li>
        <li title="呆呆看">&#x1F633;</li>
        <li title="可怜">&#x1F97A;</li>
        <li title="流汗">&#x1F630;</li>
        <li title="大哭">&#x1F62D;</li>
        <li title="捂脸吓">&#x1F631;</li>
        <li title="困">&#x1F971;</li>
        <li title="生气">&#x1F624;</li>
        <li title="骂人">&#x1F92C;</li>
      </ul>
    </transition>
    <!--    输入框-->
    <div class="mainPanel_inputContent">
      <div class="textBoxContent">
        <div
          class="textBox"
          contenteditable="true"
          ref="textBox"
          @click="faceListActive = false"
          @focus="textBoxFocus"
          @blur="textBoxBlur"
          @keydown="keyCodeCheck"
          @keyup="keyCodeArr = []"></div>
        <div class="btnGroup">
          <div class="face textBoxBtn" title="发送表情" @click="faceListActive = !faceListActive"></div>
          <div class="send textBoxBtn" @click="sendMsg"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'mainPanel',
  data () {
    return {
      loading: false,
      keyCodeArr: [],
      uid: '',
      input: '',
      faceListActive: false,
      visible: true
    }
  },
  mounted () {
    this.uid = window.sessionStorage.getItem('uid')
    this.$store.commit('scrollRec', this.$refs)
    this.$store.commit('loadChat')
  },
  methods: {
    scrollList (evt) {
      if (evt.target.scrollTop === 0 && this.loading === false) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.$store.state.globe.chat.current++
          this.$store.commit('chatObjChange', this.$store.state.chatObj)
          this.$store.commit('loadChat')
        }, 1000)
      }
    },
    /**
     * 聊天面板选择表情包，并将光标移动到输入框末尾
     */
    selectFace (face) {
      // 事件委托到ul 导致拖动ul会全选表情。所以在触发的时候判断一下是不是点击单个li
      if (face.target.nodeName.toLowerCase() === 'li') {
        const faceContent = face.target.innerHTML
        this.$refs.textBox.innerHTML += faceContent
        console.log(faceContent)
        // 将光标移动到末尾
        const range = document.createRange()
        range.selectNodeContents(this.$refs.textBox)
        range.collapse(false)
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      }
    },
    /**
     * 检测 ctrl + enter 组合键发送消息
     */
    keyCodeCheck (e) {
      const KeyCode = e.keyCode || e.which || e.charCode
      if (KeyCode === 17 && !this.keyCodeArr.includes(KeyCode)) return this.keyCodeArr.push(KeyCode)
      if (KeyCode === 13 && this.keyCodeArr.includes(17)) {
        e.preventDefault()
        this.sendMsg()
      } else if (KeyCode === 13 && !this.$store.state.sendKeyCode) {
        e.preventDefault()
        this.sendMsg()
      }
    },
    sendMsg (e) {
      this.$refs.textBox.focus() // 点击发送不让输入框失去焦点
      this.faceListActive = false
      const input = this.$refs.textBox.innerText.replace(/\n$/, '') // 匹配结尾的回车符号并替换
      const replaceSpace = input.replace(/\s+/g, '') // 不知道是干嘛的，匹配空格？
      if (replaceSpace.length === 0) {
        this.$message('说点什么啊！')
        return
      }
      // 发送消息给对方
      this.$emit('sendMsg', input, this.chatObj, 'chat')
      // 更新store
      this.$store.commit('chatRecordAdd', {
        chat: {
          msg: input,
          say: 'me',
          time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        },
        type: 'send'
      })
      this.$refs.textBox.innerHTML = ''
      // 收到或发送消息时，滚动条自动到达底部
      this.$store.commit('scrollRec')
    },
    textBoxFocus () {
      // console.log('正在输入...')
    },
    textBoxBlur () {
      // console.log('取消')
    }
  },
  computed: {
    chatObj: {
      get () {
        return this.$store.state.chatObj
      }
    },
    friends: {
      get () {
        return this.$store.state.friends[this.chatObj]
      }
    }
  },
  watch: {
    /*    '$store.state.chatObj': function () {
      const chatOrigin = this.$store.state.globe.navigation.historyList.chat[this.$store.state.chatObj].chat
      if (chatOrigin.length > this.$store.state.globe.chat.pageSize) {
        this.$store.state.globe.chat = chatOrigin.splice(chatOrigin.length - this.$store.state.globe.chat.pageSize * this.$store.state.globe.chat.current, chatOrigin.length)
      } else {
        this.$store.state.globe.chat = chatOrigin
      }
    } */
  }
}
</script>

<style scoped>
.faceListActive-enter-active, .faceListActive-leave-active {
  transition: opacity .2s;
}

.faceListActive-enter, .faceListActive-leave-to {
  opacity: 0;
}

.mainPanel_wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /*顶栏高度*/
  --nameContent-height: 90px;
  /*输入栏宽高*/
  --inputContent-height: 80px;
  --inputContent-width: 100%;
}

.mainPanel_name {
  height: var(--nameContent-height);
  min-height: var(--nameContent-height);
  width: 100%;
  background-color: #F7F9FA;
  position: relative;
  z-index: 3;
  box-sizing: border-box;
  /*padding-left: calc(var(--nameContent-height) / 2);*/
  padding-left: 10px;
  display: flex;
}

.mainPanel_name figure {
  height: var(--nameContent-height);
  width: var(--nameContent-height);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mainPanel_name figure img {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  border: 1px solid #cccccc;
}

.chatObj {
  height: var(--nameContent-height);
  font-family: cursive;
  color: #444444;
}

.chatObj .chatObjName {
  height: 53%;
  font-size: 28px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
}

.chatObj .chatObjNickName {
  box-sizing: border-box;
  padding-top: 6px;
  height: 40%;
  font-size: 15px;
  color: #999999;
}

.mainPanel_inputContent {
  min-height: var(--inputContent-height);
  width: var(--inputContent-width);
  background-color: rgba(255, 255, 255, 1);
  background: linear-gradient(to right, #F7F9FA, #ffffff);
  box-shadow: 20px -2px 22px rgba(210, 210, 210, .9),
  20px -2px 22px #ffffff;
  position: relative;
  overflow: hidden;
  z-index: 3;
  /*输入框高度*/
}

.textBoxContent {
  display: flex;
}

.textBoxContent .textBox {
  margin: calc(var(--inputContent-height) * 0.15) 0 calc(var(--inputContent-height) * 0.15) 3%;
  min-height: calc(var(--inputContent-height) * 0.7);
  width: 75%;
  padding: 6px 12px 4px;
  box-sizing: border-box;
  border-radius: 12px;
  border: none;
  background: rgba(200, 200, 200, .15);
  /*line-height: 24px;*/
  color: #444444;
  outline: none;
  max-height: 400px;
  overflow-y: auto;
  /*resize: none;
  word-break: keep-all;
  white-space: pre-wrap;*/
}

.textBoxContent .textBox::-webkit-scrollbar {
  display: none
}

.textBoxContent .btnGroup {
  width: calc(var(--inputContent-width) * 0.130);
  min-width: 110px;
  height: 48px;
  display: flex;
  position: absolute;
  justify-content: space-between;
  margin-left: 80.4%;
  margin-top: calc(var(--inputContent-height) * 0.2);
  bottom: calc(var(--inputContent-height) * 0.2);
}

.textBoxBtn {
  border-radius: 50%;
  height: 48px;
  width: 48px;
  cursor: pointer;
}

.textBoxContent .face {
  bottom: calc(var(--inputContent-height) * 0.2);
  background: url("../assets/img/face.png") no-repeat 50%;
  background-size: 90%;
  opacity: .8;
}

.textBoxContent .send {
  bottom: calc(var(--inputContent-height) * 0.2);
  background: #65C564;
}

.textBoxContent .send::after {
  content: '';
  position: absolute;
  height: 48px;
  width: 48px;
  background: url("../assets/img/send.png") no-repeat 50%;
  background-size: 70%;
}

.mainPanel_msgContent {
  position: absolute;
  top: var(--nameContent-height);
  height: calc(100% - (var(--inputContent-height) * 1) - var(--nameContent-height));
  width: 100%;
  overflow-y: auto;
  background: #F7F9FA;
}

.face-list {
  cursor: pointer;
  position: absolute;
  max-width: 70%;
  right: 5%;
  bottom: 100px;
  padding: 10px 20px;
  z-index: 999;
  background: #F7F9FA;
  border-radius: 20px;
  box-shadow: -20px 20px 60px #cecece,
  -0px -0px 0px #ffffff;
}

.face-list li {
  display: inline-block;
  width: 10%;
  text-align: center;
  line-height: 50px;
  font-size: 24px;
}

.face-list li:hover, .face-list li:active {
  background: #ffffff;
}

.msgContent {
  width: 100%;
  border: 1px solid transparent;
  box-sizing: border-box;
  padding-bottom: 100px;
}

.My_MsgContent {
  width: 100%;
  margin-top: 42px;
  min-height: 30px;
  font-size: 15px;
  display: flex;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
  align-items: start;
  position: relative;
}

.You_MsgContent {
  width: 100%;
  margin-top: 42px;
  min-height: 30px;
  font-size: 15px;
  display: flex;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
  align-items: start;
  position: relative;
}

.You_MsgContent .msgTime {
  position: absolute;
  left: 20px;
  bottom: -24px;
  font-size: 12px;
  color: rgba(100, 100, 100, .8);
}

.My_MsgContent .msgTime {
  position: absolute;
  right: 20px;
  bottom: -24px;
  font-size: 12px;
  color: rgba(100, 100, 100, .8);
}

.My_Msg, .You_Msg {
  max-width: 60%;
  min-height: 46px;
  line-height: 30px;
  font-size: 15px;
  margin: 0 20px 0 0;
  padding: 15px 25px;
  box-sizing: border-box;
  text-align: left;
  opacity: .9;
  border-radius: 30px 30px 0 30px;
  position: relative;
  letter-spacing: 1px;
  background: linear-gradient(225deg, #96d46c, #b3fb80);
  box-shadow: -4px 4px 8px #c3c5c6,
  4px -4px 8px #ffffff;
}

.You_Msg {
  border-radius: 30px 30px 30px 0px;
  background: linear-gradient(225deg, #dee0e1, #ffffff);
  box-shadow: -4px 4px 8px #c3c5c6,
  4px -4px 8px #ffffff;
  margin: 0 0 0 20px;
}
</style>
