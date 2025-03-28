<template>
  <view class="checkout-container safe-area-inset-top">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-icon" @click="goBack">
        <image src="/static/icons/icon-back.svg" class="icon-image"></image>
      </view>
      <text class="page-title">确认订单</text>
    </view>

    <scroll-view class="checkout-content" scroll-y>
      <!-- 收货地址 -->
      <view class="address-card" @click="showAddressPicker = true">
        <view v-if="selectedAddress">
          <view class="address-info">
            <view class="address-left">
              <image src="/static/icons/icon-location.svg" class="icon-image"></image>
            </view>
            <view class="address-right">
              <view class="address-top">
                <text class="receiver-name">{{ selectedAddress.receiverName }}</text>
                <text class="receiver-phone">{{ selectedAddress.phone }}</text>
              </view>
              <view class="address-bottom">
                <text class="address-text">{{ getFullAddress(selectedAddress) }}</text>
              </view>
            </view>
            <view class="address-arrow">
              <image src="/static/icons/icon-right.svg" class="icon-image"></image>
            </view>
          </view>
        </view>
        <view v-else class="no-address">
          <view class="no-address-text">请选择收货地址</view>
          <view class="address-arrow">
            <image src="/static/icons/icon-right.svg" class="icon-image"></image>
          </view>
        </view>
      </view>

      <!-- 商家信息 -->
      <view class="section-card" v-if="merchantInfo">
        <view class="merchant-info">
          <image 
            class="merchant-logo" 
            :src="merchantInfo.logo || '/static/default-logo.png'" 
            mode="aspectFill">
          </image>
          <text class="merchant-name">{{ merchantInfo.name }}</text>
        </view>
      </view>

      <!-- 商品列表 -->
      <view class="section-card">
        <view class="card-title">商品信息</view>
        <view class="goods-list">
          <view 
            class="goods-item" 
            v-for="(item, index) in cartItems" 
            :key="index"
          >
            <image class="goods-image" :src="item.imageUrl || '/static/default-food.png'" mode="aspectFill"></image>
            <view class="goods-info">
              <text class="goods-name">{{ item.name }}</text>
              <view class="goods-price-row">
                <text class="goods-price">¥{{ item.price }}</text>
                <text class="goods-count">x{{ item.quantity }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 备注信息 -->
      <view class="section-card">
        <view class="card-title">订单备注</view>
        <view class="remark-input">
          <input 
            type="text" 
            v-model="remark" 
            placeholder="有什么特殊需求，可以告诉我们..." 
            maxlength="100"
            class="input-control" 
          />
        </view>
      </view>

      <!-- 价格详情 -->
      <view class="section-card">
        <view class="card-title">价格详情</view>
        <view class="price-list">
          <view class="price-item">
            <text class="price-label">商品总价</text>
            <text class="price-value">¥{{ totalPrice.toFixed(2) }}</text>
          </view>
          <view class="price-item">
            <text class="price-label">配送费</text>
            <text class="price-value">¥{{ deliveryFee.toFixed(2) }}</text>
          </view>
          <view class="price-divider"></view>
          <view class="price-item total">
            <text class="price-label">实付款</text>
            <text class="price-total">¥{{ (totalPrice + deliveryFee).toFixed(2) }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部结算栏 -->
    <view class="checkout-bar">
      <view class="total-price">
        <text class="price-label">合计:</text>
        <text class="price-amount">¥{{ (totalPrice + deliveryFee).toFixed(2) }}</text>
      </view>
      <view class="submit-btn" @click="submitOrder">
        <text class="submit-text">提交订单</text>
      </view>
    </view>

    <!-- 地址选择弹窗 -->
    <view class="address-picker" v-if="showAddressPicker">
      <view class="address-picker-mask" @click="showAddressPicker = false"></view>
      <view class="address-picker-content">
        <view class="address-picker-header">
          <text class="address-picker-title">选择收货地址</text>
          <view class="close-icon" @click="showAddressPicker = false">
            <image src="/static/icons/icon-close.svg" class="icon-image"></image>
          </view>
        </view>
        
        <!-- 地址列表 -->
        <scroll-view v-if="!showAddForm" class="address-picker-body" scroll-y>
          <view v-if="addressList.length === 0" class="address-empty">
            <text class="empty-text">暂无收货地址</text>
            <button class="btn-add-address" @click="toggleAddForm(true)">添加地址</button>
          </view>
          <view 
            v-else 
            class="address-item" 
            v-for="(item, index) in addressList" 
            :key="index"
            @click="selectAddressAndClose(item)"
          >
            <view class="address-item-info">
              <view class="address-item-top">
                <text class="address-item-name">{{ item.receiverName }}</text>
                <text class="address-item-phone">{{ item.phone }}</text>
                <text v-if="item.isDefault === 1" class="address-item-tag">默认</text>
              </view>
              <view class="address-item-bottom">
                <text class="address-item-text">{{ getFullAddress(item) }}</text>
              </view>
            </view>
            <view class="address-item-right">
              <image v-if="selectedAddress && selectedAddress.id === item.id" src="/static/icons/icon-select.svg" class="icon-image"></image>
            </view>
          </view>
        </scroll-view>
        
        <!-- 添加地址表单 -->
        <view v-if="showAddForm" class="address-form-container">
          <AddressForm :showHeader="false" @success="onAddressSuccess" @cancel="toggleAddForm(false)" />
        </view>
        
        <view v-if="!showAddForm" class="address-picker-footer">
          <button class="btn-add-address" @click="toggleAddForm(true)">添加新地址</button>
          <button class="btn-confirm" @click="showAddressPicker = false">关闭</button>
        </view>
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
import { ref, onMounted, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { customerAddressList, customerGetMerchant } from '@/api/customerController';
import { orderCreateOrder } from '@/api/orderController';
import AddressForm from '@/pages/menu/AddressForm.vue';
import {useUserInfoStore} from "@/stores/useUserInfoStore";

// 用户信息store
const userInfoStore = useUserInfoStore();
// 商家ID
const merchantId = ref<string>('');
// 商家信息
const merchantInfo = ref<API.MerchantVO | null>(null);
// 购物车商品
const cartItems = ref<any[]>([]);
// 地址列表
const addressList = ref<API.CustomerAddressVO[]>([]);
// 选中的地址
const selectedAddress = ref<API.CustomerAddressVO | null>(null);
// 备注
const remark = ref<string>('');
// 地址选择器显示状态
const showAddressPicker = ref<boolean>(false);
// 加载状态
const isLoading = ref<boolean>(false);
// 配送费
const deliveryFee = ref<number>(5);
// 显示添加地址表单
const showAddForm = ref<boolean>(false);

// 计算商品总价
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// 页面加载
onLoad(async () => {
  // 获取用户信息
  if (!userInfoStore.userInfo.id) {
    try {
      await userInfoStore.fetchUserInfo();
      
      if (!userInfoStore.userInfo.id) {
        console.error('获取用户信息失败: 无法获取用户ID');
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        });
        
        // 跳转到登录页
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/index'
          });
        }, 1500);
        return;
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      uni.showToast({
        title: '获取用户信息失败，请重新登录',
        icon: 'none'
      });
      
      // 跳转到登录页
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/login/index'
        });
      }, 1500);
      return;
    }
  }

  console.log('页面加载 - 用户ID:', userInfoStore.userInfo.id);

  // 从本地存储获取购物车数据和商家ID
  try {
    const cartItemsStr = uni.getStorageSync('cartItems');
    const merchant = uni.getStorageSync('merchantId');
    
    if (cartItemsStr) {
      cartItems.value = JSON.parse(cartItemsStr);
    }
    
    if (merchant) {
      merchantId.value = merchant;
      await fetchMerchantInfo();
    }
    
    // 获取地址列表
    await fetchAddressList();
    
    // 如果有默认地址，则自动选中
    selectDefaultAddress();
  } catch (error) {
    console.error('初始化数据失败:', error);
  }
});

