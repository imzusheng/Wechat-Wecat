<template>
  <div class="nav">
    <!--  设置页面  s -->
    <div class="navSetting"
         :style="{transform: navSettingActive ? 'translateY(0%)' : 'translateY(-100%)', opacity: navSettingActive ? 1 : 0.2}">
      <div class="settingTitle">设置</div>
      <!--  (TODO) 将每个用户的配置文件传到数据库保存起来,弄一个配置表  -->
      <ul class="settingItems">

        <li class="info_item">个人信息</li>

        <li class="info_item">
          <router-link to="admin" class="admin_item">管理员</router-link>
        </li>

        <li @click="$store.state.globe.userConfig.timeSwitch = !$store.state.globe.userConfig.timeSwitch">
          显示消息时间
          <div class="timeSwitch" :class="{SwitchOn : $store.state.globe.userConfig.timeSwitch}">
            <div class="switchBtn"></div>
          </div>
        </li>

        <li @click="$store.state.globe.userConfig.friendInfoPanel = !$store.state.globe.userConfig.friendInfoPanel">
          好友信息面板
          <div class="timeSwitch" :class="{SwitchOn : $store.state.globe.userConfig.friendInfoPanel}">
            <div class="switchBtn"></div>
          </div>
        </li>

        <li @click="$store.state.globe.userConfig.sendKeyCode = !$store.state.globe.userConfig.sendKeyCode"
            title="Ctrl + Enter">
          使用组合键发送
          <div class="timeSwitch" :class="{SwitchOn : $store.state.globe.userConfig.sendKeyCode}">
            <div class="switchBtn"></div>
          </div>
        </li>

        <li class="message_Loading_Slider">
          聊天记录加载一次新增： {{ $store.state.globe.userConfig.pageSize }} 条
          <el-slider
            style="background: transparent"
            v-model="$store.state.globe.userConfig.pageSize"
            :step="5"
            :min="5"
            :max="50"
            :show-tooltip="false"
          ></el-slider>
        </li>

        <li class="message_Loading_Slider">
          预览图片尺寸： {{ $store.state.globe.userConfig.previewImgHeight }} px
          <el-slider
            style="background: transparent"
            v-model="$store.state.globe.userConfig.previewImgHeight"
            :step="50"
            :min="200"
            :max="800"
            :show-tooltip="false"
          ></el-slider>
        </li>

        <li>
          <a style="color: #444444; height: 100%; width: 100%; display: inline-block;" @click="clearChatRecord">
            清空所有用户聊天记录 Beta</a>
        </li>

        <li>
          <a style="color: #444444; height: 100%; width: 100%; display: inline-block;"
             href="https://zusheng.club/apidoc/index.html" target="_blank">API Doc</a>
        </li>

        <li class="exit" @click="exit()">退出登录</li>
      </ul>
    </div>
    <!--  设置页面  e -->
    <div class="top_bar">
      <div class="logo">
        <figure></figure>
      </div>
      <button class="addFriend" :class="{'addFriendActive': btnActive}"
              @click="btnActive = !btnActive; navSettingActive = !navSettingActive">
        <span class="add_1"></span>
        <span class="add_2"></span>
        <span class="add_3"></span>
      </button>
    </div>
    <div class="search">
      <span class="search_bt"></span>
      <input type="text"
             name="search"
             autocomplete="off"
             placeholder="搜索"
             @keyup="searchChange"
             @focus="searchActive = true"
             @blur="!searchContent ? searchActive = false : searchActive = true;"
             v-model="searchContent">
      <el-popover
        placement="bottom"
        width="200"
        trigger="manual"
        content="只允许输入数字、字母、字符@，不允许输入特殊字符。"
        v-if="popoverVisible">
      </el-popover>
      <div class="search_list" v-if="searchActive">
        {{ searchTips }}
        <ul class="searchResult" @click="addFriend">
          <li class="result_Title">全网搜索</li>
          <li v-for="(item, i) in $store.state.globe.navigation.searchResult" :key="i">
            <div class="searchResultMask" :data-email="item.email" :data-nickname="item.nickName"
                 :data-avatar="item.avatar"></div>
            <figure><img :src="item.avatar" alt=""></figure>
            <div class="resultName">
              <div>{{ item.nickName }}</div>
              <div>{{ item.email }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <ul class="class_list" @click="switchClass" v-if="!searchActive">
      <li>
        <input type="radio"
               class="classList_btn"
               name="classList"
               data-link="chatHistory"
               checked/>
        <span class="classList_btn"></span>
      </li>
      <li>
        <input type="radio"
               class="classList_btn"
               name="classList"
               data-link="contacts"/>
        <span class="classList_btn"></span>
      </li>
      <li>
        <input type="radio"
               class="classList_btn"
               name="classList"
               data-link="group"/>
        <span class="classList_btn"></span>
      </li>
    </ul>
    <div class="list_container" ref="listContainer" v-if="!searchActive">
      <chatHistory class="list_container_chatHistory noSelect"/>
      <contact class="list_container_contact noSelect"/>
      <group class="list_container_group noSelect"/>
    </div>
  </div>
</template>

<script>
import chatHistory from './nav_chatHistory'
import contact from './nav_contact'
import group from './nav_group'
import { apiService } from '@/assets/js/Functions'
import { API_COMMON } from '@/assets/js/api'

export default {
  name: 'indexNav',
  components: {
    chatHistory,
    contact,
    group
  },
  data () {
    return {
      uid: window.sessionStorage.getItem('uid'),
      searchContent: '',
      searchActive: false,
      searchTips: '查找好友开始聊天吧',
      btnActive: false,
      navSettingActive: false,
      chatObj: '',
      popoverVisible: false // 输入提示
    }
  },
  mounted () {
    // 获取菜单配置
    apiService.getData(API_COMMON.GET_COMMON_USER_CONFIG, {
      uid: this.uid
    }).then(res => {
      if (!res.data.error) {
        this.$store.state.globe.userConfig = res.data.config
      }
    })
    // 获取聊天记录数据
    apiService.getData(API_COMMON.GET_COMMON_CHAT_HISTORY, {
      email: this.uid
    }).then(res => {
      res.navInitType = 'historyList'
      this.$store.commit('navInit', res) // 初始化列表信息
      this.$store.state.globe.navigation.historyList.historyListStatus = true
    })
    apiService.getData(API_COMMON.GET_COMMON_CONTACT, {
      email: this.uid
    }).then(res => {
      res.navInitType = 'contact'
      this.$store.commit('navInit', res) // 初始化列表信息
      this.$store.state.globe.navigation.contactList.contactListStatus = true
    })
  },
  methods: {
    clearChatRecord () {
      apiService.getData(API_COMMON.GET_COMMON_DELETE_CHAT_RECORD, {}).then()
    },
    /** 退出登录 */
    exit () {
      this.$store.state.ws.sendMsg({
        uid: this.$store.state.uid,
        type: 'exit'
      }, this.wsMsgGHandler)
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('nickName')
      window.sessionStorage.removeItem('email')
      window.sessionStorage.removeItem('avatar')
      window.sessionStorage.removeItem('uid')
      window.location.reload()
      // this.$router.replace('login')
    },
    /** 搜索好友 */
    searchChange () {
      clearTimeout(this.timer)
      if (this.searchContent.length === 0) {
        this.$store.state.globe.navigation.searchResult = '' // 清除搜索结果
      } else {
        this.searchTips = ''
        this.timer = setTimeout(() => {
          apiService.getData(API_COMMON.GET_COMMON_NAV_SEARCH, {
            email: this.searchContent,
            nickName: this.searchContent,
            userID: this.uid
          }).then(res => {
            this.$store.state.globe.navigation.searchResult = res.data.result
          })
        }, 200)
      }
    },
    /** 切换菜单面板的分类时 */
    switchClass (e) {
      if (e.target.nodeName === 'INPUT') {
        const link = e.target.attributes['data-link'].value
        const listContainer = this.$refs.listContainer
        switch (link) {
          case 'chatHistory':
            listContainer.style.transform = 'translateX(0)'
            break
          case 'contacts':
            listContainer.style.transform = 'translateX(-33.33%)'
            break
          case 'group':
            listContainer.style.transform = 'translateX(-66.66%)'
            break
        }
      }
    },
    /** 添加好友 */
    addFriend (e) {
      /** 事件委托，点击UL时不触发click */
      if (e.target.nodeName !== 'UL' && e.target.innerHTML !== this.$store.state.uid) {
        if (this.$store.state.globe.navigation.contactList.includes(e.target.dataset.email)) {
          this.chatObj = e.target.dataset.email
          this.$store.commit('chatObjChange', this.chatObj)
          // 收到或发送消息时，滚动条自动到达底部
          this.$store.commit('scrollRec')
          // 选中该好友时，清除该好友的未读消息列表
          if (this.$store.state.unReadMsg[this.chatObj] > 0) this.$store.commit('clearUnRead', this.chatObj)
        } else if (!this.$store.state.globe.navigation.contactList.includes(e.target.dataset.email)) {
          /** 当点击的对象已经是好友时，跳转到聊天界面 */
          this.$store.commit('setAddFriend', {
            email: e.target.dataset.email,
            avatar: e.target.dataset.avatar,
            nickName: e.target.dataset.nickname
          })
          this.$store.state.addFriState = true
        }
      }
    }
  },
  watch: {
    searchActive () {
      if (!this.searchActive) {
        this.$store.state.globe.navigation.searchResult = '' // 清除搜索结果
        this.searchTips = ''
      } else {
        this.searchTips = '查找好友开始聊天吧'
      }
    },
    '$store.state.globe.userConfig.sendKeyCode': (evt) => {
      require('element-ui').Message.success({
        message: evt ? '当前使用 Ctrl + Enter 组合键发送消息' : '当前使用 Enter 键发送消息'
      })
    },
    /** 监听配置文件修改，1秒钟无修改则提交到服务器 */
    '$store.state.globe.userConfig': {
      handler (evt) {
        let timer = ''
        clearTimeout(timer)
        timer = setTimeout(() => {
          apiService.updateData(API_COMMON.PUT_COMMON_USER_CONFIG, {
            uid: this.uid,
            config: evt
          })
        }, 1000)
      },
      deep: true // 深度监听
    }
  }
}
</script>

<style scoped>
.nav {
  min-width: 280px;
  width: calc(22% - var(--common-margin));
  height: calc(100% - var(--common-margin) * 2);
  margin: var(--common-margin) 0 var(--common-margin) var(--common-margin);
  position: relative;
  z-index: 2;
  border-radius: var(--common-radius);
  background: rgba(180, 190, 200, .3);
  overflow: hidden;
}

.navSetting {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  background: #F7F9FA;
  z-index: 1000;
  opacity: 1;
  transform: translateY(-100%);
  transition: all .4s;
}

.settingTitle {
  height: 90px;
  width: 100%;
  line-height: 90px;
  box-sizing: border-box;
  padding-left: 30px;
  font-size: 24px;
  position: relative;
  background: #F7F9FA;
}

.settingTitle::after {
  content: '';
  position: absolute;
  bottom: 0;
  height: 0;
  width: 90%;
  left: 50%;
  transform: translateX(-50%);
  border-bottom: 1px solid #cccccc;
}

.settingItems {
  height: calc(100% - 90px);
  width: 100%;
  box-sizing: border-box;
}

.settingItems li:not(:last-child) {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  color: #444444;
  position: relative;
  padding: 0 30px;
  box-sizing: border-box;
}

.settingItems li {
  cursor: pointer;
  position: relative;
}

.settingItems li:not(:last-child):after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 80%;
  transform: translateX(-50%);
  border-bottom: 1px solid rgba(100, 100, 100, .2);
}

