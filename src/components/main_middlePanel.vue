<template>
  <!--  (TODO) 我点天！点击全网搜索也会弹出好友请求框！-->
  <!--  (TODO) 有一些好友关系存在，但是没有聊天记录的好友，就会报错！-->
  <!--  @drop.stop.prevent="showPreImg($event, 'drop')"-->
  <div class="mainPanel_wrap"
       :disabled="loading"
       v-loading="loading"
       @dragenter="uploadDragenter($event)"
       @dragleave="uploadDragleave($event)"
       @drop.stop.prevent="showPreImg($event, 'drop')"
  >
    <!--  图片预览 -->
    <transition name="faceListActive">
      <div
        class="previewImg"
        v-show="previewStatus"
        @click="previewStatus = false"
        :style="{transform: `translate(-50%, -50%) scale(${$store.state.globe.userConfig.previewImgHeight/100, $store.state.globe.userConfig.previewImgHeight/100})`}"
      >
        <!--        <div class="title" @click="previewStatus = false">-->
        <!--          {{ sendFile.filePreview.previewName }}-->
        <!--          <i class="el-icon-close"></i>-->
        <!--        </div>-->
        <img
          :src="sendFile.filePreview.previewSrc"
          alt=""
        />
      </div>
    </transition>
    <!--  聊天对象名字 -->
    <div class="mainPanel_name" @click="faceListActive = false">
      <figure v-if="this.chatObj.length > 0">
        <img :src="$store.state.globe.navigation.contactList.nameList[this.chatObj].friendInfo.avatar" alt="">
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
    <!--    聊天记录信息面板  -->
    <div class="mainPanel_msgContent"
         ref="msgContentBox"
         @click="faceListActive = false"
         @scroll="scrollList($event)"
    >
      <div class="msgContent" ref="msgContent"
           :style="{paddingBottom: sendFile.uploadList.length > 0 ? '180px':'100px'}">
        <transition-group name="msgFade">
          <div
            v-for="item in $store.state.globe.chat.chatList"
            :class="{My_MsgContent : item.say === 'me', You_MsgContent : item.say === 'you'}"
            :key="item.msgID ? `${$store.state.chatObj + item.msgID}` : $store.state.chatObj + '0'"
          >
            <!--   正常聊天框 s   -->
            <div
              v-if="item.type !== 'file'"
              :class="{
            'My_Msg' : item.say === 'me',
            'You_Msg' : item.say === 'you',
            'My_Msg' : item.say === 'me',
            'You_Msg' : item.say === 'you'
          }"
            >
              {{ item.msg }}
            </div>
            <!--   文件聊天框 s  -->
            <!--            :class="{-->
            <!--            'myMsgContentFadeIn' : item.say === 'me' && !$store.state.globe.chatObjChangeFlag,-->
            <!--            'youMsgContentFadeIn' : item.say === 'you' && !$store.state.globe.chatObjChangeFlag,-->
            <!--            'myMsgContentFadeOut' : item.say === 'me' && $store.state.globe.chatObjChangeFlag,-->
            <!--            'youMsgContentFadeOut' : item.say === 'you' && $store.state.globe.chatObjChangeFlag-->
            <!--            }"-->
            <div
              v-else>
              <img
                v-if="sendFile.allowImg.includes(item.postfix)"
                @click="showPre({postfix: 'jpg', imgSrc: `${server.httpServer}/static?filename=${item.msg}`})"
                style="cursor: pointer; border: 1px solid #ccc; box-shadow: 10px 10px 30px #cecece, 0px 0px 0px #ffffff; max-width: 750px; max-height: 300px"
                :style="{margin: item.say === 'me' ? '30px 20px 0 0': '30px 0 0 20px'}"
                :src="`${server.httpServer}/static?filename=${item.msg}`"
                alt=""/>
              <div
                v-if="sendFile.allowFile.includes(item.postfix)"
                :class="item.say === 'me' ? 'myfilePreview' : 'youfilePreview'"
              >
                <!--  保持文件图片始终靠向中间 s  -->
                <a
                  v-if="item.say === 'me'"
                  :href="`${server.httpServer}/static?filename=${item.msg}&raw=${item.rawName}`"
                  :download="`${item.msg}`"
                >
                  <div class="filePreview_img">
                    <svg t="1621934901345" class="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="2889" width="80" height="80">
                      <path
                        d="M519.283382 163.91421l0 232.024447 232.315066 0L519.283382 163.91421zM490.341213 425.124374 490.341213 163.91421l0 0L257.879813 163.91421l0 696.170556 508.23935 0L766.119163 425.124374 490.341213 425.124374z"
                        p-id="2890" fill="#65C564"></path>
                    </svg>
                  </div>
                  <div class="filePreview_filename">{{ item.rawName }}</div>
                </a>
                <a
                  v-else
                  :href="`${server.httpServer}/static?filename=${item.msg}&raw=${item.rawName}`"
                  :download="`${item.msg}`"
                >
                  <div class="filePreview_filename">{{ item.rawName }}</div>
                  <div class="filePreview_img">
                    <svg t="1621934901345" class="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="2889" width="80" height="80">
                      <path
                        d="M519.283382 163.91421l0 232.024447 232.315066 0L519.283382 163.91421zM490.341213 425.124374 490.341213 163.91421l0 0L257.879813 163.91421l0 696.170556 508.23935 0L766.119163 425.124374 490.341213 425.124374z"
                        p-id="2890" fill="#65C564"></path>
                    </svg>
                  </div>
                </a>
              </div>
            </div>
            <div class="msgTime" v-show="$store.state.globe.userConfig.timeSwitch">{{ item.time }}</div>
          </div>
        </transition-group>
      </div>
    </div>
    <!--    表情包面板-->
    <transition name="faceListActive">
      <ul class="face-list noSelect" @click="selectFace" v-show="faceListActive">
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
      <!--  拖动文件提示遮罩    -->
      <div
        class="mainPanel_mask"
        v-if="$store.state.globe.mainPanelMask"
      >
        <i class="el-icon-upload"></i>
        拖动到这里上传！！
      </div>
      <!--   文件预览标签 s   -->
      <div class="filePreviewContont" disabled>
        <ul>
          <li
            v-for="(file, i) in sendFile.uploadList"
            :key="i"
            class="fileStatus_upload"
            @click="showPre(file)"
          >
            <!--            @mouseenter="uploadMouseenter(file)"-->
            <!--            @mouseleave="uploadMouseleave(file)"-->
            <span>{{ file.name ? file.name : '上传完成' }}</span>
            <span class="closeContainer" @click.stop.prevent="removeFileTab(i)"><i class="el-icon-close"></i></span>
            <div
              :style="{clipPath: `polygon(0% 100%, ${sendFile.uploading[i] ? sendFile.uploading[i] : 0}% 100%, ${sendFile.uploading[i] ? sendFile.uploading[i] : 0}% 0%, 0% 0%)`}"
              :class="sendFile.uploading[i] !== '100' ? 'fileLoading fileStatus_yellow' : 'fileLoading fileStatus_green'"
            >
            </div>
          </li>
        </ul>
      </div>
      <!--   输入框和按钮组 s  -->
      <div
        class="textBoxContent">
        <div class="textarea_Container">{{ textAreaInput }}</div>
        <textarea
          :style="{opacity: $store.state.globe.mainPanelMask ? 0 : 1}"
          class="textBox"
          ref="textBox"
          v-model.trim="textAreaInput"
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
import Vue from 'vue'
import { apiUpload, getHash } from '@/assets/js/Functions'
import config from '@/assets/js/config'

