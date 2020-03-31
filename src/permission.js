import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
//import {setAsyncRoutes,getAsyncRoutes} from '@/router/modules/asyncRoutes'
import Layout from '@/layout'
import { getObj,getMockObj } from '@/api/commonData'
import { getKV } from '@/utils/auth'

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
var viewRoles

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    console.log(hasToken)
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles
      console.log(hasRoles)
      if (hasRoles) {
        if(to.path.indexOf("/simpleLayout") !=-1){
          let str = to.name.split('-')
          const { data } = await getMockObj({
            kind: str[0],
            name: str[1] + "-" + str[2].toLowerCase()
          },'/SimpleLayout/user')
          to.meta.data = data.spec
        }

        if(to.path.indexOf("/Workloads") !=-1 ||to.path.indexOf("/Cluster") !=-1 || to.path.indexOf("/Discovery and Load Balancing key") !=-1 || to.path.indexOf("/ Config and Storage") !=-1 || to.path.indexOf("/Custom Resource Definitions") !=-1){
          const { data } = await getObj({
            kind: "Frontend",
            name: "formsearch" + "-" + to.name.toLowerCase()
            })
          to.meta.data = data.spec.data
        }

        if(to.path.indexOf("/cloudplatform") !=-1){
          const { data } = await getObj({
            kind: "Frontend",
            name: "form" + "-" + to.meta.name.toLowerCase()
            })
          to.meta.data = data.spec.data
        }
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { role } = await store.dispatch('user/getInfo')
          console.log(role)
          var roles = []
          roles.push(role)
          const { data } = await getObj({"kind": "RBACRole" , "name": role, namespace:getKV('projectNum')})
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/setRoutes', [roles, filterAsyncRouter(data.spec.routes)])

          // dynamically add accessible routes
          console.log(accessRoutes)
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          console.log(error)
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      console.log("message")
      next(`/login?redirect=${to.path}`)
      NProgress.done()
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
  //console.log(accessedRouters)
  return accessedRouters
}

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
