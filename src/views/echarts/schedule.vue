<template>
<div :style="{width: '1280px', height: '1600px'}">
     <div id="temp" :style="{width: '80px', height: '50px',float:'left'}">
        <el-button type="primary" :style="{margin:'30px'}" @click="execute()">执行</el-button>
    </div>
    <div id="myChart" :style="{width: '1100px', height: '700px',float:'left'}"></div>
        <div id="column" :style="{width: '1200px', height: '800px',float:'left'}">
        <div :style="{ width: '1200px', height: '30px',float:'left'}">调度失败任务</div>          
            <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="failure"
      border
      fit
      highlight-current-row
      style="width: 250px;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row['id'] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务名" width="170px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>        
    </el-table>

        </div>

   
</div>     
</template>
<script>
import { getScheduleData,AgetScheduleData} from '@/api/taskData'
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
      symbol: [],
      categories: [[{name:'开始/结束'},{name:'任务'},{name:'优先级'},{name:'机架'},{name:'机器'}],[{name:'开始/结束'},{name:'任务'},{name:'机架'},{name:'机器'}]],
      tipData: [],
      data: [],
      num: 0,
      color: [],
      failure:[],
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
//       getScheduleData().then(response => {
//           console.log(response.data)
//           this.tipData = response.data.tipData
//           this.symbol = response.data.symbol
//             this.echartsData = response.data.links 
//                 for(let i = 0;i<response.data.links.length;i++) {                                 
//                     setTimeout(function(){
//                         this.drawLine(i)
//                     }.bind(this)
// , i*200)
//         }                
//       })
      
   
  },
  methods: {
      execute() {
          if(this.num == 0) {
                AgetScheduleData().then(response => {
          console.log(response.data)

          this.failure = response.data.failure
          this.tipData = response.data.tipData
          this.symbol = response.data.symbol
            this.echartsData = response.data.links 
                for(let i = 0;i<response.data.links.length;i++) { 
                                                 
                    setTimeout(function(){
                        this.drawLine(i)
                    }.bind(this)
, i*200)
        }                
      })
      setTimeout(function(){
                        this.$message({
        message: '经过分析，是微服务场景！',
        type: 'success'
      })}.bind(this),5000)
                       
      this.num = 1
      this.color = ['#ff9999','#67b55b','MediumTurquoise','#0399d3']
          } else if(this.num == 1) {

                   getScheduleData().then(response => {
          console.log(response.data)
          this.failure = response.data.failure
          this.tipData = response.data.tipData
          this.symbol = response.data.symbol
            this.echartsData = response.data.links 
                for(let i = 0;i<response.data.links.length;i++) {                                 
                    setTimeout(function(){
                        this.drawLine(i)
                    }.bind(this)
, i*200)
        }                
      })
      this.num = 0
      this.color = ['#ff9999','#67b55b','SandyBrown','MediumTurquoise','#0399d3']

           }
     
      },
    drawLine(i){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        myChart.setOption({
    title: {
        text: ''
    },
    color:this.color,
    legend: [{
            
            data: this.categories[this.num].map(function (a) {
                return a;
            }),
            itemWidth: 30,
            itemHeight: 20,
            textStyle: {
                fontSize: 18
            }
        }],
        animation:false,
    //animationDurationUpdate: 100,
    //animationEasingUpdate: 'quadraticOut',
    graphic: [
        {
            type: 'group',
            bounding: 'raw',
            right: 110,
            top: 110,
            z: 100,
            children: [
                {
                    type: 'text',
                    left: 'center',
                    top: 'center',
                    z: 100,
                    style: {
                        fill: 'black',
                        text: '平均调度时间：'+this.tipData[i][0]+'ms'+'\n'+'\n'+'最长调度时间：'+this.tipData[i][1]+'ms'+'\n'+'\n'+'最短调度时间：'+this.tipData[i][2]+'ms'+'\n'+'\n'+'成功数:'+this.tipData[i][3]+'\n'+'\n'+'失败数:'+this.tipData[i][4],
                        font: 'bold 18px Microsoft YaHei',
                    }
                }
            ]
        }        
        ],
        
    series : [
        {
            type: 'graph',
            symbolSize: 50,
            roam: true,
            categories: this.categories[this.num],
            label: {
                normal: {
                    show: true,
                    fontSize: 15
                }
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            lineStyle: {                 
                width: 2.5,
                color: '#33cc33',
                // shadowColor: 'black',
                // shadowOffsetX: 1,
                // shadowOffsetY: 1,
                // shadowBlur: 5                         
              },
            data: this.symbol[i],
            links: this.echartsData[i],
        }
    ]
})
    }}}
</script>
