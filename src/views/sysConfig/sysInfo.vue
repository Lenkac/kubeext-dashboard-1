<template>
<div>
  <el-card v-for="item in Object.keys(list)" :key="item" class="box-card" style="width:100%;margin: 15px 15px">
    <p style="font-size:16px;"><strong>{{item}}</strong></p>
    <div class="chart-wrapper">
      <el-table :data="Object.keys(list[item])" style="width: 80%;padding-top: 15px;">
        <el-table-column label="名称" min-width="200">
          <template slot-scope="{row}">              
              {{ row }}
              </template>
        </el-table-column>
        <el-table-column label="内容" width="800" align="left">
          <template slot-scope="{row}">
              {{ list[item][row] }}
              </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</div>
</template>

<script>
import { getsysInfo } from "@/api/commonData";
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    //this.outerService = this.$route.name
    getsysInfo().then(response => {
      if (this.validateRes(response) == 1) {
        this.list = response.data
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