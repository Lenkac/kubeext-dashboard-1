<template>
  <div class="app-container">
    <div class="tab-container">
      <!-- <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" /> -->
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
                  :span="8"
                  v-for="(item,index) in value"
                  :key="item.name"
                  style="margin-bottom:30px"
                >
                  <el-card class="box-card" :style="height">
                    <div slot="header" class="clearfix">
                      <span>
                        <p style="display:inline;font-size:18px;">
                          <strong>{{ value[index].name }}</strong>
                        </p>
                      </span>
                    </div>
                    <p style="font-size:12px;">{{item.desc}}</p>
                    <el-button
                      type="primary"
                      style="float:right;margin:20px;"
                      @click.native="showDialog(index)"
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
// import Kanban from '@/components/Kanban'
import EditableJson from "@/components/EditableJson";
import { getJsonData, updateJsonData } from "@/api/commonData";

export default {
  name: "Template",
  directives: { elDragDialog },
  components: {
    EditableJson
  },
  data() {
    return {
      schedulingType: "未选择",
      dialogTableVisible: false,
      options: [{ value: "", label: "" }],
      modelType: "",
      value: [],
      json: {},
      kind: "Container",
      catalog_kind: "Catalog",
      catalog_operator: "lifecycle",
      lifecycle_kind: "lifecycle",
      lifecycle_operator: "container",
      height: "height: 200px",
      title: "",
      activeName: "",
      tabMapOptions: []
    };
  },

  mounted() {
    this.$store
      .dispatch("taskData/getAllTaskData")
      .then((resolve, reject) => {
        console.log("resolve:", resolve);
        this.list1 = resolve["data"];
      })
      .catch((resolve, reject) => {
        console.log("reject:", reject);
      });
  },
  created() {
    getJsonData({
      kind: this.catalog_kind,
      operator: this.catalog_operator
    }).then(response => {
      this.tabMapOptions = response.data.tabMapOptions;
      this.activeName = response.data.activeName;
      console.log(this.tabMapOptions);
      getJsonData({
        kind: this.lifecycle_kind,
        operator: this.activeName
      }).then(response => {
        this.value = response.data;
        console.log(this.value);
      });
    });
  },

  methods: {
    handleClick(tab, event) {
      console.log(tab.name, event);
      getJsonData({
        kind: this.lifecycle_kind,
        operator: this.activeName
      }).then(response => {
        this.value = response.data;
        if (this.activeName == "virtualmachine") {
          this.height = "height: 240px";
        } else if (this.activeName == "container") {
          this.height = "height: 190px";
        }
        console.log(this.value);
      });
    },
    showDialog(index) {
      this.dialogTableVisible = true;
      this.json = JSON.parse(this.value[index].json);
      this.title = this.value[index].name;
    },
    updateTemplate() {
      this.dialogTableVisible = false;
      updateJsonData({
        operator: "update",
        json: this.json,
        kind: this.kind
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
</style>

