<template>
  <view class="address-container">
    <view v-if="addressList.length === 0" class="empty-address">
      <image class="empty-image" src="/static/empty-address.png" mode="aspectFill"></image>
      <text class="empty-text">您还没有添加收货地址</text>
    </view>
    
    <view v-else class="address-list">
      <view 
        v-for="(item, index) in addressList" 
        :key="item.id" 
        class="address-item"
        @click="handleSelectAddress(item)"
      >
        <view class="address-info">
          <view class="address-header">
            <text class="address-name">{{ item.receiverName || '' }}</text>
            <text class="address-phone">{{ item.phone || '' }}</text>
            <text v-if="item.isDefault" class="default-tag">默认</text>
          </view>
          <view class="address-detail">
            {{ (item.province || '') + (item.city || '') + (item.district || '') + (item.detailAddress || '') }}
          </view>
        </view>
        <view class="address-actions">
          <view class="action-item" @click.stop="handleSetDefault(item)" v-if="!item.isDefault">
            <text class="action-text">设为默认</text>
          </view>
          <view class="action-item" @click.stop="handleEditAddress(item)">
            <uni-icons type="compose" size="20" color="#666"></uni-icons>
          </view>
          <view class="action-item" @click.stop="handleDeleteAddress(item)">
            <uni-icons type="trash" size="20" color="#666"></uni-icons>
          </view>
        </view>
      </view>
    </view>
    
    <view class="add-address-btn" @click="handleAddAddress">
      <text class="btn-text">新增收货地址</text>
    </view>
    
    <!-- 编辑/添加地址弹窗 -->
    <uni-popup ref="addressPopup" type="bottom">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ formTitle }}</text>
          <view class="popup-close" @click="closePopup">
            <uni-icons type="close" size="24" color="#333"></uni-icons>
          </view>
        </view>
        <view class="form-content">
          <view class="form-item">
            <text class="form-label">收货人</text>
            <input class="form-input" v-model="addressForm.receiverName" placeholder="请输入收货人姓名" />
          </view>
          <view class="form-item">
            <text class="form-label">手机号码</text>
            <input class="form-input" v-model="addressForm.phone" placeholder="请输入手机号码" />
          </view>
          <view class="form-item">
            <text class="form-label">所在地区</text>
            <view class="region-picker" @click="showRegionPicker">
              <text v-if="regionText">{{ regionText }}</text>
              <text v-else class="placeholder">请选择省市区</text>
              <uni-icons type="right" size="16" color="#999"></uni-icons>
            </view>
          </view>
          <view class="form-item">
            <text class="form-label">详细地址</text>
            <textarea class="form-textarea" v-model="addressForm.detailAddress" placeholder="请输入详细地址，如街道、小区、楼栋号等" />
          </view>
          <view class="form-item switch-item">
            <text class="form-label">设为默认收货地址</text>
            <switch color="#ff9500" :checked="addressForm.isDefault" @change="switchDefaultAddress" />
          </view>
        </view>
        <view class="popup-footer">
          <button class="save-btn" @click="saveAddress">保存</button>
        </view>
      </view>
    </uni-popup>
    
    <!-- 地区选择器 -->
    <uni-popup ref="regionPopup" type="bottom">
      <view class="region-popup">
        <view class="region-header">
          <text class="region-title">选择地区</text>
          <view class="region-close" @click="closeRegionPopup">
            <uni-icons type="close" size="24" color="#333"></uni-icons>
          </view>
        </view>
        <view class="region-content">
          <!-- 这里应实现省市区选择器，简化示例 -->
          <picker-view class="region-picker-view" :value="regionValue" @change="handleRegionChange">
            <picker-view-column>
              <view class="picker-item" v-for="(item, index) in provinces" :key="index">{{ item }}</view>
            </picker-view-column>
            <picker-view-column>
              <view class="picker-item" v-for="(item, index) in cities" :key="index">{{ item }}</view>
            </picker-view-column>
            <picker-view-column>
              <view class="picker-item" v-for="(item, index) in districts" :key="index">{{ item }}</view>
            </picker-view-column>
          </picker-view>
        </view>
        <view class="region-footer">
          <button class="confirm-btn" @click="confirmRegion">确定</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import * as customerApi from '@/api/customerController';

// 收货地址列表
const addressList = ref<API.CustomerAddressVO[]>([]);

// 表单标题
const formTitle = ref('新增收货地址');

// 地址表单数据
const addressForm = reactive<Omit<API.CustomerAddressVO, 'id'>>({
  receiverName: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: 0
});

// 弹窗引用
const addressPopup = ref();
const regionPopup = ref();

// 当前操作的地址ID（编辑时使用）
const currentAddressId = ref<string | null>(null);

// 地区选择器数据（简化示例，实际应当使用真实数据）
const provinces = ref(['北京市', '上海市', '广东省']);
const cities = ref(['北京市', '上海市', '广州市']);
const districts = ref(['朝阳区', '浦东新区', '天河区']);
const regionValue = ref([0, 0, 0]);

