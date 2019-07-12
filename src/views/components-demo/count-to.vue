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
    <div class="board">
      <Kanban :key="1" :list="list1" :group="group" class="kanban todo" header-text="任务情况" />
      <Kanban :key="2" :list="list2" :group="group" class="kanban working" header-text="机器情况" />
      <Kanban :key="3" :list="list3" :group="group" class="kanban done" header-text="任务部署情况" />
    </div>
    <aside>
      <a href="javascript:void(0)" target="_blank">最小费用最大流（MCMF）模型</a>
    </aside>
    <canvas id="test-canvas" style="width:100%;height:300px"></canvas>
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
        { name: '任务2：（4 Core，4 Ram）', id: 2 },
        { name: '任务2：（4 Core，4 Ram）', id: 2 },
        { name: '任务3：（4 Core，4 Ram）', id: 3 }
      ],
      list2: [
        { name: '机器1：（4 Core，4 Ram）', id: 5 },
        { name: '机器2：（4 Core，4 Ram）', id: 6 },
        { name: '机器3：（4 Core，4 Ram）', id: 7 }
      ],
      list3: [
        { name: '任务1-机器2' },
        { name: '任务1-机器2' },
        { name: '任务1-机器2' }
      ]
    }
  },
  mounted() {
    var can = document.getElementById('test-canvas')
    var ctx = can.getContext('2d')
    ctx.clearRect(0, 0, 200, 200)
    ctx.fillStyle = '#dddddd'
    ctx.fillRect(10, 10, 130, 130)
    var path = new Path2D()
    path.arc(75, 75, 50, 0, Math.PI * 2, true)
    path.moveTo(110, 75)
    path.arc(75, 75, 35, 0, Math.PI, false)
    path.moveTo(65, 65)
    path.arc(60, 65, 5, 0, Math.PI * 2, true)
    path.moveTo(95, 65)
    path.arc(90, 65, 5, 0, Math.PI * 2, true)
    ctx.strokeStyle = '#0000ff'
    ctx.stroke(path)
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

<style lang="scss">

.board {
  margin-left: 20px;
  margin-bottom: 20px;
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

