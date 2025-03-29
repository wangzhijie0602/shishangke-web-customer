<template>
  <view class="order-container safe-area-inset-top">
    <view class="order-header">
      <text class="header-title">我的订单</text>
    </view>
    
    <scroll-view 
      class="order-list" 
      scroll-y 
      @scrolltolower="loadMoreOrders"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view v-if="orderList.length === 0 && !isLoading" class="empty-tip">
        <text>暂无订单记录</text>
      </view>
      
      <view v-else>
        <view 
          v-for="(orderItem, index) in orderList" 
          :key="index" 
          class="order-item"
          @click="goToOrderDetail(orderItem?.order?.id)"
        >
          <!-- 店铺信息 -->
          <view class="merchant-info">
            <text class="merchant-name">{{ orderItem?.order?.merchantName }}</text>
            <view :class="['order-status', getStatusClass(orderItem?.order?.status)]">{{ getStatusText(orderItem?.order?.status) }}</view>
          </view>
          
          <!-- 商品列表 -->
          <view class="goods-list">
            <view class="goods-images">
              <image 
                v-for="(item, itemIndex) in orderItem?.orderItem?.slice(0, 3) || []" 
                :key="itemIndex"
                :src="item.imageUrl" 
                class="goods-image"
                mode="aspectFill"
              />
              <view v-if="orderItem?.orderItem?.length && orderItem?.orderItem?.length > 3" class="goods-count">
                +{{ (orderItem?.orderItem?.length || 0) - 3 }}
              </view>
            </view>
            <view class="order-info">
              <text class="goods-count-text">共{{ orderItem?.orderItem?.length || 0 }}件商品</text>
              <text class="order-amount">￥{{ orderItem?.order?.actualAmount || 0 }}</text>
            </view>
          </view>
          
          <!-- 订单底部 -->
          <view class="order-footer">
            <text class="order-time">{{ formatDate(orderItem?.order?.createdAt) }}</text>
            <view class="order-btns">
              <button v-if="['PENDING', '待支付'].includes(orderItem?.order?.status || '')" class="btn btn-pay" @click.stop="goToPay(orderItem?.order?.id)">去支付</button>
              <button v-if="['PENDING', 'PAID', 'PREPARING', '待支付', '已支付', '准备中'].includes(orderItem?.order?.status || '')" class="btn btn-cancel" @click.stop="cancelOrder(orderItem?.order?.id)">取消订单</button>
              <button v-if="['DELIVERING', '配送中'].includes(orderItem?.order?.status || '')" class="btn btn-confirm" @click.stop="confirmOrder(orderItem?.order?.id)">确认收货</button>
              <button v-if="['COMPLETED', '已完成'].includes(orderItem?.order?.status || '')" class="btn btn-review" @click.stop="reviewOrder(orderItem?.order?.id)">评价</button>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 加载状态 -->
      <view v-if="isLoading" class="loading">
        <text>加载中...</text>
      </view>
      
      <!-- 无更多数据提示 -->
      <view v-if="!hasMore && orderList.length > 0" class="no-more">
        <text>没有更多订单了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { orderListOrderItems, orderCancelOrder } from '@/api/orderController';
import { onShow } from '@dcloudio/uni-app';

// 订单列表
const orderList = ref<API.OrderAndItemVO[]>([]);
// 是否正在加载
const isLoading = ref(false);
// 是否还有更多数据
const hasMore = ref(true);
// 当前页码
const pageNum = ref(1);
// 每页大小
const pageSize = ref(10);
// 下拉刷新状态
const isRefreshing = ref(false);

// 格式化日期
function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// 获取状态样式类
function getStatusClass(status?: string) {
  if (!status) return '';
  // 检查是否是英文状态码，进行转换
  let displayStatus = status;
  switch (status) {
    case 'PENDING': return 'status-pending';
    case 'PAID': return 'status-paid';
    case 'PREPARING': return 'status-preparing';
    case 'DELIVERING': return 'status-delivering';
    case 'COMPLETED': return 'status-completed';
    case 'CANCELLED': return 'status-cancelled';
    // 中文状态码
    case '待支付': return 'status-pending';
    case '已支付': return 'status-paid';
    case '准备中': return 'status-preparing';
    case '配送中': return 'status-delivering';
    case '已完成': return 'status-completed';
    case '已取消': return 'status-cancelled';
    default: return '';
  }
}

// 获取用于显示的状态文本
function getStatusText(status?: string) {
  if (!status) return '';
  switch (status) {
    case 'PENDING': return '待支付';
    case 'PAID': return '已支付';
    case 'PREPARING': return '准备中';
    case 'DELIVERING': return '配送中';
    case 'COMPLETED': return '已完成';
    case 'CANCELLED': return '已取消';
    default: return status; // 如果已经是中文，则直接返回
  }
}

// 跳转到订单详情页
function goToOrderDetail(orderId?: string) {
  if (!orderId) return;
  uni.navigateTo({
    url: `/pages/order/detail?id=${orderId}`
  });
}

