<script setup lang="ts">
import { IUser } from '@/views/UserManage.vue'
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useAppStore } from '@/store'
import { useRouter } from 'vue-router'
const store = useAppStore()
const router = useRouter()
const loading = ref<boolean>(false)
const form = reactive<IUser>({
    username: '',
    password: '',
})
const formRef = ref<FormInstance>(null)
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
})
const handleLogin = () => {
    loading.value = true
    return formRef.value
        .validate()
        .then(() => {
            return store.login(form).then(() => {
                router.push({ name: 'exception-monitor' })
                loading.value = false
            })
        })
        .catch((err) => {
            loading.value = false
            console.error(err)
        })
}
</script>

<template>
    <div class="login">
        <div class="login-form">
            <div class="title">Monitor</div>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="60px" hide-required-asterisk>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" autocomplete="false" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" autocomplete="new-password" type="password" />
                </el-form-item>
                <div class="operation">
                    <el-button type="primary" :loading="loading" @click="handleLogin">Login</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.login {
    height: 100%;
    background-image: url(@/assets/imgs/bg-login.webp);
    background-size: 100% 100%;
    background-color: rgba(0, 0, 0, 0.1);

    .login-form {
        color: #fff;

        :deep .el-form-item {
            &:last-child {
                margin-bottom: 0 !important;
                justify-content: center;
            }

            & .el-form-item__label {
                color: #fff;
            }
        }

        border-radius: 12px;
        padding: 30px 60px;
        background: rgba(0, 0, 0, 0.4);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        :deep(.el-input) {
            color: #fff;
            background-color: transparent;
        }

        input:-webkit-autofill {
            // box-shadow: 0 0 0px 1000px rgba(0, 0, 0, 0.3) inset !important;
            box-shadow: 0 0 0px 1000px rgba(0, 0, 0, 0.2) inset !important;
            color: #fff !important;
        }

        :deep(.el-input::placeholder) {
            color: #fff !important;
        }

        :deep(.el-input:focus) {
            border: 1px solid #fff !important;
            box-shadow: none;
            border-color: #fff !important;
        }

        :deep(.el-btn) {
            border: 1px solid #fff !important;
            color: #fff;
            box-shadow: none;
        }

        :deep(.el-btn:hover) {
            border: 1px solid #fff !important;
            color: #fff;
            box-shadow: none;
        }

        :deep(.el-btn:focus) {
            border: 1px solid #fff !important;
            color: #fff;
            box-shadow: none;
        }

        // :deep(.el-input:visited) {
        //   border: 1px solid #fff !important;
        //   box-shadow: none;
        // }
        .title {
            font-style: italic;
            letter-spacing: 8px;
            text-shadow: 2px 4px 5px #fff;
            color: #fff;
            text-shadow: rgba(10, 10, 10, 0.4);
            text-align: center;
            font-size: 36px;
            height: 44px;
            line-height: 44px;
            font-weight: 500;
            margin-bottom: 20px;
        }

        .operation {
            text-align: center;
        }
    }
}
</style>
