<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="listTemp"
      border
      fit
      highlight-current-row
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
    >
      <el-table-column
        key="image"
        label="镜像版本"
        align="left"
      >
        <template slot-scope="scope">
          <router-link
            :to="{path:'imageDetail',query:{kind: catalog_operator, name:scope.row}}"
            tag="a"
            class="link"
          >{{ name +':'+ scope.row.version}}</router-link>
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
  </div>
</template>

<script>
import {
  getObj,
  listAll,
  search,
  updateObj
} from "@/api/commonData";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { mapGetters } from "vuex";
import DynamicForm from "@/components/DynamicForm";
import { getKV } from "@/utils/auth";

export default {
  name: "imageVersion",
  components: { Pagination, DynamicForm },
  data() {
    return {
      list: [],
      listLoading: false,
      columns: [],
      listQuery: {
        page: 1,
        limit: 10,
        continue: 1
      },
      total: 0,
      frontend_kind: "Frontend",
      table_kind: "table",
      catalog_operator: "",
      listTemp: [],
      responseJson: {},
      formsearch_kind: "formsearch",
      namespace: "default",
      name: ""
    };
  },
  mounted() {
   this.catalog_operator = this.$route.query.kind;
    this.name = this.$route.query.name.metadata.name;
    console.log(this.name)
    this.listTemp = this.$route.query.name.spec.versions;
  },
  created() {
    
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

    searchList(message) {
      this.list = [];
      this.listTemp = "";
      //this.total = response3.total
      console.log(message)
      this.listLoading = false;
      search({
        kind: this.catalog_operator,
        labels: message,
        page: 1
      }).then(response => {
        this.listTemp = response.data.items;
        getObj({
          kind: this.frontend_kind,
          name: "action-" + this.catalog_operator.toLowerCase(),
          namespace: "default"
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
        page: this.listQuery.page
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
            namespace: "default"
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
    }
  }
};
</script>

<style scoped>
.link {
  color: red;
  cursor: pointer;
}
a:hover {
  text-decoration: underline;
}
input {
  height: 35px;
}
</style>