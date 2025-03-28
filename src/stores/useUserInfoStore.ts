import {ref} from 'vue'
import {defineStore} from 'pinia'
import {customerGetCurrent} from '@/api/customerController'

/**
 * 存储登录用户信息的状态
 */
export const useUserInfoStore = defineStore(
    'userInfo',
    () => {
        const userInfo = ref(<API.CustomerVO & { avatar?: string }>{})

        // 异步函数，用于初始化用户信息
        async function initUserInfo() {
            // 初始化为CustomerVO类型的空对象，包含所有可能的字段
            userInfo.value = {
                id: '',
                username: '',
                nickname: '',
                gender: '',
                birthDate: '',
                preferences: '',
                vipLevel: 0,
                points: 0,
                avatar: '',
                createdAt: '',
                updatedAt: ''
            }
        }

        async function fetchUserInfo() {
            const res = await customerGetCurrent()
            if (res.data.code === 20000 && res.data.data) {
                userInfo.value = res.data.data
            }
        }

        async function setUserInfo(user: API.CustomerVO) {
            userInfo.value = user
        }

        // 返回
        return {userInfo, fetchUserInfo, initUserInfo, setUserInfo}
    },
    {
        persist: {
            // 调整为兼容多端的API
            storage: {
                setItem(key, value) {
                    uni.setStorageSync(key, value) // [!code warning]
                },
                getItem(key) {
                    return uni.getStorageSync(key) // [!code warning]
                },
            },
        },
    },
)
