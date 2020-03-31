<template>
  <div class="app-container">
    <div>
      <el-card class="box-card" style="height:90px;">
        <div style="margin-bottom:7px">
          <strong>
            <p style="font-size:18px;">{{this.$route.query.name}}</p>
          </strong>
        </div>
        <span>
          <p style="display:inline;font-size:16px;">{{ instance.kindDes }}</p>
        </span>
      </el-card>
    </div>
    <div style="margin-top:15px">
        <p style="font-size:18px;">用量监测：</p>
      <el-row :gutter="20" style="margin-top:10px;">
        <el-col :span="24" v-for="item in monitorURL" :key="item.name" style="margin-bottom:20px">
          <el-card class="box-card" :style="height">
              <p style="font-size:18px;">{{item.name}}</p>
            <iframe frameborder="0" class="monitor" :src="item.url"></iframe>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getObj, updateObj, createObj, listAll } from "@/api/commonData";

export default {
  name: "Template",
  directives: {},
  components: {},
  props: {
    tabName: {
      type: String,
      default: "VirtualMachine"
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      value: [],
      json: {},
      kind: "Container",
      catalog_kind: "catalog",
      frontend_kind: "Frontend",
      height: "height: 200px",
      title: "",
      styleConfig: "",
      namespace: "default",
      account: {},
      current: "account"
    };
  },

  mounted() {},
  created() {
    // listAll({
    //   kind: this.frontend_kind,
    //   namespace: this.namespace
    // }).then(response => {
    //   if (this.validateRes(response) == 1) {
    //     this.styleConfig = response.data.items;
    //   }
    // });
    if (this.$route.query.account) {
      this.instance = this.$route.query.account;
    }
    
    this.monitorURL = [
        {name:"cpu",url:"http://39.106.124.113:31000/d-solo/JABGX_-mz/cluster-monitoring-for-kubernetes?refresh=5s&orgId=1&var-interval=%24__auto_interval_interval&var-datasource=Prometheus&var-Node=ali3&from=1584582896513&to=1584583196513&panelId=39"},
        {name:"network I/O",url:"http://39.106.124.113:31000/d-solo/JABGX_-mz/cluster-monitoring-for-kubernetes?refresh=5s&orgId=1&var-interval=%24__auto_interval_interval&var-datasource=Prometheus&var-Node=ali3&from=1584585907327&to=1584586207327&panelId=32"}
    ]
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

    showDialog(index) {},
    updateTemplate() {
      this.dialogTableVisible = false;
      createObj({
        json: JSON.parse(this.json),
        kind: this.frontend_kind
      }).then(response => {
        if (response.code == 20000) {
          this.handleSuccess();
          listAll({
            kind: this.frontend_kind,
            namespace: this.namespace
          }).then(response => {
            if (this.validateRes(response) == 1) {
              this.styleConfig = response.data.items;
            }
          });
          //location.reload()
        }
      });
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur();
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

<style lang="scss">
.board {
  margin-left: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4a9ff9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}

.card-editor-container {
  position: relative;
  width: 100%;
  height: 70%;
}

.monitor {
    width: 100%;
    height: 100%;
}
</style>

