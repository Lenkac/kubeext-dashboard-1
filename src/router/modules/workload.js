/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const workloadsRouter = {
  path: '/workloads',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Workloads',
  meta: {
    title: '任务管理',
    icon: 'chart'
  },
  children: [
    {
      path: 'pod-table',
      component: () => import('@/views/charts/pod-table'),
      name: 'podTable',
      meta: { title: '任务（容器）' }
    },{
      path: 'vm-table',
      component: () => import('@/views/charts/vm-table'),
      name: 'vmTable',
      meta: { title: '任务（虚拟机）' }
    },
    {
      path: 'testcase',
      component: () => import('@/views/charts/testcase'),
      name: 'testcase',
      meta: { title: '任务（演示）' }
    }
  ]
}


export default workloadsRouter
