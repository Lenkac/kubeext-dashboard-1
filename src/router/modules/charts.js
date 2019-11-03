/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Charts',
  meta: {
    title: '资源管理',
    icon: 'chart',
    roles: ['admin']
  },
  children: [
    {
      path: 'node-table',
      component: () => import('@/views/charts/node-table'),
      name: 'nodeTable',
      meta: { title: '计算资源' }
    },
    {
      path: 'network',
      component: () => import('@/views/charts/network'),
      name: 'network',
      meta: { title: '网络拓扑' }
    },
    // {
    //   path: 'test',
    //   component: () => import('@/views/echarts/test'),
    //   name: 'test',
    //   meta: { title: '测试echarts' }
    // },
    // {
    //   path: 'schedule',
    //   component: () => import('@/views/echarts/schedule'),
    //   name: 'schedule',
    //   meta: { title: '调度' }
    // }
    
  ]
}

export default chartsRouter
