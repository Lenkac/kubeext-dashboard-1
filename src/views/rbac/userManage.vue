<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新增角色</el-button>
    <el-table :data="rolesList" style="width: 700px;margin-top:30px;" border>
      <el-table-column
        v-for="(item,index) in columns"
        :key="item.key"
        :label="item.label"
        align="center"
        :width="item.width"
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'创建角色'">
      <el-form :model="role.model" label-width="80px" label-position="left">
        <el-form-item v-for="item in role.items" :key="item.key" :label="item.label">
          <el-input
            v-if="item.type=='input'"
            v-model="role.model[item.prop]"
            :placeholder="role.model[item.ph]"
            :disabled="dialogType==='edit'"
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
      index: null
    };
  },
  computed: {
    routesData() {
      return this.routes;
    }
  },
  mounted() {
    this.getRoutes();
    //this.catalog_operator = this.$route.name;
    this.catalog_operator = "RBACRole";

    getObj({
      kind: this.frontend_kind,
      name: this.form_kind + "-" + this.catalog_operator.toLowerCase(),
      namespace: this.namespace
    }).then(response => {
      this.role = response.data.spec.data;
      console.log(this.role);
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
      listAll({
        kind: this.catalog_operator
      }).then(response => {
        if (this.validateRes(response) == 1) {
          this.rolesList = response.data.items;
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
      });

      if (this.$refs.tree) {
        this.$refs.tree[0].setCheckedNodes([]);
      }
      this.dialogType = "new";
      this.dialogVisible = true;
    },

    handle(scope, type, index) {
      this.index = index;
      if (type == "edit") {
        this.dialogType = type;
        this.dialogVisible = true;
        this.checkStrictly = true;
        //this.role.routes = this.serviceRoutes;
        console.log(scope.row);
        //console.log(Object.keys(this.role.model));
        for (let i = 0; i < this.role.items.length; i++) {
          let temp = this.role.items[i].prop;
          if (temp != "menus") {
            //console.log()

            this.role.model[this.role.items[i].prop] = this.getInputValue(
              scope.row,
              temp.replace(/#/g, ".")
            );
          }
        }

        this.$nextTick(() => {
          console.log(this.rolesList[index]);
          const routes = this.generateRoutes(this.rolesList[index].spec.routes);

          setTimeout(() => {
            this.$refs.tree[0].setCheckedNodes(this.generateArr(routes));
          }, 200);

          this.checkStrictly = false;
        });
      } else if (type == "delete") {
        this.$confirm("确定删除该角色?", "Warning", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            await removeObj({
              json: scope.row,
              kind: this.catalog_operator,
              namespace: this.namespace
            });

            this.rolesList.splice(index, 1);
            this.handleSuccess()
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

      const checkedKeys = this.$refs.tree[0].getCheckedKeys();
      const newroutes = this.generateTree(
        deepClone(this.serviceRoutes),
        "/",
        checkedKeys
      );
      //console.log(this.role.routes)

      if (isEdit) {
        console.log(this.rolesList);
        getObj({
          kind: this.catalog_operator,
          name: this.rolesList[this.index].metadata.name,
          namespace: this.namespace
        }).then(response => {
          var updateJson = response.data;
          updateJson.spec.routes = newroutes;

          for (let i = 0; i < this.role.items.length; i++) {
            let temp = this.role.items[i].prop;
            if (temp != "menus" && temp != "spec#roleName") {
              //console.log()

              this.setInputValue(updateJson, temp, this.role.model[temp]);
            }
          }

          updateObj({
            json: updateJson,
            kind: this.catalog_operator,
            namespace: this.namespace
          }).then(response => {
            if (this.validateRes(response) == 1) {
              listAll({
                kind: this.catalog_operator
              }).then(response => {
                if (this.validateRes(response) == 1) {
                  this.rolesList = response.data.items;
                }
              });
              this.handleSuccess()
            }    
          });
        });
      } else {
        getMeta({ kind: this.catalog_operator }).then(response => {
          var createJson;
          createJson = response.data;
          console.log(createJson);
          createJson.spec = {};
          createJson.spec["roleName"] = this.role.model["spec#roleName"];
          createJson.metadata.name =
            getKV("projectNum").toLowerCase() +
            "-" +
            this.role.model["spec#roleName"];
          createJson.spec["routes"] = newroutes;
          createObj({
            json: createJson,
            kind: this.catalog_operator
          }).then(response => {
            if (this.validateRes(response) == 1) {
              listAll({
                kind: this.catalog_operator
              }).then(response => {
                if (this.validateRes(response) == 1) {
                  this.rolesList = response.data.items;
                }
              });
              this.handleSuccess()
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
