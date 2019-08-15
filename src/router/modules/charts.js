/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Charts',
  meta: {
    title: '资源管理',
    icon: 'chart'
  },
  children: [
    // {
    //   path: 'grafana',
    //   component: () => import('@/views/charts/grafana'),
    //   name: 'GrafanaChart',
    //   meta: { title: 'Grafana Chart', noCache: true }
    // },
    {
      path: 'node-table',
      component: () => import('@/views/charts/node-table'),
      name: 'nodeTable',
      meta: { title: '主机基本信息' }
    },
    {
      path: 'pod-table',
      component: () => import('@/views/charts/pod-table'),
      name: 'podTable',
      meta: { title: 'pod基本信息' }
    },{
      path: 'vm-table',
      component: () => import('@/views/charts/vm-table'),
      name: 'vmTable',
      meta: { title: 'vm基本信息' }
    }
    // {
    //   path: 'mix-chart',
    //   component: () => import('@/views/charts/mix-chart'),
    //   name: 'MixChart',
    //   meta: { title: 'Mix Chart', noCache: true }
    // }
  ]
}

export default chartsRouter
