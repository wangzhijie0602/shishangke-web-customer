<template>
  <view class="payment-container safe-area-inset-top">
    <!-- 返回按钮 -->
    <view class="nav-header">
      <view class="back-icon" @click="goBack">
        <image src="/static/icons/icon-back.svg" class="icon-image"></image>
      </view>
      <text class="page-title">订单支付</text>
    </view>

    <view class="payment-content" v-if="orderDetail">
      <!-- 支付金额 -->
      <view class="amount-card">
        <text class="amount-label">支付金额</text>
        <text class="amount-value">¥{{ orderDetail.order?.actualAmount || 0 }}</text>
      </view>

      <!-- 订单信息 -->
      <view class="info-card">
        <view class="card-title">订单信息</view>
        <view class="merchant-info">
          <text class="merchant-name">{{ orderDetail.order?.merchantName }}</text>
        </view>
        
        <!-- 简略商品信息 -->
        <view class="goods-summary">
          <view class="goods-images">
            <image 
              v-for="(item, index) in orderDetail.orderItem?.slice(0, 3) || []" 
              :key="index"
              :src="item.imageUrl" 
              class="goods-image"
              mode="aspectFill"
            />
            <view v-if="orderDetail.orderItem?.length && orderDetail.orderItem?.length > 3" class="goods-count">
              +{{ (orderDetail.orderItem?.length || 0) - 3 }}
            </view>
          </view>
          <text class="goods-count-text">共{{ orderDetail.orderItem?.length || 0 }}件商品</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">订单编号：</text>
          <text class="info-value">{{ orderDetail.order?.id }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">下单时间：</text>
          <text class="info-value">{{ formatDate(orderDetail.order?.createdAt) }}</text>
        </view>
      </view>

      <!-- 支付方式 -->
      <view class="info-card">
        <view class="card-title">支付方式</view>
        <view class="payment-methods">
          <view 
            v-for="(method, index) in paymentMethods" 
            :key="index" 
            class="payment-method-item"
            :class="{ active: selectedPaymentMethod === method.value }"
            @click="selectedPaymentMethod = method.value"
          >
            <view class="method-icon">
              <image :src="method.icon" class="method-icon-image"></image>
            </view>
            <view class="method-info">
              <text class="method-name">{{ method.name }}</text>
            </view>
            <view class="method-check">
              <view v-if="selectedPaymentMethod === method.value" class="check-icon"></view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="footer-btns">
      <button class="btn-pay" @click="handlePay">确认支付</button>
    </view>

    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
    
    <!-- 支付成功弹窗 -->
    <view v-if="paymentSuccess" class="success-popup">
      <view class="success-popup-mask"></view>
      <view class="success-popup-content">
        <view class="success-icon">
          <image src="/static/icons/icon-success.svg" class="icon-image"></image>
        </view>
        <text class="success-title">支付成功</text>
        <text class="success-desc">您的订单已支付成功</text>
        <button class="btn-check-order" @click="goToOrderDetail">查看订单</button>
      </view>
    </view>
    
    <!-- 支付失败弹窗 -->
    <view v-if="paymentFailed" class="fail-popup">
      <view class="success-popup-mask"></view>
      <view class="success-popup-content">
        <view class="fail-icon">
          <image src="/static/icons/icon-fail.svg" class="icon-image"></image>
        </view>
        <text class="fail-title">支付失败</text>
        <text class="fail-desc">很抱歉，您的支付未能完成</text>
        <button class="btn-retry" @click="paymentFailed = false">重新支付</button>
        <button class="btn-back" @click="goBack">返回</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { paymentCreatePayment, paymentConfirmPayment } from '@/api/paymentController';
import { orderGetOrderAndItem } from '@/api/orderController';

// 页面参数
const orderId = ref<string | null>(null);
// 订单详情
const orderDetail = ref<API.OrderAndItemVO | null>(null);
// 加载状态
const isLoading = ref(true);
// 选中的支付方式
const selectedPaymentMethod = ref<string>('WECHAT');
// 支付成功状态
const paymentSuccess = ref(false);
// 支付失败状态
const paymentFailed = ref(false);
// 支付ID
const paymentId = ref<string>('');

// 支付方式列表
const paymentMethods = [
  {
    name: '微信支付',
    value: 'WECHAT',
    icon: '/static/icons/icon-wechat.svg'
  }
];

// 获取订单详情
async function fetchOrderDetail() {
  if (!orderId.value) return;

  isLoading.value = true;
  try {
    const res = await orderGetOrderAndItem(
      { id: orderId.value },
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

// 格式化日期
function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// 创建支付订单
async function createPayment() {
  if (!orderId.value) return false;
  
  isLoading.value = true;
  try {
    // 获取选中的支付方式
    const paymentMethod = 'WECHAT'; // 直接使用微信支付
    
    // 创建支付订单
    const paymentRes = await paymentCreatePayment({
      orderId: orderId.value,
      paymentMethod: paymentMethod as any
    });
    
    if (paymentRes.data.code === 20000 && paymentRes.data.data) {
      // 修复类型问题：从 PaymentVO 中获取 id
      paymentId.value = paymentRes.data.data.id || '';
      
      // 检查支付状态
      if (paymentRes.data.data.status === '支付成功') {
        // 支付已经成功，直接显示成功状态
        paymentSuccess.value = true;
        return true;
      } else if (paymentRes.data.data.status === '支付失败') {
        // 支付已经失败，显示失败状态
        paymentFailed.value = true;
        return false;
      }
      
      return true;
    } else {
      await uni.showToast({
        title: paymentRes.data?.msg || '创建支付订单失败',
        icon: 'none'
      });
      return false;
    }
  } catch (error) {
    console.error('创建支付订单失败', error);
    await uni.showToast({
      title: '创建支付订单失败',
      icon: 'none'
    });
    return false;
  } finally {
    isLoading.value = false;
  }
}

// 确认支付
async function confirmPayment() {
  if (!paymentId.value) return false;

  isLoading.value = true;
  try {
    const confirmRes = await paymentConfirmPayment({
      paymentId: paymentId.value
    });
    
    if (confirmRes.data.code === 20000) {
      // 检查返回的状态，如果有的话
      if (confirmRes.data.data && confirmRes.data.data.status) {
        const status = confirmRes.data.data.status;
        if (status === '支付成功') {
          paymentSuccess.value = true;
          return true;
        } else if (status === '支付失败') {
          paymentFailed.value = true;
          await uni.showToast({
            title: '支付失败',
            icon: 'none'
          });
          return false;
        }
      }
      
      // 默认为成功
      paymentSuccess.value = true;
      return true;
    } else {
      await uni.showToast({
        title: confirmRes.data?.msg || '确认支付失败',
        icon: 'none'
      });
      return false;
    }
  } catch (error) {
    console.error('确认支付失败', error);
    await uni.showToast({
      title: '确认支付失败',
      icon: 'none'
    });
    return false;
  } finally {
    isLoading.value = false;
  }
}

// 处理支付
async function handlePay() {
  // 1. 创建支付订单
  const createSuccess = await createPayment();
  
  // 如果创建失败或者已经有明确的失败状态，直接返回
  if (!createSuccess || paymentFailed.value) return;
  
  // 如果已经有明确的成功状态，直接返回
  if (paymentSuccess.value) return;
  
  // 注意: 这里是模拟支付流程
  // 实际对接微信支付时，需要替换以下代码
  
  /*
   * 实际微信支付对接流程：
   * 1. 后端创建支付订单后返回支付参数(prepay_id、nonceStr、timeStamp等)
   * 2. 前端调用uni.requestPayment方法唤起微信支付
   * 示例代码：
   * uni.requestPayment({
   *   provider: 'wxpay',
   *   orderInfo: { // 微信、支付宝订单数据
   *     appid: payRes.appId,
   *     noncestr: payRes.nonceStr,
   *     package: payRes.package,
   *     partnerid: payRes.partnerId,
   *     prepayid: payRes.prepayId,
   *     timestamp: payRes.timeStamp,
   *     sign: payRes.paySign
   *   },
   *   success: function(res) {
   *     // 支付成功后调用确认接口
   *     confirmPayment();
   *   },
   *   fail: function(err) {
   *     console.error('支付失败:', err);
   *     uni.showToast({
   *       title: '支付失败',
   *       icon: 'none'
   *     });
   *   }
   * });
   */
  
  // 模拟支付过程，实际项目请对接真实支付API
  isLoading.value = true;
  
  setTimeout(async () => {
    // 2. 确认支付
    const confirmSuccess = await confirmPayment();
    if (confirmSuccess) {
      // 支付成功
      paymentSuccess.value = true;
    } else {
      // 支付失败
      paymentFailed.value = true;
    }
  }, 1500);
}

// 前往订单详情
function goToOrderDetail() {
  if (!orderId.value) return;
  
  uni.redirectTo({
    url: `/pages/order/detail?id=${orderId.value}`
  });
}

// 返回上一页
function goBack() {
  uni.navigateBack();
}

// 页面加载
onLoad((options: any) => {
  if (options.orderId) {
    orderId.value = options.orderId;
    fetchOrderDetail();
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
.payment-container {
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

.payment-content {
  padding: 20rpx;
}

.amount-card {
  background-color: #ff6633;
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(255, 102, 51, 0.2);
  
  .amount-label {
    font-size: 28rpx;
    margin-bottom: 20rpx;
  }
  
  .amount-value {
    font-size: 60rpx;
    font-weight: bold;
  }
}

.info-card {
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
  margin-bottom: 20rpx;
  
  .merchant-name {
    font-size: 28rpx;
    color: #333;
    font-weight: bold;
  }
}

.goods-summary {
  background-color: #f9f9f9;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  
  .goods-images {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
    
    .goods-image {
      width: 120rpx;
      height: 120rpx;
      margin-right: 10rpx;
      border-radius: 8rpx;
    }
    
    .goods-count {
      width: 50rpx;
      height: 120rpx;
      line-height: 120rpx;
      text-align: center;
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .goods-count-text {
    font-size: 24rpx;
    color: #666;
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
  }
  
  .info-value {
    color: #333;
    flex: 1;
  }
}

.payment-methods {
  .payment-method-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f2f2f2;
    
    &:last-child {
      border-bottom: none;
    }
    
    &.active {
      .method-name {
        color: #ff6633;
      }
    }
    
    .method-icon {
      width: 80rpx;
      height: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20rpx;
      
      .method-icon-image {
        width: 60rpx;
        height: 60rpx;
      }
    }
    
    .method-info {
      flex: 1;
      
      .method-name {
        font-size: 28rpx;
        color: #333;
      }
    }
    
    .method-check {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      border: 1rpx solid #ddd;
      display: flex;
      justify-content: center;
      align-items: center;
      
      .check-icon {
        width: 24rpx;
        height: 24rpx;
        border-radius: 50%;
        background-color: #ff6633;
      }
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
  
  .btn-pay {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    background-color: #ff6633;
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 45rpx;
    text-align: center;
    box-shadow: 0 4rpx 8rpx rgba(255, 102, 51, 0.2);
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

.success-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  
  .success-popup-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .success-popup-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    background-color: #fff;
    border-radius: 24rpx;
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .success-icon {
      width: 120rpx;
      height: 120rpx;
      background-color: rgba(76, 175, 80, 0.1);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 30rpx;
      
      .icon-image {
        width: 80rpx;
        height: 80rpx;
        color: #4caf50;
      }
    }
    
    .success-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 16rpx;
    }
    
    .success-desc {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 40rpx;
    }
    
    .btn-check-order {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      background-color: #ff6633;
      color: #fff;
      font-size: 28rpx;
      border-radius: 40rpx;
      text-align: center;
    }
  }
}

.fail-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  
  .success-popup-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .success-popup-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    background-color: #fff;
    border-radius: 24rpx;
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .fail-icon {
      width: 120rpx;
      height: 120rpx;
      background-color: rgba(244, 67, 54, 0.1);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 30rpx;
      
      .icon-image {
        width: 80rpx;
        height: 80rpx;
        color: #f44336;
      }
    }
    
    .fail-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 16rpx;
    }
    
    .fail-desc {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 40rpx;
    }
    
    .btn-retry {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      background-color: #ff6633;
      color: #fff;
      font-size: 28rpx;
      border-radius: 40rpx;
      text-align: center;
      margin-bottom: 20rpx;
    }
    
    .btn-back {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      background-color: #f5f5f5;
      color: #666;
      font-size: 28rpx;
      border-radius: 40rpx;
      text-align: center;
    }
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