.settingItems li:not(:last-child):hover {
  background: rgba(180, 180, 180, .1);
}

.info_item:before {
  content: '';
  position: absolute;
  right: 40px;
  top: 50%;
  transform: rotate(45deg) translate(0, -50%);
  height: 8px;
  width: 8px;
  border-right: 2px solid rgba(100, 100, 100, .2);
  border-top: 2px solid rgba(100, 100, 100, .2);
}

.admin_item {
  display: block;
  width: 100%;
  height: 100%;
  color: #444444;
}

.timeSwitch {
  height: 22px;
  width: 40px;
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translate(0, -50%);
  background: #CCCCCC;
  border-radius: 100px;
  transition: all .2s;
}

.SwitchOn {
  background: #65C564;
}

.SwitchOn .switchBtn {
  transform: translateX(100%);
}

.switchBtn {
  transition: all .2s;
  width: 18px;
  height: 18px;
  margin: 2px 0 0 2px;
  background: #FFFFFF;
  border-radius: 50%;
}

.exit {
  width: 60%;
  bottom: 30px;
  left: 50%;
  text-align: center;
  background: rgba(221, 0, 27, .7);
  box-sizing: border-box;
  padding: 10px 0;
  color: #ffffff;
  border-radius: 5px;
  transform: translateX(-50%);
  position: absolute !important;
}

