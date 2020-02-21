<template>
  <div class="app-container">
    <div>
      <el-card class="box-card">
        <el-col :span="24" style="text-align:center">
          <p style="display:inline;font-size:22px;">
            <strong>平台服务</strong>
          </p>
          <el-col :span="24">
            <el-card class="box-card" style="height:100px">
              <el-col :span="8">
                <el-button
                  type="warning"
                  style="height:80px;width:1260px;float:left;font-size:20px;background:rgb(254,251,240)"
                  @click.native="showDialog(index)"
                >
                  <p style="color:black"><strong>Serverless平台（深度开发，生产和运维协同）</strong></p>
                </el-button>
              </el-col>
            </el-card>
          </el-col>
          <el-row :gutter="10">
            <el-col
              :span="24"
              style="margin-bottom:10px"
            >
              <el-card class="box-card" style="height:100px;">
                <el-row :gutter="55">
                  <el-col
                    :span="8"
                    v-for="sb in topConfig"
                    :key="sb.name"
                    style="margin-bottom:20px"
                  >
                    <el-button
                      type="warning"
                      :disabled="sb.state == false"
                      style="height:80px;width:370px;float:left;font-size:20px;background:rgb(254,251,240);"
                      @click.native="showDialog(index)"
                    >
                    <p style="color:black" v-if="sb.state == false">
                      <strong>{{ sb.name }}</strong>
                    </p>
                      <router-link :to="{path:sb.route}" class="link" v-if="sb.state == true" style="color:black">
                        <strong>{{ sb.name }}</strong>
                      </router-link>
                    </el-button>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-card>
    </div>

    <div>
      <el-row :gutter="2" style="background:rgb(220,227,241)">
        <el-col :span="18">
          <el-row :gutter="10">
            <el-col
              :span="24"
              v-for="item in middleConfig"
              :key="item.title"
              style="margin-bottom:10px"
            >
              <el-card class="box-card" style="height:110px;background:rgb(220,227,241)">
                <el-col :span="4" style="height: 80px;text-align:center;line-height:80px;">
                  <span style="vertical-align:middle">
                    <p style="display:inline;font-size:20px;">
                      <strong>{{ item.title }}</strong>
                    </p>
                  </span>
                </el-col>
                <el-col
                  :span="5"
                  v-for="sb in item.subtitle"
                  :key="sb.name"
                >
                  <el-button
                    type="primary"
                    :disabled="sb.state == false"
                    style="height:80px;width:160px;float:left;font-size:20px;"
                    @click.native="showDialog(index)"
                  >
                    <p v-if="sb.state == false">
                      <strong>{{ sb.name }}</strong>
                    </p>
                    <router-link :to="{path:sb.route,query: {name:sb.tabName}}" class="link" v-if="sb.state == true">
                      <strong>{{ sb.name }}</strong>
                    </router-link>
                  </el-button>
                </el-col>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card" style="height:350px;background:rgb(220,227,241)">
            <svg-icon
              icon-class="icon-tool_brief"
              class-name="card-panel-icon"
              style="font-size:200px;margin-left:60px"
            />
            <svg-icon
              icon-class="icon-tool_brief"
              class-name="card-panel-icon"
              style="font-size:100px;margin-left:40px"
            />
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div>
      <panel-group />
    </div>
  </div>
</template>

<script>
import elDragDialog from "@/directive/el-drag-dialog"; // base on element-ui
import EditableJson from "@/components/EditableJson";
import PanelGroup from "./components/PanelGroup";
import { getObj, updateObj, createObj, listAll } from "@/api/commonData";

export default {
  name: "Index",
  directives: { elDragDialog },
  components: {
    EditableJson,
    PanelGroup
  },
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
      topConfig: "",
      middleConfig: ""
    };
  },

  mounted() {},
  created() {
    getObj({
      kind: this.frontend_kind,
      name: "dashboard"
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.topConfig = response.data.spec.data.topConfig
        this.middleConfig = response.data.spec.data.middleConfig
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

    showDialog(index) {
      this.dialogTableVisible = true;
      this.json = this.styleConfig[index];
      this.title = this.styleConfig[index].metadata.name;
    },
    updateTemplate() {
      this.dialogTableVisible = false;
      createObj({
        json: JSON.parse(this.json),
        kind: this.frontend_kind
      }).then(response => {
        console.log(response.code);
      });
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur();
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

.el-card__body {
  padding: 10px;
  padding-left: 20px;

}
</style>

