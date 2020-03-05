<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin:5px;">
      <el-col
        :span="6"
        v-for="(item,index) in styleConfig"
        :key="item.metadata.name"
        style="margin-bottom:30px"
      >
        <el-card class="box-card" :style="height">
          <div slot="header" class="clearfix">
            <span>
              <p style="display:inline;font-size:16px;">
                <strong>{{ item.metadata.name }}</strong>
              </p>
            </span>
          </div>
          <p style="font-size:12px;">{{item.metadata.name}}</p>
          <el-button
            type="primary"
            style="float:right;margin:15px;"
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
</template>

<script>
import elDragDialog from "@/directive/el-drag-dialog"; // base on element-ui
import EditableJson from "@/components/EditableJson";
import { getObj, updateObj, createObj, listAll } from "@/api/commonData";
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
    listAll({
      kind: this.frontend_kind
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.styleConfig = response.data.items;
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
        if (response.code == 20000) {
          this.handleSuccess();
          listAll({
            kind: this.frontend_kind
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
</style>

