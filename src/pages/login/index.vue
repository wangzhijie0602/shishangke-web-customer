<template>
  <view class="login-container">
    <view class="login-header">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="title">时尚客</text>
    </view>

    <view class="login-form">
      <view class="input-item">
        <text class="input-label">用户名</text>
        <input
            class="input-field"
            type="text"
            v-model="username"
            placeholder="请输入用户名/手机号"
        />
      </view>

      <view class="input-item">
        <text class="input-label">密码</text>
        <input
            class="input-field"
            type="password"
            v-model="password"
            placeholder="请输入密码"
        />
      </view>

      <button class="login-btn" @click="handleLogin" :disabled="isLoading">
        {{ isLoading ? '登录中...' : '登录' }}
      </button>

      <view class="register-link">
        <text>还没有账号？</text>
        <text class="link" @click="goToRegister">立即注册</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {customerLogin} from '@/api/customerController';
import {useUserInfoStore} from '@/stores/useUserInfoStore';

const userStore = useUserInfoStore();
const username = ref('');
const password = ref('');
const isLoading = ref(false);

// 处理登录
const handleLogin = async () => {
  // 表单验证
  if (!username.value || !password.value) {
    await uni.showToast({
      title: '请输入用户名和密码',
      icon: 'none'
    });
    return;
  }

  try {
    isLoading.value = true;
    const res = await customerLogin({
      username: username.value,
      password: password.value
    });

    if (res.data.code === 20000 && res.data.data) {
      // 登录成功，保存用户信息
      await userStore.setUserInfo(res.data.data);

      await uni.showToast({
        title: '登录成功',
        icon: 'success'
      });

      // 返回上一页或跳转到个人中心
      setTimeout(() => {
        const pages = getCurrentPages();
        if (pages.length > 1) {
          uni.navigateBack();
        } else {
          uni.switchTab({
            url: '/pages/person/index'
          });
        }
      }, 1500);
    } else {
      // 登录失败
      await uni.showToast({
        title: res.data.msg || '登录失败',
        icon: 'none'
      });
    }
  } catch (error) {
    await uni.showToast({
      title: '网络异常，请稍后再试',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
  }
};

// 跳转到注册页
const goToRegister = () => {
  uni.navigateTo({
    url: '/pages/register/index'
  });
};
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
  background-color: #fff;
  padding: 40rpx;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80rpx;
  margin-bottom: 60rpx;

  .logo {
    width: 180rpx;
    height: 180rpx;
  }

  .title {
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-top: 20rpx;
  }
}

.login-form {
  .input-item {
    margin-bottom: 30rpx;

    .input-label {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 10rpx;
      display: block;
    }

    .input-field {
      width: 100%;
      height: 90rpx;
      background-color: #f5f5f5;
      border-radius: 45rpx;
      padding: 0 30rpx;
      font-size: 28rpx;
      color: #333;
    }
  }

  .login-btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    background-color: #ff4d4f;
    color: #fff;
    font-size: 32rpx;
    border-radius: 45rpx;
    margin-top: 60rpx;
  }

  .register-link {
    margin-top: 30rpx;
    text-align: center;
    font-size: 28rpx;
    color: #666;

    .link {
      color: #ff4d4f;
      margin-left: 10rpx;
    }
  }
}
</style> 