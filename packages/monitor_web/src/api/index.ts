import service from '@/utils/service'
import { IUser } from '@/views/UserManage.vue'

export const auth = (user: IUser) => {
    return service.post('/auth', user)
}
export const getUsers = () => {
    return service.get('/user')
}
export const addUser = (user: IUser) => {
    return service.post('/user', user)
}
export const saveProject = (data) => {
    return service.post('/project', data)
}
export const deleteProById = (id) => {
    return service.delete('/project', {
        data: { id },
    })
}
export const getAllProject = (params) => {
    return service.get('/project', { params })
}
export const getProjectById = (id) => {
    return service.get(`/project/${id}`)
}
export const uploadSourceMap = (data, appId) => {
    return service.post('/sourcemap', data, { headers: { appId } })
}
export const getErrors = (params = {}) => {
    return service.get('/error', { params })
}
export const getErrorById = (id) => {
    return service.get(`/error/parse/${id}`)
}
export const getAnalysisData = (params = {}) => {
    return service.get('/error/analysis', { params })
}
