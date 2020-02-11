import Vue from "vue";
import Router from "vue-router";
// 默认导入目录下的 index.vue 文件，等价于 ./views/login/index.vue
import Login from './views/login'
// 布局组件
import Layout from './components/Layout.vue'
import Home from './views/home'
import Member from './views/member'
import Supplier from './views/supplier'
import Goods from './views/goods'
import Staff from './views/staff'

Vue.use(Router);

export default new Router({
  routes: [
    {
      // 登录页
      path: '/login',
      name: 'login', //路由名称
      component: Login
    },
    {
      // 基础布局
      path: '/',
      name: 'layout',
      component: Layout,
      redirect: '/home',// 重定向到子路由
      children: [
        {
          path: '/home',
          component: Home,
          meta: { title: '首页' }
        },
      ]
    },
    {
      // 会员管理
      path: '/member',
      component: Layout,
      children: [
        {
          path: '/',
          component: Member,
          meta: { title: '会员管理' }
        }
      ]
    },
    {
      // 供应商管理
      path: '/supplier',
      component: Layout,
      children: [
        {
          path: '/',
          component: Supplier,
          meta: { title: '供应商管理' }
        }
      ]
    },
    {
      // 商品管理
      path: '/goods',
      component: Layout,
      children: [
        {
          path: '/',
          component: Goods,
          meta: { title: '商品管理' }
        }
      ]
    },
    {
      // 员工管理
      path: '/staff',
      component: Layout,
      children: [
        {
          path: '/',
          component: Staff,
          meta: { title: '员工管理' },
        }
      ]
    },
  ],
});
