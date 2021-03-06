import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/goods',
        redirect: '/'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/',
        name: 'Goods',
        component: () => import('../views/Goods.vue'),
        meta: {
            title: '物品管理'
        }
    },
    {
        path: '/goods-category',
        name: 'GoodsCategory',
        component: () => import('../views/GoodsCategory.vue'),
        meta: {
            title: '物品类别管理'
        }
    },
    {
        path: '/user',
        name: 'User',
        component: () => import('../views/User.vue'),
        meta: {
            title: '用户管理'
        }
    },
    {
        path: '/403',
        name: '403',
        component: () => import('../views/403.vue'),
        meta: {
            title: '没有权限'
        }
    },
    {
        path: '/:catchAll(.*)',
        name: '404',
        component: () => import('../views/404.vue'),
        meta: {
            title: '未知页面'
        }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = 'IMS - ' + to.meta.title
    }
    next()
})

export default router
