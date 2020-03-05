

<template>
  <div class="full-layout">
    <div class="full-layout" v-if="rNamePrefix == 'leftRightLayout'">
        <div style="width:50%;height:100%;float:left">
            <DynamicForm :initParams="responseJson.left"></DynamicForm>
        </div>
        <div style="width:50%;height:100%;float:left">

        </div>
    </div>
  </div>
</template>

<script>
import {getObj, getMockObj, removeObj, createObj, validateRes} from "@/api/commonData";
import DynamicForm from "@/components/DynamicForm";
export default {
  name: 'SimpleLayout',
  components: { DynamicForm},
  data() {
    return {
      rKind: '',
      rNamePrefix:'',
      rNameSuffix:'',
      responseJson: {}
    }
  },
  mounted() {
    let str = this.$route.name.split('-')
    if(str.length == 3){
        this.rKind = str[0]
        this.rNamePrefix= str[1]
        this.rNameSuffix = str[2]
    }
    getMockObj({
      kind: this.rKind,
      name: this.rNamePrefix + "-" + this.rNameSuffix.toLowerCase()
    }).then(response => {
        if(validateRes(response)){
            this.responseJson = response.data.spec.data
        }
    })
  },
  methods: {
    
  }
}
</script>

<style scoped>
.full-layout {
  min-width: 100%;
  min-height: 100%;
  height: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;
}
</style>