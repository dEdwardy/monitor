import { defineStore } from 'pinia'
import { auth } from '@/api'
import { ElMessage } from 'element-plus'

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            uinfo: null,
            // menu: [],
            // permission: {},
            locale: 'zh_CN',
            settings: {
                errorShowType: 'chart',
            },
        }
    },
    actions: {
        setErrorShowType() {
            this.settings.errorShowType = this.settings.errorShowType === 'list' ? 'chart' : 'list'
        },
        setLocale(locale) {
            this.locale = locale
        },
        login(user) {
            return auth(user).then(({ data }) => {
                this.uinfo = data
                ElMessage.success('登录成功')
            })
        },
        logout() {
            this.uinfo = null
        },
    },
    persist: true,
})
