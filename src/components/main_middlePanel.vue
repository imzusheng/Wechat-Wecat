<template>
  <div class="mainPanel_wrap"
       :disabled="loading"
       v-loading="loading"
  >
    <div class="previewImg" v-if="previewStatus">
      <div class="title">
        <h5 style="display: inline-block; font-size: 14px">预览：</h5>{{ sendFile.filePreview.previewName }}
        <i class="el-icon-close" @click="previewStatus = false"></i>
      </div>
      <img
        :src="sendFile.filePreview.previewSrc"
        alt=""
      />
    </div>
    <!--    聊天对象名字-->
    <div class="mainPanel_name" @click="faceListActive = false">
      <figure v-if="this.chatObj.length > 0">
        <img :src="$store.state.globe.navigation.historyList.chat[this.chatObj].friendInfo.avatar" alt="">
      </figure>
      <div class="chatObj">
        <div class="chatObjName">{{ chatObj }}
          <span
            style="margin-left: 40px; opacity: .7; font-size: 20px;font-weight: normal; ">
            {{ inputStatus ? '对方正在输入...' : '' }}
          </span></div>
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
      <div class="msgContent" ref="msgContent"
           :style="{paddingBottom: previewStatus ? '180px':'100px'}">
        <div
          v-for="(item, i) in $store.state.globe.chat.chatList"
          :class="{My_MsgContent : item.say === 'me', You_MsgContent : item.say === 'you'}"
          :key="i"
        >
          <div
            :style="{
             height: item.type === 'file' ? '150px' : 'auto',
             padding: item.type === 'file' ? '0' : '15px 25px',
             // background: item.type === 'file' ? 'transparent' : 'linear-gradient(225deg, #96d46c, #b3fb80)',
             // boxShadow:  item.type === 'file' ? 'none' : '-4px 4px 8px #c3c5c6, 4px -4px 8px #ffffff'
          }"
            :class="{
            'My_Msg myMsgContentFadeIn' : item.say === 'me' && !$store.state.globe.chatObjChangeFlag,
            'You_Msg youMsgContentFadeIn' : item.say === 'you' && !$store.state.globe.chatObjChangeFlag,
            'My_Msg myMsgContentFadeOut' : item.say === 'me' && $store.state.globe.chatObjChangeFlag,
            'You_Msg youMsgContentFadeOut' : item.say === 'you' && $store.state.globe.chatObjChangeFlag
          }"
          >
            {{ item.type === 'file' ? '' : item.msg }}
            <img
              v-if="item.type === 'file'"
              style="height: 150px"
              :src="`${server.httpServer}/static?filename=${item.msg}`"
              alt=""/>
          </div>
          <div class="msgTime" v-show="$store.state.globe.userConfig.timeSwitch">{{ item.time }}</div>
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
      <!--   发送文件的略缩图 s   -->
      <div class="filePreviewContont" disabled>
        <ul>
          <li
            v-for="(file, i) in sendFile.uploadList"
            :key="i"
            :class="sendFile.allowFile.includes(file.name.slice(file.name.indexOf('.') + 1, file.name.length)) ? 'fileStatus_img' : 'fileStatus_file'"
            @click="previewSwitch(file)"
          >
            <span>{{ file.name }}</span>
            <i class="el-icon-close" @click.stop="removeFileTab(i)"></i>
          </li>
        </ul>
        <!--
        <div class="filePreview">
          <img
            style="height: 100px; border: 1px solid #96d46c; border-radius: 4px"
            v-for="(item, i) in sendFile.uploadList"
            :src="item.imgSrc"
            :key="i"
            alt=""
          />
        </div>
        -->
      </div>
      <div class="textBoxContent">
        <!--        <div
                  class="textBox"
                  contenteditable="true"
                  ref="textBox"
                  @input="test"
                  @drop.stop.prevent="showPreImg($event)"
                  @paste="pasteHandle"
                  @click="faceListActive = false"
                  @focus="textBoxFocus"
                  @blur="textBoxBlur"
                  @keydown="keyCodeCheck"
                  @keyup="keyCodeArr = []"
                >
                </div>-->
        <div class="textarea_Container">{{ textAreaInput }}</div>
        <textarea
          class="textBox"
          ref="textBox"
          v-model.trim="textAreaInput"
          @drop.stop.prevent="showPreImg($event, 'drop')"
          @paste="pasteHandle"
          @click="faceListActive = false"
          @focus="textBoxFocus"
          @blur="textBoxBlur"
          @keydown="keyCodeCheck"
          @keyup="keyCodeArr = []"/>
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
import { apiUpload } from '@/assets/js/Functions'
import { API_COMMON } from '@/assets/js/api'
import config from '@/assets/js/config'

