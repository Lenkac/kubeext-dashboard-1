<template>
  <div class="app-container">
    <el-card
      v-for="(itemx,index) in listtemp"
      :key="itemx.name"
      class="box-card"
      style="width:100%;margin: 15px 15px"
    >
      <p style="font-size:16px;">
        <strong>{{itemx.title}}</strong>
        <a v-if="itemx.name=='metadata'" style="color:blue" @click="openDialog">[yaml]</a>
      </p>
      <div class="chart-wrapper">
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="listtemp[index][itemx.name]"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          @sort-change="sortChange"
        >
          <el-table-column
            v-for="item in itemx.columns"
            :key="item.key"
            :label="item.label"
            align="left"
          >
            <template slot-scope="scope">
              <router-link
                :to="{path:'/resourceInfo/nodeInfo',query:{kind: catalog_operator, name:getInputValue(scope.row.json,item.row)}}"
                v-if="item.kind == 'a'"
                tag="a"
                class="link"
                @click="getData"
              >{{ getInputValue(scope.row,item.row) }}</router-link>
              <span style="white-space: pre-line" v-if="item.kind == undefined">{{ convertMapToPair(getInputValue(scope.row,item.row)) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          v-el-drag-dialog
          :visible.sync="udialogTableVisible"
          :title="resourceName"
          @dragDialog="handleDrag"
        >
          <div class="card-editor-container">
            <json-editor ref="jsonEditor" v-model="createJsonData" />
          </div>
          <div style="width:100%;height:50px;">
            <el-button
              type="primary"
              style="float:right;margin-top:20px;height:40px;display:inline;"
              @click.native="closeDialog"
            >关闭</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
    <div v-if="kind=='Pod'" class="tab-container">
      <el-tabs
        v-model="activeName"
        style="margin-top:15px;margin-left:16px"
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
            <div
              class="components-container"
              v-if="activeName==item.key"
              :type="item.key"
              :tabName="item.key"
            >
              <iframe class="iframe" :src="link"></iframe>
            </div>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getMonitorInfo } from "@/utils/getResource";
import JsonEditor from "@/components/JsonEditor";
import { listAll, getObj, removeObj } from "@/api/commonData";
import elDragDialog from "@/directive/el-drag-dialog";
import { getPodGrafanaLink } from "@/utils/getResource";
import { getKV } from "@/utils/auth";

export default {
  name: "nodeInfo",
  components: { JsonEditor },
  directives: { elDragDialog },
  data() {
    return {
      tableKey: 0,
      list: null,
      activeTab: "activity",
      key: "",
      monitor_rs: {},
      node: "",
      viewerName: "pod",
      resourceName: "",
      podList: "",
      listQuery: "",
      listLoading: "",
      columns: "",
      value: "",
      kind: "",
      frontend_kind: "Frontend",
      table_kind: "table",
      action_kind: "action",
      title_kind: "title",
      resourceInfo: "",
      tabName: "",
      json: {},
      listtemp: [],
      createJsonData: {},
      udialogTableVisible: false,
      namespace: "default",
      catalog_kind: "catalog",
      tabMapOptions: [],
      activeName: "",
      containers: [],
      containerClos: [],
      link: "",
      imageLink: ""
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
  created() {
    this.resourceName = this.$route.query.name.metadata.name;
    this.namespace = this.$route.query.name.metadata.namespace;

    if (this.$route.query.tabName) {
      this.tabName = this.$route.query.tabName;
    }

    if (this.$route.query.nodeName) {
      this.nodeName = this.$route.query.nodeName;
      this.innerName = this.resourceName;
    }

    if (this.$route.query.kind) {
      this.kind = this.$route.query.kind;
    } else {
      this.kind = this.tabName;
    }
    if (this.kind == "Pod") {
      getObj({
        kind: this.frontend_kind,
        name: this.catalog_kind + "-" + this.kind.toLowerCase(),
        namespace: "default"
      }).then(response => {
        if (this.validateRes(response) == 1) {
          this.tabMapOptions = response.data.spec.data.tabMapOptions;
          this.activeName = response.data.spec.data.activeName;
        }

        getObj({
          kind: this.kind,
          name: this.resourceName,
          namespace: this.$route.query.name.metadata.namespace
        }).then(response => {
          this.createJsonData = response.data;

          this.imageLink = response.data.spec.containers[0].image;
        });
      });
    }

    this.namespace = this.$route.query.namespace;
    // listAll({ kind: this.kind, namespace: getKV('projectNum') }).then(response => {
    //   if (this.validateRes(response) == 1) {
    //     for (var i = 0; i < response.data.items.length; i++) {
    //       if (response.data.items[i].metadata.name == this.resourceName) {
    //         if (response.data.items[i].metadata.hasOwnProperty("namespace")) {
    //           this.namespace = response.data.items[i].metadata.namespace;
    //         }

    getObj({
      kind: this.frontend_kind,
      name: this.title_kind + "-" + this.kind.toLowerCase(),
      namespace: "default"
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.list = response.data.spec.data;

        for (let obj in this.list) {
          let json = {};
          if (this.list[obj].name == "pod") {
            getObj({
              kind: this.frontend_kind,
              name: this.table_kind + "-" + this.list[obj].name,
              namespace: "default"
            }).then(response => {
              //console.log(obj);
              if (this.validateRes(response) == 1) {
                json.columns = response.data.spec.data;
                json.name = this.list[obj].name;
                json.title = this.list[obj].title;
                json.index = this.list[obj].index;
                listAll({
                  kind: "Pod",
                  namespace: this.namespace
                }).then(response => {
                  //var data = response.data;
                  //this.total = response3.total
                  this.listLoading = false;
                  json[this.list[obj].name] = response.data.items;
                  this.listtemp.push(json);
                });
              }
            });
          } else {
            if (this.list[obj].name == "metadata") {
              getObj({
                kind: this.frontend_kind,
                name:
                  this.table_kind +
                  "-" +
                  this.kind.toLowerCase() +
                  "-" +
                  this.list[obj].name,
                namespace: "default"
              }).then(response => {
                // console.log(obj);
                if (this.validateRes(response) == 1) {
                  let flag = 0;
                  json.columns = response.data.spec.data;
                  json.name = this.list[obj].name;
                  json.title = this.list[obj].title;
                  json.index = this.list[obj].index;
                  if (response.data.spec.data.length == 0) {
                    flag = 1;
                  }
                  getObj({
                    kind: this.kind,
                    name: this.resourceName,
                    namespace: this.$route.query.name.metadata.namespace
                  }).then(response => {
                    this.createJsonData = response.data;
                    if (this.catalog_operator == "Pod") {
                      this.imageLink = response.data.spec.containers[0].image;
                    }

                    this.link = getPodGrafanaLink(this.resourceName);

                    if (this.validateRes(response) == 1) {
                      if (
                        this.getInputValue(
                          response.data,
                          this.list[obj].name
                        ) == "unknown"
                      ) {
                        if (flag == 1) {
                          json[this.list[obj].name] = [];
                        } else {
                          json[this.list[obj].name] = [];
                          json[this.list[obj].name].push(response.data);
                        }
                      } else {
                        if (
                          this.getInputValue(
                            response.data,
                            this.list[obj].name
                          ) instanceof Array
                        ) {
                          json[this.list[obj].name] = this.getInputValue(
                            response.data,
                            this.list[obj].name
                          );
                        } else {
                          json[this.list[obj].name] = [];
                          json[this.list[obj].name].push(
                            this.getInputValue(
                              response.data,
                              this.list[obj].name
                            )
                          );
                        }
                        // json[this.list[obj].name] = getInputValue(response.data, this.list[obj].name)
                      }

                      // if (!response.data.hasOwnProperty(this.list[obj].name)) {
                      //   if(flag == 1) {
                      //     json[this.list[obj].name] = []
                      //   } else {
                      //     json[this.list[obj].name] = response.data
                      //   }

                      // } else {
                      //   if (response.data[this.list[obj].name] instanceof Array) {
                      //     json[this.list[obj].name] =
                      //       response.data[this.list[obj].name];
                      //   } else {
                      //     json[this.list[obj].name] = [];
                      //     json[this.list[obj].name].push(
                      //       response.data[this.list[obj].name]
                      //     );
                      //   }
                      // }
                      this.listtemp.push(json);
                      this.listtemp.sort(function(a, b) {
                        if (a.index < b.index) {
                          return -1;
                        } else if (a.index == b.index) {
                          return 0;
                        } else {
                          return 1;
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        }

        // console.log(this.listtemp);
      }
    });
    //       }
    //     }
    //   }
    // });
  },
  mounted() {
  },
  methods: {
    validateRes(res) {
      if (res.code == 20000) {
        return 1;
      } else {
        this.$notify({
          title: "error",
          message: res.data,
          type: "warning",
          duration: 3000
        });
        return 0;
      }
    },

    openTerminal(row) {
      connectTerminal(this.viewerName, row);
    },

    handleDrag() {
      this.$refs.select.blur();
    },

    handleUpdate(event, row) {
      this.operator = event;
      var name = row.metadata.name;
      if (event == "delete") {
        removeObj({
          json: row,
          kind: this.viewerName
        }).then(response => {
          if (response.code == 20000) {
            this.handleDelete(row);
          }
        });
      } else {
        this.dialogTableVisible = true;
        getObj({
          type: this.catalog_operator + "Template",
          lifecycle:
            this.catalog_operator.toLowerCase() + "-" + event.toLowerCase(),
          kind: this.viewerName,
          name: name,
          namespace: this.namespace
        }).then(response => {
          this.Variables = [];
          if (response.hasOwnProperty("data")) {
            if (response.data.spec.hasOwnProperty("lifecycle")) {
              this.lifecycle = true;
              this.createJsonData = response.data;
              let nameVariables = Object.keys(
                response.data.spec.lifecycle[event]
              );
              let values = this.getObjectValues(
                response.data.spec.lifecycle[event]
              );
              for (var i = 0; i < nameVariables.length; i++) {
                this.Variables.push({});
                this.Variables[i].nameVariable = nameVariables[i];
                if (values[i] == true) {
                  this.Variables[i].value = values[i];
                  this.Variables[i].placeholder = values[i];
                } else {
                  this.Variables[i].value = "";
                  this.Variables[i].placeholder = values[i];
                }
              }
            } else {
              this.lifecycle = false;
              getObj({
                name: name,
                kind: this.tabName,
                namespace: this.namespace
              }).then(response => {
                this.listLoading = false;
                this.createJsonData = response.data;
              });
            }
          }
        });
        for (var key in this.list) {
          this.list[key].val = "";
        }
      }
    },

    handleDelete(row) {
      this.$notify({
        title: "Success",
        message: "删除成功",
        type: "success",
        duration: 2000
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
    },

    closeDialog() {
      this.udialogTableVisible = false;
    },

    getList() {
      this.listLoading = true;
    },
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      this.handleFilter();
    },

    compare(prop) {
      return function(obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      };
    },
    convertMapToPair(map) {
      if (
          Object.prototype.toString.call(map) == "[object Object]"
        ) {
          var keys = Object.keys(map)
          var res = ''
          
          for(let i = 0; i < keys.length; i++) {
            res += keys[i]+'='+map[keys[i]]
            res += ' \n '
          }
          return res
        }else {
          return map
        }
    },
   
    getInputValue(scope, longKey) {
      if (JSON.stringify(scope) == "{}") {
        return "";
      }
      if (
        longKey == "" ||
        longKey == undefined ||
        longKey == null ||
        !longKey
      ) {
        return "";
      }
      if (longKey.indexOf(".") < 0) {
          return scope[longKey] 
      }
      var keys = longKey.split(".");
      var res = scope;
      keys.forEach(element => {
        if (element.indexOf("[") > 0) {
          res = res[element.substring(0, element.indexOf("["))];
          //console.log(res)
          if (res.length == 0) {
            res = "unknown";
          } else {
            res =
              res[
                parseInt(
                  element.substring(
                    element.indexOf("[") + 1,
                    element.indexOf("]")
                  )
                )
              ];
          }
        } else {
          if (res.hasOwnProperty(element)) {
            res = res[element];
            if (Object.prototype.toString.call(res) == "[object  Object]") {
              return "here";
              //return res;
            }

            if (res == undefined) {
              res = "unknown";
            }
          } else {
            res = "unknown";
            throw new Error("notExist");
          }
        }
      });
      return res;
    },

    openDialog() {
      this.udialogTableVisible = true;
    },

    handleClick() {
      if (this.activeName == "monitor") {
        this.link = getPodGrafanaLink(this.resourceName);
      } else {
        this.link =
          "http://" +
          window.g.VUE_APP_CONTAINER_HOST +
          ":5002/?image=" +
          this.imageLink;
      }
    },

    updateInputValue(scope, longKey, event) {
      if (longKey.indexOf(".") < 0) {
        scope[longKey] = event;
        return;
      }
      var keys = longKey.split(".");
      var obj = scope;
      for (var i = 0; i < keys.length - 1; i++) {
        var element = keys[i];
        if (element.indexOf("[") > 0) {
          obj = obj[element.substring(0, element.indexOf("["))];
          obj =
            obj[
              parseInt(
                element.substring(
                  element.indexOf("[") + 1,
                  element.indexOf("]")
                )
              )
            ];
        } else {
          obj = obj[element];
        }
      }
      obj[keys[keys.length - 1]] = event;
    }
  }
};
</script>
<style lang="scss" scoped>
.iframe {
  width: 100%;
  height: 500px;
  border: 0ch;
}
.rate_iframe {
  width: 562px;
  height: 150px;
  border: 0ch;
}
.IO_iframe {
  width: 562px;
  height: 150px;
  border: 0ch;
}
.board {
  margin-left: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.card-editor-container {
  position: relative;
  width: 100%;
  height: 70%;
}

.link {
  cursor: pointer;
}
</style>