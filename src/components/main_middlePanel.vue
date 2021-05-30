<template>
  <!--  (TODO) 希望图片不需要分片上传，只有大文件才需要 -->
  <!--  (TODO) 对方正在输入也是全局的！需要修改为每个对象一个-->
  <div v-loading="loading"
       :disabled="loading"
       class="mainPanel_wrap"
       @dragenter="uploadDragenter($event)"
       @dragleave="uploadDragleave($event)"
       @drop.stop.prevent="showPreImg($event, 'drop')"
  >
    <!--   输入长度警告 position s  -->
    <div class="chatLengthAlert">
      <div v-show="textAreaInput.length > 750"
           :class="textAreaInput.length > 950 ? (textAreaInput.length >= 1000 ? 'fileStatus_error' : 'fileStatus_yellow') : 'fileStatus_blue'">
        最多可输入1000个字符，还剩 {{ 1000 - textAreaInput.length }} 个
      </div>
    </div>

    <!--  拖动文件提示遮罩 position s  -->
    <div v-show="$store.state.globe.mainPanelMask" :contenteditable="true" class="mainPanel_mask"></div>

    <!--  拖动文件提示遮罩(为了隐藏contenteditable="true"时出现的光标，文本需要分开放) position s  -->
    <div v-show="$store.state.globe.mainPanelMask" class="mainPanel_mask_text">
      <i class="el-icon-upload"></i>
      拖动到这里上传！！
    </div>

    <!--  图片预览 position -->
    <transition name="faceListActive">
      <div
        v-show="previewStatus"
        :style="{transform: `translate(-50%, -50%) scale(${$store.state.globe.userConfig.previewImgHeight/100, $store.state.globe.userConfig.previewImgHeight/100})`}"
        class="previewImg"
        @click="previewStatus = false"
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

    <!--    表情包面板 position s -->
    <ul v-show="faceListActive" class="face-list noSelect" @click="selectFace">
      <div class="face-list-content">
        <ul>
          <li v-for="(item, index) in emoji[emojiPicked]" :key="index" :title="item.name">{{ item.emoji }}</li>
        </ul>
      </div>
      <ul class="face-list-tabs" @click="switchEmojiTabs">
        <li v-for="(item, index) in Object.keys(emoji)" :key="index">
          <input v-model="emojiPicked" :value="item" name="face-list-tabs" type="radio"/>
          <div class="face-list-tabs-child">{{ item }}</div>
        </li>
      </ul>
    </ul>

    <!--  聊天对象名字 main -->
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

    <div :style="{transform: extraVisible ? 'translate(0, -80px)' : 'translate(0, 0)'}" class="mainPanel_Box">

      <!--    聊天记录信息面板 main -->
      <div ref="msgContentBox"
           class="mainPanel_msgContent"
           @click="faceListActive = false"
           @scroll="scrollList($event)"
      >
        <div
          ref="msgContent"
          class="msgContent"
        >
          <transition-group name="msgFade">
            <div
              v-for="item in $store.state.globe.chat.chatList"
              :key="item.msgID"
              :class="{My_MsgContent : item.say === 'me', You_MsgContent : item.say === 'you'}"
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
              <!--     不正常      -->
              <div
                v-else>
                <!--     当聊天信息只为一张图片时      -->
                <img
                  v-if="sendFile.allowImg.includes(item.postfix)"
                  :src="`${server.httpServer}/static?filename=${item.msg}`"
                  :style="{margin: item.say === 'me' ? '30px 20px 0 0': '30px 0 0 20px'}"
                  alt=""
                  style="cursor: pointer; border: 1px solid #ccc; box-shadow: 5px 5px 15px #cecece, 0px 0px 0px #ffffff; height: 150px"
                  @click="showPre({postfix: 'jpg', imgSrc: `${server.httpServer}/static?filename=${item.msg}`})"/>
                <!--     当聊天信息是一个文件时      -->
                <div
                  v-if="sendFile.allowFile.includes(item.postfix)"
                  :class="item.say === 'me' ? 'myfilePreview' : 'youfilePreview'"
                >
                  <!--  保持文件图片始终靠向中间 s  -->
                  <a
                    v-if="item.say === 'me'"
                    :download="`${item.msg}`"
                    :href="`${server.httpServer}/static?filename=${item.msg}&raw=${item.rawName}`"
                  >
                    <div class="filePreview_img">
                      <svg class="icon" height="80" p-id="2889" t="1621934901345"
                           version="1.1" viewBox="0 0 1024 1024" width="80" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M519.283382 163.91421l0 232.024447 232.315066 0L519.283382 163.91421zM490.341213 425.124374 490.341213 163.91421l0 0L257.879813 163.91421l0 696.170556 508.23935 0L766.119163 425.124374 490.341213 425.124374z"
                          fill="#65C564" p-id="2890"></path>
                      </svg>
                    </div>
                    <div class="fileInfo">
                      <div class="filePreview_filename">{{ item.rawName }}</div>
                      <div class="filePreview_filename">大小：{{ fileSize(item.size) }}</div>
                    </div>
                  </a>
                  <a
                    v-else
                    :download="`${item.msg}`"
                    :href="`${server.httpServer}/static?filename=${item.msg}&raw=${item.rawName}`"
                  >
                    <div class="fileInfo">
                      <div class="filePreview_filename">{{ item.rawName }}</div>
                      <div class="filePreview_filename">大小：{{ fileSize(item.size) }}</div>
                    </div>
                    <div class="filePreview_img">
                      <svg class="icon" height="80" p-id="2889" t="1621934901345"
                           version="1.1" viewBox="0 0 1024 1024" width="80" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M519.283382 163.91421l0 232.024447 232.315066 0L519.283382 163.91421zM490.341213 425.124374 490.341213 163.91421l0 0L257.879813 163.91421l0 696.170556 508.23935 0L766.119163 425.124374 490.341213 425.124374z"
                          fill="#65C564" p-id="2890"></path>
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
              <div v-show="$store.state.globe.userConfig.timeSwitch" class="msgTime">{{ item.time }}</div>
            </div>
          </transition-group>
        </div>
      </div>

      <!--    输入框 main  -->
      <div class="mainPanel_inputContent">
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
        <!--   输入长度进度条 s  -->
        <div class="chatLengthProgress" title="最多可输入1000个字符">
          <div
            class="chatLength"
            :class="textAreaInput.length > 950 ? (textAreaInput.length >= 1000 ? 'fileStatus_error' : 'fileStatus_yellow') : 'fileStatus_blue'"
            :style="{clipPath: `polygon(0% 100%, ${textAreaInput.length / 10}% 100%, ${textAreaInput.length / 10}% 0%, 0% 0%)`}"
          >
          </div>
        </div>
        <!--   输入长度进度条 e  -->
        <div class="textarea_Container">
          <!--  textBoxSupport用于支撑 textarea 自动换行 s -->
          <div class="textBoxSupport" v-html="textAreaInput"></div>
          <!--  textBoxSupport用于支撑 textarea 自动换行 e -->
          <!-- 输入框本体 s -->
          <textarea
            ref="textBox"
            v-model.trim="textAreaInput"
            :style="{opacity: $store.state.globe.mainPanelMask ? 0 : 1}"
            class="textBox"
            maxlength="1000"
            @blur="textBoxBlur"
            @click="faceListActive = false"
            @focus="textBoxFocus"
            @keydown="keyCodeCheck"
            @keyup="keyCodeArr = []"
            @paste="pasteHandle"/>
          <!-- 输入框本体 e -->
        </div>
        <!--   发送按钮 s  -->
        <div class="btnGroup">
          <div class="btnGroup_Extra">
            <input v-model="extraVisible" name="btnGroup_Extra" type="checkbox"/>
            <i class="el-icon-plus"></i>
          </div>
          <div class="send textBoxBtn" @click="sendMsg"></div>
        </div>
        <!--   发送按钮 e  -->
      </div>
    </div>

    <!--  额外功能面板 main s  -->
    <div :style="{transform: extraVisible ? 'translate(0, 0px)' : 'translate(0, 80px)'}" class="mainPanel_Extra">
      <ul>
        <li @click="$refs.uploadFile.click()">
          <input
            ref="uploadFile"
            :accept="[...sendFile.allowImgDot, ...sendFile.allowFileDot]"
            multiple
            style="position: absolute;
            visibility: hidden"
            type="file"
            @change="showPreImg($event, 'extra')">
          <svg class="icon" height="40" p-id="3316" t="1622278437229" version="1.1"
               viewBox="0 0 1024 1024" width="40" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M843.5 226.2H473.6l-78.4-70.8H139.3l-76.8 70.8v521.3c0 64 51.9 115.9 115.9 115.9h665c64 0 115.9-51.9 115.9-115.9V342.1c0-64-51.8-115.9-115.8-115.9z"
              fill="#888888" p-id="3317"></path>
          </svg>
          文件
        </li>
        <li @click="faceListActive = !faceListActive">
          <svg class="icon" height="38" p-id="2355" t="1622278302076" version="1.1"
               viewBox="0 0 1024 1024" width="38" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M512 63.791885c-247.536746 0-448.208115 200.671369-448.208115 448.208115s200.671369 448.208115 448.208115 448.208115 448.208115-200.671369 448.208115-448.208115S759.535723 63.791885 512 63.791885zM512 906.423141c-217.829144 0-394.423141-176.593997-394.423141-394.423141s176.593997-394.423141 394.423141-394.423141 394.423141 176.593997 394.423141 394.423141S729.829144 906.423141 512 906.423141zM368.573403 494.071675c29.707602 0 53.784974-42.005696 53.784974-71.713298s-24.077372-71.713298-53.784974-71.713298c-29.707602 0-53.784974 42.005696-53.784974 71.713298S338.865801 494.071675 368.573403 494.071675zM655.426597 494.071675c29.707602 0 53.784974-42.005696 53.784974-71.713298s-24.077372-71.713298-53.784974-71.713298c-29.707602 0-53.784974 42.005696-53.784974 71.713298S625.718995 494.071675 655.426597 494.071675zM691.283246 619.569948c-8.695033-3.764744-20.904099-4.715395-32.790824-4.427846-32.450063 46.003753-85.912695 76.141144-146.492422 76.141144-61.726853 0-116.139114-31.195489-148.392702-78.669734-10.075473 0.214894-20.779256 1.90028-30.890544 6.956436-11.599176 5.809309-15.633049 13.984503-18.143219 21.029966 41.21775 71.050196 114.113991 122.396631 197.426465 122.396631 84.764546 0 158.737304-53.157687 199.524243-126.143978C706.396455 629.771287 699.906647 623.317295 691.283246 619.569948z"
              fill="#888888" p-id="2356"></path>
          </svg>
          表情
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import { apiUpload, getHash } from '@/assets/js/Functions'
import config from '@/assets/js/config'
import emoji from '@/assets/json/data-by-group.json'

