/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
import getters from '@/store/getters'
import _user from '@/store/modules/user'
var state =_user.state
var title = ''
console.log(state.token)
if(state.token == 'admin-token') {
  title = "实例"
}else{
  title = "应用"
}
const workloadsRouter = {
  path: '/workloads',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Workloads',
  meta: {
    title: title+'管理',
    icon: 'chart',
    roles: ['ladder']
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

export default workloadsRouter
