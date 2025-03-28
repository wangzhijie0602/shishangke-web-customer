<template>
  <view class="menu-content safe-area-inset-top">
    <view class="menu-header">
      <text class="header-title">附近商家</text>
    </view>
    
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
    
    <view v-else-if="merchantList.length === 0" class="empty-list">
      <text>暂无商家数据</text>
    </view>
    
    <view v-else class="merchant-list">
      <view 
        v-for="(item, index) in merchantList" 
        :key="item.id || index" 
        class="merchant-item"
        @click="navigateToMenu(item.id || '')"
      >
        <image class="merchant-logo" :src="item.logo || '/static/default-logo.png'" mode="aspectFill" />
        <view class="merchant-info">
          <text class="merchant-name">{{ item.name }}</text>
          <view class="merchant-desc">
            <text class="desc-text">{{ item.description || '暂无简介' }}</text>
          </view>
          <view class="merchant-footer">
            <text class="business-hours">营业时间: {{ (item as any).businessHours || '暂无' }}</text>
            <text class="min-price">最低消费: ¥{{ (item as any).minPrice || '0' }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { customerGetMerchants } from '@/api/customerController';

// 商家列表数据
const merchantList = ref<API.MerchantVO[]>([]);
const loading = ref(true);
const pageSize = ref(10);
const pageNumber = ref(1);

// 获取商家列表
const fetchMerchantList = async () => {
  try {
    loading.value = true;
    const res = await customerGetMerchants({
      pageSize: pageSize.value,
      pageNumber: pageNumber.value
    });
    
    if (res.data.code === 20000 && res.data.data) {
      merchantList.value = res.data.data.records || [];
    } else {
      await uni.showToast({
        title: '获取商家列表失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('获取商家列表出错:', error);
    await uni.showToast({
      title: '网络异常，请稍后重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 导航到商家菜单页面
const navigateToMenu = (id: string) => {
  uni.navigateTo({
    url: `/pages/menu/detail?id=${id}`
  });
};

// 页面加载时获取数据
onMounted(() => {
  fetchMerchantList();
});
</script>

<style lang="scss">
.menu-header {
  padding: 20rpx 30rpx;
  background-color: #fff;

  .header-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
}

.menu-content {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.loading, .empty-list {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200rpx;
  color: #999;
  font-size: 28rpx;
}

.merchant-list {
  padding: 20rpx;
}

.merchant-item {
  display: flex;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.merchant-logo {
  width: 140rpx;
  height: 140rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  background-color: #eee;
}

.merchant-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.merchant-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.merchant-desc {
  flex: 1;
  
  .desc-text {
    font-size: 26rpx;
    color: #666;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.merchant-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #999;
}
</style> 