// 获取商家信息
async function fetchMerchantInfo() {
  if (!merchantId.value) return;
  
  try {
    const res = await customerGetMerchant({
      merchantId: merchantId.value
    });
    
    if (res.data?.code === 20000 && res.data.data) {
      merchantInfo.value = res.data.data;
    }
  } catch (error) {
    console.error('获取商家信息失败:', error);
  }
}

// 获取地址列表
async function fetchAddressList() {
  try {
    const res = await customerAddressList();
    
    if (res.data?.code === 20000 && res.data.data) {
      addressList.value = res.data.data;
    }
  } catch (error) {
    console.error('获取地址列表失败:', error);
  }
}

// 自动选择默认地址
function selectDefaultAddress() {
  if (addressList.value.length > 0) {
    // 尝试找到默认地址
    const defaultAddress = addressList.value.find(addr => addr.isDefault === 1);
    
    if (defaultAddress) {
      selectedAddress.value = defaultAddress;
    } else {
      // 如果没有默认地址，选择第一个
      selectedAddress.value = addressList.value[0];
    }
  }
}

// 获取完整地址
function getFullAddress(address: API.CustomerAddressVO): string {
  if (!address) return '';
  return `${address.province} ${address.city} ${address.district} ${address.detailAddress}`;
}

// 选择地址并关闭弹窗
function selectAddressAndClose(address: API.CustomerAddressVO) {
  selectedAddress.value = address;
  showAddressPicker.value = false;
}

