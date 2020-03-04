<template>
  <div class="full-form">
    <h3>{{initParams.title}}</h3>
    <el-form
          :ref="initParams.formName"
          class="formStyle"
          :rules="initParams.rules"
          :model="initParams.formMetaData"
          label-position="left"
          label-width="150px"
          :style="initParams.formStyle"
        >
          <el-form-item
            v-for="efi in initParams.items"
            :key="efi.key"
            :label="efi.label"
            :prop="efi.prop"
            :style="efi.itemStyle"
          >
            <el-input
              v-if="efi.type == 'input'"
              v-model="initParams.model[efi.prop]"
              :placeholder="efi.ph"
              :style="efi.selfStyle"
            />
            <el-select
              v-if="efi.type == 'select'"
              v-model="initParams.model[efi.prop]"
              :placeholder="efi.ph"
              :style="efi.style"
            >
              <el-option
                v-for="lds in initParams.dataSources[efi.prop]"
                :key="lds.key"
                :label="lds.label"
                :value="lds.value"
              />
            </el-select>
            <el-checkbox-group v-if="efi.type == 'checkbox'" v-model="initParams.model[efi.prop]">
              <el-checkbox
               v-for="r in initParams.dataSources[efi.prop]"
                :key="r.key"
                :label="r.label"></el-checkbox>
            </el-checkbox-group>
            <el-radio-group v-if="efi.type == 'radio'" v-model="initParams.model[efi.prop]">
              <el-radio
               v-for="r in initParams.dataSources[efi.prop]"
                :key="r.key"
                :label="r.label"></el-radio>
            </el-radio-group>
            <el-input
              v-if="efi.type == undefined"
              v-model="temp[efi.prop]"
              :placeholder="efi.ph"
              :style="efi.style"
            />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">{{initParams.submitButton}}</el-button>
        <el-button @click="resetForm()">{{initParams.resetButton}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getObj, getMockObj, listAll, removeObj, createObj, validateRes} from "@/api/commonData";
export default {
  name: 'DynamicForm',
  data() {
    return {
      initParams:{}
    }
  },
  mounted() {
    if(!initParams.title || initParams.title ==''){
      initParams.title = '标签'
    }
    if(!initParams.submitButton || initParams.submitButton ==''){
      initParams.submitButton = '提交'
    }
    if(!initParams.resetButton || initParams.resetButton ==''){
      initParams.resetButton = '重置'
    }
    let promiseList = []
    for(var i =0;i<initParams.items.length;i++){
      if(initParams.items[i].type == 'select' || initParams.items[i].type == 'radio' || initParams.items[i].type == 'checkbox'){
        promiseList.push(this.promiseDataSource(initParams.items[i].prop))
      }
    }
    Promise.all(promiseList).then((res) => {
      console.log(res, 'promise all datasources.')
    })
  },
  methods: {
    submitForm() {
        this.$refs[initParams.formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    resetForm() {
      this.$refs[initParams.formName].resetFields();
    },
    promiseDataSource(itemName) {
      return new Promise((resolve, reject) => {
      getMockObj({
        kind: "Frontend",
        name:  this.name + "-" + initParams.formName + "-" + itemName
      }).then( 
          response => {
            if(validateRes(response)){
              initParams.dataSources[itemName] = response.data.spec.data
              resolve(response.data.spec.data.json())
            }
            else{
              reject(response.data.json())
            }
          }
        )
      })
    }
  }
}
</script>

<style scoped>
.full-form {
  min-width: 100%;
  min-height: 100%;
  height: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;
}
.formStyle {
  width: 400px; 
  margin-left:50px;
}
</style>