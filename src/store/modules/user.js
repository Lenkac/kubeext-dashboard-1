import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { getKV, setKV, removeKV } from '@/utils/auth'
import {
  getObj,
  listAll
} from "@/api/commonData";

const state = {
  token: getToken(),
  projectNum: getKV('projectNum'),
  name: '',
  avatar: 'ladder.jpg',
  introduction: '',
  role: '',
  userName: ""
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_PN: (state, projectNum) => {
    state.projectNum = projectNum
  },
  SET_NS: (state, namespace) => {
    state.namespace = namespace
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, role) => {
    state.role = role
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, namespace, projectNum } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: projectNum+"-"+username.trim(), password: password ,namespace: namespace}).then(response => {
        const { data } = response
        if(response.code == 50000){
          console.log("hhhhh")
          alert('error')
        }
        
        console.log(response)
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        commit('SET_PN', projectNum)
        commit('SET_NS', namespace)
        commit('SET_USERNAME', username)
        setKV('projectNum', projectNum)
        setKV('username', username)
        console.log(getKV('projectNum'))
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getObj({name: getKV('projectNum')+"-"+getKV('username').trim(), namespace: state.namespace, kind:"RBACUser" }).then(response => {
        
        if (!response.data) {
          reject('Verification failed, please Login again.')
        }
        
        const { role, name } = response.data.spec

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }

        commit('SET_ROLES', role)
        commit('SET_NAME', name)
        //commit('SET_AVATAR', avatar)
        //commit('SET_INTRODUCTION', introduction)
        resolve(response.data.spec)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', '')
        commit('SET_PN', '')
        removeToken()
        removeKV('projectNum')
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', '')
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(state.name, token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
