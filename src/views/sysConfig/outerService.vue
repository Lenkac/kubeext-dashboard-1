<template>
<div>
  <el-card v-for="item in list" :key="item.name" class="box-card" style="width:100%;margin: 15px 15px">
    <p style="font-size:16px;"><strong>{{item.title}}</strong></p>
    <div class="chart-wrapper">
      <el-table :data="item.content" style="width: 80%;padding-top: 15px;">
        <el-table-column label="名称" min-width="200">
          <template slot-scope="{row}">              
              {{ row.name }}
              </template>
        </el-table-column>
        <el-table-column label="地址" width="800" align="left">
          <template slot-scope="{row}">
              <a :href="row.address" target="_blank">{{ row.address }}</a>
              </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</div>
</template>

<script>
import { getObj, updateObj, createObj } from "@/api/commonData";
export default {
  data() {
    return {
      list: [],
      frontend_kind: "Frontend",
      service_kind: "service",
      namespace: "default",
      name: ""
    };
  },
  created() {
    this.name = this.$route.name
    getObj({
      kind: this.frontend_kind,
      name: service_kind + "-" +this.name,
      nnamespace: this.namespace
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.list = response.data.spec.data
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
    }
        
  }
};
</script>