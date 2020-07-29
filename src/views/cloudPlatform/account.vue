<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:50px">
      <el-button
        icon="el-icon-plus"
        style="float:left"
        type="primary"
        class="filter-item"
        @click.native="handleAddAccount"
      >{{this.createResource}}</el-button>
      <el-button
        icon="el-icon-refresh"
        style="float:left;margin-right:20px"
        class="filter-item"
        @click.native="refresh"
      >刷新页面</el-button>
    </div>
    <el-table :data="rolesList" border :header-cell-style="{background:'#eef1f6',color:'#606266'}">
      <el-table-column
        v-for="(item,index) in columns"
        :key="item.key"
        :label="item.label"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="item.kind == undefined">{{ getInputValue(scope.row,item.row) }}</span>
          <span v-if="item.kind == 'action'">
            <el-button
              v-for="act in actions"
              :key="act.key"
              :type="act.type"
              size="small"
              @click="handle(scope,act.value,index)"
            >{{act.key}}</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑账户':'创建账户'">
      <el-form
        :validate-on-rule-change="false"
        :model="cloud.model"
        label-width="100px"
        label-position="left"
        :rules="cloud.rules"
      >
        <el-form-item
          v-for="item in cloud.items"
          :key="item.key"
          :label="item.label"
          :prop="item.prop"
        >
          <el-input
            v-if="item.type=='input'"
            v-model="cloud.model[item.prop]"
            :show-password="item.catatype==='password'"
            :placeholder="item.ph"
            :disabled="dialogType==='edit'"
          />
          <el-radio-group
            v-if="item.type=='radio-group'"
            v-model="cloud.model[item.prop]"
            @change="chooseCloud"
            :disabled="dialogType==='edit'"
          >
            <el-radio-button
              style="margin-right:10px;margin-bottom:10px"
              v-for="pic in cloud.datasource"
              :key="pic.key"
              :label="pic.value"
            >
              <div
                :class="(dialogType=='edit' && currentCloud!=pic.value) ? 'gray':''"
                style="width:160px;height:160px;background-size: cover;position:relative;"
                :style="{backgroundImage: 'url(' + require('@/assets/images/'+pic.logo) + ')'}"
              >
                <p style="position:absolute;width:100%;
  bottom:10px;">{{pic.label}}</p>
              </div>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-for="content in accountform[0].account"
          :key="content.key"
          :label="content.label"
          :prop="content.prop"
        >
          <el-input
            v-model="content[content.prop]"
            :show-password="content.catatype==='password'"
            :placeholder="content.ph"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
import {
  getRoutes,
  getRoles,
  addRole,
  deleteRole,
  updateRole
} from "@/api/role";
import {
  getObj,
  listAll,
  removeObj,
  createObj,
  getMeta,
  updateObj
} from "@/api/commonData";
import { getKV } from "@/utils/auth";
import DynamicForm from "@/components/DynamicForm";
const defaultRole = {
  name: "",
  routes: []
};

