<template>
  <div class="components-container">
    <el-row style="margin-bottom:20px;">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>当前模型选择：
            <p style="color:red;display:inline;font-size:20px;"> <strong>{{ schedulingType }}</strong></p>
          </span>
        </div>
        <div style="margin-bottom:50px;">
          <el-col :span="12" class="text-center">
            <el-button type="primary" @click.native="clickA">队列模型</el-button>
          </el-col>
          <el-col :span="12" class="text-center">
              <el-button type="primary" @click.native="clickB">最小费用最大流（MCMF）模型</el-button>
          </el-col>
        </div>
      </el-card>
    </el-row>
    <aside>
      <a href="javascript:void(0)" target="_blank">队列模型</a>
    </aside>
    <div class="components-container board">
      <Kanban :key="1" :list="list1" :group="group" class="kanban todo" header-text="Todo" />
      <Kanban :key="2" :list="list2" :group="group" class="kanban working" header-text="Working" />
      <Kanban :key="3" :list="list3" :group="group" class="kanban done" header-text="Done" />
    </div>
    <aside>
      <a href="javascript:void(0)" target="_blank">最小费用最大流（MCMF）模型</a>
    </aside>

  </div>
</template>

<script>

import Kanban from '@/components/Kanban'

export default {
  name: 'CountToDemo',
  components: {
    Kanban
  },
  data() {
    return {
      schedulingType: '队列模型',
      group: 'mission',
      list1: [
        { name: 'Mission', id: 1 },
        { name: 'Mission', id: 2 },
        { name: 'Mission', id: 3 },
        { name: 'Mission', id: 4 }
      ],
      list2: [
        { name: 'Mission', id: 5 },
        { name: 'Mission', id: 6 },
        { name: 'Mission', id: 7 }
      ],
      list3: [
        { name: 'Mission', id: 8 },
        { name: 'Mission', id: 9 },
        { name: 'Mission', id: 10 }
      ]
    }
  },
  methods: {
    clickA() {
      this.schedulingType = '队列模型'
    },
    clickB() {
      this.schedulingType = '最小费用最大流（MCMF）模型'
    }
  }
}
</script>

<style scoped lang="scss">
.example-btn {
  display: inline-block;
  margin-bottom: 0;
  font-weight: 500;
  text-align: center;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  line-height: 1.5;
  padding: 4px 15px;
  font-size: 12px;
  border-radius: 4px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
  transition: all .3s cubic-bezier(.645, .045, .355, 1);
  position: relative;
  color: rgba(0, 0, 0, .65);
  background-color: #fff;
  border-color: #d9d9d9;
}

.example-btn:hover {
  color: #4AB7BD;
  background-color: #fff;
  border-color: #4AB7BD;
}
.example {
  font-size: 50px;
  color: #F6416C;
  display: block;
  margin: 10px 0;
  text-align: center;
  font-size: 80px;
  font-weight: 500;
}

.label {
  color: #2f4f4f;
  font-size: 16px;
  display: inline-block;
  margin: 15px 30px 15px 0;
}

input {
  position: relative;
  display: inline-block;
  padding: 4px 7px;
  width: 70px;
  height: 28px;
  cursor: text;
  font-size: 12px;
  line-height: 1.5;
  color: rgba(0, 0, 0, .65);
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  -webkit-transition: all .3s;
  transition: all .3s;
}

.startBtn {
  margin-left: 20px;
  font-size: 20px;
  color: #30B08F;
  background-color: #fff;
}

.startBtn:hover {
  background-color: #30B08F;
  color: #fff;
  border-color: #30B08F;
}

.pause-resume-btn {
  font-size: 20px;
  color: #E65D6E;
  background-color: #fff;
}

.pause-resume-btn:hover {
  background-color: #E65D6E;
  color: #fff;
  border-color: #E65D6E;
}

.board {
  width: 1000px;
  margin-left: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4A9FF9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}
</style>

