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
        <el-button type="primary" @click="userListModify()" :loading="load">确 定</el-button>
      </div>
    </el-dialog>
    <el-row>
      <el-col :span="24">
        <el-form size="small" :inline="true">
          <el-row :gutter="0">
            <el-col :span="5">
              <el-form-item label="用户名">
                <el-input placeholder="" v-model="find.input"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item label="权限">
                <el-select placeholder="" v-model="find.selectAccess">
                  <el-option label="所有" value="all"></el-option>
                  <el-option label="用户" value="user"></el-option>
                  <el-option label="管理员" value="admin"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item>
                <el-button type="primary" @click="userListFind()">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="loading"
          height="calc(100vh - (48px * 4) - (20px * 2) - 30px)"
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
            <template slot-scope="scope">
              <el-tag v-text="signTime(scope.row.time)"></el-tag>
            </template>
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
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="pagination.current"
          :page-size="pagination.pageSize"
          :total="tableData.length">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import axios from 'axios'
import moment from 'moment'

export default {
  name: 'userList',
  components: {},
  data () {
    return {
      loading: false, // 主面板加载
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
      find: {
        selectAccess: 'all', // 默认选中
        input: '',
        type: ''
      },
      tableData: [],
      flag: false
    }
  },
  created () {
    this.initUserList()
  },
  methods: {
    /**
     * 返回格式化时间
     */
    signTime (time) {
      return moment(time).format('YYYY-MM-DD')
    },
    /**
     * 查找
     */
    userListFind () {
      this.find.type = 'userListFind'
      this.sendData('get', this.find).then(data => {
        this.loading = !this.loading
        this.tableData = data.data.result.map(value => {
          delete value._id
          return value
        })
      })
    },
    /**
     * 初始化获取数据
     */
    initUserList () {
      this.sendData('get', {
        uid: this.$store.state.uid,
        type: 'userList'
      }).then(data => {
        this.loading = false
        if (data.data.msg === 'success') {
          /** 去掉_id属性，因为_id属性在mongodb中可读不可写 */
          this.tableData = data.data.result.map(value => {
            delete value._id
            return value
          })
        }
      })
    },
    /**
     * 发送消息
     * @param data  发送的数据
     * @param method  post/get
     * @returns {AxiosPromise} then()回调
     */
    sendData (method, data) {
      this.loading = !this.loading
      if (method === 'get') {
        return axios({
          method: method,
          url: '/admin/' + data.type,
          params: data
        })
      } else {
        return axios({
          method: method,
          url: '/admin/' + data.type,
          data: data
        })
      }
    },
    /**
     * 提交编辑用户信息
     */
    userListModify () {
      this.load = !this.load
      this.sendData('post', {
        type: 'userListModify',
        uid: this.$store.state.uid,
        formData: this.editForm
      }).then(data => {
        this.load = !this.load
        if (data.data.msg === 'success') {
          this.dialogFormVisible = false
          this.initUserList()
        }
      })
    },
    /**
     * 切换页面回调
     * @param current 当前页码
     */
    handleCurrentChange (current) {
      this.pagination.current = current
    },
    /**
     * 一页显示数据改变回调
     * @param pageSize 一页显示数据
     */
    handleSizeChange (pageSize) {
      this.pagination.pageSize = pageSize
    },
    /**
     * 编辑用户信息按钮
     * @param e
     */
    handleEdit (e) {
      this.dialogFormVisible = true
      this.editForm = e.row
    },
    /**
     * 删除用户信息按钮
     * @param e
     */
    handleDelete (e) {
      this.editForm = e.row
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        /** 删除操作 */
        this.sendData('post', {
          type: 'userListDelete',
          formData: this.editForm
        }).then(data => {
          this.loading = !this.loading
          if (data.data.msg === 'success') {
            this.initUserList()
            this.load = !this.load
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'info',
              message: '删除失败'
            })
          }
        })
      }).catch(() => {
        /*        this.$message({
          type: 'info',
          message: '取消删除操作'
        }) */
      })
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
  /*background: rgba(180, 190, 200, .3);*/
}

.el-main {
}
</style>
