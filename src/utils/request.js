import axios from 'axios'
import {MessageBox, Notification} from 'element-ui'
import store from '@/store'
import router from '@/router'

const ignoreError = '_ignore_error=true'

// create an axios instance
const baseUrl = process.env.VUE_APP_BASE_API
const service = axios.create({
    baseURL: baseUrl // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    // timeout: 5000 // request timeout
})

// request interceptor
/*service.interceptors.request.use(
    config => {
        // do something before request is sent

        if (store.getters.token) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers['token'] = getToken()
        }
        if (store.getters.language) {
            config.headers['Accept-Language'] = store.getters.language + ';q=0.9'
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)*/

const reLogin = () => {
    if (window._CONFIG.cas) {
        store.dispatch('user/resetToken').then(() => {
            const baseUrl = process.env.NODE_ENV === 'development' ? '' : process.env.VUE_APP_BASE_API
            const service = window.location.protocol + '//' + window.location.host + baseUrl + '/?appId=' + window._CONFIG['appId']
            const serviceUrl = encodeURIComponent(service)
            window.location = window._CONFIG['casPrefixUrl'] + '/login?service=' + serviceUrl
        })
        return
    }
    if (window._CONFIG.oauth) {
        store.dispatch('user/resetToken').then(() => {
            const baseUrl = process.env.NODE_ENV === 'development' ? process.env.BASE_URL : process.env.VUE_APP_BASE_API
            const service = window.location.protocol + '//' + window.location.host + baseUrl
            window.location.href = `${window._CONFIG['oauthPrefixUrl']}/app/oauth/login?response_type=code&scope=USERINFO&state=state&client_id=${window._CONFIG['oauthClientId']}&redirect_uri=${service}`
        })
        return
    }
    MessageBox.confirm('登录超时，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        store.dispatch('user/resetToken').then(() => {
            location.reload()
        })
    })
}

/**
 * 获取token的方法
 * @returns {string}
 */
// const getToken = () => {
//     return ''
// }

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data

        if (res instanceof Blob) {
            return response
        }

        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 200) {
            if (response.config.url && response.config.url.indexOf(ignoreError) === -1) {
                if (res.code === 500 && res.data) {
                    const notification = Notification({
                        dangerouslyUseHTMLString: true,
                        message: `<a style="color: #0088fe">服务器出错，点击查看详情</a>`,
                        type: 'error',
                        offset: 50,
                        duration: 0,
                        onClick: () => {
                            notification.close()
                            // 错误弹窗
                            // ErrorLogDialog.show({id: res.data})
                        }
                    })
                } else {
                    Notification({
                        message: res.message || 'Error',
                        type: 'error',
                        offset: 50,
                        duration: 5 * 1000
                    })
                }
            }

            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 401) {
                if (response.config.url && response.config.url.indexOf('_allow_anonymous=true') === -1) {
                    reLogin()
                }
                // to re-login
            }
            if (res.code === 700) {
                router.replace({path: '/change-pwd'})
            }
            if (res.code === 701) {
                router.replace({name: 'NoAuth'})
            }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error) // for debug
        if (error.response.status === 401) {
            if (error.response.config.url && error.response.config.url.indexOf('_allow_anonymous=true') === -1) {
                reLogin()
            }
            return Promise.reject(error)
        }

        if (error.response.status === 700) {
            router.replace({path: '/change-pwd'})
            return Promise.reject(error)
        }
        if (error.response.status === 701) {
            router.replace({name: 'NoAuth'})
            return Promise.reject(error)
        }
        if (error.response.config.url && error.response.config.url.indexOf(ignoreError) === -1) {
            Notification({
                message: error.message,
                type: 'error',
                offset: 50,
                duration: 5 * 1000
            })
        }
        return Promise.reject(error)
    }
)

export default service
