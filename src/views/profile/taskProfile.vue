<template>
  <div class="app-container">
    <el-row :gutter="20">    
      <el-col :span="13" style="margin-bottom:32px;">
        <el-card>
          <div class="card-editor-container">
            <json-editor ref="jsonEditor" v-model="value" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="11" style="margin-bottom:32px;"> 
        <el-card>       
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="24">
              <iframe class="rate_iframe" :src="monitor_rs.cpu"></iframe>
            </el-col>
          </el-row>
        </el-card>
        <el-card>
        <el-row type="flex" class="row-bg">
          <el-col :span="24">
            <iframe class="rate_iframe" :src="monitor_rs.memory"></iframe>
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="24">
            <iframe class="rate_iframe" :src="monitor_rs.fs"></iframe>
          </el-col>
        </el-row>
      </el-card>
      <el-card> 
        <el-row>
          <el-col :span="24">
            <iframe class="IO_iframe" :src="monitor_rs.network"></iframe>
          </el-col>
        </el-row>  
      </el-card>      
      </el-col>   
    </el-row>
    <el-row> 
    <el-card>
          <div>
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
          <router-link :to="{path:'/profile/taskProfile'}" v-if="item.kind == 'a'" tag="a" class="link" >
            {{ getInputValue(scope.row,item.row) }}
          </router-link>
          <span v-if="item.kind == undefined">{{ getInputValue(scope.row,item.row) }}</span>
        </template>
      </el-table-column>
      </el-table>
      </div>
        </el-card>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import {getMonitorInfo} from '@/utils/getResource'
import JsonEditor from '@/components/JsonEditor'
import { getListAllData, getColumns, getActions, getFilterForm, getLittleDataSource, getRules, getTemp } from '@/api/commonData'


export default {
  name: 'taskProfile',
  components: { UserCard, Activity, Timeline, Account,JsonEditor },
  data() {
    return {
      tableKey: 0,
      list: null,
      user: {},
      activeTab: 'activity',
      key: '',
      monitor_rs:{},
      node:'',
      viewerName:'Node',
      nodeName:'',
      podList:'',
      listQuery:'',
      listLoading:'',
      columns:'',
      ip:'',
      value: '',
      kind: 'Node'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
    this.key = this.$route.query.taskid
    this.nodeName = this.$route.query.node;

    this.monitor_rs = getMonitorInfo(this.kind, this.nodeName)
    
    getColumns(this.viewerName).then(response => {
      this.columns = response.data      
        getListAllData({viewerName: this.viewerName}).then(response3 => {
          var data = response3.data
          //this.total = response3.total
          this.listLoading = false
          for(var i = 0; i < data.length; i++) {
              if(data[i].metadata.name == this.nodeName) {
                this.value = data[i]
              }
            }
            this.list = data
            //console.log(data)
    })
    })
  },
  mounted() {
    
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    },
    getList() {
      this.listLoading = true
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
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
    }
  },
}
</script>
<style lang="scss" scoped>
.iframe{
  width: 280px;
  height: 135px;
  border: 0ch;
  }
.rate_iframe{
  width: 562px;
  height: 150px;
  border: 0ch;
  }
.IO_iframe{
  width: 562px;
  height: 150px;
  border: 0ch;
  }
.board {
  margin-left: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.card-editor-container{
  position: relative;
  width: 100%;
  height: 70%;
}
</style>