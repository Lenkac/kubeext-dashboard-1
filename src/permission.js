import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
//import {setAsyncRoutes,getAsyncRoutes} from '@/router/modules/asyncRoutes'
import Layout from '@/layout'
import { getColumns } from '@/api/commonData'

const _import = require('@/router/_import_development')
const whiteList = ['/login', '/auth-redirect']
NProgress.configure({ showSpinner: false })

let additionalRouter = [
  // {
  //   path: '/permission',
  //   component: "Layout",
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: 'permission/page',
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page Permission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: 'permission/directive',
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Directive Permission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: 'permission/role',
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
]

var realRouter

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  
  if(!hasToken){
    next(`/login?redirect=${to.path}`)
    NProgress.done()
  } else{
    if(to.path === '/login'){
      next({ path: '/' })
      NProgress.done()
    }
    else{
      if(!(store.getters.roles && store.getters.roles.length > 0)){
        try {
          store.dispatch('user/getInfo').then(roles => {
            return roles
          }).then(roles => {
            if (!realRouter) {
              getColumns(process.env.VUE_APP_PROJECTTITLE + '-viewroute').then(response => {
                realRouter = filterAsyncRouter(response.data)
                router.addRoutes(realRouter)
                return {realRouter: realRouter, roles: roles}
              }).then( obj => {
                store.dispatch('permission/setRoutes', obj.realRouter,obj.roles).then(()=>{
                  console.log(realRouter)
                  next({ ...to, replace: true })
                })
              })
            }
          })
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
      else{
        next()
        NProgress.done()
      }
    }
  }

})

function filterAsyncRouter(ar) {
  const accessedRouters = ar.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = _import(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