export default {
  components: { DynamicForm },
  computed: {
    accountform: function() {
      if (this.cloud.datasource) {
        var cloudkind = this.cloud_kind;
        return this.cloud.datasource.filter(function(item) {
          console.log(item.value);
          //console.log(this.cloud_kind)
          return item.value == cloudkind;
        });
      }
    }
  },
  data() {
    return {
      cloud: [],
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: "new",
      defaultProps: {
        children: "children",
        label: "title"
      },
      columns: [],
      table_kind: "table",
      frontend_kind: "Frontend",
      actions: [],
      action_kind: "action",
      form_kind: "form",
      namespace: "default",
      index: null,
      createResource: "添加云账户",
      cloudController_kind: "CloudController",
      cloudConfig: [],
      cloud_kind: "aliyunvm",
      template_kind: "template",
      currentCloud: "aliyunvm"
    };
  },
  mounted() {},

  created() {
    this.styleConfig = {
      AliyunVM: {
        logo: "aliyun.jpg",
        kindDes: "Alibaba Cloud",
        name: "Upsilon",
        button: "显示实例",
        router: "/resourceInfo/instance"
      },
      TencentVM: {
        logo: "tencent.jpg",
        kindDes: "Tencent Cloud",
        name: "Omicron",
        button: "显示实例",
        router: "/resourceInfo/instance"
      },
      AmazonVM: {
        logo: "amazon.jpg",
        kindDes: "Amazon Web Services",
        name: "Upsilon",
        button: "显示实例",
        router: "/resourceInfo/instance"
      },
      BaiduVM: {
        logo: "baidu.png",
        kindDes: "Baidu Cloud",
        name: "Omicron",
        button: "显示实例",
        router: "/resourceInfo/instance"
      },
      JDCloudVM: {
        logo: "jd.png",
        kindDes: "JD Cloud",
        name: "Omicron",
        button: "显示实例",
        router: "/resourceInfo/instance"
      }
    };

    if (this.$route.meta.data) {
      this.cloud = this.$route.meta.data;
      getObj({
        kind: this.frontend_kind,
        name: this.template_kind + "-" + "aliyunvm",
        namespace: this.namespace
      }).then(response => {
        this.json = response.data.spec.data;
      });
    } else {
      getObj({
        kind: this.frontend_kind,
        name: this.form_kind + "-" + this.cloudController_kind.toLowerCase(),
        namespace: this.namespace
      }).then(response => {
        this.cloud = response.data.spec.data;
      });
    }

    getObj({
      kind: this.frontend_kind,
      name: this.action_kind + "-" + this.cloudController_kind.toLowerCase(),
      namespace: this.namespace
    }).then(response => {
      this.actions = response.data.spec.data;
    });

    getObj({
      kind: this.frontend_kind,
      name: this.table_kind + "-" + this.cloudController_kind.toLowerCase(),
      namespace: this.namespace
    }).then(response => {
      this.columns = response.data.spec.data;
      listAll({
        kind: this.cloudController_kind,
        limit: 15
      }).then(response => {
        if (this.validateRes(response) == 1) {
          this.rolesList = response.data.items;
        }
      });
    });
    // Mock: get all routes and roles list from server
    //this.getRoles()
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

    handleAddAccount() {
      //this.role = Object.assign({}, defaultRole);
      getObj({
        kind: this.frontend_kind,
        name: this.form_kind + "-" + this.cloudController_kind.toLowerCase(),
        namespace: this.namespace
      }).then(response => {
        this.cloud = response.data.spec.data;
      });

      this.dialogType = "new";
      this.dialogVisible = true;
    },

    handle(scope, type, index) {
      this.cloud_kind = scope.row.spec.data.kind.toLowerCase();
      this.index = scope;
      this.currentCloud = scope.row.spec.data.kind.toLowerCase();
      console.log(this.index);
      if (type == "edit") {
        this.dialogType = type;
        this.dialogVisible = true;
        this.cloud.model.name = scope.row.metadata.name;
        this.cloud.model.provider = scope.row.spec.data.kind.toLowerCase();
        for (let i = 0; i < this.accountform[0].account.length; i++) {
            
          let temp = this.accountform[0].account[i];
          this.accountform[0].account[i][temp.prop] =
            scope.row.spec.data.account[temp.prop];
            console.log(this.accountform[0].account[i])
        }
      } else if (type == "delete") {
        this.$confirm("确定删除该账户?", "Warning", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            await removeObj({
              json: scope.row,
              kind: this.cloudController_kind,
              namespace: this.namespace
            });
            listAll({
              kind: this.cloudController_kind
            }).then(response => {
              if (this.validateRes(response) == 1) {
                this.rolesList = response.data.items;
              }
            });

            this.handleSuccess();
          })
          .catch(err => {
            console.error(err);
          });
      }
    },

    async confirmRole() {
      const isEdit = this.dialogType === "edit";

      console.log(this.index);
      if (isEdit) {
        //console.log(this.rolesList);
        getObj({
          kind: this.cloudController_kind,
          name: this.index.row.metadata.name,
          namespace: this.namespace
        }).then(response => {
          var updateJson = response.data;
          console.log(updateJson);
          updateJson.metadata.name = this.cloud.model.name;
          for (let i = 0; i < this.accountform[0].account.length; i++) {
            let temp = this.accountform[0].account[i];
            updateJson.spec.data.account[
              temp.prop
            ] = this.accountform[0].account[i][temp.prop];
          }

          updateObj({
            json: updateJson,
            kind: this.cloudController_kind,
            namespace: this.namespace
          }).then(response => {
            if (this.validateRes(response) == 1) {
              listAll({
                kind: this.cloudController_kind
              }).then(response => {
                if (this.validateRes(response) == 1) {
                  this.rolesList = response.data.items;
                }
              });
              this.handleSuccess();
            }
          });
        });
      } else {
        this.json.metadata.name = this.cloud.model["name"];
        var accounttemp = this.accountform[0].account;
        for (let i = 0; i < accounttemp.length; i++) {
          this.json.spec.data.account[accounttemp[i].prop] =
            accounttemp[i][accounttemp[i].prop];
        }
        createObj({
          json: this.json,
          kind: this.cloudController_kind
        }).then(response => {
          if (response.code == 20000) {
            this.dialogTableVisible = false;
            this.handleSuccess();
            listAll({
              kind: this.cloudController_kind
            }).then(response => {
              if (this.validateRes(response) == 1) {
                this.rolesList = response.data.items;
              }
            });
          }

          getObj({
            kind: this.frontend_kind,
            name:
              this.form_kind + "-" + this.cloudController_kind.toLowerCase(),
            namespace: this.namespace
          }).then(response => {
            this.cloud = response.data.spec.data;
          });
        });
      }
      this.dialogVisible = false;
    },

    refresh() {
      window.location.reload();
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

    setInputValue(scope, longKey, value) {
      if (longKey.indexOf("#") < 0) {
        scope.longKey = value;
      } else {
        var keys = longKey.split("#");
        scope[keys[0]][keys[1]] = value;
      }
    },

    chooseCloud(val) {
      //console.log(val);
      this.cloud_kind = val;
      getObj({
        kind: this.frontend_kind,
        name: this.template_kind + "-" + val,
        namespace: this.namespace
      }).then(response => {
        this.json = response.data.spec.data;
      });
    },

    handleSuccess() {
      this.$notify({
        title: "Success",
        message: "操作成功",
        type: "success",
        duration: 2000
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-radio-button__orig-radio:checked {
    color: skyblue;
}
.gray {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);

  filter: gray;
}

.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
  .el-form-item-hidden {
    display: none;
  }

  .el-radio-button__orig-radio:checked {
    color: lightblue;
  }
}
</style>