.top_bar {
  /*logo高度*/
  height: var(--logo-height);
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
}

.logo {
  margin: 0 0 0 calc(var(--logo-height) / 5);
  height: var(--logo-height);
  width: var(--logo-height);
}

.logo figure {
  height: var(--logo-height);
  width: var(--logo-height);
  background: url("../../assets/img/logo.svg") no-repeat 50%;
  background-size: 100%;
}

.top_bar .addFriend {
  height: 20px;
  width: 30px;
  border-radius: 50%;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  transform: translate(0, -50%);
  top: 50%;
  right: calc(var(--logo-height) / 5);
  position: absolute;
  padding: 0 !important;
  margin: 0 !important;
  z-index: 1001 !important;
}

.addFriend:hover {
  will-change: contents;
}

.top_bar .addFriend span {
  display: block;
  height: 4px;
  width: 24px;
  position: absolute;
  left: 50%;
  background: #555555;
  border-radius: 2px;
  transform: translate(-50%, -50%);
  transition: all .3s;
}

.addFriend .add_1 {
  top: 0;
}

.addFriend .add_2 {
  top: 50%;
}

.addFriend .add_3 {
  top: 100%;
}

.addFriendActive .add_1 {
  top: 0;
  left: 25% !important;
  transform: rotate(45deg) translateX(6%) !important;
  transform-origin: left;
}