// 切换显示添加地址表单
function toggleAddForm(show: boolean) {
  showAddForm.value = show;
}

// 处理地址添加成功
async function onAddressSuccess(address: any) {
  // 重新获取地址列表
  await fetchAddressList();
  // 选择新添加的地址
  const newAddress = addressList.value.find(addr => addr.id === address);
  if (newAddress) {
    selectedAddress.value = newAddress;
  }
  // 关闭添加表单
  toggleAddForm(false);
}

// 返回上一页
function goBack() {
  uni.navigateBack();
}

// 提交订单
async function submitOrder() {
  if (!selectedAddress.value) {
    await uni.showToast({
      title: '请选择收货地址',
      icon: 'none'
    });
    return;
  }
  
  if (cartItems.value.length === 0) {
    await uni.showToast({
      title: '购物车为空',
      icon: 'none'
    });
    return;
  }
  
  if (!merchantId.value) {
    await uni.showToast({
      title: '商家信息有误',
      icon: 'none'
    });
    return;
  }
  
  // 确保有用户ID
  let customerId = userInfoStore.userInfo.id;
  
  if (!customerId) {
    console.error('提交订单错误: 用户ID为空，尝试重新获取');
    // 尝试重新获取用户信息
    try {
      await userInfoStore.fetchUserInfo();
      customerId = userInfoStore.userInfo.id;
      
      if (!customerId) {
        console.error('重新获取用户信息后，仍无法获取用户ID');
        await uni.showToast({
          title: '用户信息有误，请重新登录',
          icon: 'none'
        });
        
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/index'
          });
        }, 1500);
        return;
      }
    } catch (error) {
      console.error('重新获取用户信息失败:', error);
      await uni.showToast({
        title: '用户信息有误，请重新登录',
        icon: 'none'
      });
      return;
    }
  }
  
  console.log('提交订单 - 用户ID:', customerId);
  console.log('提交订单 - 商家ID:', merchantId.value);
  console.log('提交订单 - 地址信息:', selectedAddress.value);
  
  isLoading.value = true;
  
  try {
    // 准备订单数据
    const orderRequest: API.OrderCreateRequest = {
      merchantId: merchantId.value,
      customerId: customerId,
      receiverName: selectedAddress.value.receiverName,
      receiverPhone: selectedAddress.value.phone,
      receiverAddress: getFullAddress(selectedAddress.value),
      remark: remark.value
    };
    
    console.log('订单请求数据:', orderRequest);
    
    // 准备订单商品数据
    const orderItemRequests: API.OrderItemCreateRequest[] = cartItems.value.map(item => {
      return {
        menuId: item.menuId,
        quantity: item.quantity
      };
    });
    
    console.log('订单商品数据:', orderItemRequests);
    
    // 创建订单
    const res = await orderCreateOrder({
      orderRequest,
      orderItemRequests
    });
    
    console.log('创建订单响应:', res.data);
    
    if (res.data?.code === 20000 && res.data.data) {
      // 创建订单成功，清空购物车
      uni.removeStorageSync('cartItems');
      
      // 显示成功提示
      await uni.showToast({
        title: '订单创建成功',
        icon: 'success'
      });
      
      // 跳转到订单详情页
      setTimeout(() => {
        uni.redirectTo({
          url: `/pages/order/detail?id=${res.data.data.order?.id}`
        });
      }, 1500);
    } else {
      throw new Error(res.data?.msg || '创建订单失败');
    }
  } catch (error) {
    console.error('创建订单失败:', error);
    await uni.showToast({
      title: '创建订单失败，请重试',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<style lang="scss">
.checkout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 120rpx;
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

.checkout-content {
  flex: 1;
  padding: 20rpx;
}

.address-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.address-info {
  display: flex;
  align-items: flex-start;
  
  .address-left {
    margin-right: 20rpx;
    padding-top: 4rpx;
    
    .icon-image {
      width: 40rpx;
      height: 40rpx;
      color: #ff6633;
    }
  }
  
  .address-right {
    flex: 1;
    
    .address-top {
      margin-bottom: 10rpx;
      
      .receiver-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-right: 20rpx;
      }
      
      .receiver-phone {
        font-size: 28rpx;
        color: #666;
      }
    }
    
    .address-bottom {
      .address-text {
        font-size: 28rpx;
        color: #666;
        line-height: 1.5;
      }
    }
  }
  
  .address-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40rpx;
    
    .icon-image {
      width: 24rpx;
      height: 24rpx;
      color: #999;
    }
  }
}

.no-address {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .no-address-text {
    font-size: 28rpx;
    color: #999;
  }
}

.section-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  
  .card-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    position: relative;
    padding-left: 20rpx;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 6rpx;
      width: 6rpx;
      height: 30rpx;
      background-color: #ff6633;
      border-radius: 3rpx;
    }
  }
}

