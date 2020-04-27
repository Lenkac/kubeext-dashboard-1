<template>
  <div class="app-container">
    <iframe class="iframe"  :src="imageHubLink"></iframe>
  </div>
</template>

<script>
import { getImageHubLink } from "@/utils/getResource";

export default {
  name: "imageHubLink",
  data() {
    return {
      imageHubLink: ""
    };
  },
  mounted() {
    this.imageHubLink = getImageHubLink();
  },
  methods: {
    
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.iframe {
  width: 100%;
  height: 1000px;
  border: 0ch;
}
</style>
