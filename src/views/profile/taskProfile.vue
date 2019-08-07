<template>
  <div class="app-container">
  
      <el-col :span="12" style="margin-bottom:32px;">
        <li v-if="key != undefined">{{key}}</li>
      </el-col>
      <el-col :span="12" style="margin-bottom:32px;">        
        <el-row :span="8" style="margin-bottom:32px;">
          <el-col :span="6" style="margin:0 50px 10px 50px;">
            <iframe class="iframe" :src="cpu.used"></iframe>
          </el-col>
          <el-col :span="6" style="margin:0 50px 10px 50px;">
            <iframe class="iframe" :src="cpu.total"></iframe>
          </el-col>
          <el-col :span="6" style="margin:0 50px 10px 50px;">
            <iframe class="rate_iframe" :src="cpu.rate"></iframe>
          </el-col>
        </el-row>
        <el-row :span="8" style="margin-bottom:32px;">
          <el-col :span="6" style="margin:0 50px 10px 50px;">
            <iframe class="iframe" :src="grafanaSolo"></iframe>
          </el-col>
          <el-col :span="6" style="margin:0 50px 10px 50px;">
            <iframe class="iframe" :src="grafanaSolo"></iframe>
          </el-col>
          <el-col :span="6" style="margin:0 50px 10px 50px;">
            <iframe class="rate_iframe" :src="grafanaSolo"></iframe>
          </el-col>
        </el-row>
        <el-row :span="8" style="margin-bottom:32px;">
          <el-col :span="6" style="margin:0 50px 10px 50px;">
            <iframe class="iframe" :src="grafanaSolo"></iframe>
          </el-col>
          <el-col :span="6" style="margin:0 50px 10px 50px;">
            <iframe class="iframe" :src="grafanaSolo"></iframe>
          </el-col>
          <el-col :span="6" style="margin:0 50px 10px 50px;">
            <iframe class="rate_iframe" :src="grafanaSolo"></iframe>
          </el-col>
        </el-row>
        <el-row :span="8" style="margin-bottom:32px;">
          <el-col :span="6" style="margin:0 50px 10px 50px;">
            <iframe class="IO_iframe" :src="grafanaSolo"></iframe>
          </el-col>
        </el-row>
        
      </el-col>
    
    <!-- <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import { getMonitorInfo } from '@/api/taskData'

export default {
  name: 'taskProfile',
  components: { UserCard, Activity, Timeline, Account },
  data() {
    return {
      user: {},
      activeTab: 'activity',
      key: '',
      grafanaSolo: '',
      cpu:{},
      memory:{},
      fs:{},
      network:'',
      node:'',
      index:'',
      viewerName:'nodes'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
    this.key = this.$route.query.taskid
  },
  mounted() {
    getMonitorInfo({"viewerName":"nodes","index":"0","node":"ali1","objectName":"grafana"}).then(response => {
      this.cpu = response.cpu
      this.memory = response.memory
      this.fs = response.fs
      this.network = response.network
      
    })
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.iframe{
  width: 250px;
  height: 100px;
  border: 0ch;
  }
.rate_iframe{
  width: 510px;
  height: 150px;
  border: 0ch;
  }
.IO_iframe{
  width: 510px;
  height: 200px;
  border: 0ch;
  }
</style>