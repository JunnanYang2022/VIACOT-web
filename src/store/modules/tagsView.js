const state = {
  visitedViews: [],
  cachedViews: [],

  currentIframeRoute: null,
  iframeRouteList: []
}

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
  },
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },

  ADD_TEMP_CACHED_VIEW: (state, view) => {
    const name = view.path
    if (state.cachedViews.includes(name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(name)
    }
  },

  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (view.meta && view.meta.isIframe) {
        if (view.name === v.name) {
          state.visitedViews.splice(i, 1)

          for (const [i, v] of state.iframeRouteList.entries()) {
            if (v.name === view.name) {
              state.iframeRouteList.splice(i, 1)
              break
            }
          }
          break
        }
      } else if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      if (v.meta.affix) {
        return true
      }
      if (v.meta && v.meta.isIframe) {
        return v.name === view.name
      }
      return v.path === view.path
    })

    if (view.meta && view.meta.isIframe) {
      state.currentIframeRoute = view
      state.iframeRouteList = [view]
    } else {
      state.currentIframeRoute = null
      state.iframeRouteList = []
    }
  },
  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = []
    }
  },

  DEL_ALL_VISITED_VIEWS: state => {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
    state.visitedViews = affixTags
  },
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = []
  },

  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  },

  SET_CURRENT_IFRAME_ROUTE(state, currentIframeRoute) {
    state.currentIframeRoute = currentIframeRoute
  },
  SET_IFRAME_ROUTE_LIST(state, iframeRouteList) {
    state.iframeRouteList = iframeRouteList
  },
  CLOSE_IFRAME(state, iframeRoute) {
    if (iframeRoute && iframeRoute.name) {
      for (const [i, v] of state.iframeRouteList.entries()) {
        if (v.name === iframeRoute.name) {
          state.iframeRouteList.splice(i, 1)
          break
        }
      }
    }
  },
  CLOSE_ALL_IFRAME(state) {
    state.currentIframeRoute = null
    state.iframeRouteList = []
  }
}

const actions = {
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },
  addTempCachedView({ commit }, view) {
    commit('ADD_TEMP_CACHED_VIEW', view)
  },

  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },

  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delOthersCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },

  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      dispatch('closeAllIframe')
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  delAllCachedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },

  updateVisitedView({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view)
  },

  closeIframe({ commit }, iframeRoute) {
    commit('CLOSE_IFRAME', iframeRoute)
  },
  closeAllIframe({ commit }) {
    commit('CLOSE_ALL_IFRAME')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
