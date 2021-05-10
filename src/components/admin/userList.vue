<template>
  <div class="userList">
    <el-dialog title="编辑用户信息" :visible.sync="dialogFormVisible">
      <el-form :model="editForm" :label-position="labelPosition">
        <el-row :gutter="20">
          <el-col :span="23">
            <el-form-item label="用户名" :label-width="formLabelWidth">
              <el-input v-model="editForm.email" autocomplete="off" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="昵称" :label-width="formLabelWidth">
              <el-input v-model="editForm.nickName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="真实姓名" :label-width="formLabelWidth">
              <el-input v-model="editForm.trueName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="密码" :label-width="formLabelWidth">
              <el-input v-model="editForm.pwd" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册时间" :label-width="formLabelWidth">
              <el-input v-model="editForm.time" autocomplete="off" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="23">
            <el-form-item label="权限" :label-width='formLabelWidth'>
              <el-select v-model="editForm.access" placeholder="">
                <el-option label="用户" value="user"></el-option>
                <el-option label="管理员" value="admin"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendData()" :loading="load">确 定</el-button>
      </div>
    </el-dialog>
    <el-row>
      <el-col :span="24">
        <el-form size="small" :inline="true">
          <el-row :gutter="0">
            <el-col :span="5">
              <el-form-item label="用户名">
                <el-input placeholder=""></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item label="权限">
                <el-select placeholder="" v-model="selectValue1">
                  <el-option label="所有" value="all"></el-option>
                  <el-option label="用户" value="user"></el-option>
                  <el-option label="管理员" value="admin"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item>
                <el-button type="primary">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="tableData.slice((pagination.current*pagination.pageSize-pagination.pageSize),pagination.current*pagination.pageSize)"
          stripe
          style="width: 100%">
          <el-table-column
            label="序号"
            type="index"
          >
            <template slot-scope="scope">
              <span>{{ pagination.pageSize * (pagination.current - 1) + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="email"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="nickName"
            label="昵称">
          </el-table-column>
          <el-table-column
            prop="trueName"
            label="真实姓名">
          </el-table-column>
          <el-table-column
            prop="pwd"
            label="密码">
          </el-table-column>
          <el-table-column
            prop="time"
            label="注册时间">
          </el-table-column>
          <el-table-column
            prop="access"
            label="权限">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.current"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>

// import axios from 'axios'

export default {
  name: 'userList',
  components: {},
  data () {
    return {
      load: false, // 加载状态
      dialogFormVisible: false, // 编辑面板的状态
      editForm: {}, // 编辑面板绑定的数据
      formLabelWidth: '80px', // 面板label长度
      labelPosition: 'left', // 面板label文字对齐
      count: 0, // 信息总条数
      pagination: {
        pageSize: 5,
        current: 1
      },
      selectValue1: 'all', // 默认选中
      tableData: [
        {
          _id: { $oid: '6093e04ce815df3b1ceff7cf' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '1',
          nickName: 'zusheng',
          pwd: 'lzs123321',
          time: '2021年5月6日 20:25:48',
          trueName: 'zusheng'
        },
        {
          _id: { $oid: '6094d8bca5f33913848c1251' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '2',
          nickName: 'shanni',
          pwd: 'lsn123321',
          time: '2021年5月7日 14:5:48',
          trueName: 'shanni'
        },
        {
          _id: { $oid: '60963218d672e394b09ddef0' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '3',
          nickName: 'wenjian',
          pwd: '123321',
          time: '2021年5月7日 20:25:48',
          trueName: 'wenjian'
        },
        {
          _id: { $oid: '6096577164723d1bc80009c8' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '4',
          nickName: 'test',
          pwd: 'test123',
          time: '2021年5月8日 17:18:41',
          trueName: 'test'
        },
        {
          _id: { $oid: '60967eca0643ba57e86f8b45' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-714.058d5831.png',
          email: '5',
          nickName: '李',
          pwd: 'a123456',
          time: '2021年5月8日 20:6:34',
          trueName: '佛山市'
        },
        {
          _id: { $oid: '6094d8bca5f33913848c1251' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '2',
          nickName: 'shanni',
          pwd: 'lsn123321',
          time: '2021年5月7日 14:5:48',
          trueName: 'shanni'
        },
        {
          _id: { $oid: '60963218d672e394b09ddef0' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '3',
          nickName: 'wenjian',
          pwd: '123321',
          time: '2021年5月7日 20:25:48',
          trueName: 'wenjian'
        },
        {
          _id: { $oid: '6096577164723d1bc80009c8' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '4',
          nickName: 'test',
          pwd: 'test123',
          time: '2021年5月8日 17:18:41',
          trueName: 'test'
        },
        {
          _id: { $oid: '60967eca0643ba57e86f8b45' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-714.058d5831.png',
          email: '5',
          nickName: '李',
          pwd: 'a123456',
          time: '2021年5月8日 20:6:34',
          trueName: '佛山市'
        },
        {
          _id: { $oid: '6094d8bca5f33913848c1251' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '2',
          nickName: 'shanni',
          pwd: 'lsn123321',
          time: '2021年5月7日 14:5:48',
          trueName: 'shanni'
        },
        {
          _id: { $oid: '60963218d672e394b09ddef0' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '3',
          nickName: 'wenjian',
          pwd: '123321',
          time: '2021年5月7日 20:25:48',
          trueName: 'wenjian'
        },
        {
          _id: { $oid: '6096577164723d1bc80009c8' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '4',
          nickName: 'test',
          pwd: 'test123',
          time: '2021年5月8日 17:18:41',
          trueName: 'test'
        },
        {
          _id: { $oid: '60967eca0643ba57e86f8b45' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-714.058d5831.png',
          email: '5',
          nickName: '李',
          pwd: 'a123456',
          time: '2021年5月8日 20:6:34',
          trueName: '佛山市'
        },
        {
          _id: { $oid: '6094d8bca5f33913848c1251' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '2',
          nickName: 'shanni',
          pwd: 'lsn123321',
          time: '2021年5月7日 14:5:48',
          trueName: 'shanni'
        },
        {
          _id: { $oid: '60963218d672e394b09ddef0' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '3',
          nickName: 'wenjian',
          pwd: '123321',
          time: '2021年5月7日 20:25:48',
          trueName: 'wenjian'
        },
        {
          _id: { $oid: '6096577164723d1bc80009c8' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '4',
          nickName: 'test',
          pwd: 'test123',
          time: '2021年5月8日 17:18:41',
          trueName: 'test'
        },
        {
          _id: { $oid: '60967eca0643ba57e86f8b45' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-714.058d5831.png',
          email: '5',
          nickName: '李',
          pwd: 'a123456',
          time: '2021年5月8日 20:6:34',
          trueName: '佛山市'
        },
        {
          _id: { $oid: '6094d8bca5f33913848c1251' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '2',
          nickName: 'shanni',
          pwd: 'lsn123321',
          time: '2021年5月7日 14:5:48',
          trueName: 'shanni'
        },
        {
          _id: { $oid: '60963218d672e394b09ddef0' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '3',
          nickName: 'wenjian',
          pwd: '123321',
          time: '2021年5月7日 20:25:48',
          trueName: 'wenjian'
        },
        {
          _id: { $oid: '6096577164723d1bc80009c8' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-722.50be5f08.png',
          email: '4',
          nickName: 'test',
          pwd: 'test123',
          time: '2021年5月8日 17:18:41',
          trueName: 'test'
        },
        {
          _id: { $oid: '60967eca0643ba57e86f8b45' },
          access: 'user',
          avatar: '/chat/img/ginger-cat-714.058d5831.png',
          email: '5',
          nickName: '李',
          pwd: 'a123456',
          time: '2021年5月8日 20:6:34',
          trueName: '佛山市'
        }
      ] // 列表数据
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
    sendData () {
      this.load = !this.load
    },
    dataHandler (data) {
      console.log(data)
    },
    handleCurrentChange (current) {
      this.pagination.current = current
    },
    handleSizeChange (pageSize) {
      this.pagination.pageSize = pageSize
    },
    handleEdit (e) {
      this.dialogFormVisible = true
      this.editForm = e.row
    },
    handleDelete (e) {
    }
  }
}
</script>

<style scoped>
.admin-container {
  height: 100vh;
  width: 100vw;
}

.el-aside {
  background: rgba(180, 190, 200, .3);
}

.el-main {
}
</style>
