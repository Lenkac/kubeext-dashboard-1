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
    {
      path: 'node-table',
      component: () => import('@/views/charts/node-table'),
      name: 'nodeTable',
      meta: { title: '主机基本信息' }
    }
    
  ]
}

export default chartsRouter
