<template>
  <view class="add-address-container">
    <!-- 顶部导航栏 -->
    <view class="nav-header" v-if="showHeader">
      <view class="back-icon" @click="goBack">
        <image src="/static/icons/icon-back.svg" class="icon-image"></image>
      </view>
      <text class="page-title">添加收货地址</text>
    </view>

    <view class="form-container">
      <view class="form-item">
        <text class="form-label">收货人</text>
        <input class="form-input" v-model="address.receiverName" placeholder="请输入收货人姓名" />
      </view>
      
      <view class="form-item">
        <text class="form-label">手机号码</text>
        <input class="form-input" v-model="address.phone" placeholder="请输入手机号码" type="number" maxlength="11" />
      </view>
      
      <view class="form-item" @click="showRegionPicker = true">
        <text class="form-label">所在地区</text>
        <view class="form-input area-input">
          <text v-if="regionText" class="area-text">{{ regionText }}</text>
          <text v-else class="placeholder-text">请选择所在地区</text>
          <view class="input-arrow">
            <image src="/static/icons/icon-right.svg" class="icon-image"></image>
          </view>
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">详细地址</text>
        <textarea class="form-textarea" v-model="address.detailAddress" placeholder="请输入详细地址，如街道、门牌号等" />
      </view>
      
      <view class="form-item">
        <text class="form-label">标签</text>
        <view class="tag-container">
          <view 
            v-for="(tag, index) in tags" 
            :key="index"
            class="tag-item"
            :class="{ active: address.tag === tag }"
            @click="address.tag = tag"
          >
            <text class="tag-text">{{ tag }}</text>
          </view>
        </view>
      </view>
      
      <view class="form-item default-item">
        <text class="form-label">设为默认地址</text>
        <switch color="#ff6633" @change="onDefaultChange" :checked="address.isDefault === 1" />
      </view>
      
      <button class="submit-btn" @click="saveAddress">保存</button>
    </view>
    
    <!-- 地区选择器 -->
    <view class="region-picker" v-if="showRegionPicker">
      <view class="region-picker-mask" @click="showRegionPicker = false"></view>
      <view class="region-picker-content">
        <view class="region-picker-header">
          <text class="region-picker-title">选择地区</text>
          <view class="close-icon" @click="showRegionPicker = false">
            <image src="/static/icons/icon-close.svg" class="icon-image"></image>
          </view>
        </view>
        <view class="region-picker-tabs">
          <view
            class="tab-item"
            :class="{ active: regionLevel === 0 }"
            @click="switchRegionLevel(0)"
          >
            <text class="tab-text">{{ address.province || '请选择' }}</text>
          </view>
          <view
            class="tab-item"
            :class="{ active: regionLevel === 1, disabled: !address.province }"
            @click="address.province && switchRegionLevel(1)"
          >
            <text class="tab-text">{{ address.city || '请选择' }}</text>
          </view>
          <view
            class="tab-item"
            :class="{ active: regionLevel === 2, disabled: !address.city }"
            @click="address.city && switchRegionLevel(2)"
          >
            <text class="tab-text">{{ address.district || '请选择' }}</text>
          </view>
        </view>
        <scroll-view class="region-picker-list" scroll-y>
          <!-- 省份列表 -->
          <view v-if="regionLevel === 0">
            <view
              v-for="(province, index) in provinces"
              :key="index"
              class="region-item"
              @click="selectProvince(province)"
            >
              <text class="region-name" :class="{ 'active-name': province === address.province }">{{ province }}</text>
              <text v-if="province === address.province" class="selected-icon">✓</text>
            </view>
          </view>
          
          <!-- 城市列表 -->
          <view v-if="regionLevel === 1">
            <view
              v-for="(city, index) in cities"
              :key="index"
              class="region-item"
              @click="selectCity(city)"
            >
              <text class="region-name" :class="{ 'active-name': city === address.city }">{{ city }}</text>
              <text v-if="city === address.city" class="selected-icon">✓</text>
            </view>
          </view>
          
          <!-- 区县列表 -->
          <view v-if="regionLevel === 2">
            <view
              v-for="(district, index) in districts"
              :key="index"
              class="region-item"
              @click="selectDistrict(district)"
            >
              <text class="region-name" :class="{ 'active-name': district === address.district }">{{ district }}</text>
              <text v-if="district === address.district" class="selected-icon">✓</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { customerAddressAdd } from '@/api/customerController';

