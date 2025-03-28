<template>
  <view class="preferences-container">
    <view class="header">
      <text class="title">选择偏好</text>
    </view>
    
    <view class="tags-area">
      <view 
        v-for="tag in tagsList" 
        :key="tag.id" 
        class="tag-item" 
        :class="{ selected: tag.selected }"
        @click="toggleTag(tag)"
      >
        <text>{{ tag.name }}</text>
      </view>
    </view>
    
    <view class="button-area">
      <button class="confirm-button" @click="confirmPreferences">确认</button>
      <button class="cancel-button" @click="cancel">取消</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 标签列表
const tagsList = ref([
  { id: 1, name: '中餐', selected: false },
  { id: 2, name: '西餐', selected: false },
  { id: 3, name: '辣菜', selected: false },
  { id: 4, name: '甜点', selected: false },
  { id: 5, name: '咖啡', selected: false },
  { id: 6, name: '茶饮', selected: false },
  { id: 7, name: '素食', selected: false },
  { id: 8, name: '海鲜', selected: false },
]);

// 从上一页获取已选标签
onLoad((option) => {
  if (option && option.selectedTags) {
    try {
      const selected = option.selectedTags.split(',');
      tagsList.value.forEach(tag => {
        tag.selected = selected.includes(tag.name);
      });
    } catch (error) {
      console.error('解析标签失败', error);
    }
  }
});

// 切换标签选中状态
const toggleTag = (tag: {id: number, name: string, selected: boolean}) => {
  tag.selected = !tag.selected;
};

// 确认选择
const confirmPreferences = () => {
  // 获取已选标签
  const selectedTags = tagsList.value.filter(tag => tag.selected);
  
  // 通过页面实例获取上一个页面
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2]; // 获取上一个页面
  
  // 调用上一页的保存方法
  if (prevPage && prevPage.$vm) {
    prevPage.$vm.savePreferences(selectedTags);
  }
  
  uni.navigateBack();
};

// 取消选择
const cancel = () => {
  uni.navigateBack();
};
</script>

<style lang="scss">
.preferences-container {
  padding: 30rpx;
  
  .header {
    text-align: center;
    margin-bottom: 50rpx;
    
    .title {
      font-size: 36rpx;
      font-weight: bold;
    }
  }
  
  .tags-area {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 50rpx;
    
    .tag-item {
      width: 22%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background-color: #f5f5f5;
      border-radius: 8rpx;
      margin-bottom: 20rpx;
      font-size: 28rpx;
      
      &.selected {
        background-color: #ff4d4f;
        color: #fff;
      }
    }
  }
  
  .button-area {
    display: flex;
    justify-content: space-between;
    
    button {
      width: 45%;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 40rpx;
      font-size: 32rpx;
    }
    
    .confirm-button {
      background-color: #ff4d4f;
      color: #fff;
    }
    
    .cancel-button {
      background-color: #f5f5f5;
      color: #333;
    }
  }
}
</style> 