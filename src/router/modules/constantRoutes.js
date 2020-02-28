import Layout from '@/layout'

const constantRoutes = [
    {
      path: '/redirect',
      component: Layout,
      hidden: true,
      children: [
        {
          path: '/redirect/:path*',
          component: () => import('@/views/redirect/index')
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/charts/node-table'),
      hidden: true
    },
    {
      path: '/auth-redirect',
      component: () => import('@/views/login/auth-redirect'),
      hidden: true
    },
    {
      path: '/404',
      component: () => import('@/views/error-page/404'),
      hidden: true
    },
    {
      path: '/401',
      component: () => import('@/views/error-page/401'),
      hidden: true
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/dashboard/index'),
          name: 'dashboard',
          meta: { title: '仪表盘', icon: 'dashboard', affix: true }
        }
      ]
    },
    {
      path: '/resourceInfo',
      component: Layout,
      redirect: '/resourceInfo',
      hidden: true,
      children: [
        {
          path: 'nodeInfo',
          component: () => import('@/views/resourceInfo/nodeInfo'),
          name: 'nodeInfo',
          meta: { title: '任务信息', icon: 'user', noCache: true }
        },
        {
          path: 'containerInfo',
          component: () => import('@/views/resourceInfo/containerInfo'),
          name: 'containerInfo',
          meta: { title: '容器信息', icon: 'user', noCache: true }
        },
        {
          path: 'vmInfo',
          component: () => import('@/views/resourceInfo/vmInfo'),
          name: 'vmInfo',
          meta: { title: 'vm信息', icon: 'user', noCache: true }
        }
      ]
    }
  ]

  export default constantRoutes