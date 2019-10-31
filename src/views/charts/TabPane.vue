<template>
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
          <router-link :to="{path:'/profile/containerInfo',query:{pod:getInputValue(scope.row,item.row),node:scope.row.spec.nodeName}}" v-if="item.kind == 'a'" tag="a" class="link" >
            {{ getInputValue(scope.row,item.row) }}
          </router-link>
          <span v-if="item.kind == undefined">{{ getInputValue(scope.row,item.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="远程连接" align="center" width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row}">        
            <svg-icon @click="openUrl(row)" icon-class="pc"  class-name='custom-class' />          
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
         <el-select v-model="action" @change="(handleUpdate($event, row.json))">
             <el-option v-for="item in actions" :key="item.key" :label="item.key" :value="item.key" @click="popJson"/>
        </el-select>
        </template>
      </el-table-column>
    </el-table>    
    </template>

<script>
import { getListAllData, getColumns, getFilterForm, getLittleDataSource, getRules, getTemp,getJsonData , createSthFromTemplate} from '@/api/commonData'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from 'vuex'
import elDragDialog from '@/directive/el-drag-dialog'
import JsonEditor from '@/components/JsonEditor'
import {resetRouter, router, constantRoutes,setNewRouter} from '@/router/index'
import Bus from '@/utils/Bus'

export default {
  name: 'podTable',
  components: { Pagination, JsonEditor },
  directives: { waves, elDragDialog },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  props: {
    tabName: {
      type: String,
      default: ''
    }
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
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
      columns: [],
      actions: [],
      podVariables: [{'key':1,'name':'name'},{'key':2,'name':'image'}],
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
      viewer: 'Pod',
      value: '',
      ip: "",
      dialogTableVisible: false,
      modelType: '',
      options: [
        { value: '队列模型', label: '队列模型' },
        { value: '最小费用最大流模型', label: '最小费用最大流模型' }
      ],
      createPodJson: {},
      createResource: "创建容器资源",
      catalog_kind: "Catalog",
      catalog_operator: "container",
      action_kind: "Action",
      action_operator: "container",
      tabMapOptions: [
        
      ],
      activeName: '',
      action: ''
    }
  },
  mounted() {
   
  },
  created() {
    console.log(this.tabName)
      getColumns(this.tabName).then(response => {
      this.columns = response.data    
        getListAllData({viewerName: this.tabName}).then(response3 => {
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
    getJsonData({kind: this.action_kind ,operator: this.action_operator}).then(response => {
      this.actions = response.data
      this.action = response.data[0].key
    })
  },
  methods: {
    showDialog(row) {
      this.dialogTableVisible = true
      var podName = row.metadata.name
      //var namespace = row.metadata.namespace
          
    },
    createJson() {
      this.dialogTableVisible = true
      getJsonData({kind: this.kind ,operator: 'create'}).then(response => {
      this.value = response.data      
      this.createPodJson = response.data
      //this.containerVariables = this.value[i].createVariables        
    })
          
    },
    create() {
      this.dialogTableVisible = false
      this.schedulingType = this.modelType
      var str = this.toRawJson(this.createPodJson)
      createSthFromTemplate({json: JSON.parse(str),kind: this.kind})
    },
    toRawJson(val){
      var str = JSON.stringify(val)
      str = str.replace(/ +/g,"")
      str = str.replace(/\\n/g,"")
      if(str[0] == "\"") {
        str = str.substring(1,str.length-1)
      }     
      str = str.replace(/\\/g,"")
      return str;
    },
     handleDrag() {
      this.$refs.select.blur()
    },
    openUrl(row) {
      console.log(row)
      var podName = row.metadata.name
      var host = this.ip
      var namespace = row.metadata.namespace
      window.open("http://"+host+":9000?host="+host+"&podName="+podName+"&namespace="+namespace)
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
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = []
        const filterVal = []
        for( var i = 0 ;i < this.columns.length;i++){
          tHeader.push(this.columns[i].label)
          filterVal.push(this.columns[i].row)
        }
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
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
          res = res[element]
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
    },
    deleteMenu(){
      // console.log(constantRoutes[9])
      // constantRoutes.splice(9,1)
      Bus.$emit('deleteMenuTest')
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
.json-editor{
  height: 538px;
  position: relative;
}
.json-editor >>> .CodeMirror {
  height: 538px;
  min-height: 300px;
}
</style>