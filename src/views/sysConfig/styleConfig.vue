<template>
  <div class="app-container">
     <div>
      <dynamic-form :formData="responseJson" :kind="catalog_operator" @watchSearch="searchList"></dynamic-form>
    </div>
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
     <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import elDragDialog from "@/directive/el-drag-dialog"; // base on element-ui
import EditableJson from "@/components/EditableJson";
import { getObj, updateObj, createObj, listAll, search } from "@/api/commonData";
import editorImage from "./components/EditorImage";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import DynamicForm from "@/components/DynamicForm";

export default {
  name: "Template",
  directives: { elDragDialog },
  components: {
    EditableJson,
    editorImage,
    Pagination,
    DynamicForm
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
      styleConfig: "",
      namespace: "default",
      total: 0,
      listQuery: {
        page: 1,
        limit: 12,
        continue: 1
      },
      responseJson: {},
      formsearch_kind: "formsearch",
      catalog_operator: "",
      message: {}
    };
  },

  mounted() {},
  created() {
    this.responseJson = this.$route.meta.data;
    this.catalog_operator = this.$route.name;
    console.log(this.responseJson)

    getObj({
      kind: this.frontend_kind,
      name: this.formsearch_kind + "-" + this.catalog_operator.toLowerCase(),
      namespace: "default"
    }).then(response => {
      this.responseJson = response.data.spec.data;
    });

    listAll({
      kind: this.$route.name,
      namespace: this.namespace,
      limit: this.listQuery.limit
    }).then(response => {
      if (this.validateRes(response) == 1) {
        this.styleConfig = response.data.items;
        this.total = response.data.metadata.totalCount;
      }
    });
  },

  methods: {
    searchList(message) {   
      this.message = message  
      search({
        kind: this.catalog_operator,
        labels: message,
        page: 1,
        limit: 12
      }).then(response => {
        this.styleConfig = response.data.items;
        this.total = response.data.metadata.totalCount;
        this.listQuery.page = 1
      });
    },

    getList() {
      this.styleConfig = []
      search({
        kind: this.$route.name,
        limit: this.listQuery.limit,
        page: this.listQuery.page,
        labels: this.message,
      }).then(response => {
        if (this.validateRes(response) == 1) {
          this.styleConfig = response.data.items;
          //this.total = response.data.metadata.remainingItemCount + 10
          //this.listQuery.page = this.listQuery.page + 1
          this.listQuery.continue = response.data.metadata.continue;
        }
      });
    },
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
      updateObj({
        json: JSON.parse(this.json),
        kind: this.frontend_kind,
        namespace: this.namespace
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
</style>

