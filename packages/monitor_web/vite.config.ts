import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvg } from './src/icons/index'
import prismjs from 'vite-plugin-prismjs'

// import styleImport from 'vite-plugin-style-import'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd())
    const __DEV__ = mode === 'development'
    const alias: Record<string, string> = {
        '@/': `${resolve(__dirname, 'src')}/`,
    }

    if (__DEV__) {
        // 解决警告You are running the esm-bundler build of vue-i18n.
        alias['vue-i18n'] = 'vue-i18n/dist/vue-i18n.cjs.js'
    }
    return {
        base: env.VITE_PUBLIC_PATH,
        resolve: {
            //设置别名
            alias,
        },
        server: {
            port: 80, //启动端口
            // hmr: {
            //     host: 'localhost',
            //     port: 443,
            // },
            // 设置 https 代理
            proxy: {
                '/nest-monitor-api': {
                    target: 'http://localhost:5003/api',
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/nest-monitor-api/, ''),
                },
            },
        },
        plugins: [
            vue(),
            prismjs({
                // languages: ['json', 'js'],
                languages: 'all',
                plugins: ['line-highlight', 'line-numbers'], //配置显示行号插件
                theme: 'twilight', //主题名称
                // theme: 'okaidia',
                css: true,
            }),
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
            // styleImport({
            //     libs: [
            //         {
            //             libraryName: 'element-plus',
            //             esModule: true,
            //             resolveStyle: (name) => {
            //                 return `element-plus/lib/theme-chalk/${name}.css`
            //             },
            //             ensureStyleFile: true, // 忽略文件是否存在, 导入不存在的CSS文件时防止错误。
            //         },
            //     ],
            // }),
            createSvg('./src/icons/svg/'),
        ],
        optimizeDeps: {
            include: ['vue', 'vue-router', 'pinia', 'pinia-plugin-persistedstate', '@element-plus/icons-vue', 'axios'],
        },
    }
})
