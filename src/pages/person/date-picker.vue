<template>
  <view class="date-picker-container">
    <view class="header">
      <text class="title">选择生日</text>
    </view>
    
    <view class="picker-area">
      <picker mode="date" :value="selectedDate" @change="dateChange" start="1900-01-01" end="2100-12-31">
        <view class="date-display">
          <text>{{selectedDate || '请选择日期'}}</text>
          <text class="picker-icon">▼</text>
        </view>
      </picker>
    </view>
    
    <view class="button-area">
      <button class="confirm-button" @click="confirmDate">确认</button>
      <button class="cancel-button" @click="cancel">取消</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const selectedDate = ref('');

onLoad((option) => {
  // 如果有传入初始日期，则使用
  if (option && option.initialDate) {
    selectedDate.value = option.initialDate;
  } else {
    // 否则使用当前日期
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    selectedDate.value = `${year}-${month}-${day}`;
  }
});

// 日期变更
const dateChange = (e: any) => {
  selectedDate.value = e.detail.value;
};

// 确认日期
const confirmDate = () => {
  // 通过页面实例获取eventChannel
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2]; // 获取上一个页面
  
  // 设置上一个页面的回调函数参数
  if (prevPage && prevPage.$vm) {
    // 调用上一页的方法
    prevPage.$vm.updateBirthDate(selectedDate.value);
  }
  
  uni.navigateBack();
};

// 取消选择
const cancel = () => {
  uni.navigateBack();
};
</script>

<style lang="scss">
.date-picker-container {
  padding: 30rpx;
  
  .header {
    text-align: center;
    margin-bottom: 50rpx;
    
    .title {
      font-size: 36rpx;
      font-weight: bold;
    }
  }
  
  .picker-area {
    background-color: #fff;
    padding: 30rpx;
    border-radius: 12rpx;
    margin-bottom: 50rpx;
    
    .date-display {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80rpx;
      border-bottom: 1px solid #f0f0f0;
      
      .picker-icon {
        color: #999;
        font-size: 24rpx;
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