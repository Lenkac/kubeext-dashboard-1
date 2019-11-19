<template>  
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
import { getGrafanaLink } from '@/utils/getResource'

export default {
  name: 'DashboardEditor',
  components: { PanThumb},
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
      this.grafanaLink = getGrafanaLink() 
  },
  methods: {
    refresh() {     
        this.grafanaLink = getGrafanaLink()
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
    background-color:rgb(25, 25, 26);
    height: 20px;
}
.iframe{
  width: 100%;
  height: 1000px;
  border: 0ch;
  }
</style>
