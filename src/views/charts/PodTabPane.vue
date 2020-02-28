<template>
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
            :to="{path:resourceInfo,query:{outTabName: outTabName, tabName: tabName, name:getInputValue(scope.row.json,item.row),nodeName:scope.row.json.spec.nodeName}}"
            v-if="item.kind == 'a'"
            tag="a"
            class="link"
          >{{ getInputValue(scope.row.json,item.row) }}</router-link>
          <span v-if="item.kind == undefined">{{ getInputValue(scope.row.json,item.row) }}</span>
          <svg-icon
            v-if="item.kind == 'terminal'"
            @click="openTerminal(scope.row)"
            icon-class="pc"
            class-name="custom-class"
          />
          <el-select
            v-if="item.kind == 'action'"
            v-model="scope.row.val"
            @change="(handleUpdate($event, scope.row.json))"
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

    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogTableVisible"
      :title="this.tabName"
      @dragDialog="handleDrag"
    >
      <div class="card-editor-container">
        <json-editor :readOnly="this.readOnly" ref="jsonEditor" v-model="createJsonData" />
        <el-table
          :data="Variables"
          v-loading="listLoading"
          border
          fit
          v-if="this.catalog_operator == 'VirtualMachine'"
          highlight-current-row
          style="width: 100%;margin-top:20px"
          @sort-change="sortChange"
        >
          <el-table-column label="key" align="center">
            <template slot-scope="{row}">
              <span>{{row.nameVariable}}</span>
            </template>
          </el-table-column>
          <el-table-column label="value" align="center">
            <template slot-scope="{row}">
              <el-radio-group v-if="row.placeholder == true" v-model="row.value">
                <el-radio :label="true">true</el-radio>
                <el-radio :label="false">false</el-radio>
              </el-radio-group>
              <input
                style="border-radius:8px;border:1px solid grey;outline:none"
                class="el-input"
                v-if="row.placeholder != true"
                :placeholder="row.placeholder"
                :value="getInputValue(row,'value')"
                @input="updateInputValue(row,'value',$event.target.value)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="width:100%;height:50px;">
        <el-button
          type="primary"
          style="float:right;margin-top:20px;height:40px;display:inline;"
          @click.native="applyOperation"
        >确认</el-button>
        <!-- <el-button type="primary" style="float:right;margin-top:20px;height:40px;display:inline;margin-right:0px;" >取消</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listAll, getObj, createObj, removeObj } from "@/api/commonData";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { mapGetters } from "vuex";
import elDragDialog from "@/directive/el-drag-dialog";
import JsonEditor from "@/components/JsonEditor";
import {
  resetRouter,
  router,
  constantRoutes,
  setNewRouter
} from "@/router/index";
import Bus from "@/utils/Bus";
import { connectTerminal } from "@/api/commonKindMethod";

