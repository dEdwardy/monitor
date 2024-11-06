import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/store'
import router from '@/router'
const service = axios.create({
    baseURL: import.meta.env.VITE_HTTP_PREFIX,
    timeout: 60000,
})

service.interceptors.request.use(
    (config) => {
        const { uinfo } = useAppStore()
        if (uinfo?.token) {
            config.headers['access-token'] = `${uinfo.token}`
            // config.headers.token = `Bear ${uinfo.token}`
        }
        return config
    },
    (err) => {
        return Promise.reject(err)
    },
)

service.interceptors.response.use(
    (res) => {
        const { status } = res.data
        if ([200, 201].includes(status)) {
            return res.data
        } else if (status === 401 && res.config.url !== '/auth') {
            const { logout } = useAppStore()
            ElMessage.warning('当前身份已失效,请重新登录')
            logout()
            router.push({ name: 'login' })
            return Promise.reject()
        }
        ElMessage.error(res.data?.error?.message ?? '请求失败')
        return Promise.reject(new Error(res.data?.error?.message ?? '请求失败'))
    },
    (err) => {
        return Promise.reject(err)
    },
)

export default service