export default {
  name: 'mainPanel',
  data () {
    return {
      dragenterClassName: '', // 记录dragenter事件classname
      textAreaInput: '',
      loading: false,
      keyCodeArr: [],
      uid: window.sessionStorage.getItem('uid'),
      faceListActive: false,
      sendFile: { // 发送文件相关
        allowImg: ['png', 'jpeg', 'jpg', 'svg', 'ico'], // 允许上传的图片格式
        allowFile: ['zip', 'tar', 'rar', '7z', 'mp4', 'mp3', 'txt', 'doc', 'docx', 'pdf', 'mov'],
        uploadList: [], // 预览图tabs
        forms: [], // 模拟FormData
        filePreview: { // 预览图相关
          previewStatus: false, // tabs面板展开状态
          previewSrc: '', // 预览图的图片路径
          previewName: ''
        },
        uploading: {} // 上传进度
      }, // 文件预览框框
      timer: '',
      flag: true // 以下测试
    }
  },
  mounted () {
    this.$store.commit('scrollRec', this.$refs)
    this.$store.state.globe.mainPanelMask = false
  },
  methods: {
    /** 文件上传完成后处理 */
    uploadDone (file, res) {
      this.$store.state.globe.navigation.historyList.nameList[this.$store.state.chatObj].count++
      const count = this.$store.state.globe.navigation.historyList.nameList[this.$store.state.chatObj].count
      this.$store.commit('chatRecordAdd', {
        chat: {
          msg: res.data.filePath,
          say: 'me',
          msgID: count,
          time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          rawName: file.name, // 文件原名称
          postfix: file.postfix, // 文件后缀
          type: 'file', // 标记为文件消息
          status: true // 发送成功
        },
        type: 'send'
      })
      this.$store.state.ws.sendMsg({
        msg: {
          content: res.data.filePath,
          time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        },
        rawName: file.name, // 文件原名称
        postfix: file.postfix, // 文件后缀
        file: true, // 标记为文件消息
        status: true, // 发送成功
        from: this.uid,
        to: this.chatObj,
        type: 'chat'
      }, (data) => {
        this.$store.commit('wsMsgGHandler', data)
      })
    },
    /** 发送图片到服务器 */
    sendFileHandle () {
      this.sendFile.uploadList.forEach(async (file, index) => {
        // 生成hash
        file.hash = getHash(file.name + file.size + file.lastModified) // 将hash挂载file上
        // 上传之前先检查服务器是否存在相同文件
        const res = await apiUpload.beforeUpload(file)
        if (!res.data.exist) { // 不存在相同文件，开始上传
          apiUpload.uploadPartition(
            file,
            {
              chunkSize: 1024 * 1024, // 1M一个分片
              oneTime: 10 // 一次性发送几个Post请求
            }, Progress => {
              Vue.set(this.sendFile.uploading, index, Progress) // 直接设置进度条不会更新，响应式原理
            }).then(res => { // 不存在相同文件，返回服务器保存后的文件名
            this.closePreview(index, file, res)
          })
        } else { // 存在相同文件，直接返回服务器文件名
          this.closePreview(index, file, res)
        }
      })
    },
    closePreview (index, file, res) { // (TODO) 上传完成，这里暂时不能用splice删除掉数组，因为会改变数组长度。后期换成对象就可以
      this.sendFile.uploadList[index] = '' // 上传完成
      this.uploadDone(file, res)
      let flag = true
      this.sendFile.uploadList.forEach(item => {
        if (item) flag = false
      })
      if (flag) {
        this.sendFile.uploadList = []
        this.sendFile.forms = []
        this.sendFile.uploading = {}
      }
    },
    /** 鼠标移入标签 */
    // uploadMouseenter (file) {
    //   clearTimeout(this.timer)
    //   this.sendFile.filePreview.previewStatus = true
    //   this.sendFile.filePreview.previewSrc = file.imgSrc
    //   this.sendFile.filePreview.previewName = file.name
    //   this.sendFile.filePreview.previewSize = file.size
    // },
    /** 鼠标移出标签 */
    // uploadMouseleave () {
    //   clearTimeout(this.timer)
    //   this.timer = setTimeout(() => {
    //     this.previewStatus = false
    //   }, 1500)
    // },
    /** 显示预览图 */
    async showPre (file) {
      // (TODO) base64的图片加载起来太慢，导致浏览器非常卡顿！
      if (this.sendFile.allowImg.includes(file.postfix)) {
        this.sendFile.filePreview.previewStatus = true
        this.sendFile.filePreview.previewSrc = file.imgSrc
        this.sendFile.filePreview.previewName = file.name ? file.name : ''
        this.sendFile.filePreview.previewSize = file.size ? file.size : ''
      }
    },
    /** 拖入文件 */
    uploadDragenter (evt) {
      this.dragenterClassName = evt.target.className
      this.$store.state.globe.mainPanelMask = true
    },
    /** 拖出文件 */
    uploadDragleave (evt) {
      if (this.dragenterClassName === evt.target.className) this.$store.state.globe.mainPanelMask = false // 上传提示蒙版关闭
    },
    /** 删除预览图标签 */
    removeFileTab (index) { // 阻止事件冒泡，以免触发previewSwitch()
      this.sendFile.filePreview.previewStatus = false
      this.sendFile.uploadList.splice(index, 1)
    },
    /** 处理copy事件，一般是微信复制的图片粘贴到输入框。 再将略缩图显示出来 */
    pasteHandle (evt) {
      const paste = evt.clipboardData
      let fileFlag = false
      paste.types.forEach(type => {
        if (type === 'Files') fileFlag = true // 当粘贴的是文件时
      })
      if (fileFlag) { // 粘贴内容是文件时，加载略缩图
        paste.files.forEach(file => {
          this.readFileAsync(file).then(fileUrl => {
            file.imgSrc = fileUrl
            file.postfix = 'png'
            this.sendFile.uploadList.push(file)
          })
        })
      }
    },
    /** 上传图片,显示略缩图 */
    showPreImg (evt, type) {
      this.$store.state.globe.mainPanelMask = false
      let files = '' // 传入文件列表
      let flag = true // 检测是否为允许上传的格式
      let message = ''

      if (type === 'drop') {
        files = evt.dataTransfer.files
      }

      if (this.sendFile.uploadList.length + files.length > 10) { // 文件不能超过10个
        return this.$message({
          type: 'error',
          message: '一次最多只能发送十个文件'
        })
      }

      files.forEach(file => {
        // if (file.size > 1024 * 1024 * 2) {
        //   flag = false
        //   message = '太大了！'
        //   return
        // }
        // 图片格式fileType = img, 文件格式fileType = file, 都不满足标记一下flag = false不允许上传
        const postfix = file.name.slice(file.name.indexOf('.') + 1, file.name.length)
        if (this.sendFile.allowImg.includes(postfix)) {
          file.postfix = postfix
        } else if (this.sendFile.allowFile.includes(postfix)) {
          file.postfix = postfix
        } else {
          message = `允许上传的格式：${[...this.sendFile.allowImg, ...this.sendFile.allowFile]}`
          flag = false
        }
      })

      if (!flag) { // 文件格式错误处理
        return this.$message({
          type: 'error',
          message: message
        })
      }

      for (let i = 0; i < files.length; i++) {
        if (this.sendFile.allowImg.includes(files[i].postfix)) { // 图片才需要转换成base64
          this.readFileAsync(files[i]).then(fileUrl => {
            files[i].imgSrc = fileUrl
            this.sendFile.uploadList.push(files[i])
          })
        } else {
          this.sendFile.uploadList.push(files[i])
        }
      }
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
        { type: arr[0].replace(new RegExp(/data:|base64/g), '') })
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
        this.$store.state.globe.navigation.historyList.nameList[this.$store.state.chatObj].count++
        const count = this.$store.state.globe.navigation.historyList.nameList[this.$store.state.chatObj].count
        this.$store.commit('chatRecordAdd', {
          chat: {
            msgID: count,
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
        return this.sendFile.filePreview.previewStatus
        // return this.sendFile.uploadList.length > 0 ? this.sendFile.filePreview.previewStatus : false
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
.msgFade-enter-active {
  transition: all .3s;
  /*transition-delay: .1s;*/
}

.msgFade-leave-active {
  transition: all 0s;
}

.msgFade-enter, .msgFade-leave-to {
  transform: translate3d(0, 80%, 0);
  opacity: 0;
}

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

.mainPanel_mask {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 98;
  background: #65C564;
  opacity: .7;
}

.mainPanel_mask .el-icon-upload {
  font-size: 28px;
  margin-right: 6px;
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
  z-index: 99;
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
  width: calc(var(--inputContent-width) * 0.12);
  min-width: 110px;
  height: 48px;
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: calc(var(--inputContent-height) * 0.2);
  left: 83.4%;
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
  position: absolute;
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
  opacity: .5;
  overflow: hidden;
  position: relative;
  border-radius: 8px 8px 0 0;
  border-right: 1px solid #a8e382;
  transition: all .2s;
}

.filePreviewContont li:hover {
  height: 40px;
  line-height: 40px;
  margin-top: 0px;
  opacity: 1;
  border: none
}

.filePreviewContont .previewImg {
  position: absolute;
  top: -220px;
  left: -200px;
  height: 200px;
  border: 1px solid #96d46c;
  border-radius: 4px
}

.filePreviewContont li span:nth-of-type(1) {
  position: relative;
  z-index: 5;
  height: 100%;
  width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.filePreviewContont li .fileLoading {
  position: absolute;
  z-index: 2;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}

/* 绿色 图片*/
.fileStatus_green {
  background: #bafb90;
}

/* 黄色 上传中*/
.fileStatus_yellow {
  background: #fbf090;
}

/* 蓝色 文件 */
.fileStatus_blue {
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

.filePreviewContont .closeContainer {
  height: 40px;
  width: 5%;
  display: block;
  position: absolute;
  text-align: center;
  z-index: 4;
  right: 12px;
  top: 50%;
  transform: translate(0, -50%);
}

.previewImg {
  cursor: pointer;
  /*border-radius: 0 0 5% 5%;*/
  overflow: hidden;
  /*background: #f2f2f2;*/
  background: transparent;
  position: absolute;
  top: 50%;
  left: 40%;
  z-index: 999;
  /*box-shadow: 20px 20px 60px #cecece,*/
  /*-0px -0px 0px #ffffff;*/
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
  max-height: 400px;
  pointer-events: none;
}

.myfilePreview {
  cursor: pointer;
  display: flex;
  margin: 30px 20px 0 0;
  height: 80px;
  border-radius: 6px;
  background: rgba(180, 190, 200, .3);
}

.youfilePreview {
  cursor: pointer;
  display: flex;
  margin: 30px 0 0 20px;
  height: 80px;
  background: rgba(180, 190, 200, .3);
}

.youfilePreview a,
.myfilePreview a {
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 6px;
  box-shadow: 5px 5px 12px #cecece,
  -0px -0px 0px #ffffff;
}

.filePreview_filename {
  box-sizing: border-box;
  padding: 15px 20px 0 15px;
  color: #333;
}

/*.myfilePreviewIcon {*/
/*  height: auto !important;*/
/*  background: none !important;*/
/*  box-shadow: none;*/
/*  position: relative !important;*/
/*  text-align: right !important;*/
/*}*/

/*.youfilePreviewIcon {*/
/*  height: auto !important;*/
/*  background: none !important;*/
/*  box-shadow: none;*/
/*  position: relative !important;*/
/*  text-align: left !important;*/
/*}*/

/*.myfilePreviewIcon .icon,*/
/*.youfilePreviewIcon .icon {*/
/*  margin: 20px 0 0px;*/
/*}*/

/*.myfilePreviewIcon .iconInfo,*/
/*.youfilePreviewIcon .iconInfo {*/
/*  display: block;*/
/*  color: #777;*/
/*  margin-top: -27px;*/
/*  font-size: 12px;*/
/*}*/
</style>