export default {
  name: "podTable",
  components: { Pagination, JsonEditor },
  directives: { elDragDialog },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
  props: {
    tabName: {
      type: String,
      default: "VirtualMachine"
    },
    outTabName: {
      type: String,
      default: "Container"
    },
    successCreate: {
      type: String,
      default: ""
    },
    resourceInfo: {
      type: String,
      default: "/resourceInfo/nodeInfo"
    },
    catalog_operator: {
      type: String,
      default: "container"
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: "",
      columns: [],
      actions: [],
      littleDataSource: {},
      filterForm: [],
      listQuery: {},
      rules: {},
      temp: {},
      value: "",
      dialogTableVisible: false,
      createPodJson: {},
      createResource: "创建",
      catalog_kind: "catalog",
      action_kind: "action",
      table_kind: "table",
      frontend_kind: "Frontend",
      tabMapOptions: [],
      createJsonData: {},
      Variables: [],
      operator: "",
      readOnly: true,
      lifecycle: true
    };
  },
  mounted() {},
  created() {
    getObj({
      kind: this.frontend_kind,
      name: this.table_kind + "-" + this.tabName.toLowerCase()
    }).then(response => {
      if (this.validateRes(response) == 1) {
        if (response.hasOwnProperty("data")) {
          this.columns = response.data.spec.data;
          console.log(this.columns);
          listAll({ kind: this.tabName }).then(response => {
            if (this.validateRes(response) == 1) {
              this.listTemp = response.data;
              this.listLoading = false;
              console.log(this.listTemp);
              getObj({
                kind: this.frontend_kind,
                name: this.action_kind + "-" + this.tabName.toLowerCase()
              }).then(response => {
                if (this.validateRes(response) == 1) {
                  if (response.hasOwnProperty("data")) {
                    this.actions = response.data.spec.data;
                  } else {
                    this.actions = [];
                  }
                  for (var i = 0; i < this.listTemp.length; i++) {
                    this.list.push({});
                    this.list[i].json = this.listTemp[i];
                    this.list[i].actions = this.actions;
                    this.list[i].val = "";
                  }
                }
              });
            }
          });
        }
      }
    });
  },
  watch: {
    successCreate(val) {
      if (this.successCreate == "success") {
        this.list = [];
        listAll({ kind: this.tabName }).then(response3 => {
          if (this.validateRes(response3) == 1) {
            this.listTemp = response3.data;
            this.listLoading = false;

            getObj({
              kind: this.frontend_kind,
              name: this.action_kind + "-" + this.tabName.toLowerCase()
            }).then(response => {
              if (this.validateRes(response) == 1) {
                if (response.hasOwnProperty("data")) {
                  this.actions = response.data.spec.data;
                } else {
                  this.actions = [];
                }

                for (var i = 0; i < this.listTemp.length; i++) {
                  this.list.push({});
                  this.list[i].json = this.listTemp[i];
                  this.list[i].actions = this.actions;
                  this.list[i].val = "";
                }
              }
            });
          }
        });
      }
    }
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
    create() {
      this.dialogTableVisible = false;
      var str = this.toRawJson(this.createPodJson);
      createObj({ json: JSON.parse(str), kind: this.kind }).then(response => {
        this.validateRes(response);
      });
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
    handleDrag() {
      this.$refs.select.blur();
    },

    openTerminal(row) {
      connectTerminal(this.tabName, row);
    },

    getList() {
      this.listLoading = true;
    },
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
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

    handleUpdate(event, row) {
      console.log(event);
      this.operator = event;
      var name = row.metadata.name;
      if (event == "delete") {
        removeObj({
          json: row,
          kind: this.tabName
        }).then(response => {
          if (response.code == 20000) {
            this.handleDelete(row);
          }
        });
      } else {
        this.dialogTableVisible = true;
        getObj({
          kind: this.catalog_operator + "Template",
          name: this.catalog_operator.toLowerCase() + "-" + event.toLowerCase(),
          currentName: name
        }).then(response => {
          //console.log(response);
          this.Variables = [];
          if (response.hasOwnProperty("data")) {
            if (response.data.spec.data.hasOwnProperty("lifecycle")) {
              this.lifecycle = true;
              this.createJsonData = response.data;
              //console.log(this.createJsonData);
              let nameVariables = Object.keys(
                response.data.spec.data.lifecycle[event]
              );
              //console.log(nameVariables);
              let values = this.getObjectValues(
                response.data.spec.data.lifecycle[event]
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
              listAll({ kind: this.tabName }).then(response => {
                var data = response.data;
                //this.total = response3.total
                this.listLoading = false;
                for (var i = 0; i < data.length; i++) {
                  if (data[i].metadata.name == name) {
                    this.createJsonData = data[i];
                  }
                }
              });
            }
          }
        });
        for (var key in this.list) {
          this.list[key].val = "";
        }
      }
    },

    applyOperation() {
      this.dialogTableVisible = false;
      if (this.lifecycle == true) {
        var temp = {};
        for (let key in this.Variables) {
          temp[this.Variables[key].nameVariable] = this.Variables[key].value;
        }
        this.createJsonData = JSON.parse(this.createJsonData);
        this.createJsonData.spec.data.lifecycle[this.operator] = temp;
      } else {
        this.createJsonData = JSON.parse(this.createJsonData);
      }

      createObj({
        json: this.createJsonData,
        kind: this.tabName
      }).then(response => {
        if (response.code == 20000) {
          for (var key in this.list) {
            this.list[key].val = "";
          }
          this.handleSuccess();
        }
      });
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

    handleSuccess() {
      this.$notify({
        title: "Success",
        message: "操作成功",
        type: "success",
        duration: 2000
      });
    },

    getObjectValues(object) {
      var values = [];
      for (var property in object) values.push(object[property]);
      return values;
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

      try {
        keys.forEach(element => {
          if (element.indexOf("[") > 0) {
            res = res[element.substring(0, element.indexOf("["))];
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
              return res
              if (res == undefined) {
                res = "unknown";
              }
            } else {
              res = "unknown";
              throw new Error("notExist");
            }
          }
        });
      } catch (e) {
        if (e.message == "notExist"){}
      } finally {
        return res;
      }
      return res;
    },

    deleteMenu() {
      Bus.$emit("deleteMenuTest");
    }
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
.json-editor {
  height: 538px;
  position: relative;
}
.json-editor >>> .CodeMirror {
  height: 538px;
  min-height: 300px;
}
</style>