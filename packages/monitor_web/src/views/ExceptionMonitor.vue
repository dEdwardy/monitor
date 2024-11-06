<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { List, PieChart } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { getErrors } from '@/api'
import { format, parseISO } from 'date-fns'
import { useRouter } from 'vue-router'
import { useTable } from '@/hooks/useTable'
import TestView from './TestView.vue'
import { useAppStore } from '@/store'

interface IError {
    _id?: string | number
    name?: string
    source?: string
    lineno?: number
    colno?: number
    date?: Array<any>
    message?: string
    [propName: string]: any
}
interface ISearchForm {
    name?: string
    principal?: string
    date?: Array<any>
}
enum showType {
    LIST = 'list',
    CHART = 'chart',
}
// const current = ref<string>(showType.CHART)
const current = computed(() => useAppStore().settings.errorShowType)
const router = useRouter()
// const handleChangeView = (value: showType) => {
//     console.error(value)
//     current.value = value === showType.LIST ? showType.LIST : showType.CHART
// }
const handleChangeView = () => {
    useAppStore().setErrorShowType()
}
const searchForm = reactive<ISearchForm>({
    name: '',
    date: [],
})
const { t } = useI18n()
const getData = (params = {}) => {
    return getErrors({
        ...params,
        startDate: searchForm.date?.[0] ?? '',
        endDate: searchForm.date?.[1] ?? '',
    }).then(({ data: { list, total } }) => ({
        list,
        total,
    }))
}
const { search, list, total, loading, pageOptions } = useTable(getData)
const getDetail = (row: IError) => {
    router.push({
        name: 'exceptionDetail',
        params: {
            id: row._id,
        },
    })
}
const handleSearch = () => search()
handleSearch()
</script>
<template>
    <div class="error-monitor">
        <div class="switch-tab">
            <el-switch
                :model-value="current"
                :active-value="showType.CHART"
                :inactive-value="showType.LIST"
                :active-icon="PieChart"
                :inactive-icon="List"
                @change="handleChangeView"
            />
        </div>
        <div v-show="current === showType.LIST" class="list-view">
            <div class="search-panel">
                <el-form inline>
                    <el-form-item label="创建时间">
                        <el-date-picker v-model="searchForm.date" value-format="YYYY-MM-DD" type="daterange" placeholder="请选择创建时间" />
                    </el-form-item>
                    <el-form-item label="项目">
                        <el-input v-model="searchForm.name"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">{{ t('common.search') }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-table v-loading="loading" :data="list">
                    <el-table-column type="index" label="序号" width="100px" />
                    <el-table-column prop="type" label="Type" width="100" sortable show-overflow-tooltip />
                    <el-table-column prop="name" label="name" width="150" show-overflow-tooltip />
                    <el-table-column prop="filename" label="filename" show-overflow-tooltip />
                    <el-table-column prop="message" label="message" show-overflow-tooltip />
                    <el-table-column prop="ip" label="ip" show-overflow-tooltip />
                    <el-table-column prop="ua" label="ua" show-overflow-tooltip />
                    <el-table-column prop="created" width="180" label="创建日期" sortable>
                        <template #default="{ row }">
                            <span>
                                {{ row.created ? format(parseISO(row.created), 'yyyy-MM-dd hh:mm:ss') : '' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operation" label="操作" width="100">
                        <template #default="{ row }">
                            <div>
                                <el-button type="primary" link @click="getDetail(row)"> detail </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination
                    v-model:page-size="pageOptions.size"
                    v-model:current-page="pageOptions.current"
                    :page-sizes="[5, 10, 20]"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                />
            </div>
        </div>
        <div v-show="current === showType.CHART" class="chart-view">
            <TestView />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.search-panel :deep(.el-form-item) {
    margin-bottom: 0 !important;
}

:deep(.el-input__wrapper) {
    width: 100%;
}

.error-monitor {
    .list-view {
        .search-panel {
            display: flex;
            margin: 20px 0;
        }

        .table {
            transition: all 0.3s ease-in-out;
        }

        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px 0;
        }
    }
    .chart-view {
    }
}
</style>
