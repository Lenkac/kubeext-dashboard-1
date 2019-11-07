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
            :to="{path:path,query:{tabName:tabName,pod:getInputValue(scope.row.json,item.row),node:scope.row.json.spec.nodeName}}"
            v-if="item.kind == 'a'"
            tag="a"
            class="link"
          >{{ getInputValue(scope.row.json,item.row) }}</router-link>
          <span v-if="item.kind == undefined">{{ getInputValue(scope.row.json,item.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="远程连接"
        align="center"
        width="130"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <svg-icon @click="openUrl(row)" icon-class="pc" class-name="custom-class" />
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        width="130"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-select
            v-model="row.val"
            @change="(handleUpdate($event, row.json))"
            placeholder="更多操作"
          >
            <el-option
              v-for="item in actions"
              :key="item.key"
              :label="item.key"
              :value="item.type"
              @click="showDialog"
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
          v-if="this.catalog_operator == 'virtualmachine'"
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
import {
  getListAllData,
  getColumns,
  getFilterForm,
  getLittleDataSource,
  getRules,
  getTemp,
  getJsonData,
  createSthFromTemplate,
  deleteSthFromTemplate,
  updateSthFromTemplate,
  queryOperation
} from "@/api/commonData";
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
      default: "Pod"
    },
    successCreate: {
      type: String,
      default: ""
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
      path: "/profile/vmInfo",
      tableKey: 0,
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: "",
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
      columns: [],
      actions: [],
      littleDataSource: {},
      filterForm: [],
      listQuery: {},
      rules: {},
      temp: {},
      viewer: "Pod",
      value: "",
      dialogTableVisible: false,
      createPodJson: {},
      createResource: "创建",
      catalog_kind: "Catalog",
      catalog_operator: "virtualmachine",
      action_kind: "Action",
      action_operator: "virtualmachine",
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
    getColumns(this.tabName).then(response => {
      this.columns = response.data;
      getListAllData({ viewerName: this.tabName }).then(response3 => {
        this.listTemp = response3.data;
        this.listLoading = false;
        console.log(this.listTemp);
        getJsonData({
          kind: this.action_kind,
          operator: this.tabName
        }).then(response => {
          this.actions = response.data;
          for (var i = 0; i < this.listTemp.length; i++) {
            this.list.push({});
            this.list[i].json = this.listTemp[i];
            this.list[i].actions = this.actions;
            this.list[i].val = "";
          }
        });
      });
    });

    getTemp({ viewer: this.viewer }).then(response => {
      this.temp = response.data;
    });
    getLittleDataSource({ viewer: this.viewer }).then(response => {
      this.littleDataSource = response.data;
    });
    getRules({ viewer: this.viewer }).then(response => {
      this.rules = response.data;
    });
    getFilterForm({ viewer: this.viewer }).then(response => {
      this.filterForm = response.data;
    });
  },
  watch: {
    successCreate(val) {
      if (this.successCreate == "success") {
        this.list = [];
        getListAllData({ viewerName: this.tabName }).then(response3 => {
          this.listTemp = response3.data;
          this.listLoading = false;
          console.log(this.listTemp);
          getJsonData({
            kind: this.action_kind,
            operator: this.tabName
          }).then(response => {
            this.actions = response.data;
            for (var i = 0; i < this.listTemp.length; i++) {
              this.list.push({});
              this.list[i].json = this.listTemp[i];
              this.list[i].actions = this.actions;
              this.list[i].val = "";
            }
          });
        });
      }
    }
  },
  methods: {
    showDialog(row) {
      console.log(row);
    },
    createJson() {
      this.dialogTableVisible = true;
      getJsonData({ kind: this.kind, operator: "create" }).then(response => {
        this.value = response.data;
        this.createPodJson = response.data;
        //this.containerVariables = this.value[i].createVariables
      });
    },
    create() {
      this.dialogTableVisible = false;
      var str = this.toRawJson(this.createPodJson);
      createSthFromTemplate({ json: JSON.parse(str), kind: this.kind });
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
    openUrl(row) {
      console.log(row);
      var podName = row.metadata.name;
      var host = this.ip;
      var namespace = row.metadata.namespace;
      window.open(
        "http://" +
          host +
          ":9000?host=" +
          host +
          "&podName=" +
          podName +
          "&namespace=" +
          namespace
      );
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
        deleteSthFromTemplate({
          json: row,
          kind: this.tabName
        }).then(response => {
          if (response.code == 20000) {
            this.handleDelete(row);
          }
        });
      } else {
        queryOperation({
          name: name,
          operator: event,
          kind: this.tabName
        }).then(response => {
          this.Variables = [];
          if (response.hasOwnProperty("data")) {
            if (response.data.spec.hasOwnProperty("lifecycle")) {
              this.lifecycle = true;
              this.createJsonData = response.data;
              if (JSON.stringify(response.data.spec.lifecycle[event]) == "{}") {
                updateSthFromTemplate({
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
              } else {
                  this.dialogTableVisible = true;
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
              }
            }
          } else {
            this.lifecycle = false;
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
        this.createJsonData.spec.lifecycle[this.operator] = temp;
      }

      updateSthFromTemplate({
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
      keys.forEach(element => {
        if (element.indexOf("[") > 0) {
          res = res[element.substring(0, element.indexOf("["))];
          res =
            res[
              parseInt(
                element.substring(
                  element.indexOf("[") + 1,
                  element.indexOf("]")
                )
              )
            ];
        } else {
          if (res.hasOwnProperty(element)) {
            res = res[element];
          } else {
            res = "unknown";
          }
        }
      });
      //console.log(res)
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