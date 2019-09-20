/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const templateRouter = {
  path: '/template',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Template',
  meta: {
    title: '元配置管理',
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
        path: 'podTemplate',
        component: () => import('@/views/template/podTemplate'),
        name: 'podTemplate',
        meta: { title: '容器配置' }
      },
      {
        path: 'VMTemplate',
        component: () => import('@/views/template/VMTemplate'),
        name: 'VMTemplate',
        meta: { title: 'vm配置' }
      }
    // {
    //   path: 'mix-chart',
    //   component: () => import('@/views/charts/mix-chart'),
    //   name: 'MixChart',
    //   meta: { title: 'Mix Chart', noCache: true }
    // }
  ]
}

export default templateRouter
