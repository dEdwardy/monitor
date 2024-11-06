import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import MLayout from '@/components/MLayout.vue'
import { useAppStore } from '@/store'
import { ElMessage } from 'element-plus'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
            requireAuth: false,
        },
        component: () => import('@/views/LoginView.vue'),
    },
    {
        path: '/',
        component: MLayout,
        redirect: 'login',
        children: [
            {
                path: 'index',
                name: 'Index',
                meta: {
                    title: '首页',
                    requireAuth: true,
                },
                component: () => import('@/views/HomeView.vue'),
            },
            {
                path: 'user-manage',
                name: 'user-manage',
                meta: {
                    title: '用户管理',
                    requireAuth: true,
                },
                component: () => import('@/views/UserManage.vue'),
            },
            {
                path: 'project-manage',
                name: 'project-manage',
                meta: {
                    title: '项目管理',
                    requireAuth: true,
                },
                component: () => import('@/views/ProjectManage.vue'),
            },
            {
                path: 'exception-monitor',
                name: 'exception-monitor',
                meta: {
                    title: '异常监控',
                    requireAuth: true,
                },
                component: () => import('@/views/ExceptionMonitor.vue'),
            },
            {
                path: 'exception/:id',
                name: 'exceptionDetail',
                meta: {
                    title: '异常监控',
                    requireAuth: true,
                },
                component: () => import('@/views/ExceptionDetail.vue'),
            },
            {
                path: 'test',
                name: 'test',
                meta: {
                    title: '测试页面',
                    requireAuth: true,
                },
                component: () => import('@/views/TestView.vue'),
            },
        ],
    },
]

const router = createRouter({
    history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
    routes,
})
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next()
    } else {
        const { uinfo } = useAppStore()
        // 如果没登录,都导向登录页
        if (!uinfo) {
            if (to.path !== '/login') {
                ElMessage.warning('当前身份已失效,请重新登录')
                next({ path: '/login' })
                // next()
            } else {
                next()
            }
        } else {
            next()
        }
    }
})
export default router
