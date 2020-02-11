/*
权限校验：
通过router路由前置钩子函数 beforeEach() ，
在跳转路由前进行拦截判断是否已经登录，
如果已登录，则进行路由跳转，如果没有则回到登录页
*/
import router from './router'
import { getUserInfo } from './api/login'
/*
前置路由钩子函数
to ：即将要进入的目标路由对象
from ：当前导航正要离开的路由对象
next : 调用该方法，进入目标路由
*/
router.beforeEach((to, from, next) => {
    // 1.获取 token
    const token = localStorage.getItem('msm-token')
    if (!token) {
        //1.1如果没有获取到
        //要访问非登录页面，则不让访问，加到登录页面/login
        if (to.path !== '/login') {
            next({ path: '/login' })
        } else {
            next()
        }
    } else {
        // 1.2 获取到token
        //     1.2.1请求路由 /login，那就去目标路由
        if (to.path === '/login') {
            next()
        } else {
            //     1.2.2请求路由非登录页面，就通过token去获取用户信息
            const userinfo = localStorage.getItem('msm-user')
            if (userinfo) {
                //本地获取到，则直接去目标路由
                next()
            } else {
                //     如果本地没有用户信息，就通过token去获取用户信息
                getUserInfo(token).then(Response => {
                    const resp = response.data
                    if (resp.flag) {
                        // 获取到, 保存数据,则进行非登陆页面，否则回到登陆页面
                        //保存本地
                        localStorage.setItem('msm-user', JSON.stringify(resp.data))
                        next()
                    } else {
                        // 未获取到,重新登录
                        next({ path: '/login' })
                    }
                })
            }
        }
    }
})


