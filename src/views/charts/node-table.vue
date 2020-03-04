<template>
  <div class="app-container">
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
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      @sort-change="sortChange"
    >
      <el-table-column
        v-for="item in columns"
        :key="item.key"
        :label="item.label"
        
        align="left"
      >
        <template slot-scope="scope">
          <router-link
            :to="{path:'/resourceInfo/metadataInfo',query:{kind: catalog_operator, name:getInputValue(scope.row.json,item.row)}}"
            v-if="item.kind == 'a'"
            tag="a"
            class="link"
            @click="getData"
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
      :visible.sync="udialogTableVisible"
      :title="this.catalog_operator"
      @dragDialog="handleDrag"
    >
      <div class="card-editor-container">
        <json-editor ref="jsonEditor" v-model="createJsonData" />
      </div>
      <div style="width:100%;height:50px;">
        <el-button
          type="primary"
          style="float:right;margin-top:20px;height:40px;display:inline;"
          @click.native="applyOperation"
        >确认</el-button>
      </div>
    </el-dialog>

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
          <p>请填写JSON格式</p>
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
</template>

<script>
import {
  getListAllData,
  getColumns,
  getActions,
  getFilterForm,
  getLittleDataSource,
  getRules,
  getTemp
} from "@/api/commonData";
import { getObj, listAll,removeObj,createObj } from "@/api/commonData";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { mapGetters } from "vuex";
import Bus from "@/utils/Bus";
import JsonEditor from "@/components/JsonEditor";
import elDragDialog from "@/directive/el-drag-dialog";
import { connectTerminal } from "@/api/commonKindMethod";

export default {
  name: "nodeTable",
  components: { Pagination, JsonEditor },
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
      tableKey: 0,
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: "",
      downloadLoading: false,
      columns: [],
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
      ip: "",
      frontend_kind: "Frontend",
      table_kind: "table",
      catalog_operator: "",
      actions: [],
      listTemp: "",
      createJsonData: {},
      dialogTableVisible: false,
      createResource: "创建",
      createRSJson: {},
      udialogTableVisible: false
    };
  },
  mounted() {
    //kind=Frontend&name=table-node
    //route name:frontend_kind-table_kind-catalog_operator
    var str = this.$route.name.split('-')
    if(str.length == 3){
        this.frontend_kind = str[0]
        this.table_kind= str[1]
        this.catalog_operator = str[2]
    }
    else{
        this.frontend_kind = "Frontend"
        this.table_kind= "table"
        this.catalog_operator = this.$route.name
    }
  },
  created() {
    this.catalog_operator = this.$route.name;
    getObj({
      kind: this.frontend_kind,
      name: this.table_kind + "-" + this.catalog_operator.toLowerCase()
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.columns = response.data.spec.data;
        listAll({ kind: this.catalog_operator }).then(response => {
          if (this.validateRes(response) == 1) {
            this.listTemp = response.data;
            //this.total = response3.total
            this.listLoading = false;
            getObj({
              kind: this.frontend_kind,
              name: "action-" + this.catalog_operator.toLowerCase()
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
    deleteMenu() {
      // console.log(constantRoutes[9])
      // constantRoutes.splice(9,1)
      Bus.$emit("deleteMenuTest");
    },
    getData() {
      Bus.$emit("val", this.list);
      console.log("hhhh" + this.list);
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
    handleDrag() {
      this.$refs.select.blur();
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
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
        }
      });
    },
    handleUpdate(event, row) {
      console.log(event);
      this.operator = event;
      var name = row.metadata.name;
      console.log(name)
      if (event == "delete") {
        removeObj({
          json: row,
          kind: this.catalog_operator
        }).then(response => {
          if (response.code == 20000) {
            this.handleDelete(row);
          }
        });
      } else {
        this.udialogTableVisible = true;

        listAll({ kind: this.catalog_operator }).then(response => {
          var data = response.data;
          //this.total = response3.total
          this.listLoading = false;
          for (var i = 0; i < data.length; i++) {
            if (data[i].metadata.name == name) {
              this.createJsonData = data[i];
            }
          }
          console.log(this.createJsonData)
        });
        for (var key in this.list) {
          this.list[key].val = "";
        }
      }
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
createJson() {
      this.dialogTableVisible = true;
      //   getJsonData({kind: this.kind ,operator: 'create'}).then(response => {
      //   this.value = response.data
      //   this.createPodJson = response.data
      //})
    },
    refresh() {
      this.list = []
      getObj({
      kind: this.frontend_kind,
      name: this.table_kind + "-" + this.catalog_operator.toLowerCase()
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.columns = response.data.spec.data;
        listAll({ kind: this.catalog_operator }).then(response => {
          if (this.validateRes(response) == 1) {
            this.listTemp = response.data;
            //this.total = response3.total
            this.listLoading = false;
            getObj({
              kind: this.frontend_kind,
              name: "action-" + this.catalog_operator.toLowerCase()
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
                //console.log(this.list);
              }
            });
          }
        });
      }
    });
    },
    applyOperation() {
      this.udialogTableVisible = false;

      this.createJsonData = JSON.parse(this.createJsonData);

      createObj({
        json: this.createJsonData,
        kind: this.catalog_operator
      }).then(response => {
        if (response.code == 20000) {
          for (var key in this.list) {
            this.list[key].val = "";
          }
          this.handleSuccess();
        }
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

    openTerminal(row) {
      connectTerminal('Pod', row);
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
        if(longKey == "unknown") {
          return '无'
        }else {
          return scope[longKey];
        }   
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
              return res
              if (res == undefined) {
                res = "unknown";
              }
            } else {
              res = "无";
              return res
              throw new Error("notExist");
            }
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
</style>