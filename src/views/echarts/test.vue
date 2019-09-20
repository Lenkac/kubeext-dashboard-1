<template>
  <div id="myChart" :style="{width: '700px', height: '700px'}"></div>
  
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
      testData: { 
    name: "flare",    
   
    children: [
        {
            name: "flex",
            value: 4116,    
            collapsed: true, 
        },
        
    ]
    
  }}},
  mounted(){
      getEchartsData().then(response => {
          this.echartsData = response.data
          console.log(response.data)
          this.drawLine()
      })
   
  },
  methods: {
    drawLine(){
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

                data: [this.testData],

                left: '2%',
                right: '2%',
                top: '8%',
                bottom: '20%',

                symbol: 'emptyCircle',

                orient: 'vertical',

                expandAndCollapse: true,

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
