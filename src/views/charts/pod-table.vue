<template>
  <div class="app-container">
    <div style="width:70%;float:left">
      <div class="filter-container" style="margin-bottom:50px">
        <el-button
          style="float:left"
          type="primary"
          class="filter-item"
          @click.native="createJson"
        >{{this.createResource}}</el-button>
        <el-button
          style="float:left;margin-right:20px"
          type="primary"
          class="filter-item"
          @click.native="refresh"
        >刷新</el-button>
      </div>

      <div class="tab-container">
        <el-tabs
          v-model="outActiveName"
          style="margin-top:15px;width:100%"
          type="border-card"
          @tab-click="outHandleClick"
        >
          <el-tab-pane
            v-for="item in outTabMapOptions"
            :key="item.key"
            :label="item.label"
            :name="item.key"
          >
            <keep-alive>
              <div class="tab-container" v-if="outActiveName==item.key">
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
                      <tab-pane
                        v-if="activeName==item.key"
                        :type="item.key"
                        :tabName="item.key"
                        :successCreate="successCreate"
                        :resourceInfo="resourceInfo"
                        :catalog_operator="outActiveName"
                      />
                    </keep-alive>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </div>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item
            v-for="efi in columns"
            :key="efi.key"
            :label="efi.label"
            :prop="efi.row"
            :style="efi.itemStyle"
          >
            <el-input
              v-if="efi.type == 'input'"
              v-model="temp[efi.row]"
              :placeholder="efi.ph"
              :style="efi.style"
            />
            <el-select
              v-if="efi.type == 'select'"
              v-model="temp[efi.row]"
              :placeholder="efi.ph"
              :style="efi.style"
            >
              <el-option
                v-for="lds in littleDataSource[efi.dataSource]"
                :key="lds.key"
                :label="lds.label"
                :value="lds.value"
              />
            </el-select>
            <el-input
              v-if="efi.type == undefined"
              v-model="temp[efi.row]"
              :placeholder="efi.ph"
              :style="efi.style"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogTableVisible"
        :title="this.createResource"
        @dragDialog="handleDrag"
      >
        <div class="card-editor-container">
          <json-editor ref="jsonEditor" v-model="createRSJson" />
          <div style="width:100%;height:50px;">
            <el-button
              type="primary"
              style="float:right;margin-top:20px;height:40px;display:inline;"
              @click.native="create"
            >确认</el-button>
            <!-- <el-button type="primary" style="float:right;margin-top:20px;height:40px;display:inline;margin-right:0px;" >取消</el-button> -->
          </div>
        </div>
      </el-dialog>
    </div>
    <div style="width:30%;float:left">
      <timeline />
    </div>
  </div>
</template>

<script>
import { getObj, createObj } from "@/api/commonData";
import waves from "@/directive/waves"; // waves directive
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
import tabPane from "./PodTabPane";
import timeline from "@/components/timeline";

export default {
  name: "podTable",
  components: { Pagination, JsonEditor, tabPane, timeline },
  directives: { waves, elDragDialog },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: "",
      columns: [],
      actions: [],
      littleDataSource: {},
      filterForm: [],
      listQuery: {},
      total: 0,
      rules: {},
      temp: {},
      textMap: {
        update: "更新数据",
        create: "创建新记录"
      },
      value: "",
      dialogTableVisible: false,
      createRSJson: {},
      createResource: "创建",
      frontend_kind: "Frontend",
      catalog_operator: "container",
      outcatalog_operator: "lifecycle",
      catalog_kind: "catalog",
      tabMapOptions: [],
      outTabMapOptions: [],
      activeName: "",
      outActiveName: "",
      kind: "",
      createdTimes: 0,
      successCreate: "",
      resourceInfo: ""
    };
  },
  mounted() {},
  created() {
    
    // this.catalog_operator = this.$route.name;
    if(this.$route.query.name == undefined) {
      this.outcatalog_operator = this.$route.meta.tabName;
    }else {
      this.outcatalog_operator = this.$route.query.name;
    }   
    console.log(this.outcatalog_operator)

    getObj({
      kind: this.frontend_kind,
      name: this.catalog_kind + "-" + this.outcatalog_operator.toLowerCase()
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.outTabMapOptions = response.data.spec.data.tabMapOptions;
        this.outActiveName = response.data.spec.data.activeName;
        this.resourceInfo = this.$route.meta.resourceInfo[this.outActiveName];
        getObj({
          kind: this.frontend_kind,
          name: this.catalog_kind + "-" + this.outActiveName.toLowerCase()
        }).then(response => {
          if (this.validateRes(response) == 1) {
            this.tabMapOptions = response.data.spec.data.tabMapOptions;
            this.activeName = response.data.spec.data.activeName;
          }
        });
      }
    });
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

    outHandleClick(tab, event) {
      console.log(tab.name, event);
      this.kind = tab.name;
      console.log(this.kind);
      this.outActiveName = tab.name;
      this.resourceInfo = this.$route.meta.resourceInfo[this.outActiveName];
      getObj({
        kind: this.frontend_kind,
        name: this.catalog_kind + "-" + tab.name.toLowerCase()
      }).then(response => {
        if (this.validateRes(response) == 1) {
          if (!response.hasOwnProperty("data")) {
            this.tabMapOptions = null;
            this.activeName = "";
          } else {
            this.tabMapOptions = response.data.spec.data.tabMapOptions;
            this.activeName = response.data.spec.data.activeName;
          }
        }
      });
    },

    handleClick(tab, event) {
      console.log(tab.name, event);
      this.kind = tab.name;
      console.log(this.kind);
    },
    showDialog(row) {
      this.dialogTableVisible = true;
      var podName = row.metadata.name;
    },
    createJson() {
      this.dialogTableVisible = true;
      //   getJsonData({kind: this.kind ,operator: 'create'}).then(response => {
      //   this.value = response.data
      //   this.createPodJson = response.data
      //})
    },
    refresh() {
      this.successCreate = "success";
      setTimeout(
        function() {
          this.successCreate = "fail";
        }.bind(this),
        500
      );
    },
    create() {
      this.dialogTableVisible = false;
      createObj({
        json: JSON.parse(this.createRSJson),
        kind: JSON.parse(this.createRSJson).kind
      }).then(response => {
        if (this.validateRes(response) == 1) {
          if (response.code == 20000) {
            this.handleSuccess();
            this.successCreate = "success";
            this.refresh();
          }
        }
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
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleSuccess() {
      this.$notify({
        title: "Success",
        message: "操作成功",
        type: "success",
        duration: 2000
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
        }
      });
    },
    handleUpdate(row, event) {
      if (event === "update") {
        this.temp = Object.assign({}, row); // copy obj
        //this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      }
      if (event === "delete") {
        this.handleDelete(row);
      }
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
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

    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
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
          } else [(res = "unknown")];
        }
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
    },
    deleteMenu() {
      // console.log(constantRoutes[9])
      // constantRoutes.splice(9,1)
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