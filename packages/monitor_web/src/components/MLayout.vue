<script setup lang="ts">
import { useAppStore } from '@/store'
import { storeToRefs } from 'pinia'
import { watchEffect, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { uinfo } = storeToRefs(useAppStore())
const username = (uinfo.value as any)?.username
const routeInfo = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const active = ref<string>('')
const handleSelect = (name: string) => {
    router.push({ name })
}
const handleChangeLang = () => {
    const current = localStorage.getItem('locale') ?? 'zh-CN'
    const lang = current === 'zh_CN' ? 'en_US' : 'zh_CN'
    localStorage.setItem('locale', lang)
    locale.value = lang
}
const handleLogout = () => {
    localStorage.clear()
    router.push({ name: 'login' })
}
watchEffect(() => {
    active.value = routeInfo.path.slice(1)
})
</script>
<template>
    <div class="e-layout">
        <el-container>
            <el-header class="header">
                <span class="app_name"> Fe_Monitor</span>
                <div class="info">
                    <div class="lang">
                        <el-popover placement="bottom" :width="80" trigger="hover">
                            <el-button type="primary" link @click="handleChangeLang">
                                {{ locale === 'zh_CN' ? 'English' : '中文' }}
                            </el-button>
                            <template #reference>
                                <el-icon :size="20">
                                    <SvgIcon icon-class="lang"></SvgIcon>
                                </el-icon>
                            </template>
                        </el-popover>
                    </div>
                    <el-popover placement="bottom" :width="80" trigger="hover">
                        <el-button type="primary" link @click="handleLogout">
                            {{ t('common.logout') }}
                        </el-button>
                        <template #reference>
                            <div>{{ username }}</div>
                        </template>
                    </el-popover>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu
                        active-text-color="#ffd04b"
                        background-color="#545c64"
                        class="aside-menu"
                        :default-active="active"
                        text-color="#fff"
                        @select="handleSelect"
                    >
                        <el-menu-item index="user-manage">
                            <el-icon>
                                <SvgIcon icon-class="user-manage" />
                            </el-icon>
                            <span>{{ t('menu.user_manage') }}</span>
                        </el-menu-item>
                        <el-menu-item index="project-manage">
                            <el-icon>
                                <SvgIcon icon-class="project-manage" />
                            </el-icon>
                            <span>{{ t('menu.project_manage') }}</span>
                        </el-menu-item>
                        <el-menu-item index="exception-monitor">
                            <el-icon>
                                <SvgIcon icon-class="exception-monitor" />
                            </el-icon>
                            <span>{{ t('menu.exception_monitor') }}</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main class="main">
                    <router-view v-slot="{ Component }">
                        <transition name="fade" mode="out-in">
                            <component :is="Component" />
                        </transition>
                    </router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style lang="scss" scoped>
.e-layout {
    height: 100%;

    .header {
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: space-between;

        .app_name {
            font-size: 16px;
            font-style: italic;
        }

        .info {
            display: flex;
            align-items: center;

            .lang {
                cursor: pointer;
                padding: 0 10px;
            }
        }
    }

    .aside-menu {
        height: 100%;
        border-right: 0 !important;
    }

    .main {
        background-color: rgba(0, 0, 0, 0.1);
        height: calc(100vh - 60px);
        overflow-y: auto;
    }
}
</style>
