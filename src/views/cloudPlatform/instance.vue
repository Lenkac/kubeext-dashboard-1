<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:50px">
      <el-button
        icon="el-icon-plus"
        style="float:left"
        type="primary"
        class="filter-item"
        @click.native="createJson"
      >{{this.createResource}}</el-button>
      <el-button
        icon="el-icon-refresh"
        style="float:left;margin-right:20px"
        class="filter-item"
        @click.native="refresh"
      >刷新页面</el-button>
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
      <el-table-column v-for="item in columns" :key="item.key" :label="item.label" align="left">
        <template slot-scope="scope">
          <router-link
            :to="{path:'/resourceInfo/monitor',query:{current: 'instance', account:styleConfig[catalog_operator],name:scope.row.json.metadata.name}}"
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

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

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
        <!-- <p>请填写JSON格式（因版本兼容性约束，请使用以下的group和version信息创建资源）</p> -->
        <json-editor v-if="otherOperation==false" ref="jsonEditor" v-model="createRSJson" />
        <div v-if="otherOperation==true">
          请选择模版：
          <el-select v-model="createModel" @change="(handleModel($event))" placeholder="选择模版">
            <el-option v-for="item in models" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <el-table
          v-if="otherOperation==true"
          :data="CVariables"
          v-loading="listLoading"
          border
          fit
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
              <el-radio-group v-if="row.placeholder == 'bool'" v-model="row.value">
                <el-radio :label="true">true</el-radio>
                <el-radio :label="false">false</el-radio>
              </el-radio-group>
              <input
                style="border-radius:8px;border:1px solid grey;outline:none"
                class="el-input"
                v-if="row.placeholder != 'bool'"
                :placeholder="row.placeholder"
                :value="getInputValue(row,'value')"
                @input="updateInputValue(row,'value',$event.target.value)"
              />
            </template>
          </el-table-column>
        </el-table>
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
import {
  getObj,
  listAll,
  removeObj,
  createObj,
  getMeta,
  search,
  updateObj
} from "@/api/commonData";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { mapGetters } from "vuex";
import Bus from "@/utils/Bus";
import JsonEditor from "@/components/JsonEditor";
import elDragDialog from "@/directive/el-drag-dialog";
import { connectTerminal } from "@/api/commonKindMethod";
import DynamicForm from "@/components/DynamicForm";

