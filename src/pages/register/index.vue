<template>
  <view class="register-container">
    <view class="register-header">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="title">注册账号</text>
    </view>
    
    <view class="register-form">
      <view class="input-item">
        <text class="input-label">用户名</text>
        <input 
          class="input-field" 
          type="text" 
          v-model="formData.username" 
          placeholder="请输入用户名"
        />
      </view>
      
      <view class="input-item">
        <text class="input-label">密码</text>
        <input 
          class="input-field" 
          type="password" 
          v-model="formData.password" 
          placeholder="请输入密码"
        />
      </view>
      
      <view class="input-item">
        <text class="input-label">确认密码</text>
        <input 
          class="input-field" 
          type="password" 
          v-model="confirmPassword" 
          placeholder="请再次输入密码"
        />
      </view>
      
      <view class="input-item">
        <text class="input-label">真实姓名 (选填)</text>
        <input 
          class="input-field" 
          type="text" 
          v-model="formData.realName" 
          placeholder="请输入真实姓名"
        />
      </view>
      
      <view class="input-item">
        <text class="input-label">性别 (选填)</text>
        <picker class="picker" mode="selector" :range="genderOptions" @change="onGenderChange">
          <view class="picker-text">{{ formData.gender || '请选择性别' }}</view>
        </picker>
      </view>
      
      <button class="register-btn" @click="handleRegister" :disabled="isLoading">
        {{ isLoading ? '注册中...' : '注册' }}
      </button>
      
      <view class="login-link">
        <text>已有账号？</text>
        <text class="link" @click="goToLogin">立即登录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { customerRegister } from '@/api/customerController';

const formData = reactive({
  username: '',
  password: '',
  realName: '',
  gender: '',
});

const confirmPassword = ref('');
const isLoading = ref(false);
const genderOptions = ['男', '女'];

// 性别选择
const onGenderChange = (e: any) => {
  formData.gender = genderOptions[e.detail.value];
};

// 处理注册
const handleRegister = async () => {
  // 表单验证
  if (!formData.username || !formData.password) {
    uni.showToast({
      title: '请输入用户名和密码',
      icon: 'none'
    });
    return;
  }
  
  if (formData.password !== confirmPassword.value) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    });
    return;
  }
  
  try {
    isLoading.value = true;
    
    // 准备注册请求数据
    const registerData: API.CustomerCreateRequest = {
      username: formData.username,
      password: formData.password,
    };
    
    // 添加可选字段
    if (formData.realName) {
      registerData.realName = formData.realName;
    }
    
    if (formData.gender) {
      registerData.gender = formData.gender;
    }
    
    const res = await customerRegister(registerData);
    
    if (res.data.code === 20000) {
      // 注册成功
      await uni.showToast({
        title: '注册成功，请登录',
        icon: 'success'
      });
      
      // 跳转到登录页
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/login/index'
        });
      }, 1500);
    } else {
      // 注册失败
      await uni.showToast({
        title: res.data.msg || '注册失败',
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

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index'
  });
};
</script>

<style lang="scss">
.register-container {
  min-height: 100vh;
  background-color: #fff;
  padding: 40rpx;
}

.register-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60rpx;
  margin-bottom: 40rpx;
  
  .logo {
    width: 160rpx;
    height: 160rpx;
  }
  
  .title {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    margin-top: 20rpx;
  }
}

.register-form {
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
    
    .picker {
      width: 100%;
      height: 90rpx;
      background-color: #f5f5f5;
      border-radius: 45rpx;
      padding: 0 30rpx;
      display: flex;
      align-items: center;
      
      .picker-text {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
  
  .register-btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    background-color: #ff4d4f;
    color: #fff;
    font-size: 32rpx;
    border-radius: 45rpx;
    margin-top: 60rpx;
  }
  
  .login-link {
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