// 计算属性：选择的地区文本
const regionText = computed(() => {
  if (addressForm.province && addressForm.city && addressForm.district) {
    return addressForm.province + ' ' + addressForm.city + ' ' + addressForm.district;
  }
  return '';
});

// 页面加载时获取地址列表
onShow(() => {
  fetchAddressList();
});

// 获取收货地址列表
const fetchAddressList = async () => {
  try {
    const res = await customerApi.customerAddressList();
    if (res.data?.code === 20000 && res.data?.data) {
      addressList.value = res.data.data;
    }
  } catch (error) {
    await uni.showToast({
      title: '获取地址列表失败',
      icon: 'none'
    });
  }
};

// 打开添加地址弹窗
const handleAddAddress = () => {
  formTitle.value = '新增收货地址';
  currentAddressId.value = null;
  resetAddressForm();
  addressPopup.value.open();
};

// 打开编辑地址弹窗
const handleEditAddress = (address: API.CustomerAddressVO) => {
  formTitle.value = '编辑收货地址';
  currentAddressId.value = address.id ? String(address.id) : null;
  
  // 填充表单数据
  addressForm.receiverName = address.receiverName || '';
  addressForm.phone = address.phone || '';
  addressForm.province = address.province || '';
  addressForm.city = address.city || '';
  addressForm.district = address.district || '';
  addressForm.detailAddress = address.detailAddress || '';
  addressForm.isDefault = address.isDefault || 0;
  
  addressPopup.value.open();
};

