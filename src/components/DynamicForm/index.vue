<template>
  <div class="full-form">
    <h3>{{initParams.title}}</h3>
    <el-form
          :ref="initParams.formName"
          class="formStyle"
          :rules="initParams.rules"
          :model="initParams.model"
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
              :style="efi.selfStyle"
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
        <span>{{loading}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getObj, getMockObj, listAll, removeObj, createObj, validateRes} from "@/api/commonData";
export default {
  name: 'DynamicForm',
  props: {
      formData: Object
  },
  data() {
    return {
      initParams:{},
      loading:''
    }
  },
  created() {
    this.initParams = this.formData
    console.log(this.initParams)
    if(!this.initParams.title || this.initParams.title ==''){
      this.initParams.title = '标签'
    }
    if(!this.initParams.submitButton || this.initParams.submitButton ==''){
      this.initParams.submitButton = '提交'
    }
    if(!this.initParams.resetButton || this.initParams.resetButton ==''){
      this.initParams.resetButton = '重置'
    }
    for(var i =0;i<this.initParams.items.length;i++){
      if(this.initParams.items[i].type == 'select' || this.initParams.items[i].type == 'radio' || this.initParams.items[i].type == 'checkbox'){
        this.promiseDataSource(this.initParams.items[i].prop)
      }
    }
  },
  watch: {
      formData(newVal){
      this.initParams = newVal;
    }

  },
  methods: {
    submitForm() {
        this.$refs[this.initParams.formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    resetForm() {
      this.$refs[this.initParams.formName].resetFields();
    },
    promiseDataSource(itemName) {
      this.loading = "start"+itemName
      getMockObj({
        kind: "Frontend",
        name:  this.name + "-" + this.initParams.formName + "-" + itemName
      },"/ds/"+itemName).then( response => {
            if(validateRes(response)){
              this.initParams.dataSources[itemName] = response.data.spec.data
              console.log("change loading")
              this.loading = itemName
            }
            else{
            }
          }
        )
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