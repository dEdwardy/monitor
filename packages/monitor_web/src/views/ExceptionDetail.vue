<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { getErrorById } from '@/api'
import { nextTick, reactive } from 'vue'
const { params } = useRoute()
const res = reactive({
    detail: {
        name: undefined,
        type: undefined,
        message: undefined,
        detail: undefined,
        po: {
            line: undefined,
            column: undefined,
        },
        remote: undefined,
        ua: undefined,
        ip: undefined,
    },
})
const getExceptionDetailById = () => {
    return getErrorById(params.id).then(({ data }) => {
        res.detail = {
            ...data,
            // detail: data.detail
            //     .split('\n')
            //     .map((i: string, idx: number) => {
            //         return idx + 1 === data?.po?.line ? `<span class="error-line">${i}</span>` : i
            //     })
            //     .join('\n'),
        }
        if (data?.po?.line) {
            let str = data.detail.split('\n')[data?.po?.line - 1]
            nextTick(() => {
                let code = document.querySelector('code')
                console.error('code', code, str)
            })
        }
    })
}

getExceptionDetailById()
</script>

<template>
    <div class="exception-detail">
        <el-form :label-width="80" label-position="left">
            <el-form-item label="Name"> {{ res.detail.name }} </el-form-item>
            <el-form-item label="Type"> {{ res.detail.type }} </el-form-item>
            <el-form-item label="Message">
                {{ res.detail.message }}
            </el-form-item>
            <el-form-item label="UserAgent">
                {{ res.detail.ua }}
            </el-form-item>
            <el-form-item label="IP">
                {{ res.detail.ip }}
            </el-form-item>
            <el-form-item label="Detail" class="detail">
                <div v-if="res.detail.po?.line">
                    Line {{ res.detail.po.line }} - Column
                    {{ res.detail.po.column }}
                    <preview-code :code="res.detail.detail" type="js" :line="res.detail.po.line"> </preview-code>
                </div>

                <span v-if="res.detail?.remote"> {{ res.detail?.remote }}</span>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
:deep(.detail) {
    .el-form-item__content {
        display: unset;
    }
}
</style>
