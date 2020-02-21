<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin:5px;">
      <el-col :span="6" v-for="item in Object.keys(styleConfig)" :key="item" style="margin-bottom:30px">
        <el-card class="box-card" :style="height">
          <div slot="header" class="clearfix">
            <span>
              <p style="display:inline;font-size:16px;">
                <strong>{{ item }}</strong>
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
</template>

<script>
import elDragDialog from "@/directive/el-drag-dialog"; // base on element-ui
import EditableJson from "@/components/EditableJson";
import { getObj, updateObj, createObj, listAll } from "@/api/commonData"
import editorImage from "./components/EditorImage";

export default {
  name: "Template",
  directives: { elDragDialog },
  components: {
    EditableJson,
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
      dialogTableVisible: false,
      value: [],
      json: {},
      kind: "Container",
      catalog_kind: "catalog",
      frontend_kind: "Frontend",
      height: "height: 200px",
      title: "",
      styleConfig: ""
    };
  },

  mounted() {},
  created() {
    getObj({
      kind: "ConfigMap",
      name: "kubeext-metadata"
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.styleConfig = response.data.data
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
    
    showDialog(item) {
      this.dialogTableVisible = true;
      this.json = this.styleConfig[item];
      this.title = item;
    },
    updateTemplate() {
      this.dialogTableVisible = false;
      getObj({
        name: "kubeext-nodeless",
        kind: "ConfigMap"
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
</style>

