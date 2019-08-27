/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const workloadsRouter = {
  path: '/workloads',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Workloads',
  meta: {
    title: '工作负载',
    icon: 'chart'
  },
  children: [
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
  ]
}

export default workloadsRouter