export default {
  name: 'mainPanel',
  data () {
    return {
      textAreaInput: '',
      loading: false,
      keyCodeArr: [],
      uid: window.sessionStorage.getItem('uid'),
      faceListActive: false,
      visible: true,
      sendFile: { // 发送文件相关
        allowFile: ['png', 'jpeg', 'jpg', 'svg', 'ico'], // 允许上传的文件格式
        uploadList: [], // 预览图tabs
        forms: {}, // 模拟FormData
        filePreview: { // 预览图相关
          previewStatus: false, // tabs面板展开状态
          previewSrc: '', // 预览图的图片路径
          previewName: ''
        }
      }, // 文件预览框框
      flag: true // 以下测试
    }
  },
  mounted () {
    this.$store.commit('scrollRec', this.$refs)
  },
  methods: {
    async sendFileHandle () {
      this.sendFile.uploadList = []
      // 发送图片到服务器
      const res = await apiUpload.upload(API_COMMON.POST_COMMON_UPLOAD, this.sendFile.forms, (progress) => {
        console.log(`上传进度：${((progress.loaded / progress.total) * 100).toFixed(2)}%`)
      })
      res.data.result.forEach(value => {
        this.$store.commit('chatRecordAdd', {
          chat: {
            msg: value.filename,
            say: 'me',
            time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            type: 'file',
            statuc: value.status
          },
          type: 'send'
        })
        this.$store.state.ws.sendMsg({
          msg: {
            content: value.filename,
            time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          },
          status: value.status,
          file: true,
          from: this.uid,
          to: this.chatObj,
          type: 'chat'
        }, (data) => {
          this.$store.commit('wsMsgGHandler', data)
        })
      })
    },
    previewSwitch (file) {
      this.sendFile.filePreview.previewStatus = true
      this.sendFile.filePreview.previewSrc = file.imgSrc
      this.sendFile.filePreview.previewName = file.name
      this.sendFile.filePreview.previewSize = file.size
    },
    /** 删除预览图标签 */
    removeFileTab (index) { // 阻止事件冒泡，以免触发previewSwitch()
      this.sendFile.filePreview.previewStatus = false
      this.sendFile.uploadList.splice(index, 1)
    },
    /** 处理copy事件，一般是微信复制的图片粘贴到输入框。 再将略缩图显示出来 */
    async pasteHandle (evt) {
      const paste = evt.clipboardData
      let fileFlag = false
      paste.types.forEach(type => {
        if (type === 'Files') fileFlag = true // 当粘贴的是文件时
      })
      if (fileFlag) { // 粘贴内容是文件时，加载略缩图
        const files = paste.files
        this.showPreImg(files, 'paste')
      }
    },
    /** 上传图片,显示略缩图 */
    async showPreImg (evt, type) {
      let files
      if (type === 'drop') {
        files = evt.dataTransfer.files
      } else if (type === 'paste') {
        files = evt
      }
      if (this.sendFile.uploadList.length + files.length > 10) { // 文件不能超过10个
        return this.$message({
          type: 'error',
          message: '一次最多只能发送十个文件'
        })
      }
      let flag = true // 检测是否为图片格式
      files.forEach(file => { // 检查文件格式
        if (!this.sendFile.allowFile.includes(file.name.slice(file.name.indexOf('.') + 1, file.name.length))) {
          flag = false
        }
      })

      if (!flag) { // 文件格式错误处理
        return this.$message({
          type: 'error',
          message: `允许上传的格式：${[...this.sendFile.allowFile]}`
        })
      }

      const forms = new FormData()
      for (let i = 0; i < files.length; i++) {
        forms.append('files', files[i])
        files[i].imgSrc = await this.readFileAsync(files[i])
        this.sendFile.uploadList.push(files[i])
      }
      this.sendFile.forms = forms
    },
    readFileAsync (file) { // 略缩图处理，转换为URL
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = evt => resolve(evt.target.result) // onload是指readAsDataURL处理完后
        reader.readAsDataURL(file)
      })
    },
    /** 将base64转换成file文件对象 */
    dataURLtoFile (dataurl) {
      // 获取到base64编码
      const arr = dataurl.split(',')
      // 将base64编码转为字符串
      const bstr = window.atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n) // 创建初始化为0的，包含length个元素的无符号整型数组
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File(
        [u8arr],
        `${Date.now()}.${arr[0].replace(new RegExp(/data:image\/|base64/g), '')}`,
        {
          type: arr[0].replace(new RegExp(/data:|base64/g), '')
        })
    },
    /** 模拟懒加载 */
    scrollList (evt) {
      /** 当滚动条到达顶部 && 不在加载状态时 && 已经加载的聊天记录条数不等于总条数时 */
      if (evt.target.scrollTop === 0 && this.loading === false && this.$store.state.globe.chat.total !== this.$store.state.globe.chat.chatList.length) {
        this.loading = true
        setTimeout(() => {
          this.$store.state.globe.chat.current++
          this.$store.commit('loadChat')
          this.loading = false
        }, 400)
      }
    },
    /** 聊天面板选择表情包，并将光标移动到输入框末尾 */
    selectFace (face) {
      // 事件委托到ul 导致拖动ul会全选表情。所以在触发的时候判断一下是不是点击单个li
      if (face.target.nodeName.toLowerCase() === 'li') {
        const faceContent = face.target.innerHTML
        this.textAreaInput += faceContent
        // 将光标移动到末尾
        // const range = document.createRange()
        // range.selectNodeContents(this.$refs.textBox)
        // range.collapse(false)
        // const sel = window.getSelection()
        // sel.removeAllRanges()
        // sel.addRange(range)
      }
    },
    /**
     * 检测 ctrl + enter 组合键发送消息
     * keyCode 13 = enter
     * keyCode 17 = ctrl
     */
    keyCodeCheck (e) {
      const KeyCode = e.keyCode || e.which || e.charCode
      if (KeyCode === 17 && !this.keyCodeArr.includes(KeyCode)) return this.keyCodeArr.push(KeyCode)

      if (KeyCode === 13 && this.keyCodeArr.includes(17)) { // 组合键发送
        e.preventDefault()
        this.sendMsg()
      } else if (KeyCode === 13 && !this.$store.state.globe.userConfig.sendKeyCode) {
        e.preventDefault()
        this.sendMsg()
      }
    },
    // (TODO) 点击发送-> 上传文件-> 服务器传回保存的文件名字-> 将文件名作为聊天记录发送
    sendMsg (e) {
      this.$refs.textBox.focus() // 点击发送不让输入框失去焦点
      this.faceListActive = false // 点击发送关闭表情包选择面板
      const input = this.textAreaInput.replace(/\n$|\s+/, '') // 匹配结尾的回车符号并替换
      if (input.length === 0 && this.sendFile.uploadList.length === 0) { // 如果内容全为空格，判定为空
        return this.$message('说点什么吧！')
      }
      if (this.sendFile.uploadList.length > 0) this.sendFileHandle()
      if (input.length > 0) {
        // 发送消息给对方
        this.$emit('sendMsg', input, this.chatObj, 'chat')
        // 更新store
        this.$store.commit('chatRecordAdd', {
          chat: {
            msg: input,
            say: 'me',
            time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            type: 'chat',
            static: 'true'
          },
          type: 'send'
        })
        this.textAreaInput = ''
        // 收到或发送消息时，滚动条自动到达底部
        this.$store.commit('scrollRec')
      }
    },
    /** 输入框获得焦点时，发送当前输入状态 */
    textBoxFocus () {
      this.$store.state.ws.sendMsg({
        from: this.uid,
        to: this.chatObj,
        inputStatus: true,
        type: 'inputStatus'
      }, (data) => {
        this.$store.commit('wsMsgGHandler', data)
      })
    },
    textBoxBlur () {
      this.$store.state.ws.sendMsg({
        from: this.uid,
        to: this.chatObj,
        inputStatus: false,
        type: 'inputStatus'
      }, (data) => {
        this.$store.commit('wsMsgGHandler', data)
      })
    }
  },
  computed: {
    server: {
      get () {
        return config.server
      }
    },
    previewStatus: {
      get () {
        return this.sendFile.uploadList.length > 0 ? this.sendFile.filePreview.previewStatus : false
      },
      set (evt) {
        this.sendFile.filePreview.previewStatus = evt
      }
    },
    chatObj: {
      get () {
        return this.$store.state.chatObj
      }
    },
    inputStatus: {
      get () {
        return this.$store.state.inputStatus
      }
    },
    friends: {
      get () {
        return this.$store.state.friends[this.chatObj]
      }
    }
  },
  watch: {}
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
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  /*顶栏高度*/
  --nameContent-height: 90px;
  /*输入栏宽高*/
  --inputContent-height: 80px;
  --inputContent-width: 100%;
  --transTime: .2s
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
  /*background-color: rgba(255, 255, 255, 1);*/
  background: linear-gradient(to right, #F7F9FA, #ffffff);
  box-shadow: 20px -2px 22px rgba(210, 210, 210, .9),
  20px -2px 22px #ffffff;
  position: relative;
  z-index: 3;
  /*输入框高度*/
}

