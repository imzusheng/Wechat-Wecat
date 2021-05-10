<template>
  <div class="admin-container">
    <el-container class="admin-container">
      <el-container>
        <!--        <router-link :to="{ name: 'userList'}" replace>userList</router-link>-->
        <!--        <router-link :to="{ name: 'chatRecord'}" replace>chatRecord</router-link>-->
        <el-aside width="200px">
          <el-menu
            :router="false"
            :unique-opened="true"
            :default-active="$router.history.current.name">
            <router-link :to="{ name: 'userList'}" replace>
              <el-menu-item index="userList">
                <i class="el-icon-s-custom"></i>
                <span slot="title">用户信息</span>
              </el-menu-item>
            </router-link>
            <router-link :to="{ name: 'chatRecord'}" replace>
              <el-menu-item index="chatRecord">
                <i class="el-icon-s-comment"></i>
                <span slot="title">聊天记录</span>
              </el-menu-item>
            </router-link>
            <router-link :to="{ name: 'home'}" replace>
              <el-menu-item index="/home">
                <i class="el-icon-s-home"></i>
                <span slot="title">用户界面</span>
              </el-menu-item>
            </router-link>
          </el-menu>
        </el-aside>
        <el-main>
          <el-row>
            <el-col :span="24">
              <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
                <el-breadcrumb-item :replace="true" :to="{ path: '/admin' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :replace="true" :to="{ path: $router.history.current.name}">
                  <a>{{ routerName[$router.history.current.name] }}</a>
                </el-breadcrumb-item>
              </el-breadcrumb>
            </el-col>
          </el-row>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

// import axios from 'axios'

export default {
  name: 'admin',
  components: {},
  data () {
    return {
      routerName: {
        userList: '用户信息',
        chatRecord: '聊天记录'
      }
    }
  },
  created () {
    /*    axios({
      method: 'get',
      url: '/admin',
      data: {
        uid: this.$store.state.uid,
        type: 'allUser'
      }
    }).then(data => this.dataHandler(data.data)).catch(err => this.dataHandler(err.response)) */
  },
  methods: {
    dataHandler (data) {
      // console.log(this.$router.history)
    }
  }
}
</script>

<style>
.el-menu-item:focus {
  background: #fff !important;
}

.is-active {
  background-color: #fff !important;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}

.breadcrumb, .pagination {
  margin: 18px 0 48px;
}
</style>