export default {
  name: "instance",
  components: { Pagination, JsonEditor, DynamicForm },
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
      listQuery: {
        page: 1,
        limit: 10,
        continue: null
      },
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
      createResource: "创建对象",
      createRSJson: {},
      udialogTableVisible: false,
      responseJson: {},
      formsearch_kind: "formsearch",
      namespace: "default",
      styleConfig: {},
      Variables: [],
      CVariables: [],
      container_kind: "Wizard",
      otherOperation: false,
      models: "",
      createModel: "",
      nameTempVariables: [],
      message: {}
    };
  },
  mounted() {
    //kind=Frontend&name=table-node
    //route name:frontend_kind-table_kind-catalog_operator
    var str = this.$route.name.split("-");
    if (str.length == 3) {
      this.frontend_kind = str[0];
      this.table_kind = str[1];
      this.catalog_operator = str[2];
    } else {
      this.frontend_kind = "Frontend";
      this.table_kind = "table";
      this.catalog_operator = this.$route.name;
    }
  },
  created() {
      this.styleConfig = {
        AliyunVM: {
          logo: "aliyun.jpg",
          kindDes: "Alibaba Cloud",
          name: "Upsilon",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "AliyunVM"
        },
        TencentVM: {
          logo: "tencent.jpg",
          kindDes: "Tencent Cloud",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "TencentVM"
        },
        AmazonVM: {
          logo: "amazon.jpg",
          kindDes: "Amazon Web Services",
          name: "Upsilon",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "AmazonVM"
        },
        BaiduVM: {
          logo: "baidu.png",
          kindDes: "Baidu Cloud",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "BaiduVM"
        },
        JDCloudVM: {
          logo: "jd.png",
          kindDes: "JD Cloud",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "JDCloudVM"
        },
        AzureVM: {
          logo: "azure.png",
          kindDes: "Azure Cloud",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "AzureVM"
        },
        CloudStack: {
          logo: "cloudstack.png",
          kindDes: "CloudStack",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "CloudStack"
        },
        GoogleVM: {
          logo: "google.jpg",
          kindDes: "Google Cloud",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "GoogleVM"
        },
        OpenStack: {
          logo: "openstack.png",
          kindDes: "OpenStack",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "OpenStack"
        },
        Cloudscale: {
          logo: "cloudscale.png",
          kindDes: "Cloudscale",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "Cloudscale"
        },
        GridScale: {
          logo: "gridscale.png",
          kindDes: "GridScale",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "GridScale"
        },
        DigitalOcean: {
          logo: "digitalocean.png",
          kindDes: "DigitalOcean",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "DigitalOcean"
        },
        Gandi: {
          logo: "gandi.png",
          kindDes: "Gandi",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "Gandi"
        },
        Libvirt: {
          logo: "libvirt.png",
          kindDes: "Libvirt",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "Libvirt"
        },
        vCloud: {
          logo: "vcloud.png",
          kindDes: "vCloud",
          name: "Omicron",
          button: "显示实例",
          router: "/resourceInfo/instance",
          kind: "vCloud"
        }
      };
    this.catalog_operator = this.$route.name;
    this.responseJson = this.$route.meta.data;

    getMeta({
      kind: this.catalog_operator
    }).then(response => {
      this.createRSJson = response.data;
    });

    getObj({
      kind: this.frontend_kind,
      name: this.table_kind + "-" + this.catalog_operator.toLowerCase(),
      namespace: this.namespace
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.columns = response.data.spec.data;
        listAll({
          kind: this.catalog_operator
        }).then(response => {
          if (this.validateRes(response) == 1) {
            this.listTemp = response.data.items;
            this.total = response.data.metadata.remainingItemCount + 10;
            this.listQuery.continue = response.data.metadata.continue;
            this.listLoading = false;
            getObj({
              kind: this.frontend_kind,
              name: "action-" + this.catalog_operator.toLowerCase(),
              namespace: this.namespace
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
    },

    searchList(message) {
      this.list = [];
      this.listTemp = "";
      //this.total = response3.total
      this.listLoading = false;
      search({
        kind: this.catalog_operator,
        fieldSelector: message
      }).then(response => {
        this.listTemp = response.data.items;
        getObj({
          kind: this.frontend_kind,
          name: "action-" + this.catalog_operator.toLowerCase(),
          namespace: this.namespace
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
      });
    },

    getList() {
      this.listLoading = true;
      this.list = [];
      listAll({
        kind: this.catalog_operator,
        limit: this.listQuery.limit,
        nextId: this.listQuery.continue
      }).then(response => {
        if (this.validateRes(response) == 1) {
          this.listTemp = response.data.items;
          //this.total = response.data.metadata.remainingItemCount + 10
          //this.listQuery.page = this.listQuery.page + 1
          this.listQuery.continue = response.data.metadata.continue;
          this.listLoading = false;
          getObj({
            kind: this.frontend_kind,
            name: "action-" + this.catalog_operator.toLowerCase(),
            namespace: this.namespace
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

    handleModel(event) {
      getObj({
        kind: this.container_kind + "Template",
        name: this.catalog_operator.toLowerCase() + "-create." + event
      }).then(response => {
        if (response.code == 20000) {
          this.otherOperation = true;
          this.createRSJson = response.data.spec.data.template;
          this.CVariables = [];
          if (response.hasOwnProperty("data")) {
            var nameVariables = response.data.spec.data.values;
            this.nameTempVariables = response.data.spec.data.values;
            for (var i = 0; i < nameVariables.length; i++) {
              this.CVariables.push({});
              this.CVariables[i].nameVariable = nameVariables[i].name;
              if (nameVariables[i].id.indexOf(",") > 0) {
                this.CVariables[i].id = nameVariables[i].id.substring(
                  0,
                  nameVariables[i].id.indexOf(",")
                );
              } else {
                this.CVariables[i].id = nameVariables[i].id;
              }
              this.CVariables[i].type = nameVariables[i].type;
              if (nameVariables[i].type == "bool") {
                this.CVariables[i].value = true;
                this.CVariables[i].placeholder = nameVariables[i].type;
              } else {
                this.CVariables[i].value = "";
                this.CVariables[i].placeholder = nameVariables[i].type;
              }
            }
          }
        }
      });
    },
    
    handleUpdate(event, row) {
      this.operator = event;
      var name = row.metadata.name;
      if (row.metadata.namespace != undefined) {
        this.namespace = row.metadata.namespace;
      }

      if (event == "delete") {
        removeObj({
          json: row,
          kind: this.catalog_operator,
          namespace: this.namespace
        }).then(response => {
          if (this.validateRes(response) == 1) {
            this.handleDelete(row);
          }
        });
      } else if (event.slice(event.length - 8) == "Instance") {
        getObj({
          name: name,
          kind: this.catalog_operator,
          namespace: this.namespace
        }).then(response => {
          this.createJsonData = response.data;
          this.createJsonData.spec.lifecycle = {};
          this.createJsonData.spec.lifecycle[event + "Request"] = {};
          this.createJsonData.spec.lifecycle[event + "Request"].instanceId =
            response.data.spec.data.instances[0].instanceId;
          updateObj({
            json: this.createJsonData,
            kind: this.catalog_operator,
            namespace: this.namespace
          }).then(response => {
            if (response.code == 20000) {
              for (var key in this.list) {
                this.list[key].val = "";
              }
              //this.handleSuccess();
              if (event == "startInstance") {
                // this.listLoading = true;
                // var id = setInterval(
                //   function() {
                //     getObj({
                //       name: name,
                //       kind: this.catalog_operator,
                //       namespace: this.namespace
                //     }).then(response => {
                //       if (
                //         response.data.spec.data.instances[0].status == "Staring"
                //       ) {
                //         this.getList();
                //         clearInterval(id);
                //       }
                //     });
                //   }.bind(this),
                //   2 * 1000
                // );
              } else {
                this.handleSuccess();
              }
            }
          });
        });
      } else {
        this.udialogTableVisible = true;

        getObj({
          name: name,
          kind: this.catalog_operator,
          namespace: this.namespace
        }).then(response => {
          this.listLoading = false;
          this.createJsonData = response.data;
          console.log(this.createJsonData);
        });
        for (var key in this.list) {
          this.list[key].val = "";
        }
      }
    },
    create() {
      this.dialogTableVisible = false;

      //console.log(createJsonDataTmp);
      //this.createRSJson = JSON.parse(this.createRSJson);
      for (let key in this.CVariables) {
        //var createJsonDataTmp = this.createRSJson;
        console.log(this.CVariables);
        console.log(createJsonDataTmp);
        if (this.nameTempVariables[key].id.indexOf(",") > 0) {
          var outerlongkey = this.nameTempVariables[key].id.split(",");
        } else {
          var outerlongkey = [];
          outerlongkey.push(this.nameTempVariables[key].id);
          console.log(outerlongkey);
        }

        for (let j = 0; j < outerlongkey.length; j++) {
          var createJsonDataTmp = this.createRSJson;
          var longkey = outerlongkey[j].split(".");

          //console.log(longkey)

          for (let i = 0; i < longkey.length - 1; i++) {
            //console.log(longkey[i]);
            if (longkey[i].indexOf("[") > 0) {
              createJsonDataTmp =
                createJsonDataTmp[
                  longkey[i].substring(0, longkey[i].indexOf("["))
                ];
              createJsonDataTmp =
                createJsonDataTmp[
                  parseInt(
                    longkey[i].substring(
                      longkey[i].indexOf("[") + 1,
                      longkey[i].indexOf("]")
                    )
                  )
                ];
              //console.log(createJsonDataTmp);
            } else {
              createJsonDataTmp = createJsonDataTmp[longkey[i]];
              //console.log(createJsonDataTmp);
            }
          }

          if (longkey[longkey.length - 1].indexOf("[") > 0) {
            createJsonDataTmp =
              createJsonDataTmp[
                longkey[longkey.length - 1].substring(
                  0,
                  longkey[longkey.length - 1].indexOf("[")
                )
              ];

            if (this.CVariables[key].type == "integer") {
              createJsonDataTmp[
                parseInt(
                  longkey[longkey.length - 1].substring(
                    longkey[longkey.length - 1].indexOf("[") + 1,
                    longkey[longkey.length - 1].indexOf("]")
                  )
                )
              ] = Number(this.CVariables[key].value);
            } else {
              createJsonDataTmp[
                parseInt(
                  longkey[longkey.length - 1].substring(
                    longkey[longkey.length - 1].indexOf("[") + 1,
                    longkey[longkey.length - 1].indexOf("]")
                  )
                )
              ] = this.CVariables[key].value;
            }
          } else if (this.CVariables[key].type == "integer") {
            createJsonDataTmp[longkey[longkey.length - 1]] = Number(
              this.CVariables[key].value
            );
          } else {
            createJsonDataTmp[longkey[longkey.length - 1]] = this.CVariables[
              key
            ].value;
            console.log(key);
            console.log(this.CVariables[key].value);
          }
        }
        //var longkey = this.CVariables[key].id.split(".");
      }

      if(typeof(this.createRSJson) == 'string'){
        this.createRSJson = JSON.parse(this.createRSJson)
      }
      createObj({
        json: this.createRSJson,
        kind: this.createRSJson.kind
      }).then(response => {
        if (this.validateRes(response) == 1) {
          if (response.code == 20000) {
            this.handleSuccess();
            this.successCreate = "success";
            this.refresh();
          } else {
          }
        }
      });
    },
    createJson() {
      this.dialogTableVisible = true;
      getObj({
        kind: this.container_kind + "Template",
        name: this.catalog_operator.toLowerCase() + "-" + "create"
      }).then(response => {
        if (response.code == 20000) {
          this.otherOperation = true;
          this.models = response.data.spec.data.support;
        }
      })
      //   getJsonData({kind: this.kind ,operator: 'create'}).then(response => {
      //   this.value = response.data
      //   this.createPodJson = response.data
      //})
    },
    refresh() {
      this.list = [];
      getObj({
        kind: this.frontend_kind,
        name: this.table_kind + "-" + this.catalog_operator.toLowerCase(),
        namespace: this.namespace
      }).then(response => {
        if (this.validateRes(response) == 1) {
          this.columns = response.data.spec.data;
          listAll({
            kind: this.catalog_operator,
            limit: this.listQuery.limit,
            nextId: null,
            namespace: this.namespace
          }).then(response => {
            if (this.validateRes(response) == 1) {
              this.listTemp = response.data.items;
              //this.total = response3.total
              this.listLoading = false;
              getObj({
                kind: this.frontend_kind,
                name: "action-" + this.catalog_operator.toLowerCase(),
                namespace: this.namespace
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

      var temp = {};
      if (typeof this.createJsonData == "string") {
        this.createJsonData = JSON.parse(this.createJsonData);
      }

      var createJsonDataTmp = this.createJsonData;
      for (let key in this.Variables) {
        var longkey = this.Variables[key].id.split(".");
        for (let i = 0; i < longkey.length - 1; i++) {
          createJsonDataTmp = createJsonDataTmp[longkey[i]];
          console.log(this.createJsonData);
        }
        if (this.Variables[key].type == "integer") {
          createJsonDataTmp[longkey[longkey.length - 1]] = Number(
            this.Variables[key].value
          );
        } else {
          createJsonDataTmp[longkey[longkey.length - 1]] = this.Variables[
            key
          ].value;
        }
      }
      //this.createJsonData = JSON.parse(this.createJsonData);

      updateObj({
        json: this.createJsonData,
        kind: this.catalog_operator,
        namespace: this.namespace
      }).then(response => {
        if (response.code == 20000) {
          this.getList();
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
      connectTerminal("Pod", row);
    },

    updateData() {},
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
        if (longKey == "unknown") {
          return "无";
        } else {
          return scope[longKey];
        }
      }
      var keys = longKey.split(".");
      var res = scope;
      keys.forEach(element => {
        if (element.indexOf("[") > 0) {
          res = res[element.substring(0, element.indexOf("["))];
          if (res == undefined) {
            res = "unknown";
          } else if (res.length == 0) {
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
            return res;
            if (res == undefined) {
              res = "unknown";
            }
          } else {
            res = "无";
            return res;
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