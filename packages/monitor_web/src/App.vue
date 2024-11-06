<script setup lang="ts">
import { ref, reactive } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import type { ElConfigProvider } from 'element-plus'
const locale = ref({
    ...zhCn,
})

const buttonConfig = reactive({
    autoInsertSpace: false,
})
const messageConfig = reactive({
    max: 3,
})
</script>

<template>
    <el-config-provider :locale="locale" :button="buttonConfig" :message="messageConfig">
        <!-- <router-view v-slot="{ Component }">
            <transition name="slide-left" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view> -->
        <router-view></router-view>
    </el-config-provider>
</template>

<style lang="scss">
html,
body,
#app {
    height: 100%;
}
</style>
