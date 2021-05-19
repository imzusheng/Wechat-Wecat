<template>
  <div class="config">
<!--    将于2021-5-20开放-->
    <el-form :model="editForm" >
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item label="WebSocket 服务器（本地）" :label-width="'220px'">
            <el-input v-model="editForm.local.wsServer" autocomplete="off" :disabled="!serverSwitch"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="端口" :label-width="'100px'">
            <el-input v-model="editForm.local.wsServerPort" autocomplete="off" :disabled="!serverSwitch"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="业务服务器（本地）" :label-width="'220px'">
            <el-input v-model="editForm.local.httpServer" autocomplete="off" :disabled="!serverSwitch"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="端口" :label-width="'100px'">
            <el-input v-model="editForm.local.httpPort" autocomplete="off" :disabled="!serverSwitch"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <br />

      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item label="WebSocket 服务器（远程）" :label-width="'220px'">
            <el-input v-model="editForm.server.wsServer" autocomplete="off" :disabled="serverSwitch"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="端口" :label-width="'100px'">
            <el-input v-model="editForm.server.wsServerPort" autocomplete="off" :disabled="serverSwitch"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="业务服务器（远程）" :label-width="'220px'">
            <el-input v-model="editForm.server.httpServer" autocomplete="off" :disabled="serverSwitch"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="端口" :label-width="'100px'">
            <el-input v-model="editForm.server.httpPort" autocomplete="off" :disabled="serverSwitch"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <br />

    <div class="serverSwitch">
      使用远程
      <el-switch
        v-model="serverSwitch"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
    </div>
  </div>
</template>

<script>
import config from '@/assets/js/config'

export default {
  name: 'config',
  components: {},
  data () {
    return {
      loading: false,
      serverSwitch: false,
      editForm: {
        local: {
          httpServer: config.local.httpServer,
          httpPort: config.local.httpPort,
          wsServer: config.local.wsServer,
          wsServerPort: config.local.wsServerPort
        },
        server: {
          httpServer: config.server.httpServer,
          httpPort: config.server.httpPort,
          wsServer: config.server.wsServer,
          wsServerPort: config.server.wsServerPort
        }
      }
    }
  },
  created () {
  },
  methods: {}
}
</script>

<style scoped>
.serverSwitch{
  width: 120px;
  display: flex;
  justify-items: center;
  justify-content: space-between;
  align-items: center;
}
</style>
