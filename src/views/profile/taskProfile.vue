<template>
  <div class="app-container">
    <el-row :gutter="20">    
      <el-col :span="13" style="margin-bottom:32px;">
        <el-card>
          <div class="card-editor-container">
            <json-editor ref="jsonEditor" v-model="value" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="11" style="margin-bottom:32px;"> 
        <el-card>       
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="24">
              <iframe class="rate_iframe" :src="monitor_rs.cpu.rate"></iframe>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col :span="12" >
              <iframe class="iframe" :src="monitor_rs.cpu.used"></iframe>           
            </el-col>
            <el-col :span="12">
              <iframe class="iframe" :src="monitor_rs.cpu.total"></iframe>
            </el-col>
          </el-row>
        </el-card>
        <el-card>
        <el-row type="flex" class="row-bg">
          <el-col :span="24">
            <iframe class="rate_iframe" :src="monitor_rs.memory.rate"></iframe>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col :span="12" >
            <iframe class="iframe" :src="monitor_rs.memory.used"></iframe>           
          </el-col>
          <el-col :span="12">
            <iframe class="iframe" :src="monitor_rs.memory.total"></iframe>
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="24">
            <iframe class="rate_iframe" :src="monitor_rs.fs.rate"></iframe>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col :span="12" >
            <iframe class="iframe" :src="monitor_rs.fs.used"></iframe>           
          </el-col>
          <el-col :span="12">
            <iframe class="iframe" :src="monitor_rs.fs.total"></iframe>
          </el-col>
        </el-row>
      </el-card>
      <el-card> 
        <el-row>
          <el-col :span="24">
            <iframe class="IO_iframe" :src="monitor_rs.network"></iframe>
          </el-col>
        </el-row>  
      </el-card>      
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
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import { getMonitorInfo } from '@/api/taskData'
import JsonEditor from '@/components/JsonEditor'
import Bus from'../../utils/bus'
const jsonData = '[{"items":[{"market_type":"forexdata","symbol":"XAUUSD"},{"market_type":"forexdata","symbol":"UKOIL"},{"market_type":"forexdata","symbol":"CORN"}],"name":""}]'

export default {
  name: 'taskProfile',
  components: { UserCard, Activity, Timeline, Account,JsonEditor },
  data() {
    return {
      user: {},
      activeTab: 'activity',
      key: '',
      monitor_rs:{},
      node:'ali1',
      objectName:'link',
      viewerName:'monitor',
      value: JSON.parse(jsonData)
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
    getMonitorInfo({viewerName:this.viewerName,node:this.node,objectName:this.objectName}).then(response => {
      this.monitor_rs = response     
    })
  },
  mounted() {
          var vm = this
          // 用$on事件来接收参数
          Bus.$on('val', (data) => {
            console.log("hhhhhhhh"+data)
            vm.node = data
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
  width: 280px;
  height: 165px;
  border: 0ch;
  }
.rate_iframe{
  width: 562px;
  height: 210px;
  border: 0ch;
  }
.IO_iframe{
  width: 562px;
  height: 210px;
  border: 0ch;
  }
.board {
  margin-left: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.card-editor-container{
  position: relative;
  width: 100%;
  height: 70%;
}
</style>