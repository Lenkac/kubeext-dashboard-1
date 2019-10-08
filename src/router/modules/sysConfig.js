/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const sysConfigRouter = {
  path: '/sysConfig',
  component: Layout,
  redirect: 'noRedirect',
  name: 'SysConfig',
  meta: {
    title: '测试用例',
    icon: 'chart',
  },
  children: [
    // {
    //   path: 'grafana',
    //   component: () => import('@/views/charts/grafana'),
    //   name: 'GrafanaChart',
    //   meta: { title: 'Grafana Chart', noCache: true }
    // },
    {
        path: 'priority',
        component: () => import('@/views/sysConfig/priority'),
        name: 'priority',
        meta: { title: '任务优先级' }
      },
      {
        path: 'divide',
        component: () => import('@/views/sysConfig/divide'),
        name: 'divide',
        meta: { title: '主机资源超分' }
      }
  ]
}

export default sysConfigRouter
