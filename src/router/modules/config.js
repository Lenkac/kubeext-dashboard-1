/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const configRouter = {
  path: '/config',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Config',
  meta: {
    title: '配置',
    icon: 'chart'
  },
  children: [
    {
      path: 'api-analysis',
      component: () => import('@/views/config/apiAnalysis'),
      name: 'apiAnalysis',
      meta: { title: 'api分析' }
    },
    // {
    //   path: 'network',
    //   component: () => import('@/views/charts/network'),
    //   name: 'network',
    //   meta: { title: '网络拓扑' }
    // },
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

export default configRouter
