<template>
  <div class="search">
    <Card>
      <Row class="operation">
        <Button @click="add" type="primary" icon="md-add">添加用户</Button>
        <Button @click="delAll" icon="md-trash">批量删除</Button>
      </Row>
      <Row>
        <Table
          :loading="loading"
          border
          :columns="columns"
          :data="data"
          sortable="custom"
          @on-sort-change="changeSort"
          @on-selection-change="showSelect"
          ref="table"
        ></Table>
      </Row>
    </Card>

    <Modal
      :title="modalTitle"
      v-model="userModalVisible"
      :mask-closable="false"
      :width="500"
      :styles="{top: '30px'}"
    >
      <Form ref="form" :model="form" :label-width="70" :rules="userFormValidate">
        <FormItem label="用户名" prop="username">
          <Input v-model="form.username" autocomplete="off" />
        </FormItem>
        <FormItem label="密码" prop="password" v-if="modalType==0" :error="errorPass">
          <Input type="password" password v-model="form.password" autocomplete="off" />
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="form.email" />
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input v-model="form.mobile" />
        </FormItem>
        <FormItem label="性别" prop="sex">
          <RadioGroup v-model="form.sex">
            <Radio v-for="(item, i) in dictSex" :key="i" :label="item.value">{{item.title}}</Radio>
          </RadioGroup>
        </FormItem>
        <Form-item label="所属部门">
          <department-tree-choose @on-change="handleSelectDepTree" ref="depTree"></department-tree-choose>
        </Form-item>
        <FormItem label="用户类型" prop="type">
          <Select v-model="form.type" placeholder="请选择">
            <Option :value="0">普通用户</Option>
            <Option :value="1">管理员</Option>
          </Select>
        </FormItem>
        <FormItem label="角色分配" prop="roles">
          <Select v-model="form.roles" multiple>
            <Option v-for="item in roleList" :value="item.id" :key="item.id" :label="item.name">
              <span style="margin-right:10px;">{{ item.name }}</span>
              <span style="color:#ccc;">{{ item.description }}</span>
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="userModalVisible = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitUser">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { listAll, getObj, removeObj } from "@/api/commonData";
import { validateMobile, validatePassword } from "@/libs/validate";
import departmentChoose from "../components-demo/department-choose";
import departmentTreeChoose from "../components-demo/department-tree-choose";

