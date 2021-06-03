<template>
  <div class="navSetting">
    <div class="settingTitle">设置</div>
    <div class="settingContainer">
      <!-- 设置菜单滑动容器 s -->
      <div class="settingTranslate" :style="{transform: userInfoActivity ? 'translateX(-50%)' : 'none'}">
        <!--          :style="{width: userInfoActivity ? '50%' : 'calc(100% - 2px)'}"-->
        <div class="exitContainer">
          <div class="exit" @click="exit()">退出登录</div>
        </div>
        <!-- 所有设置项目 s -->
        <div class="settingContent">
          <ul class="settingItems">
            <li class="info_item" @click="userInfoActivity = true">个人信息</li>
            <li class="info_item" @click="$store.state.chatObj=''">
              <router-link to="admin" class="admin_item">管理员</router-link>
            </li>
            <li @click="setting('timeSwitch')">
              显示消息时间
              <div class="timeSwitch" :class="{SwitchOn : $store.state.globe.userConfig.timeSwitch}">
                <div class="switchBtn"></div>
              </div>
            </li>
            <li @click="setting('friendInfoPanel')">
              好友信息面板
              <div class="timeSwitch" :class="{SwitchOn : $store.state.globe.userConfig.friendInfoPanel}">
                <div class="switchBtn"></div>
              </div>
            </li>
            <li @click="setting('sendKeyCode')" title="Ctrl + Enter">
              使用组合键发送
              <div class="timeSwitch" :class="{SwitchOn : $store.state.globe.userConfig.sendKeyCode}">
                <div class="switchBtn"></div>
              </div>
            </li>
            <li @click="setting('loadingChat')">
              聊天记录懒加载 模拟
              <div class="timeSwitch" :class="{SwitchOn : $store.state.globe.userConfig.loadingChat}">
                <div class="switchBtn"></div>
              </div>
            </li>
            <el-tooltip :disabled="$store.state.globe.userConfig.loadingChat" class="item" effect="dark"
                        content="聊天记录懒加载关闭时，该选项不可用" placement="top">
              <li class="message_Loading_Slider" disabled>
                聊天记录加载一次新增： {{ $store.state.globe.userConfig.pageSize }} 条
                <el-slider
                  :disabled="!$store.state.globe.userConfig.loadingChat"
                  style="background: transparent"
                  v-model="$store.state.globe.userConfig.pageSize"
                  :step="5"
                  :min="5"
                  :max="50"
                  :show-tooltip="false"
                ></el-slider>
              </li>
            </el-tooltip>
            <li class="message_Loading_Slider">
              预览图片尺寸： {{ $store.state.globe.userConfig.previewImgHeight }} %
              <el-slider
                style="background: transparent"
                v-model="$store.state.globe.userConfig.previewImgHeight"
                :step="5"
                :min="50"
                :max="300"
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
          </ul>
        </div>
        <!--   个人信息面板 s    -->
        <div class="settingUserInfo">
          <ul class="user-info-main">
            <li class="user-info-main-back" @click="userInfoActivity = false">返回设置</li>
            <li class="user-info-avatar">
              <figure @click="$store.state.globe.avatarCropperVisible = true" title="点击更换头像">
                <!--    (TODO)  头像要可以修改           -->
                <img class="noSelect" :src="$store.state.globe.user.avatarUrl" alt="">
              </figure>
            </li>
            <li>
              <textarea
                style="font-size: 36px; height: 54px; width: 100%"
                v-model="userInfo.nickName"
                maxlength="6"
                class="infoEditInput"
                @blur="infoEditBlur($event,'nickName')"
                @input="infoEdit($event, 'nickName')"
              />
            </li>
            <li style="font-size: 14px; color: #999;">
              <div>{{ userInfo.email }}</div>
            </li>
            <li style="font-size: 16px; margin-top: 24px; height: 80px">
              <div>”</div>
              <textarea
                v-model="userInfo.Individuality"
                maxlength="30"
                class="infoEditInput"
                @blur="infoEditBlur($event,'Individuality')"
                @input="infoEdit($event, 'Individuality')"
              />
              <div>“</div>
            </li>
            <li>
            </li>
          </ul>
          <ul class="personal_Info">
            <li>
              <div class="info_position_title">
                <i class="el-icon-thumb"></i>
                <span>最近登录：</span>
              </div>
              <div class="info_position">
                {{ userInfo.RecentlyTime ? userInfo.RecentlyTime : '暂无' }}
              </div>
            </li>
            <li>
              <div class="info_phone_title">
                <i class="el-icon-chat-dot-round"></i>
                <span>登录地址：</span>
              </div>
              <div class="info_phone">
                {{
                  userInfo.address ? userInfo.address.Country + '-' + userInfo.address.Province + '-' + userInfo.address.City : '暂无'
                }}
              </div>
            </li>
            <li>
              <div class="info_email_title">
                <i class="el-icon-s-promotion"></i>
                <span>注册日期：</span>
              </div>
              <div class="info_email">
                {{ moment(userInfo.time).format('YYYY-MM-DD') }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from '@/assets/js/Functions'
import { API_COMMON } from '@/assets/js/api'
import Vue from 'vue'
import moment from 'moment'

export default {
  name: 'navSetting',
  data () {
    return {
      moment,
      userInfoActivity: false, // 是否切换到个人信息页
      userInfo: {},
      warningActivity: false,
      warningActivityTimer: '',
      avatarUrl: '' // 头像url
    }
  },
  created () {
    this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    if (!this.userInfo.Individuality) this.userInfo.Individuality = '你抡我啊'
    this.$store.state.globe.user.avatarUrl = window.sessionStorage.getItem('avatar')
  },
  methods: {
    editWarning (msg) {
      if (this.warningActivity === false) {
        this.$message({
          type: 'info',
          message: msg,
          onClose: () => {
            clearTimeout(this.warningActivityTimer)
            this.warningActivity = false
          }
        })
        this.warningActivity = true
        this.warningActivityTimer = setTimeout(() => {
          this.warningActivity = false
          this.$message({
            type: 'info',
            message: msg
          })
        }, 3000)
      }
    },
    infoEdit (evt, type) {
      if (type === 'nickName' && this.userInfo.nickName.length > 8) {
        this.editWarning('最多输入8个字')
      } else if (type === 'Individuality' && this.userInfo.Individuality.length >= 30) {
        this.editWarning('最多输入30个字')
      }
    },
    /** 当内容为空时, 自动恢复为原来的内容 */
    infoEditBlur (evt, type) {
      if (this.userInfo[type].length === 0 && type !== 'Individuality') {
        const value = JSON.parse(window.sessionStorage.getItem('userInfo'))[type]
        Vue.set(this.userInfo, type, value)
      }
      apiService.updateData(API_COMMON.PUT_COMMON_USER_INFO, {
        uid: window.sessionStorage.getItem('uid'),
        nickName: this.userInfo.nickName,
        Individuality: this.userInfo.Individuality
      })
    },
    setting (type) {
      Vue.set(this.$store.state.globe.userConfig, type, !this.$store.state.globe.userConfig[type])
    },
    clearChatRecord () {
      apiService.getData(API_COMMON.GET_COMMON_DELETE_CHAT_RECORD, {}).then()
    },
    /** 退出登录 */
    exit () {
      this.$store.state.ws.sendMsg({
        from: window.sessionStorage.getItem('uid'),
        type: 'exit'
      }, data => {
        this.$store.commit('wsMsgGHandler', data)
      })
      // this.$router.replace('login')
    }
  },
  computed: {},
  watch: {
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

.navSetting {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  z-index: 1000;
  opacity: 1;
  transform: translateY(-100%);
  transition: all .4s;
  /*background: #fff;*/
  background: #F7F9FA;
}

.settingTitle {
  position: absolute;
  height: 90px;
  width: 100%;
  line-height: 90px;
  box-sizing: border-box;
  padding-left: 30px;
  font-size: 24px;
  z-index: 2;
}

.settingTitle::after {
  content: '';
  position: absolute;
  bottom: 0;
  height: 0;
  width: 90%;
  left: 50%;
  transform: translateX(-50%);
}

.settingContainer {
  margin-top: 90px;
  height: calc(100% - 90px);
  width: 100%;
}

.settingTranslate {
  height: 100%;
  width: 200%;
  display: flex;
  position: relative;
  transition: transform .2s;
}

.settingContent {
  height: 100%;
  width: 50%;
  box-sizing: border-box;
  overflow-y: auto;
  position: relative;
}

.settingItems {
  width: 100%;
  padding-bottom: 140px;
}

.settingUserInfo {
  width: 50%;
  overflow: hidden;
}

.settingUserInfo .user-info-main {
  width: 100%;
  box-sizing: border-box;
  padding: 0 30px;
}

.settingItems > li {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  color: #444444;
  position: relative;
  padding: 0 30px;
  box-sizing: border-box;
}

.settingItems > li {
  cursor: pointer;
  position: relative;
}

.settingItems > li:not(:last-child):after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 80%;
  transform: translateX(-50%);
  border-bottom: 1px solid rgba(100, 100, 100, .2);
}

.settingItems > li:not(:last-child):hover {
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

.exitContainer {
  position: absolute;
  width: calc(50% - 2px);
  height: 140px;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to top, #F7F9FA, rgba(255, 255, 255, .1));
}

.exit {
  cursor: pointer !important;
  width: 60%;
  text-align: center;
  background: rgba(230, 76, 95, 1);
  box-sizing: border-box;
  padding: 10px 0;
  color: #ffffff;
  border-radius: 5px;
  z-index: 1000;
}

.message_Loading_Slider {
  height: 100px !important;
}

.settingUserInfo .user-info-main li {
  width: 100%;
  box-sizing: border-box;
  margin: 2px 0;
  padding: 0;
  display: flex;
  justify-content: center;
  font-size: 20px;
  color: #444;
  position: relative;
}

.user-info-main-back {
  color: #444444 !important;
  font-size: 14px !important;
  height: 36px !important;
  display: flex;
  align-items: center;
  justify-content: flex-start !important;
  position: relative !important;
  box-sizing: border-box !important;
  padding-left: 20px !important;
  cursor: pointer;
}

.user-info-main-back:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: rotate(-45deg) translate(0, -50%) !important;
  height: 8px;
  width: 8px;
  border-left: 2px solid rgba(100, 100, 100, .2);
  border-top: 2px solid rgba(100, 100, 100, .2);
}

.settingUserInfo .user-info-main li div {
  position: relative;
  outline-color: #F60;
}

.settingUserInfo .user-info-main .user-info-avatar {
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 0 24px;
}

.settingUserInfo .user-info-main .user-info-avatar > figure:hover {
  will-change: auto;
}

.settingUserInfo .user-info-main .user-info-avatar > figure {
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
}

.settingUserInfo .user-info-main .user-info-avatar > figure,
.settingUserInfo .user-info-main .user-info-avatar > figure > img {
  height: 150px;
  width: 150px;
}

.infoEditInput {
  background: #F7F9FA;
  display: block;
  font-size: 18px;
  border: none;
  color: #444;
  box-sizing: border-box;
  padding-bottom: 6px;
  text-align: center;
  outline-color: #F60;
  outline-width: thin;
  resize: none;
}

.infoEditInput:before {
  content: '';
  position: absolute;
  height: 1px;
  transform: scaleY(.5);
  left: 0;
  bottom: 0;
  width: 100%;
  background: #F60;
  /*background: rgba(85, 236, 125, 1);*/
}

/*.infoEdit:before {*/
/*  content: '点击编辑';*/
/*  position: absolute;*/
/*  top: 0;*/
/*  left: 0;*/
/*  height: 100%;*/
/*  width: 100%;*/
/*  font-size: 12px;*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*  transition: all .2s;*/
/*  transform: translate(0, 100%);*/
/*  background: #F7F9FA;*/
/*  color: #999;*/
/*}*/

.personal_Info {
  width: 100%;
  padding: 0 20px;
  margin-top: 28px;
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
