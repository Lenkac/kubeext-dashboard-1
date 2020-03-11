<template>
  <div class="app-container">
    <div style="padding-left:200px;padding-right:200px;">
      <el-card class="box-card">
        <el-col :span="24" style="text-align:center">
          <p style="display:inline;font-size:20px;">
            <strong>平台服务</strong>
          </p>
          <el-col :span="24" >
            <el-card class="box-card" style="height:100px">
              <el-col :span="24">
                <el-button
                  type="warning"
                  style="height:80px;width:100%;float:left;font-size:18px;background:rgb(254,251,240)"
                >
                  <p style="color:black"><strong>Serverless平台（深度开发，生产和运维协同）</strong></p>
                </el-button>
              </el-col>
            </el-card>
          </el-col>
          <el-row :gutter="5" >
            <el-col
              :span="24"
              style="margin-bottom:10px"
            >
              <el-card class="box-card" style="height:100px;">
                <el-row :gutter="20">
                  <el-col
                    :span="8"
                    v-for="sb in topConfig"
                    :key="sb.name"
                    style="margin-bottom:20px"
                  >
                    <el-button
                      type="warning"
                      :disabled="sb.state == false"
                      style="height:80px;width:100%;float:left;font-size:18px;background:rgb(254,251,240);"
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
    <div style="padding-left:200px;padding-right:200px;">
      <el-row>
      <el-col :span="8">
            <svg-icon
              icon-class="arrow-down"
              class-name="card-panel-icon"
              style="font-size:60px;margin-left:40px;width:240px"
            />
        </el-col>
        <el-col :span="8">
            <svg-icon
              icon-class="arrow-down"
              class-name="card-panel-icon"
              style="font-size:60px;margin-left:40px;width:240px"
            />
        </el-col>
        <el-col :span="8">
            <svg-icon
              icon-class="arrow-down"
              class-name="card-panel-icon"
              style="font-size:60px;margin-left:40px;width:240px"
            />
        </el-col>
      </el-row>
      
    </div>

    <div style="padding-left:200px;padding-right:200px;">
      <el-row :gutter="2" style="background:rgb(220,227,241)">
        <el-col :span="18" >
          <el-row :gutter="15">
            <el-col
              :span="24"
              v-for="item in middleConfig"
              :key="item.title"
            >
              <el-card class="box-card" style="height:100px;background:rgb(220,227,241)">
                <el-col :span="4" style="height: 80px;text-align:center;line-height:80px;">
                  <span style="vertical-align:middle">
                    <p style="display:inline;font-size:18px;">
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
                    style="height:75px;width:100%;float:left;font-size:18px;"
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
          <el-card class="box-card" style="height:300px;background:rgb(220,227,241)">
            <svg-icon
              icon-class="icon-tool_brief"
              class-name="card-panel-icon"
              style="font-size:160px;margin-left:30px"
            />
            <svg-icon
              icon-class="icon-tool_brief"
              class-name="card-panel-icon"
              style="font-size:60px;margin-left:10px"
            />
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div style="padding-left:200px;padding-right:200px;">
      <el-row>
      <el-col :span="8">
            <svg-icon
              icon-class="arrow-up"
              class-name="card-panel-icon"
              style="font-size:60px;margin-left:40px;width:240px"
            />
        </el-col>
        <el-col :span="8">
            <svg-icon
              icon-class="arrow-up"
              class-name="card-panel-icon"
              style="font-size:60px;margin-left:40px;width:240px"
            />
        </el-col>
        <el-col :span="8">
            <svg-icon
              icon-class="arrow-up"
              class-name="card-panel-icon"
              style="font-size:60px;margin-left:40px;width:240px"
            />
        </el-col>
      </el-row>
      
    </div>

    <div style="padding-left:200px;padding-right:200px;">
      <panel-group />
    </div>
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup";
import { getObj, updateObj, createObj, listAll } from "@/api/commonData";

export default {
  name: "Index",
  components: {
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
      value: [],
      json: {},
      kind: "Container",
      catalog_kind: "catalog",
      frontend_kind: "Frontend",
      height: "height: 200px",
      title: "",
      topConfig: "",
      middleConfig: "",
      namespace: "default"
    };
  },

  mounted() {},
  created() {
    getObj({
      kind: this.frontend_kind,
      name: "dashboard",
      namespace: this.namespace
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