export default {
  name: "user-manage",
  components: {
    departmentChoose,
    departmentTreeChoose,
  },
  data() {
    return {
      loading: false,
      openSearch: true,
      openTip: true,
      operationLoading: false,
      loadingExport: true,
      modalExportAll: false,
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "ios-arrow-down",
      selectCount: 0,
      selectList: [],
      dataDep: [],
      searchKey: "",
      searchForm: {
        username: "",
        departmentId: "",
        mobile: "",
        email: "",
        sex: "",
        type: "",
        status: "",
        pageNumber: 1,
        pageSize: 10,
        sort: "createTime",
        order: "desc",
        startDate: "",
        endDate: ""
      },
      selectDate: null,
      modalType: 0,
      userModalVisible: false,
      modalTitle: "",
      form: {
        username: "",
        mobile: "",
        email: "",
        sex: 1,
        type: 0,
        avatar: "",
        roles: [],
        departmentId: "",
        departmentTitle: ""
      },
      userRoles: [],
      roleList: [],
      errorPass: "",
      userFormValidate: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址" },
          { type: "email", message: "邮箱格式不正确" }
        ]
      },
      submitLoading: false,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          type: "index",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "用户名",
          key: "username",
          minWidth: 145,
          sortable: true,
          fixed: "left"
        },
        {
          title: "头像",
          key: "avatar",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("Avatar", {
              props: {
                src: params.row.avatar
              }
            });
          }
        },
        {
          title: "所属部门",
          key: "departmentTitle",
          width: 120
        },
        {
          title: "手机",
          key: "mobile",
          width: 125,
          sortable: true
        },
        {
          title: "邮箱",
          key: "email",
          width: 180,
          sortable: true
        },
        {
          title: "性别",
          key: "sex",
          width: 70,
          align: "center"
        },
        {
          title: "用户类型",
          key: "type",
          align: "center",
          width: 100,
          render: (h, params) => {
            let re = "";
            if (params.row.type == 1) {
              re = "管理员";
            } else if (params.row.type == 0) {
              re = "普通用户";
            }
            return h("div", re);
          }
        },
        {
          title: "创建时间",
          key: "createTime",
          sortable: true,
          sortType: "desc",
          width: 180
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.edit(params.row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data: [{
        username: "1",
        mobile: "17801055040",
        email: "1",
        sex: 1,
        type: 0,
        avatar: "https://i.loli.net/2019/04/28/5cc5a71a6e3b6.png",
        roles: [1],
        departmentId: "1",
        departmentTitle: "1"
      }],
      total: 0,
      dictSex: [{titile:"男",value:'0'},{titile:"女",value:'1'}]
    };
  },
  methods: {
    // init() {
    //   this.getUserList();
    // },
    handleSelectDepTree(v) {
      this.form.departmentId = v;
    },
    handleSelectDep(v) {
      this.searchForm.departmentId = v;
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getUserList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getUserList();
    },
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    getUserList() {
      // 多条件搜索用户列表
      this.loading = true;
      // 避免后端默认值
      if (!this.searchForm.type) {
        this.searchForm.type = " ";
      }
      if (!this.searchForm.status) {
        this.searchForm.status = " ";
      }
      getUserListData(this.searchForm).then(res => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
    },

    showSelect(e) {
      this.exportData = e;
      this.selectList = e;
      this.selectCount = e.length;
    },
   
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.selectDate = null;
      this.searchForm.startDate = "";
      this.searchForm.endDate = "";
      this.selectDep = [];
      this.searchForm.departmentId = "";
      // 重新加载数据
      this.getUserList();
    },
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order == "normal") {
        this.searchForm.order = "";
      }
      this.getUserList();
    },
    getRoleList() {
      getAllRoleList().then(res => {
        if (res.success) {
          this.roleList = res.result;
        }
      });
    },
    
    resetPass() {
      this.$Modal.confirm({
        title: "确认重置",
        content:
          "您确认要重置所选的 " +
          this.selectCount +
          " 条用户数据密码为【123456】?",
        loading: true,
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          resetUserPass({ ids: ids }).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("操作成功");
              this.clearSelectAll();
              this.getUserList();
            }
          });
        }
      });
    },
    submitUser() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.modalType == 0) {
            // 添加用户 避免编辑后传入id
            delete this.form.id;
            delete this.form.status;
            if (this.form.password == "" || this.form.password == undefined) {
              this.errorPass = "密码不能为空";
              return;
            }
            if (this.form.password.length < 6) {
              this.errorPass = "密码长度不得少于6位";
              return;
            }
            this.submitLoading = true;
            addUser(this.form).then(res => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("操作成功");
                this.getUserList();
                this.userModalVisible = false;
              }
            });
          } else {
            // 编辑
            this.submitLoading = true;
            editUser(this.form).then(res => {
              this.submitLoading = false;
              if (res.success) {
                this.$Message.success("操作成功");
                this.getUserList();
                this.userModalVisible = false;
              }
            });
          }
        }
      });
    },
    add() {
      this.modalType = 0;
      this.modalTitle = "添加用户";
      this.$refs.form.resetFields();
      this.$refs.depTree.setData("", "");
      this.userModalVisible = true;
    },
    edit(v) {
      this.modalType = 1;
      this.modalTitle = "编辑用户";
      this.$refs.form.resetFields();
      // 转换null为""
      for (let attr in v) {
        if (v[attr] == null) {
          v[attr] = "";
        }
      }
      let str = JSON.stringify(v);
      let data = JSON.parse(str);
      this.form = data;
      this.$refs.depTree.setData(data.departmentId, data.departmentTitle);
      let selectRolesId = [];
      this.form.roles.forEach(function(e) {
        selectRolesId.push(e.id);
      });
      this.form.roles = selectRolesId;
      this.userModalVisible = true;
    },
    enable(v) {
      this.$Modal.confirm({
        title: "确认启用",
        content: "您确认要启用用户 " + v.username + " ?",
        loading: true,
        onOk: () => {
          enableUser(v.id).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("操作成功");
              this.getUserList();
            }
          });
        }
      });
    },
    disable(v) {
      this.$Modal.confirm({
        title: "确认禁用",
        content: "您确认要禁用用户 " + v.username + " ?",
        loading: true,
        onOk: () => {
          disableUser(v.id).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("操作成功");
              this.getUserList();
            }
          });
        }
      });
    },
    remove(v) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除用户 " + v.username + " ?",
        loading: true,
        onOk: () => {
          deleteUser(v.id).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("删除成功");
              this.getUserList();
            }
          });
        }
      });
    },
    dropDown() {
      if (this.drop) {
        this.dropDownContent = "展开";
        this.dropDownIcon = "ios-arrow-down";
      } else {
        this.dropDownContent = "收起";
        this.dropDownIcon = "ios-arrow-up";
      }
      this.drop = !this.drop;
    },
   
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未选择要删除的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除所选的 " + this.selectCount + " 条数据?",
        loading: true,
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          deleteUser(ids).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("删除成功");
              this.clearSelectAll();
              this.getUserList();
            }
          });
        }
      });
    }
  },
  mounted() {
    // this.init();
    // this.getRoleList();
    //console.log(this.dropDownContent)
  },
  created() {
    console.log(this.dropDownContent)
  },
};
</script>
<style lang="less">
@import "./table-common.less";
</style>