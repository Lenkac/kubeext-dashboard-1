/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const scheduleConfigRouter = {
  path: '/scheduleConfig',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ScheduleConfig',
  meta: {
    title: '调度配置',
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
        path: 'schedule',
        component: () => import('@/views/scheduleConfig/schedule'),
        name: 'schedule',
        meta: { title: '调度配置' }
      }
  ]
}

export default scheduleConfigRouter
