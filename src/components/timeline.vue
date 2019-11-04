<template>
  <div class="container">
    <div class="timeline">
      <div v-for="item in events" class="article" :key="item.title">
        <span class="dot"></span>
        <p class="article-date">{{ item.firstTimestamp }}</p>
        <p>{{ item.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getListAllData } from "@/api/commonData";

export default {
  computed: {},

  data() {
    return {
      kind: "Event",
      events: []
    };
  },
  created() {
    getListAllData({ viewerName: this.kind }).then(response => {
      this.events = response.data;
    });
  },

  methods: {
    anyArticle() {
      return this.countAllArticles() ? true : false;
    },
    countAllArticles() {
      console.log(this.datesArticles);
      //   return this.datesArticles.length
    }
  }
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  width: 100%;
  max-width: 300px;
}

.timeline {
  position: relative;
  border-left: 1px solid black;
}

.date {
  display: inline-block;
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
  position: relative;
  left: 15px;
  margin: 15px 0;
}

.article {
  position: relative;
  left: 20px;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}

.article-date {
  font-weight: 300;
  font-size: 14px;
}

.dot {
  display: block;
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: green;
  left: -25.5px;
  top: calc(50% - 5px);
}
</style>