<template>
  <div>
    <el-button
      type="primary"
      style="display:block;margin-left: 20px;margin-top: 20px;"
      @click="execute()"
    >执行</el-button>
    <div
      class="card-editor-container"
      style="width: 30%; height: 400px;float: left;margin-top:20px;margin-left:20px"
    >
      <!-- <json-editor ref="EditableJson" v-model="value" /> -->
      <EditableJson v-model="json" />
    </div>
    <div id="myChart" style="width: 60%; height: 700px;float: left;"></div>
    <!-- <div id="column" :style="{width: '1200px', height: '800px',float:'left'}">
      <div :style="{ width: '1200px', height: '30px',float:'left'}">调度失败任务</div>
      <el-table
        :data="failure"
        border
        fit
        highlight-current-row
        style="width: 250px;"
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
    </div>-->
  </div>
</template>
<script>
import { AgetScheduleData } from "@/api/taskData";
import { getScheduleData, getJsonData } from "@/api/commonData";
import { setInterval } from "timers";
import elDragDialog from "@/directive/el-drag-dialog";
import EditableJson from "@/components/EditableJson";
let echarts = require("echarts");

export default {
  name: "schedule",
  directives: { elDragDialog },
  components: {
    EditableJson
  },
  data() {
    return {
      echartsData: [],
      symbol: [],
      categories: [      
      ],
      tipData: [],
      data: [],
      json: {},
      num: 0,
      colors: [],
      failure: [],
      animations: [],
      counter: 0,
      testData: {
        name: "flare",

        children: [
          {
            name: "flex",
            value: 4116,
            collapsed: true
          }
        ]
      }
    };
  },
  mounted() {
    getJsonData({ kind: "mcmf", operator: "simpleparameter" }).then(
          response => {
            this.json = response.data
          })
  },
  methods: {
    execute() {
        //                 AgetScheduleData().then(response => {
        //           console.log(response.data)

        //           this.failure = response.data.failure
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
        //       setTimeout(function(){
        //                         this.$message({
        //         message: '经过分析，是微服务场景！',
        //         type: 'success'
        //       })}.bind(this),5000)

        // this.num = 1;
        // this.color = ["#ff9999", "#67b55b", "MediumTurquoise", "#0399d3"];
        getScheduleData(JSON.parse(this.json)).then(response => {
              console.log(response.data);
              // this.failure = response.data.failure
              // this.tipData = response.data.tipData
              this.symbol = response.data.dm.data;
              this.echartsData = response.data.dm.links;
              this.animations = response.data.dm.animations
              this.categories = response.data.dm.categories
              this.colors = response.data.dm.colors
               this.drawLine();
              setInterval(function(){
                if(this.counter < this.animations.length){
                    var temp = this.animations[this.counter]
                    if(temp.type == 'link'){
                        for( var j = 0;j< this.echartsData.length;j++){
                          if(this.echartsData[j].source == temp.link.source &&
                            this.echartsData[j].target == temp.link.target){
                            this.echartsData[j] = temp.link
                            this.drawLine();
                            break;
                          }
                        }
                    }
                    this.counter++

                }
                
              }.bind(this),500)
              
            });
        
            
            this.num = 0;
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        title: {
          text: ""
        },
        color: this.colors,
        legend: [
          {
            data: this.categories.map(function(a) {
              return a;
            }),
            itemWidth: 30,
            itemHeight: 20,
            textStyle: {
              fontSize: 18
            }
          }
        ],
        animationDurationUpdate: 1000,
        animationEasingUpdate: 'quadraticOut',
        // graphic: [
        //   {
        //     type: "group",
        //     bounding: "raw",
        //     right: 110,
        //     top: 110,
        //     z: 100,
        //     children: [
        //       {
        //         type: "text",
        //         left: "center",
        //         top: "center",
        //         z: 100,
        //         style: {
        //           fill: "black",
        //           text:
        //             "平均调度时间：" +
        //             this.tipData[i][0] +
        //             "ms" +
        //             "\n" +
        //             "\n" +
        //             "最长调度时间：" +
        //             this.tipData[i][1] +
        //             "ms" +
        //             "\n" +
        //             "\n" +
        //             "最短调度时间：" +
        //             this.tipData[i][2] +
        //             "ms" +
        //             "\n" +
        //             "\n" +
        //             "成功数:" +
        //             this.tipData[i][3] +
        //             "\n" +
        //             "\n" +
        //             "失败数:" +
        //             this.tipData[i][4],
        //           font: "bold 18px Microsoft YaHei"
        //         }
        //       }
        //     ]
        //   }
        // ],

        series: [
          {
            type: "graph",
            symbolSize: 50,
            roam: true,
            categories: this.categories,
            label: {
              normal: {
                show: true,
                fontSize: 15
              }
            },
            edgeSymbol: ["circle", "arrow"],
            lineStyle: {
              width: 2.5,
              color: "#33cc33"
              // shadowColor: 'black',
              // shadowOffsetX: 1,
              // shadowOffsetY: 1,
              // shadowBlur: 5
            },
            data: this.symbol,
            links: this.echartsData
          }
        ]
      });
    }
  }
};
</script>
