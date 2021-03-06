import axios from 'axios'
import {ElMessage} from 'element-plus'


const httpClient = axios.create({
    baseURL: '/api'
})
httpClient.interceptors.response.use(response => {
    return response.data
}, error => {
    if (error.response.status === 401) {//处理401 Unauthorized
        window.location = '/login'
    } else if (error.response.status === 403) {//处理403 Forbidden
        window.location = '/403'
    } else {
        return Promise.reject(error)
    }
})

const getLoginedUser = function (common) {
    httpClient.get('/logined-user')
        .then(response => {
            if (response['code'] === 0) {
                common.user = response['data']['user']
            } else {
                ElMessage.error({
                    message: '获取登录用户失败：' + response['msg']
                })
            }
        })
        .catch(error => {
            ElMessage.error({
                message: '获取登录用户失败：' + error
            })
        })
}

export {httpClient, getLoginedUser}
