

<template>
  <div class="full-layout">
    <div class="full-layout" v-if="rNamePrefix == 'leftRightLayout'">
        <div style="width:50%;height:100%;float:left">
            <dynamic-form :formData="responseJson.left"></dynamic-form>
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
      responseJson: {},
      dataLoading: true
    }
  },
  created: function() {
    let str = this.$route.name.split('-')
    if(str.length == 3){
        this.rKind = str[0]
        this.rNamePrefix= str[1]
        this.rNameSuffix = str[2]
    }
    this.responseJson = this.$route.meta.data
  },
  mounted: function() {
    
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