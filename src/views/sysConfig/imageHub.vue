<template>
  <div class="app-container">
    <div>
      <dynamic-form :formData="responseJson" :kind="catalog_operator" @watchSearch="searchList"></dynamic-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="listTemp"
      border
      fit
      highlight-current-row
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
    >
      <el-table-column
        v-for="item in columns"
        :key="item.key"
        :label="item.label"
        align="left"
        :width="item.width"
      >
        <template slot-scope="scope">
          <router-link
            :to="{path:'/resourceInfo/imageVersion',query:{kind: catalog_operator, name:scope.row}}"
            v-if="item.kind == 'a'"
            tag="a"
            class="link"
          >{{ getInputValue(scope.row,item.row) }}</router-link>
          <span v-if="item.kind == undefined">{{ scope.row.spec.versions.length }}</span>
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
  name: "imageHub",
  components: { Pagination, DynamicForm },
  data() {
    return {
      list: [],
      listLoading: true,
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
    };
  },
  mounted() {
   
  },
  created() {
    this.catalog_operator = this.$route.name;
    this.responseJson = this.$route.meta.data;

    getObj({
      kind: this.frontend_kind,
      name: this.formsearch_kind + "-" + this.catalog_operator.toLowerCase(),
      namespace: "default"
    }).then(response => {
      this.responseJson = response.data.spec.data;
    });

    getObj({
      kind: this.frontend_kind,
      name: this.table_kind + "-" + this.catalog_operator.toLowerCase(),
      namespace: "default"
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.columns = response.data.spec.data;
        listAll({
          kind: this.catalog_operator,
          limit: this.listQuery.limit,
          page: this.listQuery.continue
        }).then(response => {
          if (this.validateRes(response) == 1) {
            this.listTemp = response.data.items;
            console.log(this.listTemp)
            this.total = response.data.metadata.totalCount;
            this.listQuery.continue = response.data.metadata.continue;
            this.listLoading = false;
              
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