// 删除地址
const handleDeleteAddress = async (address: API.CustomerAddressVO) => {
  if (!address.id) return;
  
  uni.showModal({
    title: '提示',
    content: '确定要删除此收货地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const result = await customerApi.customerAddressDelete({ addressId: String(address.id) });
          if (result.data?.code === 20000) {
            await uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
            await fetchAddressList();
          } else {
            await uni.showToast({
              title: result.data?.msg || '删除失败',
              icon: 'none'
            });
          }
        } catch (error) {
          await uni.showToast({
            title: '删除失败',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 选择地址
const handleSelectAddress = (address: API.CustomerAddressVO) => {
  // 可用于订单页面选择地址时回传
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];
  
  if (prevPage && prevPage.$vm && prevPage.$vm.setSelectedAddress) {
    prevPage.$vm.setSelectedAddress(address);
    uni.navigateBack();
  }
};

// 设置为默认地址
const handleSetDefault = async (address: API.CustomerAddressVO) => {
  if (!address.id) return;
  
  try {
    const result = await customerApi.customerAddressSetDefault({ addressId: String(address.id) });
    if (result.data?.code === 20000) {
      await uni.showToast({
        title: '设置成功',
        icon: 'success'
      });
      await fetchAddressList();
    } else {
      await uni.showToast({
        title: result.data?.msg || '设置失败',
        icon: 'none'
      });
    }
  } catch (error) {
    await uni.showToast({
      title: '设置失败',
      icon: 'none'
    });
  }
};

// 设置为默认地址
const switchDefaultAddress = (e: any) => {
  addressForm.isDefault = e.detail.value ? 1 : 0;
};

// 重置地址表单
const resetAddressForm = () => {
  addressForm.receiverName = '';
  addressForm.phone = '';
  addressForm.province = '';
  addressForm.city = '';
  addressForm.district = '';
  addressForm.detailAddress = '';
  addressForm.isDefault = 0;
};

// 保存地址
const saveAddress = async () => {
  // 表单验证
  if (!addressForm.receiverName) {
    return uni.showToast({ title: '请输入收货人姓名', icon: 'none' });
  }
  if (!addressForm.phone) {
    return uni.showToast({ title: '请输入手机号码', icon: 'none' });
  }
  if (!addressForm.province || !addressForm.city || !addressForm.district) {
    return uni.showToast({ title: '请选择所在地区', icon: 'none' });
  }
  if (!addressForm.detailAddress) {
    return uni.showToast({ title: '请输入详细地址', icon: 'none' });
  }
  
  try {
    let result;
    
    if (currentAddressId.value) {
      // 更新地址 - 构建符合CustomerAddressUpdateRequest类型的请求体
      const updateRequest: API.CustomerAddressUpdateRequest = {
        id: currentAddressId.value,
        receiverName: addressForm.receiverName || '',
        phone: addressForm.phone || '',
        province: addressForm.province || '',
        city: addressForm.city || '',
        district: addressForm.district || '',
        detailAddress: addressForm.detailAddress || '',
        isDefault: addressForm.isDefault || 0
      };
      
      result = await customerApi.customerAddressUpdate(updateRequest);
    } else {
      // 新增地址 - 确保所有必要字段都有值
      const newAddressData: API.CustomerAddressCreateRequest = {
        receiverName: addressForm.receiverName || '',
        phone: addressForm.phone || '',
        province: addressForm.province || '',
        city: addressForm.city || '',
        district: addressForm.district || '',
        detailAddress: addressForm.detailAddress || '',
        isDefault: addressForm.isDefault || 0
      };
      
      result = await customerApi.customerAddressAdd(newAddressData);
    }
    
    if (result.data?.code === 20000) {
      await uni.showToast({
        title: currentAddressId.value ? '更新成功' : '添加成功',
        icon: 'success'
      });
      // 先获取最新数据，再关闭弹窗
      await fetchAddressList();
      closePopup();
    } else {
      await uni.showToast({
        title: result.data?.msg || (currentAddressId.value ? '更新失败' : '添加失败'),
        icon: 'none'
      });
    }
  } catch (error) {
    await uni.showToast({
      title: currentAddressId.value ? '更新失败' : '添加失败',
      icon: 'none'
    });
  }
};

// 关闭弹窗
const closePopup = () => {
  try {
    addressPopup.value.close();
  } catch (error) {
    console.error('关闭弹窗失败', error);
  }
};

// 显示地区选择器
const showRegionPicker = () => {
  regionPopup.value.open();
};

// 关闭地区选择器
const closeRegionPopup = () => {
  regionPopup.value.close();
};

// 地区选择器变化事件
const handleRegionChange = (e: any) => {
  regionValue.value = e.detail.value;
};

// 确认选择地区
const confirmRegion = () => {
  const [provinceIndex, cityIndex, districtIndex] = regionValue.value;
  
  addressForm.province = provinces.value[provinceIndex];
  addressForm.city = cities.value[cityIndex];
  addressForm.district = districts.value[districtIndex];
  
  closeRegionPopup();
};
</script>

<style lang="scss">
.address-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx; // 为底部按钮留出空间
}

.empty-address {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  
  .empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 20rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

.address-list {
  .address-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
    
    .address-info {
      flex: 1;
      
      .address-header {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
        
        .address-name {
          font-size: 32rpx;
          font-weight: bold;
          margin-right: 20rpx;
        }
        
        .address-phone {
          font-size: 28rpx;
          color: #666;
          margin-right: 20rpx;
        }
        
        .default-tag {
          font-size: 22rpx;
          color: #ff9500;
          border: 1px solid #ff9500;
          padding: 2rpx 10rpx;
          border-radius: 4rpx;
        }
      }
      
      .address-detail {
        font-size: 28rpx;
        color: #333;
        line-height: 1.4;
      }
    }
    
    .address-actions {
      display: flex;
      
      .action-item {
        padding: 10rpx;
        margin-left: 20rpx;
        
        .action-text {
          font-size: 24rpx;
          color: #ff9500;
          border: 1px solid #ff9500;
          padding: 4rpx 10rpx;
          border-radius: 4rpx;
        }
      }
    }
  }
}

.add-address-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #ff9500;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .btn-text {
    font-size: 32rpx;
    color: #fff;
    font-weight: bold;
  }
}

.popup-content {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1px solid #f0f0f0;
    
    .popup-title {
      font-size: 32rpx;
      font-weight: bold;
    }
  }
  
  .form-content {
    padding: 20rpx 30rpx;
    
    .form-item {
      margin-bottom: 30rpx;
      
      .form-label {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 10rpx;
      }
      
      .form-input {
        width: 100%;
        height: 80rpx;
        border: 1px solid #eee;
        border-radius: 8rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
      }
      
      .form-textarea {
        width: 100%;
        height: 160rpx;
        border: 1px solid #eee;
        border-radius: 8rpx;
        padding: 20rpx;
        font-size: 28rpx;
      }
      
      .region-picker {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 80rpx;
        border: 1px solid #eee;
        border-radius: 8rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
        
        .placeholder {
          color: #bbb;
        }
      }
      
      &.switch-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .form-label {
          margin-bottom: 0;
        }
      }
    }
  }
  
  .popup-footer {
    padding: 20rpx 30rpx 40rpx;
    
    .save-btn {
      width: 100%;
      height: 90rpx;
      background-color: #ff9500;
      color: #fff;
      border-radius: 45rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      font-weight: bold;
    }
  }
}

.region-popup {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  
  .region-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1px solid #f0f0f0;
    
    .region-title {
      font-size: 32rpx;
      font-weight: bold;
    }
  }
  
  .region-content {
    height: 500rpx;
    
    .region-picker-view {
      width: 100%;
      height: 100%;
      
      .picker-item {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28rpx;
      }
    }
  }
  
  .region-footer {
    padding: 20rpx 30rpx 40rpx;
    
    .confirm-btn {
      width: 100%;
      height: 90rpx;
      background-color: #ff9500;
      color: #fff;
      border-radius: 45rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      font-weight: bold;
    }
  }
}
</style> 