.merchant-info {
  display: flex;
  align-items: center;
  
  .merchant-logo {
    width: 80rpx;
    height: 80rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
  }
  
  .merchant-name {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
  }
}

.goods-list {
  .goods-item {
    display: flex;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f2f2f2;
    
    &:last-child {
      border-bottom: none;
    }
    
    .goods-image {
      width: 120rpx;
      height: 120rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
      background-color: #f8f8f8;
    }
    
    .goods-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .goods-name {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 10rpx;
      }
      
      .goods-price-row {
        display: flex;
        justify-content: space-between;
        
        .goods-price {
          font-size: 28rpx;
          color: #ff6633;
          font-weight: bold;
        }
        
        .goods-count {
          font-size: 26rpx;
          color: #999;
        }
      }
    }
  }
}

.remark-input {
  .input-control {
    width: 100%;
    height: 80rpx;
    border: 1rpx solid #eee;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #333;
  }
}

.price-list {
  .price-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
    
    .price-label {
      font-size: 28rpx;
      color: #666;
    }
    
    .price-value {
      font-size: 28rpx;
      color: #333;
    }
  }
  
  .price-divider {
    height: 1rpx;
    background-color: #eee;
    margin: 16rpx 0;
  }
  
  .total {
    .price-label {
      font-size: 30rpx;
      color: #333;
      font-weight: bold;
    }
    
    .price-total {
      font-size: 34rpx;
      color: #ff6633;
      font-weight: bold;
    }
  }
}

.checkout-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 10;
  
  .total-price {
    display: flex;
    align-items: baseline;
    
    .price-label {
      font-size: 28rpx;
      color: #333;
      margin-right: 10rpx;
    }
    
    .price-amount {
      font-size: 36rpx;
      color: #ff6633;
      font-weight: bold;
    }
  }
  
  .submit-btn {
    background-color: #ff6633;
    border-radius: 40rpx;
    padding: 0 50rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .submit-text {
      color: #fff;
      font-size: 30rpx;
      font-weight: bold;
    }
  }
}

.address-picker {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  
  .address-picker-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .address-picker-content {
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
  
  .address-picker-header {
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #f2f2f2;
    
    .address-picker-title {
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
  
  .address-picker-body {
    flex: 1;
    padding: 0 30rpx;
    
    .address-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      
      .empty-text {
        font-size: 28rpx;
        color: #999;
        margin-bottom: 30rpx;
      }
    }
    
    .address-item {
      display: flex;
      padding: 30rpx 0;
      border-bottom: 1rpx solid #f2f2f2;
      
      .address-item-info {
        flex: 1;
        
        .address-item-top {
          margin-bottom: 10rpx;
          display: flex;
          align-items: center;
          
          .address-item-name {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            margin-right: 20rpx;
          }
          
          .address-item-phone {
            font-size: 28rpx;
            color: #666;
            margin-right: 20rpx;
          }
          
          .address-item-tag {
            font-size: 22rpx;
            color: #ff6633;
            border: 1rpx solid #ff6633;
            border-radius: 4rpx;
            padding: 0 8rpx;
          }
        }
        
        .address-item-bottom {
          .address-item-text {
            font-size: 26rpx;
            color: #666;
            line-height: 1.5;
          }
        }
      }
      
      .address-item-right {
        display: flex;
        align-items: center;
        padding-left: 20rpx;
        
        .icon-image {
          width: 36rpx;
          height: 36rpx;
          color: #ff6633;
        }
      }
    }
  }
  
  .address-picker-footer {
    padding: 20rpx 30rpx;
    border-top: 1rpx solid #f2f2f2;
    display: flex;
    
    .btn-add-address {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 28rpx;
      border-radius: 40rpx;
      background-color: #fff;
      color: #ff6633;
      border: 1rpx solid #ff6633;
      margin-right: 20rpx;
    }
    
    .btn-confirm {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 28rpx;
      border-radius: 40rpx;
      background-color: #ff6633;
      color: #fff;
    }
  }
  
  .address-form-container {
    flex: 1;
    padding: 0 30rpx;
    overflow-y: auto;
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