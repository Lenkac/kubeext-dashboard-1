<template>
<div :style="{width: '1280px', height: '1600px'}">
        <div id="temp" :style="{width: '80px', height: '50px',float:'left'}">   
<el-button type="primary" :style="{margin:'30px'}" @click="execute()">分析</el-button>
        </div>
  <div id="myChart" :style="{width: '1100px', height: '700px',float:'left'}"></div>
</div>
  
</template>
<script>
import { getEchartsData} from '@/api/taskData'
let echarts = require('echarts')
// 引入柱状图组件
//require('echarts/lib/chart/bar')
// 引入提示框和title组件
//require('echarts/lib/component/tooltip')
//require('echarts/lib/component/title')
export default {
    name: 'test',
  data () {
    return {
      echartsData: {},  
  }},
  mounted(){
      getEchartsData().then(response => {
          this.echartsData = response.data
          console.log(response.data)
          //this.drawLine()
      })
   
  },
  methods: {
      execute() {               
        for(let i = 0;i<4;i++) {                                                 
                    setTimeout(function(){
                        this.drawLine(i)
                    }.bind(this)
, i*1000)
        }                
      

          },

    drawLine(i){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series:[
            {
                type: 'tree',

                data: [this.echartsData],

                left: '2%',
                right: '2%',
                top: '8%',
                bottom: '20%',

                symbol: 'emptyCircle',

                orient: 'vertical',

                expandAndCollapse: true,
                initialTreeDepth: i,

                label: {
                    normal: {
                        position: 'top',
                        rotate: -90,
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 9
                    }
                },

                leaves: {
                    label: {
                        normal: {
                            position: 'bottom',
                            rotate: -90,
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    }
                },

                animationDurationUpdate: 750
            }
        ]
    });
    }

  }
}
</script>
