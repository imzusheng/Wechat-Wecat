<template>
  <div class="nav">
    <div class="navSetting" :class="{navSetting_FadeIn: navSettingActive, navSetting_FadeOut: !navSettingActive}">
      <div class="settingTitle">设置</div>
      <ul class="settingItems">
        <li class="info_item">个人信息</li>
        <li @click="$store.state.timeSwitch = !$store.state.timeSwitch">显示消息时间
          <div class="timeSwitch" :class="{timeSwitchOn : $store.state.timeSwitch}">
            <div class="switchBtn"></div>
          </div>
        </li>
        <li class="exit" @click="exit()">退出登录</li>
      </ul>
    </div>
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
             @blur="!searchContent ? searchActive = false : searchActive = true"
             v-model="searchContent">
      <div class="search_list" v-if="searchActive">
        {{searchTips}}
        <ul class="searchResult">
          <li class="result_Title">全网搜索</li>
          <li v-for="(item, i) in $store.state.searchResult" :key="i">
            <figure><img src="../assets/ginger-cat/ginger-cat-714.png"/></figure>
            <div class="resultName">{{item}}</div>
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
      <chatHistory class="list_container_chatHistory noSelect" :historyList="historyList" @getData="getData"/>
      <contact class="list_container_contact noSelect" :contactList="contactList" @getData="getData"/>
      <group class="list_container_group noSelect" :groupList="groupList" @getData="getData"/>
    </div>
  </div>
</template>

<script>
import chatHistory from './nav_chatHistory'
import contact from './nav_contact'
import group from './nav_group'
import axios from 'axios'

export default {
  name: 'indexNav',
  components: {
    chatHistory,
    contact,
    group
  },
  data () {
    return {
      uid: '',
      historyList: [],
      contactList: [],
      groupList: [],
      searchContent: '',
      searchActive: false,
      searchTips: '输入内容以查找',
      btnActive: false,
      navSettingActive: false
    }
  },
  mounted () {
    this.uid = window.sessionStorage.getItem('uid') || this.$store.state.uid
    // 获取数据
    this.getData('chatHistory')
    this.getData('contact')
    this.getData('group')
  },
  methods: {
    exit () {
      window.sessionStorage.removeItem('uid')
      window.sessionStorage.removeItem('token')
      this.$router.replace('login')
    },
    searchChange () {
      clearTimeout(this.timer)
      const _that = this
      this.searchTips = this.searchContent.length > 0 ? '' : '输入内容以搜索'
      if (this.searchContent.length === 0) {
        this.$store.commit('clearNavSearch')
      } else {
        _that.timer = setTimeout(() => {
          _that.$store.state.ws.sendMsg({
            uid: _that.uid,
            msg: _that.searchContent,
            type: 'navSearch'
          }, _that.wsMsgGHandler)
        }, 100)
      }
    },
    wsMsgGHandler (data) {
      this.$store.commit('wsMsgGHandler', data)
      // this.$store.commit('navSearch', data)
    },
    /**
     * @param type // 请求分组内数据的类型 chatHistory / contact / group
     */
    getData (type, chatObj) {
      axios({
        method: 'get',
        url: `/${type}`,
        params: {
          uid: this.uid,
          chatObj: chatObj
        }
      }).then(data => this.dataHandler(data)).catch(err => this.dataHandler(err.response))
    },
    dataHandler (data) {
      if (data.config.method === 'get' && data.data !== 'OK') {
        if (data.data.type === 'chatHistory') {
          this.historyList = data.data.resultArr
          this.$store.commit('chatRecordChange', data.data.resultArr)
        } else if (data.data.type === 'contact') {
          this.contactList = data.data.resultArr
        } else if (data.data.type === 'group') {
          this.groupList = data.data.resultArr
        }
      }
    },
    /**
     * @param e // DOM
     * 切换菜单面板的分类时
     */
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
    }
  },
  watch: {
    searchActive () {
      this.$store.commit('clearNavSearch')
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
    background: rgba(180, 190, 200, .6);
    overflow: hidden;
  }

  .navSetting {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    background: #F7F9FA;
    z-index: 1000;
    opacity: 0;
    transform: translateY(-100%);
  }

  .navSetting_FadeIn {
    animation: navSetting_FadeIn .5s forwards;
  }

  .navSetting_FadeOut {
    animation: navSetting_FadeOut .3s forwards;
  }

  @keyframes navSetting_FadeIn {
    0% {
      opacity: 1;
      transform: translateY(-100%);
    }
    100% {
      opacity: 1;
      transform: translateY(0%);
    }
  }

  @keyframes navSetting_FadeOut {
    0% {
      opacity: 1;
      transform: translateY(0%);
    }
    100% {
      opacity: 1;
      transform: translateY(-100%);
    }
  }

  .settingTitle {
    height: 90px;
    width: 100%;
    line-height: 90px;
    box-sizing: border-box;
    padding-left: 30px;
    font-size: 24px;
    position: relative;
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

  .timeSwitchOn {
    background: #65C564;
  }

  .timeSwitchOn .switchBtn {
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
    background: url("../assets/img/logo.svg") no-repeat 50%;
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
    top: 0%;
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
    background: url("../assets/img/search.png") no-repeat 50%;
    background-size: 50%;
  }

  .search input[name=search] {
    height: 100%;
    width: 100%;
    border: none;
    outline: none;
    border-radius: 3px;
    background: rgba(190, 190, 190, .6);
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
    --search-li-height: 40px;
    width: 100%;
    display: flex;
  }

  .search_list .searchResult li:not(:first-child) {
    cursor: pointer;
  }

  .search_list .searchResult li:not(:first-child):hover {
    background: rgba(200, 200, 200, .7);
  }

  .search_list .result_Title {
    font-size: 13px;
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
    padding-left: 20px;
    text-align: left;
    font-size: 14px;
    color: #444444;
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
    mask-image: url("../assets/img/chatHistory.png");
    mask-size: 32%;
    mask-position: 0 50%;
  }

  .class_list > li:nth-of-type(2) > input + span {
    mask-image: url("../assets/img/contacts.png");
    mask-size: 36%;
    mask-position: 50%;
  }

  .class_list > li:nth-of-type(3) > input + span {
    mask-image: url("../assets/img/group.png");
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
</style>
