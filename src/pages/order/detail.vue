<template>
  <view class="order-detail-container safe-area-inset-top">
    <!-- 返回按钮 -->
    <view class="nav-header">
      <view class="back-icon" @click="goBack">
        <image src="/static/icons/icon-back.svg" class="icon-image"></image>
      </view>
      <text class="page-title">订单详情</text>
    </view>

    <scroll-view class="detail-content" scroll-y v-if="orderDetail">
      <!-- 订单状态 -->
      <view class="status-card" :class="getStatusClass(orderDetail.order?.status)">
        <view :class="['status-icon', getStatusIconClass(orderDetail.order?.status)]">
          <text class="icon-text">{{ getStatusIcon(orderDetail.order?.status) }}</text>
        </view>
        <view class="status-info">
          <text class="status-text">{{ getStatusText(orderDetail.order?.status) }}</text>
          <text class="status-desc">{{ getStatusDesc(orderDetail.order?.status) }}</text>
        </view>
      </view>

      <!-- 商家信息 -->
      <view class="info-card">
        <view class="card-title">商家信息</view>
        <view class="shop-info">
          <text class="shop-name">{{ orderDetail.order?.merchantName }}</text>
        </view>
      </view>
      
      <!-- 商品列表 -->
      <view class="info-card">
        <view class="card-title">商品信息</view>
        <view class="goods-list">
          <view
              class="goods-item"
              v-for="(item, index) in orderDetail.orderItem"
              :key="index"
          >
            <image class="goods-image" :src="item.imageUrl" mode="aspectFill"/>
            <view class="goods-info">
              <text class="goods-name">{{ item.menuName }}</text>
              <view class="goods-price-info">
                <text class="goods-price">¥{{ item.price }}</text>
                <text class="goods-count">x{{ item.quantity }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 价格信息 -->
        <view class="price-summary">
          <view class="price-item">
            <text class="price-label">商品总价</text>
            <text class="price-value">¥{{ orderDetail.order?.totalAmount || 0 }}</text>
          </view>
          <view class="price-item">
            <text class="price-label">配送费</text>
            <text class="price-value">¥{{ orderDetail.order?.deliveryFee || 0 }}</text>
          </view>
          <view class="price-divider"></view>
          <view class="price-item total">
            <text class="price-label">实付款</text>
            <text class="price-total">¥{{ orderDetail.order?.actualAmount || 0 }}</text>
          </view>
        </view>
      </view>

      <!-- 收货信息 -->
      <view class="info-card">
        <view class="card-header">
          <view class="card-title">收货信息</view>
          <view class="card-action" @click="showAddressPicker = true">
            <text class="action-text">更换地址</text>
            <image src="/static/icons/icon-right.svg" class="icon-image"></image>
          </view>
        </view>
        <view class="address-info">
          <view class="address-left">
            <image src="/static/icons/icon-location.svg" class="icon-image"></image>
          </view>
          <view class="address-right">
            <view class="address-top">
              <text class="receiver-name">{{ orderDetail.order?.receiverName }}</text>
              <text class="receiver-phone">{{ orderDetail.order?.receiverPhone }}</text>
            </view>
            <view class="address-bottom">
              <text class="address-text">{{ orderDetail.order?.receiverAddress }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="info-card">
        <view class="card-title">订单信息</view>
        <view class="info-item">
          <text class="info-label">订单编号：</text>
          <text class="info-value">{{ orderDetail.order?.id }}</text>
          <text class="info-action" @click="copyOrderId">复制</text>
        </view>
        <view class="info-item">
          <text class="info-label">下单时间：</text>
          <text class="info-value">{{ formatDate(orderDetail.order?.createdAt) }}</text>
        </view>
        <view class="info-item" v-if="orderDetail.order?.remark">
          <text class="info-label">订单备注：</text>
          <text class="info-value">{{ orderDetail.order?.remark }}</text>
        </view>
        <view class="info-item" v-if="orderDetail.order?.expectedDeliveryTime">
          <text class="info-label">预计送达：</text>
          <text class="info-value">{{ formatDate(orderDetail.order?.expectedDeliveryTime) }}</text>
        </view>
        <view class="info-item" v-if="orderDetail.order?.actualDeliveryTime">
          <text class="info-label">实际送达：</text>
          <text class="info-value">{{ formatDate(orderDetail.order?.actualDeliveryTime) }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="footer-btns" v-if="orderDetail">
      <view class="btn-container">
        <button
            v-if="['PENDING', 'PAID', 'PREPARING', '待支付', '已支付', '准备中'].includes(orderDetail.order?.status || '')"
            class="btn btn-default"
            @click="cancelOrder"
        >取消订单
        </button>

        <button
            v-if="['PENDING', '待支付'].includes(orderDetail.order?.status || '')"
            class="btn btn-primary"
            @click="goToPay"
        >去支付
        </button>

        <button
            v-if="['DELIVERING', '配送中'].includes(orderDetail.order?.status || '')"
            class="btn btn-primary"
            @click="confirmOrder"
        >确认收货
        </button>

        <button
            v-if="['COMPLETED', '已完成'].includes(orderDetail.order?.status || '')"
            class="btn btn-primary"
            @click="reviewOrder"
        >评价订单
        </button>
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
        <scroll-view class="address-picker-body" scroll-y>
          <view v-if="addressList.length === 0" class="address-empty">
            <text class="empty-text">暂无收货地址</text>
            <button class="btn-add-address" @click="goToAddAddress">添加地址</button>
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
              <image v-if="selectedAddressId === item.id" src="/static/icons/icon-select.svg" class="icon-image"></image>
            </view>
          </view>
        </scroll-view>
        <view class="address-picker-footer">
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
import {ref} from 'vue';
import {onLoad} from '@dcloudio/uni-app';
import {orderGetOrderAndItem, orderChangeAddress, orderCancelOrder} from '@/api/orderController';
import {customerAddressList} from '@/api/customerController';

// 页面参数
const orderId = ref<string | null>(null);
// 订单详情
const orderDetail = ref<API.OrderAndItemVO | null>(null);
// 加载状态
const isLoading = ref(true);
// 地址选择器状态
const showAddressPicker = ref(false);
// 地址列表
const addressList = ref<API.CustomerAddressVO[]>([]);
// 选中的地址ID
const selectedAddressId = ref<string | null>(null);
// 临时选中的地址ID（未确认）
const tempSelectedAddressId = ref<string | null>(null);

// 获取订单详情
async function fetchOrderDetail() {
  if (!orderId.value) return;

  isLoading.value = true;
  try {
    const res = await orderGetOrderAndItem(
        {id: orderId.value},
    );

    if (res.data && res.data.data) {
      orderDetail.value = res.data.data;
    } else {
      await uni.showToast({
        title: '订单数据不存在',
        icon: 'none'
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  } catch (error) {
    console.error('获取订单详情失败', error);
    await uni.showToast({
      title: '获取订单详情失败',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
  }
}

// 获取地址列表
async function fetchAddressList() {
  try {
    const res = await customerAddressList();
    if (res.data && res.data.data) {
      addressList.value = res.data.data;
    }
  } catch (error) {
    console.error('获取地址列表失败', error);
    uni.showToast({
      title: '获取地址列表失败',
      icon: 'none'
    });
  }
}

// 格式化地址信息
function getFullAddress(address: API.CustomerAddressVO): string {
  if (!address) return '';
  return `${address.province} ${address.city} ${address.district} ${address.detailAddress}`;
}

// 选择地址并关闭弹窗
function selectAddressAndClose(address: API.CustomerAddressVO) {
  if (!orderId.value) return;
  
  selectedAddressId.value = address.id || '';
  isLoading.value = true;
  
  // 调用修改地址API
  const addressRequest: API.OrderAddressRequest = {
    id: orderId.value,
    receiverName: address.receiverName,
    receiverPhone: address.phone,
    receiverAddress: getFullAddress(address)
  };
  
  orderChangeAddress(addressRequest)
    .then(res => {
      if (res.data && res.data.code === 20000) {
        // 更新订单地址信息
        if (orderDetail.value && orderDetail.value.order) {
          orderDetail.value.order.receiverName = address.receiverName || '';
          orderDetail.value.order.receiverPhone = address.phone || '';
          orderDetail.value.order.receiverAddress = getFullAddress(address);
          
          uni.showToast({
            title: '地址已更新',
            icon: 'success'
          });
        }
      } else {
        uni.showToast({
          title: res.data?.msg || '更新地址失败',
          icon: 'none'
        });
      }
    })
    .catch(error => {
      console.error('更新地址失败', error);
      uni.showToast({
        title: '更新地址失败',
        icon: 'none'
      });
    })
    .finally(() => {
      isLoading.value = false;
      showAddressPicker.value = false;
    });
}

// 前往添加地址页面
function goToAddAddress() {
  uni.navigateTo({
    url: '/pages/address/add',
    success: () => {
      showAddressPicker.value = false;
    }
  });
}

// 格式化日期
function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// 获取状态样式类
function getStatusClass(status?: string) {
  if (!status) return '';
  switch (status) {
    case 'PENDING':
      return 'status-pending';
    case 'PAID':
      return 'status-paid';
    case 'PREPARING':
      return 'status-preparing';
    case 'DELIVERING':
      return 'status-delivering';
    case 'COMPLETED':
      return 'status-completed';
    case 'CANCELLED':
      return 'status-cancelled';
      // 中文状态码
    case '待支付':
      return 'status-pending';
    case '已支付':
      return 'status-paid';
    case '准备中':
      return 'status-preparing';
    case '配送中':
      return 'status-delivering';
    case '已完成':
      return 'status-completed';
    case '已取消':
      return 'status-cancelled';
    default:
      return '';
  }
}

// 获取用于显示的状态文本
function getStatusText(status?: string) {
  if (!status) return '';
  switch (status) {
    case 'PENDING':
      return '待支付';
    case 'PAID':
      return '已支付';
    case 'PREPARING':
      return '准备中';
    case 'DELIVERING':
      return '配送中';
    case 'COMPLETED':
      return '已完成';
    case 'CANCELLED':
      return '已取消';
    default:
      return status; // 如果已经是中文，则直接返回
  }
}

// 获取状态图标类
function getStatusIconClass(status?: string) {
  if (!status) return '';
  const mappedStatus = getStatusClass(status);
  switch (mappedStatus) {
    case 'status-pending':
      return 'icon-pending';
    case 'status-paid':
      return 'icon-paid';
    case 'status-preparing':
      return 'icon-preparing';
    case 'status-delivering':
      return 'icon-delivering';
    case 'status-completed':
      return 'icon-completed';
    case 'status-cancelled':
      return 'icon-cancelled';
    default:
      return '';
  }
}

// 获取状态图标
function getStatusIcon(status?: string) {
  if (!status) return '';
  const mappedStatus = getStatusClass(status);
  switch (mappedStatus) {
    case 'status-pending':
      return '￥';
    case 'status-paid':
      return '√';
    case 'status-preparing':
      return '⏰';
    case 'status-delivering':
      return '🚚';
    case 'status-completed':
      return '✓';
    case 'status-cancelled':
      return '×';
    default:
      return '';
  }
}

// 获取状态描述
function getStatusDesc(status?: string) {
  if (!status) return '';
  const mappedStatus = getStatusClass(status);
  switch (mappedStatus) {
    case 'status-pending':
      return '请尽快完成支付';
    case 'status-paid':
      return '商家已收到您的订单';
    case 'status-preparing':
      return '商家正在准备您的餐品';
    case 'status-delivering':
      return '骑手正在火速配送中';
    case 'status-completed':
      return '订单已完成，欢迎再次光临';
    case 'status-cancelled':
      return '订单已取消';
    default:
      return '';
  }
}

// 复制订单号
function copyOrderId() {
  if (!orderDetail.value?.order?.id) return;

  uni.setClipboardData({
    data: String(orderDetail.value.order.id),
    success: () => {
      uni.showToast({
        title: '订单号已复制',
        icon: 'none'
      });
    }
  });
}

// 去支付
function goToPay() {
  if (!orderId.value) return;
  uni.navigateTo({
    url: `/pages/payment/index?orderId=${orderId.value}`
  });
}

// 取消订单
function cancelOrder() {
  if (!orderId.value) return;
  
  uni.showModal({
    title: '确认取消',
    content: '确定要取消此订单吗？',
    success: (res) => {
      if (res.confirm) {
        isLoading.value = true;
        orderCancelOrder({ id: orderId.value || '' })
          .then(res => {
            if (res.data && res.data.code === 20000) {
              uni.showToast({
                title: '订单已取消',
                icon: 'success'
              });
              // 取消订单成功后返回上一级
              setTimeout(() => {
                uni.navigateBack();
              }, 1500);
            } else {
              uni.showToast({
                title: res.data?.msg || '取消订单失败',
                icon: 'none'
              });
            }
          })
          .catch(error => {
            console.error('取消订单失败', error);
            uni.showToast({
              title: '取消订单失败',
              icon: 'none'
            });
          })
          .finally(() => {
            isLoading.value = false;
          });
      }
    }
  });
}

// 确认收货
function confirmOrder() {
  // if (!orderId.value) return;
  //
  // uni.showModal({
  //   title: '确认收货',
  //   content: '确认已收到商品吗？',
  //   success: (res) => {
  //     if (res.confirm) {
  //       isLoading.value = true;
  //       orderConfirmReceipt({ id: orderId.value })
  //         .then(res => {
  //           if (res.data && res.data.code === 200) {
  //             uni.showToast({
  //               title: '确认收货成功',
  //               icon: 'success'
  //             });
  //             // 刷新订单详情
  //             fetchOrderDetail();
  //           } else {
  //             uni.showToast({
  //               title: res.data?.msg || '确认收货失败',
  //               icon: 'none'
  //             });
  //           }
  //         })
  //         .catch(error => {
  //           console.error('确认收货失败', error);
  //           uni.showToast({
  //             title: '确认收货失败',
  //             icon: 'none'
  //           });
  //         })
  //         .finally(() => {
  //           isLoading.value = false;
  //         });
  //     }
  //   }
  // });
}

// 评价订单
function reviewOrder() {
  if (!orderId.value) return;
  uni.navigateTo({
    url: `/pages/review/index?orderId=${orderId.value}`
  });
}

// 返回上一页
function goBack() {
  uni.navigateBack();
}

// 页面加载
onLoad((options: any) => {
  if (options.id) {
    orderId.value = options.id;
    fetchOrderDetail();
    fetchAddressList();
  } else {
    uni.showToast({
      title: '订单ID不存在',
      icon: 'none'
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }
});
</script>

<style lang="scss">
.order-detail-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 120rpx;
  width: 100%;
  box-sizing: border-box;
}

.nav-header {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  box-sizing: border-box;
  
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

.detail-content {
  flex: 1;
  padding: 20rpx;
  width: 100%;
  box-sizing: border-box;
}

.status-card {
  background-color: #ff6633;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  color: #fff;
  box-shadow: 0 4rpx 12rpx rgba(255, 102, 51, 0.2);
  
  .status-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20rpx;
    
    .icon-text {
      font-size: 40rpx;
    }
  }
  
  .status-info {
    flex: 1;
    
    .status-text {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
      display: block;
    }
    
    .status-desc {
      font-size: 26rpx;
      opacity: 0.9;
    }
  }
  
  &.status-pending {
    background-color: #ff9900;
    box-shadow: 0 4rpx 12rpx rgba(255, 153, 0, 0.2);
  }
  
  &.status-paid {
    background-color: #409eff;
    box-shadow: 0 4rpx 12rpx rgba(64, 158, 255, 0.2);
  }
  
  &.status-preparing {
    background-color: #9c27b0;
    box-shadow: 0 4rpx 12rpx rgba(156, 39, 176, 0.2);
  }
  
  &.status-delivering {
    background-color: #2196f3;
    box-shadow: 0 4rpx 12rpx rgba(33, 150, 243, 0.2);
  }
  
  &.status-completed {
    background-color: #4caf50;
    box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.2);
  }
  
  &.status-cancelled {
    background-color: #909399;
    box-shadow: 0 4rpx 12rpx rgba(144, 147, 153, 0.2);
  }
}

.info-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .card-action {
      display: flex;
      align-items: center;
      color: #ff6633;
      font-size: 26rpx;
      
      .icon-image {
        width: 24rpx;
        height: 24rpx;
        margin-left: 4rpx;
      }
    }
  }
  
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

.address-info {
  display: flex;
  background-color: #f9f9f9;
  border-radius: 12rpx;
  padding: 20rpx;
  
  .address-left {
    display: flex;
    align-items: flex-start;
    padding-top: 4rpx;
    margin-right: 16rpx;
    
    .icon-image {
      width: 36rpx;
      height: 36rpx;
      color: #ff6633;
    }
  }
  
  .address-right {
    flex: 1;
    
    .address-top {
      margin-bottom: 8rpx;
      
      .receiver-name {
        font-size: 28rpx;
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
        font-size: 26rpx;
        color: #666;
        line-height: 1.5;
      }
    }
  }
}

.info-item {
  display: flex;
  margin-bottom: 16rpx;
  font-size: 26rpx;
  line-height: 1.5;
  
  .info-label {
    color: #666;
    width: 160rpx;
    flex-shrink: 0;
  }
  
  .info-value {
    color: #333;
    flex: 1;
  }
  
  .info-action {
    color: #ff6633;
    margin-left: 20rpx;
  }
}

.shop-info {
  .shop-name {
    font-size: 28rpx;
    color: #333;
    font-weight: bold;
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
      width: 140rpx;
      height: 140rpx;
      border-radius: 12rpx;
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
        font-weight: 500;
      }
      
      .goods-price-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .goods-price {
          font-size: 30rpx;
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

.price-summary {
  margin-top: 30rpx;
  
  .price-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
    
    .price-label {
      font-size: 26rpx;
      color: #666;
    }
    
    .price-value {
      font-size: 26rpx;
      color: #333;
    }
  }
  
  .price-divider {
    height: 1rpx;
    background-color: #f2f2f2;
    margin: 20rpx 0;
  }
  
  .total {
    .price-label {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }
    
    .price-total {
      font-size: 34rpx;
      color: #ff6633;
      font-weight: bold;
    }
  }
}

.footer-btns {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 10;
  
  .btn-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  
  .btn {
    height: 80rpx;
    line-height: 80rpx;
    font-size: 28rpx;
    border-radius: 40rpx;
    flex: 1;
  }
  
  .btn-primary {
    background-color: #ff6633;
    color: #fff;
    border: none;
    box-shadow: 0 4rpx 8rpx rgba(255, 102, 51, 0.2);
  }
  
  .btn-default {
    background-color: #fff;
    color: #666;
    border: 1rpx solid #ddd;
    margin-right: 20rpx;
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
      
      .btn-add-address {
        font-size: 28rpx;
        color: #fff;
        background-color: #ff6633;
        border-radius: 40rpx;
        padding: 10rpx 40rpx;
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
    
    .btn-confirm {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 28rpx;
      border-radius: 40rpx;
      background-color: #ff6633;
      color: #fff;
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