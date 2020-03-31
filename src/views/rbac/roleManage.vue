<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新增{{this.$route.meta.name}}</el-button>
    <el-table
      :data="rolesList"
      style="margin-top:30px;"
      border
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
    >
      <el-table-column v-for="item in columns" :key="item.key" :label="item.label" align="center">
        <template slot-scope="scope">
          <span v-if="item.kind == undefined">{{ getInputValue(scope.row,item.row) }}</span>
          <span v-if="item.kind == 'action'">
            <el-button
              v-for="act in actions"
              :key="act.key"
              :type="act.type"
              size="small"
              @click="handle(scope.row,act.value)"
            >{{act.key}}</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      style="width:70%; margin: 0 auto"
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编辑'+this.$route.meta.name:'创建'+this.$route.meta.name"
    >
      <el-form :model="role.model" label-width="80px" label-position="left" :rules="role.rules">
        <el-form-item
          v-for="item in role.items"
          :key="item.key"
          :label="item.label"
          :prop="item.prop"
        >
          <el-input
            v-if="item.type=='input'"
            v-model="role.model[item.prop]"
            :show-password="item.catatype==='password'"
            :placeholder="item.ph"
            :disabled="item.prop==='spec#name'&&dialogType==='edit'"
          />
          <el-tree
            v-if="item.type=='tree'"
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
          <el-select v-if="item.type == 'select'" v-model="role.model[item.prop]" placeholder="请选择">
            <el-option
              v-for="it in item.datasource"
              :key="it.spec.name"
              :label="it.spec.name"
              :value="it.spec.name"
            />
          </el-select>
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
  data() {
    return {
      role: [],
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: "new",
      checkStrictly: false,
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
      formdata: {},
      totalWidth: 0
    };
  },
  computed: {
    routesData() {
      return this.routes;
    }
  },
  mounted() {
    this.getRoutes();
    this.catalog_operator = this.$route.name;
    //this.catalog_operator = "RBACRole";

    getObj({
      kind: this.frontend_kind,
      name: this.form_kind + "-" + this.catalog_operator.toLowerCase(),
      namespace: this.namespace
    }).then(response => {
      this.role = response.data.spec.data;
      for (let i = 0; i < this.role.items.length; i++) {
        if (this.role.items[i].type == "select") {
          console.log(this.role.items[i].getdata);
          listAll({
            kind: this.role.items[i].getdata,
            namespace: getKV("projectNum").toLowerCase()
          }).then(response => {
            console.log(response);
            if (this.validateRes(response) == 1) {
              this.role.items[i].datasource = response.data.items;
              console.log(this.role);
            }
          });
        }
      }
      //console.log(this.role);
    });

    getObj({
      kind: this.frontend_kind,
      name: this.action_kind + "-" + this.catalog_operator.toLowerCase(),
      namespace: this.namespace
    }).then(response => {
      this.actions = response.data.spec.data;
    });

    getObj({
      kind: this.frontend_kind,
      name: this.table_kind + "-" + this.catalog_operator.toLowerCase(),
      namespace: this.namespace
    }).then(response => {
      this.columns = response.data.spec.data;
      for (let i = 0; i < this.columns.length; i++) {
        this.totalWidth += this.columns[i].width;
      }

      listAll({
        kind: this.catalog_operator,
        namespace: getKV("projectNum").toLowerCase()
      }).then(response => {
        if (this.validateRes(response) == 1) {
          for (let i = 0; i < response.data.items.length; i++) {
            if (response.data.items[i].spec.hasOwnProperty("role")) {
              var roletemp = response.data.items[i].spec.role;
              response.data.items[i].spec.role = roletemp.slice(
                roletemp.indexOf("-") + 1,
                roletemp.length
              );
              this.rolesList.push(response.data.items[i]);
            } else {
              this.rolesList = response.data.items;
            }
          }
          console.log(response.data.items);
          //this.rolesList = response.data.items;
        }
      });
    });
  },

  created() {
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

    // async getRoles() {
    //   const res = await getRoles()
    //   this.rolesList = res.data
    //   console.log(this.rolesList)
    // },
    async getRoutes() {
      const res = await getObj({
        kind: "Frontend",
        name: "viewroute-" + getKV("projectNum").toLowerCase()
      });
      this.serviceRoutes = res.data.spec.data;
      this.routes = this.generateRoutes(res.data.spec.data);
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = "/") {
      const res = [];

      for (let route of routes) {
        // skip some route
        if (route.hidden) {
          continue;
        }

        const onlyOneShowingChild = this.onlyOneShowingChild(
          route.children,
          route
        );

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild;
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        };

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path);
        }
        res.push(data);
      }
      return res;
    },

    generateArr(routes) {
      let data = [];
      routes.forEach(route => {
        data.push(route);
        if (route.children) {
          const temp = this.generateArr(route.children);
          if (temp.length > 0) {
            data = [...data, ...temp];
          }
        }
      });
      return data;
    },

    handleAddRole() {
      //this.role = Object.assign({}, defaultRole);
      getObj({
        kind: this.frontend_kind,
        name: this.form_kind + "-" + this.catalog_operator.toLowerCase(),
        namespace: this.namespace
      }).then(response => {
        this.role = response.data.spec.data;
        for (let i = 0; i < this.role.items.length; i++) {
          if (this.role.items[i].type == "select") {
            console.log(this.role.items[i].getdata);
            listAll({
              kind: this.role.items[i].getdata,
              namespace: getKV("projectNum").toLowerCase()
            }).then(response => {
              console.log(response);
              if (this.validateRes(response) == 1) {
                this.role.items[i].datasource = response.data.items;
                //console.log(this.role)
              }
            });
          }
        }
      });

      if (this.$refs.tree) {
        this.$refs.tree[0].setCheckedNodes([]);
      }
      this.dialogType = "new";
      this.dialogVisible = true;
    },

    handle(scope, type) {
      this.formdata = scope;
      if (type == "edit") {
        this.dialogType = type;
        this.dialogVisible = true;
        this.checkStrictly = true;
        //this.role.routes = this.serviceRoutes;
        //console.log(Object.keys(this.role.model));
        let rulesForm = {};
        for (let i = 0; i < this.role.items.length; i++) {
          let temp = this.role.items[i].prop;
          if (temp != "menus") {
            //console.log()

            rulesForm[this.role.items[i].prop] = this.getInputValue(
              scope,
              temp.replace(/#/g, ".")
            );
          }

          this.role.model = { ...rulesForm };
        }
        if (this.catalog_operator == "RBACRole") {
          this.$nextTick(() => {
            //console.log(this.rolesList[index]);
            const routes = this.generateRoutes(scope.spec.routes);

            setTimeout(() => {
              this.$refs.tree[0].setCheckedNodes(this.generateArr(routes));
            }, 200);

            this.checkStrictly = false;
          });
        }
      } else if (type == "delete") {
        this.$confirm("确定删除?", "Warning", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            await removeObj({
              json: scope,
              kind: this.catalog_operator,
              namespace: this.namespace
            });
            this.rolesList = []
            this.handleSuccess();
            listAll({
              kind: this.catalog_operator,
              namespace: getKV("projectNum").toLowerCase()
            }).then(response => {
              if (this.validateRes(response) == 1) {
                for (let i = 0; i < response.data.items.length; i++) {
                  if (response.data.items[i].spec.hasOwnProperty("role")) {
                    var roletemp = response.data.items[i].spec.role;
                    response.data.items[i].spec.role = roletemp.slice(
                      roletemp.indexOf("-") + 1,
                      roletemp.length
                    );
                    this.rolesList.push(response.data.items[i]);
                  } else {
                    this.rolesList = response.data.items;
                  }
                }
              }
            });
          })
          .catch(err => {
            console.error(err);
          });
      }
    },

    generateTree(routes, basePath = "/", checkedKeys) {
      const res = [];

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path);

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(
            route.children,
            routePath,
            checkedKeys
          );
        }

        if (
          checkedKeys.includes(routePath) ||
          (route.children && route.children.length >= 1)
        ) {
          res.push(route);
        }
      }
      return res;
    },
    async confirmRole() {
      const isEdit = this.dialogType === "edit";
      if (this.$refs.tree) {
        var newroutes;
        const checkedKeys = this.$refs.tree[0].getCheckedKeys();
        newroutes = this.generateTree(
          deepClone(this.serviceRoutes),
          "/",
          checkedKeys
        );
      }

      //console.log(this.role.routes)

      if (isEdit) {
        getObj({
          kind: this.catalog_operator,
          name: this.formdata.metadata.name,
          namespace: this.namespace
        }).then(response => {
          var updateJson = response.data;
          console.log(updateJson);
          if (this.catalog_operator == "RBACRole") {
            updateJson.spec.routes = newroutes;
          }

          for (let i = 0; i < this.role.items.length; i++) {
            let temp = this.role.items[i].prop;
            if (temp != "menus") {
              //console.log()
              if(temp == "spec#role") {
                this.setInputValue(updateJson, temp, getKV("projectNum")+'-'+this.role.model[temp])
              }else{
                this.setInputValue(updateJson, temp, this.role.model[temp]);
              }
            }
          }

          updateObj({
            json: updateJson,
            kind: this.catalog_operator,
            namespace: this.namespace
          }).then(response => {
            if (this.validateRes(response) == 1) {
              listAll({
                kind: this.catalog_operator,
                namespace: getKV("projectNum").toLowerCase()
              }).then(response => {
                if (this.validateRes(response) == 1) {
                  this.rolesList = []
                  for (let i = 0; i < response.data.items.length; i++) {
                    if (response.data.items[i].spec.hasOwnProperty("role")) {
                      var roletemp = response.data.items[i].spec.role;
                      response.data.items[i].spec.role = roletemp.slice(
                        roletemp.indexOf("-") + 1,
                        roletemp.length
                      );
                      this.rolesList.push(response.data.items[i]);
                    } else {
                      this.rolesList = response.data.items;
                    }
                  }
                }
              });
              this.handleSuccess();
              this.formdata = {};
            }
          });
        });
      } else {
        getMeta({ kind: this.catalog_operator }).then(response => {
          var createJson;
          createJson = response.data;
          console.log(createJson);
          createJson.spec = {};
          for (let i = 0; i < this.role.items.length; i++) {
            let temp = this.role.items[i].prop;
            if (temp != "menus") {
              //console.log()
              if(temp == "spec#role") {
                this.setInputValue(createJson, temp, getKV("projectNum")+'-'+this.role.model[temp])
              }else{
                this.setInputValue(createJson, temp, this.role.model[temp]);
              }
              
            }
          }
          //createJson.spec["roleName"] = this.role.model["spec#roleName"];
          createJson.metadata.name =
            getKV("projectNum").toLowerCase() +
            "-" +
            this.role.model["spec#name"];
          if (this.catalog_operator == "RBACRole") {
            createJson.spec["routes"] = newroutes;
          }
          createObj({
            json: createJson,
            kind: this.catalog_operator
          }).then(response => {
            if (this.validateRes(response) == 1) {
              this.rolesList = []
              listAll({
                kind: this.catalog_operator,
                namespace: getKV("projectNum").toLowerCase()
              }).then(response => {
                if (this.validateRes(response) == 1) {
                  for (let i = 0; i < response.data.items.length; i++) {
                    if (response.data.items[i].spec.hasOwnProperty("role")) {
                      var roletemp = response.data.items[i].spec.role;
                      response.data.items[i].spec.role = roletemp.slice(
                        roletemp.indexOf("-") + 1,
                        roletemp.length
                      );
                      this.rolesList.push(response.data.items[i]);
                    } else {
                      this.rolesList = response.data.items;
                    }
                  }
                }
              });
              this.handleSuccess();
            }
          });
        });
      }

      this.dialogVisible = false;
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

    handleSuccess() {
      this.$notify({
        title: "Success",
        message: "操作成功",
        type: "success",
        duration: 2000
      });
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null;
      const showingChildren = children.filter(item => !item.hidden);

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0];
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path);
        return onlyOneChild;
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return onlyOneChild;
      }

      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
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
}
</style>
