/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const templateRouter = {
  path: '/template',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Template',
  meta: {
    title: '系统配置',
    icon: 'chart',
    roles: ['admin']
  },
  children: [
    // {
    //   path: 'grafana',
    //   component: () => import('@/views/charts/grafana'),
    //   name: 'GrafanaChart',
    //   meta: { title: 'Grafana Chart', noCache: true }
    // },
    {
        path: 'podTemplate',
        component: () => import('@/views/echarts/schedule'),
        name: 'podTemplate',
        meta: { title: '调度策略' }
      },
      {
        path: 'VMTemplate',
        component: () => import('@/views/sysConfig/lifecycle'),
        name: 'VMTemplate',
        meta: { title: '生命周期' }
      },
      {
        path: 'testcase',
        component: () => import('@/views/testcase/testcase'),
        name: 'VMTemplate',
        meta: { title: '测试用例' }
      }
  ]
}

export default templateRouter
