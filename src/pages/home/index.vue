<template>
  <view class="home-content safe-area-inset-top">
    <view class="user-info-card">
      <view class="user-info-title">用户信息</view>
      <view class="user-info-item">
        <text class="info-label">用户名：</text>
        <text class="info-value">{{ userInfo.username || '未登录' }}</text>
      </view>
      <view class="user-info-item">
        <text class="info-label">会员等级：</text>
        <text class="info-value">{{ userInfo.level || '普通用户' }}</text>
      </view>
      <view class="user-info-item">
        <text class="info-label">积分：</text>
        <text class="info-value">{{ userInfo.points || 0 }}</text>
      </view>
    </view>

    <view class="action-buttons">
      <button class="action-btn order-btn" @click="handleOrder">点餐</button>
      <button class="action-btn takeout-btn" @click="handleTakeout">外卖</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 用户信息（示例数据）
const userInfo = ref({
  username: '张三',
  level: '黄金会员',
  points: 520
});

// 点餐按钮点击事件
const handleOrder = () => {
  uni.showToast({
    title: '点餐功能',
    icon: 'none'
  });
};

// 外卖按钮点击事件
const handleTakeout = () => {
  uni.showToast({
    title: '外卖功能',
    icon: 'none'
  });
};
</script>

<style lang="scss">
.home-content {
  padding: 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.user-info-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .user-info-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 20rpx;
  }

  .user-info-item {
    display: flex;
    margin-bottom: 20rpx;
    
    .info-label {
      width: 160rpx;
      color: #666;
      font-size: 28rpx;
    }
    
    .info-value {
      flex: 1;
      color: #333;
      font-size: 28rpx;
      font-weight: 500;
    }
  }
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  
  .action-btn {
    width: 46%;
    height: 90rpx;
    border-radius: 45rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    font-weight: bold;
    color: #fff;
  }
  
  .order-btn {
    background-color: #ff6b6b;
  }
  
  .takeout-btn {
    background-color: #4ecdc4;
  }
}
</style> 