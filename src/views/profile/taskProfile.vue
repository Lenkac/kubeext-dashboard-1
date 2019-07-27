<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="10" style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <li v-if="key != undefined">{{key}}</li>
      </el-col>
      <el-col :span="14" style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <iframe class="iframe" :src="grafanaSolo"></iframe>
      </el-col>
    </el-row>
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
import { getGrafanaSolo } from '@/api/taskData'

export default {
  name: 'taskProfile',
  components: { UserCard, Activity, Timeline, Account },
  data() {
    return {
      user: {},
      activeTab: 'activity',
      key: '',
      grafanaSolo: ''
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
    getGrafanaSolo().then(response => {
      this.grafanaSolo = response.data
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
  width: 550px;
  height: 200px;
  border: 0ch;
  }
</style>