.textBoxContent {
  position: relative;
}

.textBoxContent .textBox {
  /*margin: calc(var(--inputContent-height) * 0.15) 0 calc(var(--inputContent-height) * 0.15) 3%;*/
  min-height: calc(var(--inputContent-height) * 0.7);
  width: 75%;
  height: 100%;
  padding: 6px 12px 4px;
  box-sizing: border-box;
  border-radius: 12px;
  border: none;
  background: rgba(200, 200, 200, .15);
  color: #444444;
  outline: none;
  line-height: 24px;
  max-height: 400px;
  overflow-y: hidden;
  resize: none;
  position: absolute;
  top: 50%;
  left: 3%;
  transform: translate(0, -50%);
  /*  word-break: keep-all;
    white-space: pre-wrap;*/
}

.textarea_Container {
  margin: calc(var(--inputContent-height) * 0.15) 0 calc(var(--inputContent-height) * 0.15) 3%;
  min-height: calc(var(--inputContent-height) * 0.7);
  width: 75%;
  height: 100%;
  padding: 6px 12px 4px;
  box-sizing: border-box;
  border: none;
  line-height: 24px;
  max-height: 400px;
  visibility: hidden;
}

.textBoxContent .textBox::-webkit-scrollbar {
  display: none
}

.textBoxContent .btnGroup {
  width: calc(var(--inputContent-width) * 0.130);
  min-width: 110px;
  height: 48px;
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: calc(var(--inputContent-height) * 0.2);
  left: 80.4%;
  top: 50%;
  transform: translate(0, -50%);
  /*margin-left: 80.4%;*/
  /*margin-top: calc(var(--inputContent-height) * 0.2);*/
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
  overflow: hidden;
  transition: all .3s;
}

