<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="13" style="margin-bottom:32px;">
        <el-card>
          <span
            style="display:inline-block; margin-bottom:10px; fontSize:16px; font-weight:bold"
          >yaml配置</span>
          <div class="card-editor-container">
            <json-editor ref="jsonEditor" v-model="value" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="11" style="margin-bottom:32px;">
        <el-card>
          <span
            style="display:inline-block; margin-bottom:10px; fontSize:16px; font-weight:bold"
          >监控信息</span>
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="24">
              <iframe class="rate_iframe" :src="monitor_rs.cpu"></iframe>
            </el-col>
          </el-row>
        </el-card>
        <el-card>
          <el-row type="flex" class="row-bg">
            <el-col :span="24">
              <iframe class="rate_iframe" :src="monitor_rs.memory"></iframe>
            </el-col>
          </el-row>
        </el-card>
        <el-card>
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="24">
              <iframe class="rate_iframe" :src="monitor_rs.fs"></iframe>
            </el-col>
          </el-row>
        </el-card>
        <el-card>
          <el-row>
            <el-col :span="24">
              <iframe class="IO_iframe" :src="monitor_rs.network"></iframe>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-card v-if="this.kind == 'Node'">
        <div>
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            @sort-change="sortChange"
          >
            <el-table-column
              v-for="item in columns"
              :key="item.key"
              :label="item.label"
              :width="item.width"
              align="center"
            >
              <template slot-scope="scope">
                <router-link
                  :to="{path: resourceInfo,query:{tabName: viewerName, name:getInputValue(scope.row,item.row),node:scope.row.spec.nodeName}}"
                  v-if="item.kind == 'a'"
                  tag="a"
                  class="link"
                >{{ getInputValue(scope.row,item.row) }}</router-link>
                <span v-if="item.kind == undefined">{{ getInputValue(scope.row,item.row) }}</span>
                <svg-icon
                  v-if="item.kind == 'terminal'"
                  @click="openTerminal(scope.row)"
                  icon-class="pc"
                  class-name="custom-class"
                />
                <el-select
                  v-if="item.kind == 'action'"
                  v-model="scope.row.val"
                  @change="(handleUpdate($event, scope.row))"
                  placeholder="更多操作"
                >
                  <el-option
                    v-for="item in actions"
                    :key="item.key"
                    :label="item.key"
                    :value="item.type"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getMonitorInfo } from "@/utils/getResource";
import JsonEditor from "@/components/JsonEditor";
import { listAll, getObj, removeObj } from "@/api/commonData";

export default {
  name: "nodeInfo",
  components: { JsonEditor },
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
      resourceInfo: "",
      tabName: "",
      namespace: "default"
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
  created() {
    this.resourceName = this.$route.query.name;
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

    console.log(this.kind);

    if (this.resourceName.substring(0, 1) == "vm") {
      this.viewerName = "virtualmachine";
      this.resourceInfo = "/resourceInfo/vmInfo";
    } else {
      this.viewerName = "pod";
      this.resourceInfo = "/resourceInfo/containerInfo";
    }

    this.monitor_rs = getMonitorInfo(
      this.kind,
      this.resourceName,
      this.innerName
    );

    listAll({ kind: this.kind, namespace: this.namespace }).then(response => {
      if (this.validateRes(response) == 1) {
        var data = response.data.items;
        this.listLoading = false;
        for (var i = 0; i < data.length; i++) {
          if (data[i].metadata.name == this.resourceName) {
            this.value = data[i];
          }
        }
      }
    });

    getObj({
      kind: this.frontend_kind,
      name: this.table_kind + "-" + this.viewerName,
      namespace: this.namespace
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.columns = response.data.spec.data;
        listAll({ kind: this.viewerName, namespace: this.namespace }).then(response => {
          if (this.validateRes(response) == 1) {
            var data = response.data.items;
            var listtemp = [];
            this.listLoading = false;
            getObj({
              kind: this.frontend_kind,
              name: this.action_kind + "-" + this.viewerName.toLowerCase(),
              namespace: this.namespace
            }).then(response => {
              if (this.validateRes(response) == 1) {
                this.actions = response.data.spec.data;
                for (var i = 0; i < data.length; i++) {
                  if (data[i].spec.nodeName == this.resourceName) {
                    listtemp.push(data[i]);
                  }
                }
                this.list = listtemp;
                console.log(this.list);
              }
            });
          }
        });
      }
    });
  },
  mounted() {},
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

    handleUpdate(event, row) {
      console.log(event);
      this.operator = event;
      console.log(row);
      var name = row.metadata.name;
      if (event == "delete") {
        removeObj({
          json: row,
          kind: this.viewerName,
          namespace:this.namespace
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
          console.log(response);
          this.Variables = [];
          if (response.hasOwnProperty("data")) {
            if (response.data.spec.hasOwnProperty("lifecycle")) {
              this.lifecycle = true;
              this.createJsonData = response.data;
              let nameVariables = Object.keys(
                response.data.spec.lifecycle[event]
              );
              console.log(nameVariables);
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
              getObj({ name:name, kind: this.tabName, namespace: this.namespace }).then(response => {
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
        return scope[longKey];
      }
      var keys = longKey.split(".");
      var res = scope;
      keys.forEach(element => {
        //console.log(element)
        // if (element.indexOf("[") > 0) {
        //   res = res[element.substring(0, element.indexOf("["))];
        //   res =
        //     res[
        //       parseInt(
        //         element.substring(
        //           element.indexOf("[") + 1,
        //           element.indexOf("]")
        //         )
        //       )
        //     ];
        // } else {
        if (res.hasOwnProperty(element)) {
          res = res[element];
        } else [(res = "unknown")];
        //}
      });
      //console.log(res)
      return res;
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
  width: 280px;
  height: 135px;
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
</style>