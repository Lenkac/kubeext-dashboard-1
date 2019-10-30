/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const templateRouter = {
  path: '/template',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Template',
  meta: {
    title: '配置管理',
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
        meta: { title: '容器生命周期' }
      },
      {
        path: 'VMTemplate',
        component: () => import('@/views/template/VMTemplate'),
        name: 'VMTemplate',
        meta: { title: 'vm生命周期' }
      }
  ]
}

export default templateRouter
