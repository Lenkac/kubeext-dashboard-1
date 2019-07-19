<template>
  <div class="chart-container" >
      <div class="bar">
        <span class="refresh" @click="refresh">刷新</span>
      </div>
    <iframe id="iframe" src="http://47.96.36.117:3000/dashboard/db/nginxfang-wen-tong-ji?spm=a2c4g.11186623.2.65.6274e9d6N3KHZn&orgId=1&from=1563436218919&to=1563499940379&var-myinterval=30m&var-hostname=*" width="100%" height="1500px" frameborder="0">
    </iframe>
  </div>
</template>

<script>
export default {
  name: 'Grafana',
  data() {
    return {
    }
  },
  created() {
    
  },
  mounted() {
    
  },
  destroyed() {
    
  },
  methods: {
    refresh() {
      document.getElementById("iframe").src = "http://47.96.36.117:3000/dashboard/db/nginxfang-wen-tong-ji?spm=a2c4g.11186623.2.65.6274e9d6N3KHZn&orgId=1&from=1563436218919&to=" + new Date().getTime() + "&var-myinterval=30m&var-hostname=*"
    }
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: 100%;
}
.refresh{
    float: right;
    font-size: smaller;
    background-color: rgb(25, 25, 26);
    color:white;   
}
.bar{
    width: 100%;
    background-color:rgb(25, 25, 26);
    height: 20px;
}
</style>