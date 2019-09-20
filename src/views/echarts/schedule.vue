<template>
  <div id="myChart" :style="{width: '700px', height: '700px'}"></div>
  
</template>
<script>
import { getScheduleData} from '@/api/taskData'
import { setInterval } from 'timers';
let echarts = require('echarts')
// 引入柱状图组件
//require('echarts/lib/chart/bar')
// 引入提示框和title组件
//require('echarts/lib/component/tooltip')
//require('echarts/lib/component/title')
export default {
    name: 'schedule',
  data () {
    return {
      echartsData: [],
      data: [],
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
      getScheduleData().then(response => {
          
            //   setTimeout(function(){
            //     this.echartsData = response.data[i]
            //     this.drawLine()
            //   },1000)
            //this.data = response.data;
            this.echartsData = response.data 
                for(let i = 0;i<response.data.length;i++) {
                                  
                    setTimeout(function(){
                        this.drawLine(i)
                    }
   // this.drawLine(i)

, i*2000)
        }   
                  
        
        for(let i=0; i<5; i++) {

        
}   
              
              
          //console.log(response.data)
      })
   
  },
  methods: {
    drawLine(i){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
    title: {
        text: 'Graph 简单示例'
    },
    tooltip: {},
    animationDurationUpdate: 2000,
    animationEasingUpdate: 'quadraticOut',
    series : [
        {
            type: 'graph',
            layout: 'none',
            symbolSize: 50,
            roam: true,
            label: {
                normal: {
                    show: true
                }
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
                normal: {
                    textStyle: {
                        fontSize: 20
                    }
                }
            },
            data: [{
                name: 'S',
                x: 300,
                y: 400
            }, {
                name: 'E',
                x: 900,
                y: 400
            }, {
                name: 'task1',
                x: 500,
                y: 150
            }, {
                name: 'task2',
                x: 500,
                y: 400
            }, {
                name: 'task3',
                x: 500,
                y: 650
            }, {
                name: 'node1',
                x: 700,
                y: 250
            }, {
                name: 'node2',
                x: 700,
                y: 550
            }],
            // links: [],
            links: this.echartsData[i],
            lineStyle: {
                normal: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0
                }
            }
        }
    ]
})
    }}}
</script>
