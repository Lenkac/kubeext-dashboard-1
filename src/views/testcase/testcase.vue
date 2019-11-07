<template>
  <div class="app-container">
    <div class="tab-container">
      <el-tabs
        v-model="activeName"
        style="margin-top:15px;width:100%"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in tabMapOptions"
          :key="item.key"
          :label="item.label"
          :name="item.key"
        >
          <keep-alive>
            <InnerPane v-if="activeName==item.key" :type="item.key" :tabName="item.key" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getEchartsData, getPriorityData } from "@/api/taskData";
import {
  getListAllData,
  getColumns,
  getFilterForm,
  getLittleDataSource,
  getRules,
  getTemp,
  getJsonData,
  createSthFromTemplate
} from "@/api/commonData";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { mapGetters } from "vuex";
import { transactionList } from "@/api/remote-search";
import InnerPane from "./components/showTestcase";

export default {
  name: "testcase",
  components: { InnerPane },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: "success",
        fail: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
    orderNoFilter(str) {
      return str.substring(0, 30);
    }
  },
  data() {
    return {
      echartsData: {},
      createPodJson: [],
      tableKey: 0,
      list: null,
      listLoading: true,
      total: 0,
      rules: {},
      temp: {},
      textMap: {
        update: "更新数据",
        create: "创建新记录"
      },
      viewer: "pods",
      value: "",
      dialogTableVisible: false,
      modelType: "",
      kind: "",
      rate: 1,
      catalog_kind: "Catalog",
      catalog_operator: "testcase",
      tabMapOptions: [],
      activeName: "testcase1",
      innerTab: "left",
    }
  },
  mounted() {
    getEchartsData().then(response => {
      this.echartsData = response.data;
      console.log(response.data);
    });
  },
  created() {
    getPriorityData().then(response => {
      this.createPodJson = response.data;
    });

    getJsonData({
      kind: this.catalog_kind,
      operator: this.catalog_operator
    }).then(response => {
      this.tabMapOptions = response.data.tabMapOptions;
      this.activeName = response.data.activeName;
    });
  },
  methods: {
    handleClick() {

    },
    toRawJson(val) {
      var str = JSON.stringify(val);
      str = str.replace(/ +/g, "");
      str = str.replace(/\\n/g, "");
      if (str[0] == '"') {
        str = str.substring(1, str.length - 1);
      }
      str = str.replace(/\\/g, "");
      return str;
    },
    getVal(val) {
      this.kind = val;
    },
    fetchData() {
      this.$message({
        message: "开始测试！",
        type: "success"
      });
      if (this.kind == "priority" && this.rate == 1) {
        setTimeout(
          function() {
            this.list = [
              {
                name: "testcase1",
                strategy: "priority",
                status1: "success",
                status2: "success",
                status3: "fail"
              },
              {
                name: "testcase2",
                strategy: "priority",
                status1: "success",
                status2: "success",
                status3: "fail"
              },
              {
                name: "testcase3",
                strategy: "priority",
                status1: "success",
                status2: "success",
                status3: "fail"
              }
            ];
          }.bind(this),
          9500
        );

        setTimeout(
          function() {
            this.testData1.children = children;
            this.drawLine1();
          }.bind(this),
          3000
        );

        setTimeout(
          function() {
            this.$message({
              message: "卸载环境！",
              type: "success"
            });
          }.bind(this),
          3500
        );

        setTimeout(
          function() {
            this.$message({
              message: "卸载环境！",
              type: "success"
            });
          }.bind(this),
          7000
        );

        setTimeout(
          function() {
            this.testData2.children = children;
            //this.describe2()
            let myChart2 = this.$echarts.init(
              document.getElementById("myChart2")
            );
            myChart2.setOption({
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove"
              },
              series: [
                {
                  type: "tree",

                  data: [this.testData2],

                  left: "2%",
                  right: "2%",
                  top: "25%",
                  bottom: "30%",

                  symbol: "circle",
                  symbolSize: 15,
                  itemStyle: {
                    color: "black",
                    borderWidth: 0
                  },

                  orient: "vertical",

                  expandAndCollapse: true,

                  label: {
                    normal: {
                      position: "top",
                      verticalAlign: "middle",
                      align: "right",
                      fontSize: 14
                    }
                  },

                  leaves: {
                    label: {
                      normal: {
                        position: "bottom",
                        verticalAlign: "right",
                        align: "right",
                        rotate: -90
                      }
                    }
                  },

                  animationDurationUpdate: 750
                }
              ]
            });
          }.bind(this),
          6000
        );
        setTimeout(
          function() {
            this.testData3.children = children;
            //this.drawLine3()
            let myChart3 = this.$echarts.init(
              document.getElementById("myChart3")
            );
            myChart3.setOption({
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove"
              },
              series: [
                {
                  type: "tree",

                  data: [this.testData3],

                  left: "2%",
                  right: "2%",
                  top: "25%",
                  bottom: "30%",

                  symbol: "circle",
                  symbolSize: 15,
                  itemStyle: {
                    color: "black",
                    borderWidth: 0
                  },

                  orient: "vertical",

                  expandAndCollapse: true,

                  label: {
                    normal: {
                      position: "top",
                      verticalAlign: "middle",
                      align: "right",
                      fontSize: 14
                    }
                  },

                  leaves: {
                    label: {
                      normal: {
                        position: "bottom",
                        verticalAlign: "right",
                        align: "right",
                        rotate: -90
                      }
                    }
                  },

                  animationDurationUpdate: 750
                }
              ]
            });
          }.bind(this),
          9000
        );
      } else if (this.kind == "default" && this.rate == 1) {
        setTimeout(
          function() {
            this.list = [
              {
                name: "testcase1",
                strategy: "default",
                status1: "success",
                status2: "success",
                status3: "fail"
              },
              {
                name: "testcase2",
                strategy: "default",
                status1: "success",
                status2: "fail",
                status3: "success"
              },
              {
                name: "testcase3",
                strategy: "default",
                status1: "fail",
                status2: "success",
                status3: "success"
              }
            ];
          }.bind(this),
          9500
        );
        setTimeout(
          function() {
            this.testData1.children = children;
            this.drawLine1();
          }.bind(this),
          3000
        );

        setTimeout(
          function() {
            this.$message({
              message: "卸载环境！",
              type: "success"
            });
          }.bind(this),
          3500
        );

        setTimeout(
          function() {
            this.$message({
              message: "卸载环境！",
              type: "success"
            });
          }.bind(this),
          7000
        );

        setTimeout(
          function() {
            this.testData2.children = children1;
            let myChart2 = this.$echarts.init(
              document.getElementById("myChart2")
            );
            myChart2.setOption({
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove"
              },
              series: [
                {
                  type: "tree",

                  data: [this.testData2],

                  left: "2%",
                  right: "2%",
                  top: "25%",
                  bottom: "30%",

                  symbol: "circle",
                  symbolSize: 15,
                  itemStyle: {
                    color: "black",
                    borderWidth: 0
                  },

                  orient: "vertical",

                  expandAndCollapse: true,

                  label: {
                    normal: {
                      position: "top",
                      verticalAlign: "middle",
                      align: "right",
                      fontSize: 14
                    }
                  },

                  leaves: {
                    label: {
                      normal: {
                        position: "bottom",
                        verticalAlign: "right",
                        align: "right",
                        rotate: -90
                      }
                    }
                  },

                  animationDurationUpdate: 750
                }
              ]
            });
          }.bind(this),
          6000
        );
        setTimeout(
          function() {
            this.testData3.children = children2;
            let myChart3 = this.$echarts.init(
              document.getElementById("myChart3")
            );
            myChart3.setOption({
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove"
              },
              series: [
                {
                  type: "tree",

                  data: [this.testData3],

                  left: "2%",
                  right: "2%",
                  top: "25%",
                  bottom: "30%",

                  symbol: "circle",
                  symbolSize: 15,
                  itemStyle: {
                    color: "black",
                    borderWidth: 0
                  },

                  orient: "vertical",

                  expandAndCollapse: true,

                  label: {
                    normal: {
                      position: "top",
                      verticalAlign: "middle",
                      align: "right",
                      fontSize: 14
                    }
                  },

                  leaves: {
                    label: {
                      normal: {
                        position: "bottom",
                        verticalAlign: "right",
                        align: "right",
                        rotate: -90
                      }
                    }
                  },

                  animationDurationUpdate: 750
                }
              ]
            });
          }.bind(this),
          9000
        );
      } else if (this.rate > 1) {
        setTimeout(
          function() {
            this.list = [
              {
                name: "testcase1",
                strategy: "priority",
                status1: "success",
                status2: "success",
                status3: "success"
              },
              {
                name: "testcase2",
                strategy: "priority",
                status1: "success",
                status2: "success",
                status3: "success"
              },
              {
                name: "testcase3",
                strategy: "priority",
                status1: "success",
                status2: "success",
                status3: "success"
              }
            ];
          }.bind(this),
          9500
        );
        setTimeout(
          function() {
            this.testData1.children = children3;
            this.drawLine1();
          }.bind(this),
          3000
        );

        setTimeout(
          function() {
            this.$message({
              message: "卸载环境！",
              type: "success"
            });
          }.bind(this),
          3500
        );

        setTimeout(
          function() {
            this.$message({
              message: "卸载环境！",
              type: "success"
            });
          }.bind(this),
          7000
        );

        setTimeout(
          function() {
            this.testData2.children = children3;
            let myChart2 = this.$echarts.init(
              document.getElementById("myChart2")
            );
            myChart2.setOption({
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove"
              },
              series: [
                {
                  type: "tree",

                  data: [this.testData2],

                  left: "2%",
                  right: "2%",
                  top: "25%",
                  bottom: "30%",

                  symbol: "circle",
                  symbolSize: 15,
                  itemStyle: {
                    color: "black",
                    borderWidth: 0
                  },

                  orient: "vertical",

                  expandAndCollapse: true,

                  label: {
                    normal: {
                      position: "top",
                      verticalAlign: "middle",
                      align: "right",
                      fontSize: 14
                    }
                  },

                  leaves: {
                    label: {
                      normal: {
                        position: "bottom",
                        verticalAlign: "right",
                        align: "right",
                        rotate: -90
                      }
                    }
                  },

                  animationDurationUpdate: 750
                }
              ]
            });
          }.bind(this),
          6000
        );
        setTimeout(
          function() {
            this.testData3.children = children3;
            let myChart3 = this.$echarts.init(
              document.getElementById("myChart3")
            );
            myChart3.setOption({
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove"
              },
              series: [
                {
                  type: "tree",

                  data: [this.testData3],

                  left: "2%",
                  right: "2%",
                  top: "25%",
                  bottom: "30%",

                  symbol: "circle",
                  symbolSize: 15,
                  itemStyle: {
                    color: "black",
                    borderWidth: 0
                  },

                  orient: "vertical",

                  expandAndCollapse: true,

                  label: {
                    normal: {
                      position: "top",
                      verticalAlign: "middle",
                      align: "right",
                      fontSize: 14
                    }
                  },

                  leaves: {
                    label: {
                      normal: {
                        position: "bottom",
                        verticalAlign: "right",
                        align: "right",
                        rotate: -90
                      }
                    }
                  },

                  animationDurationUpdate: 750
                }
              ]
            });
          }.bind(this),
          9000
        );
        //this.drawLine()
      }
    },
    drawLine1() {
      // 基于准备好的dom，初始化echarts实例
      let myChart1 = this.$echarts.init(document.getElementById("myChart1"));

      // 绘制图
      myChart1.setOption({
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove"
        },
        series: [
          {
            type: "tree",

            data: [this.testData1],

            left: "2%",
            right: "2%",
            top: "25%",
            bottom: "30%",

            symbol: "circle",
            symbolSize: 15,
            itemStyle: {
              color: "black",
              borderWidth: 0
            },

            orient: "vertical",

            expandAndCollapse: true,

            label: {
              normal: {
                position: "top",
                verticalAlign: "middle",
                align: "right",
                fontSize: 14
              }
            },

            leaves: {
              label: {
                normal: {
                  position: "bottom",
                  verticalAlign: "right",
                  align: "right",
                  rotate: -90
                }
              }
            },

            animationDurationUpdate: 750
          }
        ]
      });
    }
  },
  describe2() {
    // 基于准备好的dom，初始化echarts实例
    let myChart2 = this.$echarts.init(document.getElementById("myChart2"));
    myChart2.setOption({
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove"
      },
      series: [
        {
          type: "tree",

          data: [this.testData2],

          left: "2%",
          right: "2%",
          top: "25%",
          bottom: "30%",

          symbol: "circle",
          symbolSize: 15,
          itemStyle: {
            color: "black",
            borderWidth: 0
          },

          orient: "vertical",

          expandAndCollapse: true,

          label: {
            normal: {
              position: "top",
              verticalAlign: "middle",
              align: "right",
              fontSize: 14
            }
          },

          leaves: {
            label: {
              normal: {
                position: "bottom",
                verticalAlign: "right",
                align: "right",
                rotate: -90
              }
            }
          },

          animationDurationUpdate: 750
        }
      ]
    });
  },
  drawLine3() {
    // 基于准备好的dom，初始化echarts实例
    let myChart3 = this.$echarts.init(document.getElementById("myChart3"));
    myChart3.setOption({
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove"
      },
      series: [
        {
          type: "tree",

          data: [this.testData3],

          left: "2%",
          right: "2%",
          top: "25%",
          bottom: "30%",

          symbol: "circle",
          symbolSize: 15,
          itemStyle: {
            color: "black",
            borderWidth: 0
          },

          orient: "vertical",

          expandAndCollapse: true,

          label: {
            normal: {
              position: "top",
              verticalAlign: "middle",
              align: "right",
              fontSize: 14
            }
          },

          leaves: {
            label: {
              normal: {
                position: "bottom",
                verticalAlign: "right",
                align: "right",
                rotate: -90
              }
            }
          },

          animationDurationUpdate: 750
        }
      ]
    });
  }
};
</script>

<style scoped>
.link {
  color: red;
}
a:hover {
  text-decoration: underline;
}
input {
  height: 35px;
}
</style>