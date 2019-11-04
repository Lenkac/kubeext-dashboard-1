<template>  
      <!-- <div class="info-container">
        <span class="display_name">{{ name }}</span>
        <span style="font-size:20px;padding-top:20px;display:inline-block;">演示系统默认界面，请点击左侧导航栏操作</span>
      </div> -->
      <div class="chart-container" >
      <div class="bar">
        <span class="refresh" @click="refresh">刷新</span>
      </div>
    <iframe class="iframe" id="iframe" :src="grafanaLink"></iframe>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import GithubCorner from '@/components/GithubCorner'
import { getGrafanaLink } from '@/api/taskData'

export default {
  name: 'DashboardEditor',
  components: { PanThumb, GithubCorner },
  data() {
    return {
      grafanaLink: ''
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  mounted() {
    getGrafanaLink().then(response => {
      this.grafanaLink = response.data
    })
  },
  methods: {
    refresh() {
      getGrafanaLink().then(response => {
        this.grafanaLink = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .chart-container{
  position: relative;
  width: 100%;
  height: 100%;
}
.refresh{
    float: right;
    font-size: smaller;
    background-color: rgb(255, 255, 255);
    color:black;   
}
.bar{
    width: 100%;
    background-color:rgb(255, 255, 255);
    height: 20px;
}
.iframe{
  width: 100%;
  height: 1000px;
  border: 0ch;
  }
</style>