const props = defineProps({
  showHeader: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['success', 'cancel']);

// 地址信息
const address = ref<API.CustomerAddressCreateRequest>({
  receiverName: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  tag: '家',
  isDefault: 0
});

// 地址标签
const tags = ['家', '公司', '学校', '其他'];

// 加载状态
const isLoading = ref(false);

// 地区选择器
const showRegionPicker = ref(false);
const regionLevel = ref(0);

// 这里是模拟数据，实际应从接口获取或使用静态数据
const provinces = [
  '北京', '上海', '广东', '江苏', '浙江', '四川', '湖北', '湖南', '河南', '河北'
];

const cities = computed(() => {
  // 模拟数据，实际根据选择的省份获取对应城市
  if (address.value.province === '广东') {
    return ['广州', '深圳', '东莞', '珠海', '佛山', '中山'];
  } else if (address.value.province === '北京') {
    return ['北京市'];
  } else if (address.value.province === '上海') {
    return ['上海市'];
  }
  return ['城市1', '城市2', '城市3', '城市4'];
});

const districts = computed(() => {
  // 模拟数据，实际根据选择的城市获取对应区县
  if (address.value.city === '广州') {
    return ['天河区', '海珠区', '越秀区', '白云区', '黄埔区', '番禺区'];
  } else if (address.value.city === '深圳') {
    return ['南山区', '福田区', '罗湖区', '宝安区', '龙岗区', '盐田区'];
  }
  return ['区1', '区2', '区3', '区4'];
});

// 完整地区文本
const regionText = computed(() => {
  if (!address.value.province) return '';
  
  let text = address.value.province;
  if (address.value.city) {
    text += ' ' + address.value.city;
    if (address.value.district) {
      text += ' ' + address.value.district;
    }
  }
  
  return text;
});

// 切换地区级别
const switchRegionLevel = (level: number) => {
  regionLevel.value = level;
};

// 选择省份
const selectProvince = (province: string) => {
  address.value.province = province;
  address.value.city = '';
  address.value.district = '';
  regionLevel.value = 1;
};

// 选择城市
const selectCity = (city: string) => {
  address.value.city = city;
  address.value.district = '';
  regionLevel.value = 2;
};

// 选择区县
const selectDistrict = (district: string) => {
  address.value.district = district;
  showRegionPicker.value = false;
};

// 切换默认地址
const onDefaultChange = (e: any) => {
  address.value.isDefault = e.detail.value ? 1 : 0;
};

// 保存地址
const saveAddress = async () => {
  // 表单验证
  if (!address.value.receiverName) {
    return uni.showToast({
      title: '请输入收货人姓名',
      icon: 'none'
    });
  }
  
  if (!address.value.phone) {
    return uni.showToast({
      title: '请输入手机号码',
      icon: 'none'
    });
  }
  
  if (!/^1\d{10}$/.test(address.value.phone)) {
    return uni.showToast({
      title: '手机号码格式有误',
      icon: 'none'
    });
  }
  
  if (!address.value.province || !address.value.city || !address.value.district) {
    return uni.showToast({
      title: '请选择完整的地区信息',
      icon: 'none'
    });
  }
  
  if (!address.value.detailAddress) {
    return uni.showToast({
      title: '请输入详细地址',
      icon: 'none'
    });
  }
  
  isLoading.value = true;
  
  try {
    const res = await customerAddressAdd(address.value);
    
    if (res.data?.code === 20000) {
      await uni.showToast({
        title: '添加地址成功',
        icon: 'success'
      });
      
      // 触发成功事件，将新地址传递给父组件
      emit('success', res.data.data);
      
      // 如果在页面中使用，才执行返回操作
      if (props.showHeader) {
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    } else {
      throw new Error(res.data?.msg || '添加地址失败');
    }
  } catch (error) {
    console.error('添加地址失败:', error);
    await uni.showToast({
      title: '添加地址失败，请重试',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  emit('cancel');
  if (props.showHeader) {
    uni.navigateBack();
  }
};

// 暴露方法给父组件使用
defineExpose({
  saveAddress,
  address
});
</script>

<style lang="scss">
.add-address-container {
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;
}

.nav-header {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
  
  .back-icon {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .icon-image {
      width: 30rpx;
      height: 30rpx;
    }
  }
  
  .page-title {
    flex: 1;
    text-align: center;
    font-size: 34rpx;
    font-weight: bold;
    color: #333;
    margin-right: 60rpx;
  }
}

.form-container {
  padding: 20rpx 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
  
  .form-label {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 16rpx;
    display: block;
  }
  
  .form-input {
    width: 100%;
    height: 80rpx;
    border: 1rpx solid #eee;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #333;
    background-color: #fff;
  }
  
  .area-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    
    .placeholder-text, .area-text {
      flex: 1;
      font-size: 28rpx;
    }
    
    .placeholder-text {
      color: #999;
    }
    
    .area-text {
      color: #333;
    }
    
    .input-arrow {
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .icon-image {
        width: 24rpx;
        height: 24rpx;
        color: #999;
      }
    }
  }
  
  .form-textarea {
    width: 100%;
    height: 160rpx;
    border: 1rpx solid #eee;
    border-radius: 8rpx;
    padding: 20rpx;
    font-size: 28rpx;
    color: #333;
    background-color: #fff;
  }
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 16rpx;
  
  .tag-item {
    padding: 10rpx 30rpx;
    border: 1rpx solid #ddd;
    border-radius: 30rpx;
    margin-right: 20rpx;
    margin-bottom: 16rpx;
    
    .tag-text {
      font-size: 26rpx;
      color: #666;
    }
    
    &.active {
      border-color: #ff6633;
      background-color: rgba(255, 102, 51, 0.05);
      
      .tag-text {
        color: #ff6633;
      }
    }
  }
}

.default-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .form-label {
    margin-bottom: 0;
  }
}

.submit-btn {
  margin-top: 50rpx;
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 30rpx;
  font-weight: bold;
  color: #fff;
  background-color: #ff6633;
  border-radius: 40rpx;
}

.region-picker {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  
  .region-picker-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .region-picker-content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    border-radius: 24rpx 24rpx 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 70vh;
  }
  
  .region-picker-header {
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #f2f2f2;
    
    .region-picker-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .close-icon {
      width: 40rpx;
      height: 40rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      
      .icon-image {
        width: 30rpx;
        height: 30rpx;
      }
    }
  }
  
  .region-picker-tabs {
    display: flex;
    border-bottom: 1rpx solid #f2f2f2;
    
    .tab-item {
      flex: 1;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      
      .tab-text {
        font-size: 28rpx;
        color: #666;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 30rpx;
      }
      
      &.active {
        .tab-text {
          color: #ff6633;
          font-weight: bold;
        }
        
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 30%;
          right: 30%;
          height: 4rpx;
          background-color: #ff6633;
          border-radius: 2rpx;
        }
      }
      
      &.disabled {
        .tab-text {
          color: #999;
        }
      }
    }
  }
  
  .region-picker-list {
    flex: 1;
    
    .region-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #f5f5f5;
      
      .region-name {
        font-size: 28rpx;
        color: #333;
        
        &.active-name {
          color: #ff6633;
          font-weight: bold;
        }
      }
      
      .selected-icon {
        font-size: 32rpx;
        color: #ff6633;
      }
    }
  }
}

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  
  .loading-spinner {
    width: 60rpx;
    height: 60rpx;
    border: 4rpx solid #f3f3f3;
    border-top: 4rpx solid #ff6633;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20rpx;
  }
  
  .loading-text {
    font-size: 28rpx;
    color: #666;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style> 