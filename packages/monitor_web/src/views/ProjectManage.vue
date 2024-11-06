<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { saveProject, getAllProject, getProjectById, uploadSourceMap, deleteProById } from '@/api'
import { useAppStore } from '@/store'
import { storeToRefs } from 'pinia'
import { format, parseISO } from 'date-fns'
type TFile = {
    name: string
    url: string
    status?: string
}
interface IProject {
    id?: string | number
    name?: string
    email?: string
    createdDate?: string
    principal?: any
    sourcemaps: Array<TFile>
    [propName: string]: any
}
interface ISearchForm {
    name?: string
    principal?: string
    createdDate?: string
}
const loading = ref<boolean>(false)
const searchForm = reactive<ISearchForm>({
    name: '',
    createdDate: '',
})
const { t } = useI18n()
const formRef = ref<FormInstance>()
const { uinfo } = storeToRefs(useAppStore())
const form = reactive<IProject>({
    id: '',
    name: '',
    desc: '',
    sourcemaps: [],
    principal: (uinfo.value as any)?.id,
    email: '',
})
const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入项目名称', trigger: 'blur' },
        {
            min: 2,
            max: 20,
            message: '项目名称长度在 2 到 20 个字符',
            trigger: 'blur',
        },
    ],
    principal: [
        { required: true, message: '请输入负责人', trigger: 'blur' },
        {
            min: 2,
            max: 20,
            message: '负责人长度在 2 到 20 个字符',
            trigger: 'blur',
        },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
    ],
})
const tableData = ref<IProject[]>([])
const dialogVisible = ref<boolean>(false)
const dialogLoading = ref<boolean>(false)
const resetForm = () => {
    // Object.keys(form).forEach((key) => (form[key] = undefined))
    formRef.value && formRef.value.resetFields()
    form.id = undefined
    form.name = undefined
    form.email = undefined
    form.sourcemaps = []
}
const handleSearch = () => {
    loading.value = true
    getAllProject(searchForm).then((res) => {
        loading.value = false
        tableData.value = res.data
    })
}
const handleAdd = () => {
    resetForm()
    dialogVisible.value = true
}
const handleSure = () => {
    formRef.value?.validate(async (valid: boolean) => {
        if (valid) {
            form.sourcemaps = form.sourcemaps?.map((i) => ({
                name: i.name,
                url: i?.url ?? (i as any)?.response?.data?.url,
            }))
            return saveProject(form)
                .then(() => {
                    ElMessage.success('操作成功')
                    handleSearch()
                })
                .finally(() => {
                    dialogVisible.value = false
                })
        }
    })
}
const handleCancel = () => {
    resetForm()
    dialogVisible.value = false
}
const showDetail = (id: string) => {
    resetForm()
    return getProjectById(id).then(({ data }) => {
        dialogVisible.value = true
        form.id = data.id
        form.name = data.name
        form.email = data.email
        form.sourcemaps = data.sourcemaps ?? []
        form.desc = data.desc
    })
}
const handleUpload = (res: any) => {
    const formData = new FormData()
    formData.append('file', res.file)
    return uploadSourceMap(formData, form.id).then(({ data }) => {
        form.sourcemaps.push(data)
    })
}
const handleRemoveSourceMap = (uploadFile: any) => {
    form.sourcemaps = form.sourcemaps.filter((i: any) => i.id !== uploadFile.id)
}
const handleRemove = (id: string) => {
    console.error('id', id)
    return deleteProById(id).then(() => {
        ElMessage.success('操作成功')
        handleSearch()
    })
}
handleSearch()
</script>
<template>
    <div class="project-manage">
        <div class="search-panel">
            <el-form inline>
                <el-form-item label="创建时间">
                    <el-date-picker v-model="searchForm.createdDate" type="date" placeholder="请选择创建时间" />
                </el-form-item>
                <el-form-item label="项目">
                    <el-input v-model="searchForm.name"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleSearch">{{ t('common.search') }}</el-button>
                    <el-button type="primary" @click="handleAdd">
                        <el-icon :size="16">
                            <SvgIcon icon-class="new" />
                        </el-icon>
                        {{ t('common.new') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table">
            <el-table v-loading="loading" :data="tableData" height="500px">
                <el-table-column type="index" label="序号" width="100px"></el-table-column>
                <el-table-column prop="name" label="项目名称"></el-table-column>
                <el-table-column prop="principal" width="120px" label="负责人">
                    <template #default="{ row }">
                        <div>{{ row.principal.username }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="createdDate" label="创建日期">
                    <template #default="{ row }">
                        <div>
                            {{ format(parseISO(row.createdDate), 'yyyy-MM-dd hh:mm:ss') }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="apiKey" label="ApiKey"></el-table-column>
                <el-table-column prop="operation" label="操作">
                    <template #default="{ row }">
                        <div>
                            <el-button type="primary" link @click="showDetail(row.id)">详情</el-button>
                            <el-button type="danger" link @click="handleRemove(row.id)">删除 </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-model="dialogVisible" @close="handleCancel">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="项目名称" prop="name">
                    <el-input v-model="form.name" :disabled="!!form.id" />
                </el-form-item>
                <el-form-item label="负责人邮件" prop="email">
                    <el-input v-model="form.email" :disabled="!!form.id" />
                </el-form-item>
                <el-form-item label="SourceMap" prop="sourcemaps">
                    <el-upload
                        style="width: 100%"
                        drag
                        :file-list="form.sourcemaps"
                        :http-request="handleUpload"
                        :on-remove="handleRemoveSourceMap"
                        multiple
                    >
                        <el-icon :size="100">
                            <SvgIcon icon-class="upload"></SvgIcon>
                        </el-icon>
                        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
                        <!-- <template #tip>
                            <div class="el-upload__tip">
                                jpg/png files with a size less than 500kb
                            </div>
                        </template> -->
                    </el-upload>
                </el-form-item>
                <el-form-item label="项目描述" prop="desc">
                    <el-input v-model="form.desc" :rows="4" type="textarea" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div>
                    <el-button @click="handleCancel">取消</el-button>
                    <el-button type="primary" @click="handleSure">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
.search-panel :deep(.el-form-item) {
    margin-bottom: 0 !important;
}

:deep(.el-input__wrapper) {
    width: 100%;
}

.project-manage {
    .search-panel {
        margin: 20px 0;
    }

    .table {
    }
}
</style>
