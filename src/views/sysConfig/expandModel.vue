<template>
  <div class="app-container">
    <div class="tab-container">
      <el-tabs
        v-model="activeName"
        style="margin-top:15px;"
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
            <div
              class="components-container"
              v-if="activeName==item.key"
              :type="item.key"
              :tabName="item.key"
            >
              <el-row :gutter="20" style="margin:5px;">
                <el-col
                  :span="6"
                  v-for="item in value"
                  :key="item"
                  style="margin-bottom:30px"
                >
                  <el-card class="box-card" :style="height">
                    <div slot="header" class="clearfix">
                      <span>
                        <p style="display:inline;font-size:16px;">
                          <strong>{{ item}}</strong>
                        </p>
                      </span>
                    </div>
                    <p style="font-size:12px;">{{item}}</p>
                    <el-button
                      type="primary"
                      style="float:right;margin:15px;"
                      @click.native="showDialog(item)"
                    >查看/修改</el-button>
                  </el-card>
                </el-col>
              </el-row>

              <el-dialog
                v-el-drag-dialog
                :visible.sync="dialogTableVisible"
                :title="title"
                @dragDialog="handleDrag"
              >
                <div class="card-editor-container">
                  <!-- <json-editor ref="EditableJson" v-model="value" /> -->
                  <EditableJson v-model="json" />
                </div>
                <div style="width:100%;height:50px;">
                  <el-button
                    type="primary"
                    style="float:right;margin-top:20px;height:40px;display:inline;"
                    @click.native="updateTemplate"
                  >确认</el-button>
                  <!-- <el-button type="primary" style="float:right;margin-top:20px;height:40px;display:inline;margin-right:0px;" >取消</el-button> -->
                </div>
              </el-dialog>
            </div>
            <!-- <tab-pane v-if="activeName==item.key" :type="item.key" :tabName="item.key"/> -->
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import elDragDialog from "@/directive/el-drag-dialog"; // base on element-ui
import EditableJson from "@/components/EditableJson";
import { getObj, updateObj, createObj, listAll } from "@/api/commonData";
import apiAnalysis from "@/views/config/apiAnalysis";
import editorImage from "./components/EditorImage";

export default {
  name: "Template",
  directives: { elDragDialog },
  components: {
    EditableJson,
    apiAnalysis,
    editorImage
  },
  props: {
    tabName: {
      type: String,
      default: "VirtualMachine"
    }
  },
  data() {
    return {
      schedulingType: "未选择",
      test: "hhh",
      test1: "hhh",
      parentMessage: "",
      dialogTableVisible: false,
      options: [{ value: "", label: "" }],
      modelType: "",
      value: [],
      json: {},
      kind: "Container",
      catalog_kind: "catalog",
      frontend_kind: "Frontend",
      catalog_operator: "expandmodel",
      lifecycle_kind: "Template",
      lifecycle_operator: "container",
      api_kind: "api",
      height: "height: 200px",
      title: "",
      activeName: "",
      tabMapOptions: [],
      dataTemp: {},
      combineJson: {},
      namespace: "default"
    };
  },

  mounted() {},
  created() {
    getObj({
      kind: this.frontend_kind,
      name: this.catalog_kind + "-" + this.catalog_operator,
      namespace: this.namespace
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.tabMapOptions = response.data.spec.data.tabMapOptions;
        this.activeName = response.data.spec.data.activeName;

        getObj({
          kind: "ConfigMap",
          name: "kubeext-" + this.activeName,
          namespace: this.namespace
        }).then(response => {
          if (this.validateRes(response) == 1) {
                this.value = Object.keys(response.data.data);
                this.dataTemp = response.data.data
                this.combineJson = response.data
                console.log(this.value);
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

    handleClick(tab, event) {
      console.log(tab.name, event);
        this.activeName = tab.name
        getObj({
          kind: "ConfigMap",
          name: "kubeext-" + this.activeName,
          namespace: this.namespace
        }).then(response => {
          if (this.validateRes(response) == 1) {
                this.value = Object.keys(response.data.data);
                this.dataTemp = response.data.data
                this.combineJson = response.data
                console.log(this.value);
              }
        });
    },
    showDialog(index) {
      this.dialogTableVisible = true;
      console.log(this.json)
      this.json = this.dataTemp[index];
      this.title = index;
    },
    updateTemplate() {
      this.dialogTableVisible = false;
      this.combineJson.data[this.title] = this.json.slice(1, -1)
      updateObj({
        json: this.combineJson,
        kind: "ConfigMap"
      }).then(response => {
        console.log(response.code);
      });
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur();
    },
    toRawJson(val) {
      var str = JSON.stringify(val);
      str = str.replace(/ +/g, "");
      str = str.replace(/\\n/g, "");
      str = str.substring(1, str.length - 1);
      str = str.replace(/\\/g, "");
      return str;
    },
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
</style>

