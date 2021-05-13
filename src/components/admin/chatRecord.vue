<template>
  <div class="chatRecord">
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="loading"
          class="chatRecordTable"
          :data="tableData.slice((pagination.current*pagination.pageSize-pagination.pageSize),pagination.current*pagination.pageSize)"
          height="calc(100vh - (48px * 4) - (20px * 2))"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="最近聊天">
                  <!--  模态框内容  -->
                  <el-dialog
                    width="80%"
                    :visible.sync="dialogTableVisible">
                    <template v-slot:title>
                      <div style="font-size: 24px">聊天记录
                        <el-tag size="medium" type="info" style="margin-left: 20px">{{ chatDetailPrams.uid }}</el-tag>
                      </div>
                    </template>
                    <el-form size="small" :inline="true" :model="dialogFindParams">
                      <el-row :gutter="0">
                        <el-col :span="6">
                          <el-form-item label="发送人">
                            <el-select v-model="dialogFindParams.sendObj" placeholder="">
                              <el-option label='全部' value=""></el-option>
                              <el-option :label='chatDetailPrams.uid' value="me"></el-option>
                              <el-option :label="chatDetailPrams.chatObj" value="you"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label="关键词">
                            <el-input v-model="dialogFindParams.keyword" placeholder=""></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="10">
                          <el-form-item label="时间">
                            <el-date-picker
                              @change="DatePickerChange($event)"
                              v-model="datePicker.value"
                              type="datetimerange"
                              align="right"
                              :start-placeholder="'开始日期 ' + datePicker.defaultTime.start"
                              :end-placeholder="'结束日期 ' + datePicker.defaultTime.end"
                              :default-time="[datePicker.defaultTime.start, datePicker.defaultTime.end]">
                            </el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="2" style="text-align: right">
                          <el-form-item>
                            <el-button type="primary" @click="chatDetailFind()">查询</el-button>
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
                          <span>{{ scope.row.chat.say === 'me' ? chatDetailPrams.uid : chatDetailPrams.chatObj }}</span>
                        </template>
                      </el-table-column>

                      <el-table-column
                        label="消息内容"
                        prop="chat.msg">
                      </el-table-column>

                      <el-table-column
                        label="时间"
                        prop="chat.time">
                      </el-table-column>

                      <el-table-column
                        label="状态">
                        <template slot-scope="scope">
                          <span>{{ scope.row.chat.status ? '已读' : '未读' }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-dialog>

                  <el-tooltip
                    class="item"
                    effect="dark"
                    placement="bottom-end"
                    v-for="(items, index) of props.row.friends"
                    :key="index"
                    :content="tooltipContent(items)"
                  >
                    <el-badge
                      class="item"
                      :value="items.recMsgCount + items.sendMsgCount">
                      <el-button size="small" class="el-icon-view" @click="chatDetailFind(props.row.email, items.name)">
                        {{ items.name }}
                      </el-button>
                    </el-badge>
                  </el-tooltip>

                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column
            label="序号"
            type="index">
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
            <template slot-scope="scope">
              <el-tag type="success">{{ scope.row.friendsCount }} 个</el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="发送消息"
            prop="sendMsgCount">
            <template slot-scope="scope">
              <el-tag>{{ scope.row.sendMsgCount }} 条</el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="接收消息"
            prop="recMsgCount">
            <template slot-scope="scope">
              <el-tag type="warning">{{ scope.row.recMsgCount }} 条</el-tag>
            </template>
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
import moment from 'moment'

export default {
  name: 'chatRecord',
  components: {},
  data () {
    return {
      loading: false,
      datePicker: {
        value: '',
        defaultTime: {
          start: '07:00:00',
          end: '22:00:00'
        }
      },
      dialogTableVisible: false, // 编辑面板的状态
      dialogFindParams: { // 搜索条件
        sendObj: '',
        keyword: '',
        startTime: '',
        endTime: ''
      },
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
      tableData: [] // 列表数据
    }
  },
  created () {
    this.initChatRecord()
  },
  methods: {
    tooltipContent (items) {
      return `共 ${items.recMsgCount + items.sendMsgCount} 条记录，点击查看详情`
    },
    chatDetailFind (uid, chatObj) {
      if (!this.dialogTableVisible) {
        this.chatDetailPrams.uid = uid
        this.chatDetailPrams.chatObj = chatObj
        this.dialogTableVisible = true
      }
      const params = {}
      this
        .sendData('get',
          {
            data: Object.assign(params, this.chatDetailPrams, this.dialogFindParams),
            type: 'chatDetailFind'
          })
        .then(data => {
          if (data.data.msg === 'success') {
            this.chatDetailList = data.data.chatList
            console.log(this.chatDetailList)
          }
        })
    },
    /**
     *  选择时间
     */
    DatePickerChange (e) {
      this.dialogFindParams.startTime = moment(e[0]).format('YYYY-MM-DD HH:mm:ss')
      this.dialogFindParams.endTime = moment(e[1]).format('YYYY-MM-DD HH:mm:ss')
    },
    /**
     * 初始化获取数据
     */
    initChatRecord () {
      this.loading = !this.loading
      this.sendData('get', {
        uid: this.$store.state.uid,
        type: 'chatRecordList'
      }).then(data => {
        this.loading = !this.loading
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
