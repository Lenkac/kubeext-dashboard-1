import Layout from '@/layout'
import workloadsRouter from './workload'
import chartsRouter from './charts'
import templateRouter from './template'


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
      component: () => import('@/views/login/index'),
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
      path: '/profile',
      component: Layout,
      redirect: '/profile/index',
      hidden: true,
      children: [
        {
          path: 'index',
          component: () => import('@/views/profile/index'),
          name: 'Profile',
          meta: { title: '个人信息', icon: 'user', noCache: true }
        },
        {
          path: 'taskProfile',
          component: () => import('@/views/profile/taskProfile'),
          name: 'taskProfile',
          meta: { title: '任务信息', icon: 'user', noCache: true }
        },
        {
          path: 'containerInfo',
          component: () => import('@/views/profile/containerInfo'),
          name: 'containerInfo',
          meta: { title: '容器信息', icon: 'user', noCache: true }
        },
        {
          path: 'vmInfo',
          component: () => import('@/views/profile/vmInfo'),
          name: 'vmInfo',
          meta: { title: 'vm信息', icon: 'user', noCache: true }
        }
      ]
    },
    workloadsRouter,
    chartsRouter,
    templateRouter
  ]

  export default constantRoutes