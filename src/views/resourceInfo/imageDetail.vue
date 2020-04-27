<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="listTemp"
      border
      fit
      highlight-current-row
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="margin-left:15px"
    >
      <el-table-column
        v-for="item in columns"
        :key="item.key"
        :label="item.label"
        align="left"
        :width="item.width"
      >
        <template slot-scope="scope">
          <span v-if="item.row!='size'">{{ getInputValue(scope.row,item.row) }}</span>
          <span v-if="item.row=='size'">{{ handleSize(getInputValue(scope.row,item.row)) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-card
      v-for="item in list"
      :key="item[Object.keys(item)[0]]"
      class="box-card"
      style="width:100%;margin: 15px 15px"
    >
      <p style="font-size:16px;">
        <strong>{{Object.keys(item)[0]}}</strong>
      </p>
      <div class="chart-wrapper">
        <el-table
          :data="Object.keys(JSON.parse(item[Object.keys(item)[0]]))"
          style="width: 80%;padding-top: 15px;"
        >
          <el-table-column label="名称" min-width="200">
            <template slot-scope="{row}">{{row}}</template>
          </el-table-column>
          <el-table-column label="内容" width="800" align="left">
            <template slot-scope="{row}">{{ JSON.parse(item[Object.keys(item)[0]])[row] }}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getObj, listAll, search, updateObj } from "@/api/commonData";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { mapGetters } from "vuex";
import DynamicForm from "@/components/DynamicForm";
import { getKV } from "@/utils/auth";
import request from "@/utils/request";
import axios from "axios";

const instance = axios.create({
  baseURL: "/v2",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    Accept: "application/vnd.docker.distribution.manifest.v2+json",
    "Cache-Control": "no-cache"
  }
});

const historyInstance = axios.create({
  baseURL: "/v2",
  timeout: 1000
});

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
      name: ""
    };
  },
  mounted() {},
  created() {
    this.catalog_operator = this.$route.query.kind;
    this.name = this.$route.query.name;

    getObj({
      kind: this.frontend_kind,
      name:
        this.table_kind + "-" + this.catalog_operator.toLowerCase() + "-detail",
      namespace: "default"
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.columns = response.data.spec.data;
        console.log(this.name.detail.header);

        instance.get(this.name.overview.url, { params: {} }).then(res => {
          this.listTemp = res.data.layers;
          console.log(res);
          console.log(this.listTemp);
          this.listLoading = false;
        });

        historyInstance
          .get(this.name.overview.url, { params: {} })
          .then(res => {
            this.list = res.data.history;
            console.log(this.list);
          });
      }
    });
  },
  methods: {
    handleSize(num) {
      var size = num / 1024 / 1024;
      size = size.toFixed(2);
      size = size + "MB";
      return size;
    },
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

    getList() {
      this.listLoading = true;
      this.list = [];
      listAll({
        kind: this.catalog_operator,
        limit: this.listQuery.limit,
        nextId: this.listQuery.page
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