.addFriendActive .add_2 {
  top: 50%;
  opacity: 0;
}

.addFriendActive .add_3 {
  top: 100%;
  left: 25% !important;
  transform: rotate(-45deg) translateX(10%) !important;
  transform-origin: left;
}

.search {
  height: 38px;
  width: 100%;
  padding: 0 calc(var(--logo-height) / 5);
  box-sizing: border-box;
  position: relative;
}

.search_bt {
  position: absolute;
  top: 0;
  left: calc(var(--logo-height) / 5);
  height: 38px;
  width: 38px;
  background: url("../../assets/img/search.png") no-repeat 50%;
  background-size: 50%;
}

.search input[name=search] {
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 3px;
  background: rgba(190, 190, 190, .3);
  padding-left: calc(18px + var(--logo-height) / 5);
  box-sizing: border-box;
}

.search_list {
  width: 100%;
  height: calc(100vh - var(--classIcon-height) - var(--logo-height));
  line-height: calc(60vh - var(--classIcon-height) - var(--logo-height));
  text-align: center;
  position: absolute;
  color: #888888;
  z-index: 999;
  top: 100%;
  left: 0;
}

.search_list .searchResult {
  padding: calc(var(--logo-height) / 5);
  box-sizing: border-box;
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

.search_list .searchResult li {
  line-height: var(--search-li-height);
  height: var(--search-li-height);
  --search-li-height: 60px;
  width: 100%;
  display: flex;
  overflow: hidden;
  position: relative;
}

.search_list .searchResult li:not(:first-child) {
  cursor: pointer;
}

.search_list .searchResult li:not(:first-child):hover {
  background: rgba(200, 200, 200, .7);
}

.search_list .result_Title {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px;
  font-weight: 600;
  color: #444444;
  box-sizing: border-box;
  padding-left: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.search_list .searchResult li figure,
.search_list .searchResult li figure img {
  height: var(--search-li-height);
  width: var(--search-li-height);
}

.search_list .searchResult .resultName {
  line-height: var(--search-li-height);
  height: var(--search-li-height);
  width: calc(100% - var(--search-li-height));
  border-bottom: 1px solid rgba(0, 0, 0, .1);
  box-sizing: border-box;
  padding-left: 13px;
  text-align: left;
  font-size: 14px;
  color: #444444;
}

.resultName div {
  width: 100%;
  height: calc(var(--search-li-height) / 2);
  /*line-height: calc(var(--search-li-height) / 2);*/
}

.resultName div:nth-of-type(1) {
  font-size: 18px;
  line-height: 40px !important;
}

.resultName div:nth-of-type(2) {
  font-size: 12px;
  color: #888888;
  line-height: 30px !important;
}

.search_list .searchResult li:last-child .resultName {
  border-bottom: none;
}

.search_list .searchResult li:last-child {
  border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.class_list {
  height: var(--classIcon-height);
  width: 100%;
  margin: calc(var(--classIcon-height) / 4) 0 calc(var(--classIcon-height) / 3) 0;
  box-sizing: border-box;
  padding: 0 calc(var(--logo-height) / 5);
  display: flex;
  justify-content: space-between;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.class_list li {
  line-height: var(--classIcon-height);
  height: var(--classIcon-height);
  width: 33.33%;
  max-width: 84px;
  text-align: center;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
}

.class_list li .classList_btn {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: block;
  position: absolute;
}

.class_list li input {
  z-index: 2;
  opacity: 0;
  cursor: pointer;
}

.class_list li input:checked + .classList_btn {
  background: #65C564;
  mask-repeat: no-repeat;
}

.class_list li input + span {
  background: rgba(100, 100, 100, 0.6);
  mask-repeat: no-repeat;
  transition: background-color .16s;
}

.class_list > li:nth-of-type(1) > input + span {
  mask-image: url("../../assets/img/chatHistory.png");
  mask-size: 32%;
  mask-position: 0 50%;
}

.class_list > li:nth-of-type(2) > input + span {
  mask-image: url("../../assets/img/contacts.png");
  mask-size: 36%;
  mask-position: 50%;
}

.class_list > li:nth-of-type(3) > input + span {
  mask-image: url("../../assets/img/group.png");
  mask-size: 35%;
  mask-position: 100% 50%;
}

.list_container {
  height: calc(100% - var(--logo-height) - var(--classIcon-height) - 38px - calc(var(--classIcon-height) / 4) - calc(var(--classIcon-height) / 3));
  width: 300%;
  box-sizing: border-box;
  display: flex;
  overflow: hidden;
}

.list_container_chatHistory,
.list_container_contact,
.list_container_group {
  width: 33.3333%;
  height: 100%;
}

.searchResultMask {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 9999;
}

.message_Loading_Slider {
  height: 100px !important;
}
</style>