// 去支付
function goToPay(orderId?: string) {
  if (!orderId) return;
  uni.navigateTo({
    url: `/pages/payment/index?orderId=${orderId}`
  });
}

// 取消订单
function cancelOrder(orderId?: string) {
  if (!orderId) return;
  
  uni.showModal({
    title: '确认取消',
    content: '确定要取消此订单吗？',
    success: (res) => {
      if (res.confirm) {
        isLoading.value = true;
        orderCancelOrder({ id: orderId })
          .then(res => {
            if (res.data && res.data.code === 20000) {
              uni.showToast({
                title: '订单已取消',
                icon: 'success'
              });
              // 刷新订单列表
              pageNum.value = 1;
              orderList.value = [];
              hasMore.value = true;
              fetchOrders();
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
function confirmOrder(orderId?: string) {
  // TODO: 实现确认收货逻辑
  console.log('确认收货', orderId);
}

// 评价订单
function reviewOrder(orderId?: string) {
  // TODO: 实现评价逻辑
  console.log('评价订单', orderId);
}

// 获取订单列表
async function fetchOrders() {
  // 只在加载更多时检查这些条件，重置列表时不检查
  if (orderList.value.length > 0 && (isLoading.value || !hasMore.value)) return;
  
  isLoading.value = true;
  try {
    const res = await orderListOrderItems(
      { pageNum: pageNum.value, pageSize: pageSize.value },
      {} // 空的查询条件，获取所有订单
    );
    
    if (res.data.data && res.data.data.records) {
      if (pageNum.value === 1) {
        orderList.value = res.data.data.records;
      } else {
        orderList.value = [...orderList.value, ...res.data.data.records];
      }
      
      hasMore.value = res.data.data.records.length === pageSize.value;
      if (hasMore.value) {
        pageNum.value++;
      }
    } else {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('获取订单列表失败', error);
    await uni.showToast({
      title: '获取订单失败',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
  }
}

// 加载更多订单
function loadMoreOrders() {
  if (!isLoading.value && hasMore.value) {
    fetchOrders();
  }
}

// 下拉刷新
function onRefresh() {
  isRefreshing.value = true;
  pageNum.value = 1;
  hasMore.value = true;
  fetchOrders();
}

// 页面加载时获取订单
onMounted(() => {
  fetchOrders();
});

// 页面显示时重新获取订单列表
onShow(() => {
  pageNum.value = 1;
  orderList.value = [];
  hasMore.value = true;
  fetchOrders();
});
</script>

<style lang="scss">
.order-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.order-header {
  padding: 20rpx 30rpx;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 1;

  .header-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
}

.order-list {
  flex: 1;
  height: calc(100vh - 100rpx);
}

.empty-tip {
  height: 300rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #999;
}

.order-item {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.merchant-info {
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #f2f2f2;

  .merchant-name {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
  }

  .order-status {
    font-size: 24rpx;
    padding: 4rpx 12rpx;
    border-radius: 20rpx;
    font-weight: 500;
  }
  
  .status-pending {
    color: #ff9900;
    background-color: rgba(255, 153, 0, 0.1);
  }
  
  .status-paid {
    color: #409eff;
    background-color: rgba(64, 158, 255, 0.1);
  }
  
  .status-preparing {
    color: #9c27b0;
    background-color: rgba(156, 39, 176, 0.1);
  }
  
  .status-delivering {
    color: #2196f3;
    background-color: rgba(33, 150, 243, 0.1);
  }
  
  .status-completed {
    color: #4caf50;
    background-color: rgba(76, 175, 80, 0.1);
  }
  
  .status-cancelled {
    color: #909399;
    background-color: rgba(144, 147, 153, 0.1);
  }
}

.goods-list {
  padding: 20rpx 30rpx;
}

.goods-images {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  
  .goods-image {
    width: 140rpx;
    height: 140rpx;
    margin-right: 10rpx;
    border-radius: 8rpx;
    background-color: #f8f8f8;
  }
  
  .goods-count {
    width: 50rpx;
    height: 140rpx;
    line-height: 140rpx;
    text-align: center;
    font-size: 24rpx;
    color: #999;
  }
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .goods-count-text {
    font-size: 24rpx;
    color: #666;
  }
  
  .order-amount {
    font-size: 30rpx;
    font-weight: bold;
    color: #ff6633;
  }
}

.order-footer {
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1rpx solid #f2f2f2;
  
  .order-time {
    font-size: 24rpx;
    color: #999;
  }
  
  .order-btns {
    display: flex;
  }
  
  .btn {
    margin-left: 20rpx;
    padding: 0 30rpx;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 24rpx;
    border-radius: 30rpx;
    background-color: #fff;
  }
  
  .btn-pay {
    color: #fff;
    background-color: #ff6633;
    border: 1rpx solid #ff6633;
  }
  
  .btn-cancel, .btn-confirm, .btn-review {
    color: #666;
    border: 1rpx solid #ddd;
  }
}

.loading, .no-more {
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
  color: #999;
}
</style> 