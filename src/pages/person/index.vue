<template>
  <view class="person-container safe-area-inset-top">
    <!-- 头部信息 -->
    <view class="person-header" @click="goToPersonDetail">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
        <view class="user-detail">
          <text class="username">{{ userInfo.username || '未登录' }}</text>
          <text class="vip-tag" v-if="userInfo.vipLevel">VIP{{ userInfo.vipLevel }}</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="function-menu">
      <view class="menu-item" @click="goToAddress">
        <view class="menu-icon">
          <uni-icons type="location" size="24" color="#ff9500"></uni-icons>
        </view>
        <view class="menu-content">
          <text class="menu-title">收货地址管理</text>
        </view>
        <view class="menu-arrow">
          <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {useUserInfoStore} from '@/stores/useUserInfoStore';
import {storeToRefs} from 'pinia';
import {onShow} from '@dcloudio/uni-app';

const userStore = useUserInfoStore();
const {userInfo} = storeToRefs(userStore);

// 页面显示时获取用户信息
onShow(() => {
  userStore.fetchUserInfo();
});

// 跳转到个人详情页
const goToPersonDetail = () => {
  if (!userInfo.value.id) {
    uni.navigateTo({
      url: '/pages/login/index'
    });
  } else {
    uni.navigateTo({
      url: '/pages/person/detail'
    });
  }
};

// 跳转到收货地址管理页面
const goToAddress = () => {
  if (!userInfo.value.id) {
    uni.navigateTo({
      url: '/pages/login/index'
    });
  } else {
    uni.navigateTo({
      url: '/pages/person/address'
    });
  }
};
</script>

<style lang="scss">
.person-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.person-header {
  padding: 40rpx 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .user-info {
    display: flex;
    align-items: center;

    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      background-color: #eee;
    }

    .user-detail {
      margin-left: 30rpx;

      .username {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 10rpx;
      }

      .vip-tag {
        font-size: 24rpx;
        color: #fff;
        background-color: #ff9500;
        padding: 4rpx 12rpx;
        border-radius: 20rpx;
      }
    }
  }
}

.function-menu {
  background-color: #fff;
  margin-bottom: 20rpx;

  .menu-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .menu-icon {
      margin-right: 20rpx;
    }

    .menu-content {
      flex: 1;

      .menu-title {
        font-size: 30rpx;
        color: #333;
      }
    }

    .menu-arrow {
      color: #999;
    }
  }
}
</style> 