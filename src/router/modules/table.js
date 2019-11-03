/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/workloads',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Workloads',
  meta: {
    title: '实例管理',
    icon: 'chart',
    roles: ['admin']
  },
  children: [
    {
      path: 'pod-table',
      component: () => import('@/views/charts/pod-table'),
      name: 'podTable',
      meta: { title: '容器' }
    },{
      path: 'vm-table',
      component: () => import('@/views/charts/vm-table'),
      name: 'vmTable',
      meta: { title: '虚拟机' }
    }
  ]
}
export default tableRouter