export default {
  name: 'mainPanel',
  // directives: {
  //   msgUpdate: {
  //     inserted () {
  //       console.log('inserted')
  //     },
  //     componentUpdated () {
  //       console.log('componentUpdated')
  //     }
  //   }
  // },
  data () {
    return {
      emoji,
      chatListChange: false,
      extraVisible: false, // 额外功能面板
      emojiPicked: '', // 选中的表情分类
      dragenterClassName: '', // 记录dragenter事件classname
      textAreaInput: '',
      loading: false,
      keyCodeArr: [],
      uid: window.sessionStorage.getItem('uid'),
      faceListActive: false,
      sendFile: { // 发送文件相关
        sending: false, // 是否正在发送中,发送中不可关闭预览标签
        allowImgDot: ['.png', '.jpeg', '.jpg', '.svg', '.ico'], // 允许上传的图片格式
        allowFileDot: ['.zip', '.tar', '.rar', '.7z', '.mp4', '.mp3', '.txt', '.doc', '.docx', '.pdf', '.mov', '.avi', '.pdf'],
        allowImg: ['png', 'jpeg', 'jpg', 'svg', 'ico'], // 允许上传的图片格式
        allowFile: ['zip', 'tar', 'rar', '7z', 'mp4', 'mp3', 'txt', 'doc', 'docx', 'pdf', 'mov', 'avi', 'pdf'],
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
    this.$store.state.refs = this.$refs
    this.emojiPicked = Object.keys(emoji)[0]
    this.$store.state.globe.mainPanelMask = false
  },
  beforeUpdate () {
  },
  updated () {
    if (!this.chatListChange) return // 当chatList没有发生改变时,直接返回.chatList才是聊天记录数据
    this.chatListChange = false
    setTimeout(() => { // 解决切换动画 .msgFade-leave-active 期间内导致父层高度变化影响观感的问题
      if (!this.$store.state.globe.userConfig.loadingChat) { // 当未开启懒加载时，直接把所有聊天记录展示出来
        this.$refs.msgContentBox.scrollTop = this.$refs.msgContent.offsetHeight
      } else { // 以下开启懒加载，聊天记录切割后展示
        if (this.$store.state.globe.chat.total > this.$store.state.globe.userConfig.pageSize * this.$store.state.globe.chat.current) { // 当剩余页数大于1时
          if (this.$store.state.globe.chat.current >= 2) { // 当前页数在第二页及以上时
            if (this.$store.state.globe.chat.total > this.$store.state.globe.userConfig.pageSize * this.$store.state.globe.chat.current) {
              this.$store.state.globe.chat.curScroll = this.$store.state.refs.msgContentBox.scrollHeight // 保存当前的滚动条总高度
              this.$store.state.refs.msgContentBox.scrollTop = this.$store.state.globe.chat.curScroll - this.$store.state.globe.chat.befScroll // 利用计算后的滚动条高度差，使更新后用户界面仍在原来位置
              this.$store.state.globe.chat.befScroll = this.$store.state.refs.msgContentBox.scrollHeight // 使用后
            }
          } else { // 当前页数在第一页时，作特殊处理
            this.$store.state.globe.chat.befScroll = this.$store.state.refs.msgContent.offsetHeight
            this.$store.state.refs.msgContentBox.scrollTop = this.$store.state.refs.msgContent.offsetHeight
          }
        } else { // 当剩余页数等于1时
          this.$store.state.globe.chat.curScroll = this.$store.state.refs.msgContentBox.scrollHeight
          this.$store.state.refs.msgContentBox.scrollTop = this.$store.state.globe.chat.curScroll - this.$store.state.globe.chat.befScroll // 利用计算后的滚动条高度差，使更新后用户界面仍在原来位置
        }
      }
    }, 200)
  },
  methods: {
    switchEmojiTabs (evt) {
      this.emojiPicked = evt.target.value
    },
    /** 处理显示文件大小 */
    fileSize (size) {
      if (size <= 1024 * 1024) {
        return `${(size / 1024).toFixed(2)} kb`
      } else if (size <= 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(2)} M`
      } else {
        return `${(size / (1024 * 1024 * 1024)).toFixed(2)} G`
      }
    },
    /** 发送消息 */
    sendMsg (e) {
      this.extraVisible = false // 只要发送消息，功能面板就关闭
      this.$refs.textBox.focus() // 点击发送不让输入框失去焦点
      this.faceListActive = false // 点击发送关闭表情包选择面板
      const input = this.textAreaInput.replace(/\n$|\s+/, '') // 匹配结尾的回车符号并替换
      if (input.length === 0 && this.sendFile.uploadList.length === 0) { // 如果内容全为空格，判定为空
        return this.$message('说点什么吧！')
      }
      if (this.sendFile.uploadList.length > 0) { // 当上传文件时
        this.sendFile.uploadList.forEach((file, index) => {
          file.hash = getHash(file.name + file.size + file.lastModified) // 生成hash,将hash挂载file上
        })
        const unique = {}
        this.sendFile.uploadList.forEach((file, index) => {
          unique[file.hash] = file
        })
        if ([...Object.values(unique)].length !== this.sendFile.uploadList.length) {
          this.$message({
            type: 'info',
            message: '检测到重复文件，将合并为一次发送！'
          })
        }
        this.sendFile.uploadList = [...Object.values(unique)]
        this.sendFileHandle()
      }
      if (input.length > 0) {
        // 发送消息给对方
        this.$emit('sendMsg', input, this.chatObj, 'chat')
        // 更新store
        this.$store.commit('chatRecordAdd', {
          chat: {
            msgID: 'me' + this.uid + Date.now() + this.$store.state.chatObj,
            msg: input,
            say: 'me',
            time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            type: 'chat',
            static: 'true'
          },
          type: 'send'
        })
        this.textAreaInput = ''
      }
    },
    /** 文件上传完成后处理 */
    uploadDone (file, res) {
      this.$store.commit('chatRecordAdd', {
        chat: {
          msg: res.data.filePath,
          say: 'me',
          msgID: 'me' + this.uid + Date.now() + this.$store.state.chatObj,
          time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          size: file.size,
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
        msgID: 'me' + this.uid + Date.now() + this.$store.state.chatObj,
        rawName: file.name, // 文件原名称
        postfix: file.postfix, // 文件后缀
        size: file.size,
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
      this.sendFile.sending = true
      this.sendFile.uploadList.forEach(async (file, index) => {
        if (!file) return
        // 生成hash
        file.hash = getHash(file.name + file.size + file.lastModified) // 将hash挂载file上
        // 上传之前先检查服务器是否存在相同文件
        const res = await apiUpload.beforeUpload(file)
        if (!res.data.exist) { // 不存在相同文件，开始上传
          apiUpload.uploadPartition(
            file,
            {
              chunkSize: 1024 * 1024, // 1M一个分片
              oneTime: 10 // 队列中最多存在几个Post请求
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
      this.sendFile.sending = false // 发送完毕
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
      if (this.sendFile.sending) {
        return this.$message({
          type: 'error',
          message: '想停止上传可以刷新浏览器试试，emmm.....'
        })
      }
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
      } else if (type === 'extra') {
        files = evt.target.files
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
          this.$store.state.globe.userConfig.loadingChat ? this.$store.commit('loadChat') : this.$store.commit('loadOnceChat')
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
        this.$refs.textBox.focus()
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
    previewStatus: { // 预览图状态
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
    inputStatus: { // 输入状态
      get () {
        return this.$store.state.globe.inputStatus
      }
    }
  },
  watch: {
    '$store.state.globe.chat.chatList': function () {
      this.chatListChange = true
    }
  }
}
</script>

<style scoped>
.msgFade-enter-active {
  will-change: transform;
  transition: all .2s;
  transition-delay: .2s;
}

.msgFade-leave-active {
  will-change: transform;
  transition: all .2s;
}

.msgFade-enter-to, .msgFade-leave {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}

.msgFade-enter, .msgFade-leave-to {
  transform: translate3d(0, 10%, 0);
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
  /*气泡动画时间，暂时废弃*/
  --transTime: .2s;
  /*功能栏高度*/
  --mainPanel-extra-height: 80px;
}

.mainPanel_Box {
  transition: all .3s;
  height: calc(100% - var(--nameContent-height));
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
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
  background: linear-gradient(to right, #F7F9FA, #ffffff);
  box-shadow: 20px -2px 22px rgba(210, 210, 210, .9),
  20px -2px 22px #ffffff;
  position: relative;
  z-index: 3;
  display: flex;
}

.mainPanel_mask {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 看着来 */
  z-index: 999;
  color: transparent;
}

.mainPanel_mask_text {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 998;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #65C564;
  opacity: .7;
  letter-spacing: 3px;
  font-size: 24px;
}

.mainPanel_mask .el-icon-upload {
  font-size: 28px;
  margin-right: 6px;
}

.textarea_Container {
  width: 100%;
  min-height: var(--inputContent-height);
  position: relative;
}

.chatLengthAlert {
  position: absolute;
  display: flex;
  justify-content: center;
  top: 0;
  left: 0;
  height: 38px;
  width: 100%;
  color: #444;
  z-index: 5;
}

.chatLengthAlert div {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  border-radius: 0 0 10px 10px;
}

.chatLengthProgress {
  position: absolute;
  top: -3px;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(230, 230, 230, 1);
  cursor: pointer;
  overflow: hidden;
}

.chatLengthProgress .chatLength {
  width: 100%;
  height: 100%;
}

.textBoxSupport {
  height: calc(100% - 24px);
  width: calc(100% - 36px);
  box-sizing: border-box;
  margin: 12px 0 0 24px;
  padding: 4px 12px 4px;
  line-height: 24px;
  max-height: 400px;
  max-width: calc(100% - 24px);
  visibility: hidden;
  font-size: 18px;
  word-break: break-all;
  word-wrap: break-word;
}

.textBox {
  font-size: 18px;
  position: absolute;
  top: 12px;
  left: 24px;
  height: calc(100% - 24px);
  width: calc(100% - 36px);
  box-sizing: border-box;
  padding: 4px 12px;
  border-radius: 12px;
  border: none;
  background: rgba(200, 200, 200, .15);
  color: #444444;
  outline: none;
  line-height: 24px;
  resize: none;
  z-index: 4;
  word-break: break-all;
  word-wrap: break-word;
}

.textBox::-webkit-scrollbar {
  display: none
}

.btnGroup {
  margin: 0 12px 0;
  width: 140px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 6;
}

.textBoxBtn {
  margin: 0 5px;
  border-radius: 50%;
  height: 48px;
  width: 48px;
  cursor: pointer;
}

.btnGroup_Extra {
  position: relative;
  margin-right: 10px;
}

.btnGroup_Extra .el-icon-plus {
  font-size: 44px;
  color: #999;
  opacity: .8;
  cursor: pointer;
  transition: all .2s;
}

.btnGroup_Extra > input {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 2;
  opacity: 0;
}

.btnGroup_Extra > input:checked + .el-icon-plus {
  transform: rotate(135deg);
}

.send {
  background: #65C564;
}

.send::after {
  content: '';
  position: absolute;
  height: 48px;
  width: 48px;
  background: url("../assets/img/send.png") no-repeat 50%;
  background-size: 70%;
}

.mainPanel_msgContent {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  background: #F7F9FA;
}

.face-list {
  cursor: pointer;
  position: absolute;
  right: 5%;
  bottom: 180px;
  max-width: 60%;
  z-index: 999;
  background: #F7F9FA;
  border-radius: 10px;
  box-shadow: -20px 20px 60px #cecece,
  -0px -0px 0px #ffffff;
  overflow: hidden;
}

.face-list-tabs {
  box-sizing: border-box;
  padding: 0 5px;
  display: flex;
  overflow-x: auto;
}

.face-list-tabs li {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  position: relative;
}

.face-list-tabs > li > input {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 2;
  opacity: 0;
}

.face-list-tabs > li > .face-list-tabs-child {
  color: #333;
  padding: 10px 12px;
  box-sizing: border-box;
  white-space: nowrap;
  transition: all .2s;
  opacity: .2;
}

.face-list-tabs > li > input:hover + .face-list-tabs-child,
.face-list-tabs > li > input:checked + .face-list-tabs-child {
  opacity: 1;
}

.face-list-content {
  box-sizing: border-box;
  padding: 15px;
  max-height: 50vh;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.face-list-content li {
  display: inline-block;
  box-sizing: border-box;
  width: 8%;
  text-align: center;
  line-height: 50px;
  font-size: 24px;
}

.face-list-content li:hover, .face-list-content li:active {
  background: #ffffff;
}

.msgContent {
  width: 100%;
  overflow: hidden;
  border: 1px solid transparent;
  box-sizing: border-box;
  padding-bottom: 180px;
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
  flex-direction: column;
  align-items: flex-end;
}

.You_MsgContent {
  width: 100%;
  margin-top: 42px;
  min-height: 30px;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.msgContent > span {
  display: block;
}

.You_MsgContent .msgTime {
  margin: 10px 0 0 25px;
  font-size: 12px;
  color: rgba(100, 100, 100, .8);
}

.My_MsgContent .msgTime {
  margin: 10px 25px 0 0;
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
  top: -103px;
  left: 0;
  z-index: 3;
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

.fileInfo {
  box-sizing: border-box;
  padding: 15px 20px 5px 15px;
  color: #333;
}

.fileInfo > div {
  display: flex;
  align-items: center;
  height: 50%;
}

.fileInfo > div:last-child {
  font-size: 12px;
  color: #999;
}

.mainPanel_Extra {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: var(--mainPanel-extra-height);
  transition: all .3s;
  background: #F7F9FA;
}

.mainPanel_Extra > ul {
  height: var(--mainPanel-extra-height);
  width: 100%;
  display: flex;
}

.mainPanel_Extra > ul > li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: var(--mainPanel-extra-height);
  flex: 1;
  font-size: 12px;
  color: #888;
  border-radius: 0px;
  cursor: pointer;
  background: #F2F2F2;
  box-shadow: inset 19px -19px 38px #F7F9FA,
  inset -19px 19px 38px #ffffff;
}

.mainPanel_Extra > ul > li:hover {
}
</style>
