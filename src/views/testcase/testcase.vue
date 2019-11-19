<template>
  <div class="app-container">
    <div class="tab-container">
      <el-tabs
        v-model="activeName"
        style="margin-top:15px;width:100%"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in tabMapOptions"
          :key="item.key"
          :label="item.label"
          :name="item.key"
        >
          <keep-alive>
            <InnerPane v-if="activeName==item.key" :type="item.key" :tabName="item.key" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getJsonData,
  createSthFromTemplate
} from "@/api/commonData";
import { mapGetters } from "vuex";
import InnerPane from "./components/showTestcase";

export default {
  name: "testcase",
  components: { InnerPane },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: "success",
        fail: "danger"
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      kind: "",
      catalog_kind: "Catalog",
      catalog_operator: "testcase",
      tabMapOptions: [],
      activeName: "testcase1",
      innerTab: "left",
    }
  },
  mounted() {
    
  },
  created() {

    getJsonData({
      kind: this.catalog_kind,
      operator: this.catalog_operator
    }).then(response => {
      this.tabMapOptions = response.data.tabMapOptions;
      this.activeName = response.data.activeName;
    });
  },
  methods: {
    handleClick() {

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