<template>
  <div class="app-container">
    <div class="filter-container">
      <span v-for="ff in filterForm" :key="ff.key">
        <!-- @input="updateJson(listQuery,ff.prop,$event)" -->
        <input type="text" v-if="ff.type == 'input'" :value="getInputValue(listQuery,ff.prop) " 
　　　　　　@input="updateInputValue(listQuery,ff.prop,$event.target.value)" :placeholder="ff.ph" :style="ff.style" class="filter-item" @keyup.enter.native="handleFilter"/>
        <select v-if="ff.type == 'select'" :value="getInputValue(listQuery,ff.prop)"
          @change="updateInputValue(listQuery,ff.prop,$event.target.value)"
         :placeholder="ff.ph" :style="ff.style" class="filter-item">
          <option v-for="item in littleDataSource[ff.dataSource]" 
          :key="item.key" :label="item.label" :value="item.value" />
        </select>
      </span>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column v-for="item in columns" :key="item.key" :label="item.label" :width="item.width" align="center">
        <template  slot-scope="scope">
          <router-link :to="{path:'/resourceInfo/nodeInfo',query:{node:getInputValue(scope.row,item.row)}}"  v-if="item.kind == 'a'" tag="a" class="link" @click="getData">
            {{ getInputValue(scope.row,item.row) }}
          </router-link>
          <span v-if="item.kind == undefined">{{ getInputValue(scope.row,item.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-for="item in actions" :key="item.key" :type="item.type" @click="handleUpdate(row, item.event)">
            {{ item.name }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item v-for="efi in columns" :key="efi.key" :label="efi.label" :prop="efi.row" :style='efi.itemStyle'>
          <el-input v-if="efi.type == 'input'" v-model="temp[efi.row]" :placeholder="efi.ph" :style="efi.style" />
          <el-select v-if="efi.type == 'select'" v-model="temp[efi.row]" :placeholder="efi.ph" :style="efi.style">
            <el-option v-for="lds in littleDataSource[efi.dataSource]" :key="lds.key" :label="lds.label" :value="lds.value" />
          </el-select>
          <el-input v-if="efi.type == undefined" v-model="temp[efi.row]" :placeholder="efi.ph" :style="efi.style" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getListAllData, getColumns, getActions, getFilterForm, getLittleDataSource, getRules, getTemp } from '@/api/commonData'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from 'vuex'
import Bus from '@/utils/Bus'


export default {
  name: 'nodeTable',
  components: { Pagination },
  directives: { waves },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      importanceOptions: [1, 2, 3],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      downloadLoading: false,
      columns: [],
      actions: [],
      littleDataSource: {},
      filterForm: [],
      listQuery: {},
      total: 0,
      rules: {
      },
      temp: {
      },
      textMap: {
        update: '更新数据',
        create: '创建新记录'
      },
      viewer: 'Node',
      value: "",
      ip: ""
    }
  },
  mounted() {
   
  },
  created() {
    getColumns(this.viewer).then(response => {
      this.columns = response.data
        getListAllData({viewerName: this.viewer}).then(response3 => {
          this.list = response3.data
          //this.total = response3.total
          this.listLoading = false
        })
    })

    getTemp({viewer: this.viewer}).then(response => {
      this.temp = response.data
    })
    getLittleDataSource({viewer: this.viewer}).then(response => {
      this.littleDataSource = response.data
    })
    getRules({viewer: this.viewer}).then(response => {
      this.rules = response.data
    })
    getFilterForm({viewer: this.viewer}).then(response => {
      this.filterForm = response.data
    })
    getActions({viewer: this.viewer}).then(response => {
      this.actions = response.data
    })

  },
  methods: {
    deleteMenu(){
      // console.log(constantRoutes[9])
      // constantRoutes.splice(9,1)
      Bus.$emit('deleteMenuTest')
    },
    getData() {
        Bus.$emit('val', this.list)
        console.log("hhhh"+this.list)
      },

    getList() {
      this.listLoading = true
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          
        }
      })
    },
    handleUpdate(row, event) {
      if (event === 'update') {
        this.temp = Object.assign({}, row) // copy obj
        //this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
      if (event === 'delete') {
        this.handleDelete(row)
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
  
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getInputValue(scope,longKey){
      if( JSON.stringify(scope)=='{}'){
        return ''
      }
      if( longKey == "" || longKey == undefined || longKey == null || !longKey){
        return ''
      }
      if( longKey.indexOf('\.') < 0 ){
        return scope[longKey]
      }
      var keys = longKey.split("\.")
      var res =scope;
      keys.forEach(element => {
        if(element.indexOf('\[') > 0){
          res = res[element.substring(0,element.indexOf('\['))]
          res = res[parseInt(element.substring(element.indexOf('\[')+1,element.indexOf('\]')))]
        }
        else{
          if(res.hasOwnProperty(element)){
            res = res[element]
          }else [
            res = "unknown"
          ]

        }
      });
      //console.log(res)
      return res
    },
    updateInputValue(scope,longKey,event){
      if( longKey.indexOf('\.') < 0 ){
         scope[longKey] = event
         return 
      }
      var keys = longKey.split("\.")
      var obj = scope
      for (var i=0 ;i < keys.length -1 ;i++){
        var element = keys[i]
        if(element.indexOf('\[') > 0){
          obj = obj[element.substring(0,element.indexOf('\['))]
          obj = obj[parseInt(element.substring(element.indexOf('\[')+1,element.indexOf('\]')))]
        }
        else{
          obj = obj[element]
        }
      }
      obj[keys[keys.length-1]] = event
    }
  },
}
</script>

<style scoped>
.link{
  color: red;
}
a:hover{
  text-decoration: underline;
}
input {
  height: 35px;
}
</style>