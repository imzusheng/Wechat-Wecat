<template>
  <div class="chatRecord">
    <el-row>
      <el-col :span="24">
        <el-table
          class="chatRecordTable"
          :data="tableData.slice((pagination.current*pagination.pageSize-pagination.pageSize),pagination.current*pagination.pageSize)"
          height="calc(100vh - (48px * 4) - (20px * 2))"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="最近聊天">
                  <el-dialog
                    width="80%"
                    title="聊天记录"
                    :visible.sync="dialogTableVisible">
                    <el-form size="small" :inline="true">
                      <el-row :gutter="0">
                        <el-col :span="5">
                          <el-form-item label="发送人">
                            <el-input placeholder=""></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label="关键词">
                            <el-input placeholder=""></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="10">
                          <el-form-item label="时间">
                            <el-date-picker
                              v-model="datePicker.value"
                              type="datetimerange"
                              align="right"
                              :start-placeholder="'开始日期 ' + datePicker.defaultTime.start"
                              :end-placeholder="'结束日期 ' + datePicker.defaultTime.end"
                              :default-time="[datePicker.defaultTime.start, datePicker.defaultTime.end]">
                            </el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4" style="text-align: right">
                          <el-form-item>
                            <el-button type="primary">查询</el-button>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>

                    <el-table
                      height="360"
                      :data="chatDetailList"
                    >
                      <el-table-column
                        label="发送人">
                        <template slot-scope="scope">
                          <span>{{ scope.row.say === 'me' ? chatDetailPrams.uid : chatDetailPrams.chatObj }}</span>
                        </template>
                      </el-table-column>

                      <el-table-column
                        label="消息内容"
                        prop="msg">
                      </el-table-column>

                      <el-table-column
                        label="时间"
                        prop="time">
                      </el-table-column>

                      <el-table-column
                        label="状态">
                        <template slot-scope="scope">
                          <span>{{ scope.row.status ? '已读' : '未读' }}</span>
                        </template>
                      </el-table-column>
                    </el-table>

                  </el-dialog>

                  <el-badge
                    class="item"
                    v-for="(items, index) of props.row.friends"
                    :key="index"
                    :value="items.recMsgCount + items.sendMsgCount"
                  >
                    <el-button size="small" @click="chatDetail(props.row.email, items.name)">{{
                        items.name
                      }}
                    </el-button>
                  </el-badge>

                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column
            label="序号"
            type="index"
          >
            <template slot-scope="scope">
              <span>{{ pagination.pageSize * (pagination.current - 1) + scope.$index + 1 }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="用户名"
            prop="email">
          </el-table-column>

          <el-table-column
            label="好友总数"
            prop="friendsCount">
          </el-table-column>

          <el-table-column
            label="发送消息"
            prop="sendMsgCount">
          </el-table-column>

          <el-table-column
            label="接收消息"
            prop="recMsgCount">
          </el-table-column>

          <el-table-column
            label="最近登录时间"
            prop="RecentlyTime">
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

import axios from 'axios'

export default {
  name: 'chatRecord',
  components: {},
  data () {
    return {
      datePicker: {
        value: '',
        defaultTime: {
          start: '00:00:00',
          end: '24:00:00'
        }
      },
      dialogTableVisible: false, // 编辑面板的状态
      count: 0, // 信息总条数
      pagination: {
        pageSize: 5,
        current: 1
      },
      chatDetailPrams: {
        uid: '',
        chatObj: ''
      },
      chatDetailList: [],
      tableData: []// 列表数据
    }
  },
  created () {
    this.initChatRecord()
  },
  methods: {
    chatDetail (uid, chatObj) {
      this.chatDetailPrams.uid = uid
      this.chatDetailPrams.chatObj = chatObj
      this.dialogTableVisible = true
      this.sendData('get', {
        uid: uid,
        chatObj: chatObj,
        type: 'chatDetail'
      }).then(data => {
        if (data.data.msg === 'success') {
          this.chatDetailList = data.data.result[0].chat
        }
      })
    },
    /**
     * 初始化获取数据
     */
    initChatRecord () {
      this.sendData('get', {
        uid: this.$store.state.uid,
        type: 'chatRecordList'
      }).then(data => {
        if (data.data.msg === 'success') {
          /** 去掉_id属性，因为_id属性在mongodb中可读不可写 */
          this.tableData = data.data.data.map(value => {
            delete value._id
            return value
          })
        }
      })
    },
    /**
     * 发送消息
     * @param data  发送的数据
     * @param method  get/post
     * @returns {AxiosPromise} then()回调
     */
    sendData (method, data) {
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

.item {
  margin: 0 40px 10px 0;
}
</style>
