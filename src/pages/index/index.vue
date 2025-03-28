<template>
  <div id="app">
    <div class="tabbar">
      <div 
        v-for="(item, index) in tabbarList" 
        :key="index" 
        class="tabbar-item"
        @click="switchTab(item.pagePath)"
        :class="{ active: currentTab === index }"
      >
        <image :src="currentTab === index ? item.selectedIconPath : item.iconPath" class="tabbar-icon"></image>
        <text class="tabbar-text">{{ item.text }}</text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentTab = ref(0);
const tabbarList = [
  {
    pagePath: "pages/home/index",
    text: "首页",
    iconPath: "/static/tabbar/home.png",
    selectedIconPath: "/static/tabbar/home-active.png"
  },
  {
    pagePath: "pages/menu/index",
    text: "点餐",
    iconPath: "/static/tabbar/menu.png",
    selectedIconPath: "/static/tabbar/menu.png"
  },
  {
    pagePath: "pages/order/index",
    text: "订单",
    iconPath: "/static/tabbar/order.png",
    selectedIconPath: "/static/tabbar/order-active.png"
  },
  {
    pagePath: "pages/person/index",
    text: "我的",
    iconPath: "/static/tabbar/person.png",
    selectedIconPath: "/static/tabbar/person-active.png"
  }
];

const switchTab = (url: string) => {
  uni.switchTab({
    url: `/${url}`
  });
};
</script>

<style>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tabbar-icon {
  width: 50rpx;
  height: 50rpx;
  margin-bottom: 5rpx;
}

.tabbar-text {
  font-size: 24rpx;
  color: #8a8a8a;
}

.tabbar-item.active .tabbar-text {
  color: #ff4d4f;
}
</style>