@keyframes myMsgContentFadeIn {
  0% {
    opacity: 0;
    transform: translate(30%, 0);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}

@keyframes youMsgContentFadeIn {
  0% {
    opacity: 0;
    transform: translate(-30%, 0);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}

@keyframes myMsgContentFadeOut {
  0% {
    opacity: 1;
    transform: translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: translate(30%, 0);
  }
}

@keyframes youMsgContentFadeOut {
  0% {
    opacity: 1;
    transform: translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-30%, 0);
  }
}

.myMsgContentFadeIn {
  animation: myMsgContentFadeIn var(--transTime) forwards;
}

.youMsgContentFadeIn {
  animation: youMsgContentFadeIn var(--transTime) forwards;
}

.myMsgContentFadeOut {
  animation: myMsgContentFadeOut var(--transTime) forwards;
}

.youMsgContentFadeOut {
  animation: youMsgContentFadeOut var(--transTime) forwards;
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

.filePreviewContont {
  height: 40px;
  width: 100%;
  position: absolute;
  top: -100px;
  left: 0;
}

.filePreviewContont ul {
  height: 40px;
  width: calc(100% - 8px);
  margin-top: 60px;
  display: flex;
}

.filePreviewContont li {
  cursor: pointer;
  color: #444444;
  height: 40px;
  flex: 1;
  padding: 0 22px 0 12px;
  box-sizing: border-box;
  line-height: 40px;
  opacity: .9;
  position: relative;
  border-radius: 8px 8px 0 0;
  border-right: 1px solid #a8e382;
}

.filePreviewContont .previewImg {
  position: absolute;
  top: -220px;
  left: -200px;
  height: 200px;
  border: 1px solid #96d46c;
  border-radius: 4px
}

.filePreviewContont li span {
  height: 100%;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

/* 绿色 图片*/
.fileStatus_img {
  background: #bafb90;
}

/* 蓝色 文件 */
.fileStatus_file {
  background: #b5ebff;
}

/* 灰色 上传中*/
.fileStatus_upload {
  background: #d6d3d3;
}

/* 红色 上传失败 */
.fileStatus_error {
  background: #ff6666;
}

.filePreviewContont .el-icon-close {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translate(0, -50%);
}

.previewImg {
  /*border: 2px solid #bafb90;*/
  border-radius: 18px 0 18px 18px;
  background: #f2f2f2;
  box-shadow: 7px 7px 15px #e6e6e6,
  -7px -7px 15px #fefefe;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  transform: translate(-50%, -50%);
}

.previewImg .title {
  position: absolute;
  box-shadow: 7px -7px 15px #e6e6e6,
  -7px -7px 15px #fefefe;
  background: linear-gradient(to bottom, #bafb90, #f2f2f2);
  font-size: 14px;
  font-family: Microsoft YaHei;
  width: auto;
  height: 36px;
  line-height: 36px;
  border-radius: 8px 8px 0 0;
  box-sizing: border-box;
  padding: 0 22px;
  top: -36px;
  right: 0;
}

.previewImg .el-icon-close {
  cursor: pointer;
  margin-left: 20px;
}

.previewImg img {
  pointer-events: none;
  height: 300px;
}
</style>
