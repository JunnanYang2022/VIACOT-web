import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let lineageRouter = new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/Main/Home.vue')
        },
        {
            path: '/search',
            name: 'search',
            component: () => import('@/views/Main/Search'),
        },
        {
            path: '/visualization',
            name: 'Visualization',
            component: () => import('@/views/Main/Visualization'),
        },
        {
            path: '/upload',
            name: 'upload',
            component: () => import('@/views/Main/Upload'),
        }
    ]
})

// 判断是否需要登录权限 以及是否登录
lineageRouter.beforeEach((to, from, next) => {
    // 判断是否需要登录权限
    if (to.matched.some(res => res.meta.requireAuth)) {
        // 判断是否登录
        if (sessionStorage.getItem('token')) {
            next()
        } else {
            // 没登录则跳转到登录界面
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath
                }
            })
        }
    } else {
        next()
    }
})

export default lineageRouter
