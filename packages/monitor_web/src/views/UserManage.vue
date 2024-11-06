<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getUsers, addUser } from '@/api'
import { ElMessage } from 'element-plus'
import { format, parseISO } from 'date-fns'
export interface IUser {
    id?: string | number
    username?: string
    email?: string
    createdDate?: string
    [propName: string]: any
}
interface ISearchForm {
    username?: string
    createdDate?: string
}
const loading = ref<boolean>(false)
const searchForm = reactive<ISearchForm>({
    username: '',
    createdDate: '',
})
const formRef = ref<FormInstance>()
const form = reactive<IUser>({
    username: '',
    password: '',
    email: '',
})
const rules = reactive<FormRules>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        {
            min: 6,
            max: 15,
            message: '用户名长度在 6 到 15 个字符',
            trigger: 'blur',
        },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 15 个字符',
            trigger: 'blur',
        },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
    ],
})
const dialogVisible = ref<boolean>(false)

const resetForm = () => {
    formRef.value && formRef.value.resetFields()
}
const handleSure = () => {
    formRef.value?.validate((valid) => {
        if (valid) {
            return addUser(form).then(() => {
                ElMessage.success('操作成功')
                dialogVisible.value = false
                handleSearch()
            })
        }
    })
}
const handleCancel = () => {
    dialogVisible.value = false
}
const handleAdd = () => {
    resetForm()
    dialogVisible.value = true
}
const handleSearch = () => {
    loading.value = true
    return getUsers()
        .then(({ data }) => {
            tableData.value = data
        })
        .finally(() => {
            loading.value = false
        })
}
const tableData = ref<IUser[]>([])
handleSearch()
</script>
<template>
    <div class="user-manage">
        <div class="search-panel">
            <el-form inline>
                <el-form-item label="创建时间">
                    <el-date-picker v-model="searchForm.createdDate" type="date" placeholder="请选择创建时间" />
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="searchForm.username"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button type="primary" @click="handleAdd">add</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table">
            <el-table v-loading="loading" :data="tableData" height="500px">
                <el-table-column type="index" label="序号" width="100px"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="createdDate" label="创建日期">
                    <template #default="{ row }">
                        <div>
                            {{ format(parseISO(row.createdDate), 'yyyy-MM-dd hh:mm:ss') }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-model="dialogVisible" width="500px">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password" autocomplete="new-password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email"></el-input>
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
.user-manage {
    :deep(.el-input__wrapper) {
        width: 100%;
    }

    .search-panel {
        margin: 20px 0;

        :deep(.el-form-item) {
            margin-bottom: 0 !important;
        }
    }

    .table {
    }
}
</style>
