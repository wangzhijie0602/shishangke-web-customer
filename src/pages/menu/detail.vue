<template>
  <view class="menu-content">
    <view class="menu-header">
      <text class="header-title">商家菜单</text>
    </view>

    <!-- 商家信息 -->
    <view v-if="merchant" class="merchant-info-container">
      <image class="merchant-logo" :src="merchant.logo || '/static/default-logo.png'" mode="aspectFill"/>
      <view class="merchant-info">
        <text class="merchant-name">{{ merchant.name }}</text>
        <text class="merchant-desc">{{ merchant.description || '暂无简介' }}</text>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>

    <!-- 空数据状态 -->
    <view v-else-if="menuList.length === 0" class="empty-list">
      <text>暂无菜单数据</text>
    </view>

    <!-- 新的两栏布局：左侧分类，右侧菜单项 -->
    <view v-else class="menu-layout">
      <!-- 左侧分类导航 -->
      <view class="category-sidebar">
        <scroll-view scroll-y="true" class="category-scroll-vertical">
          <view 
            v-for="(category, idx) in filteredCategories" 
            :key="idx"
            class="category-item-vertical"
            :class="{ active: currentCategory === category.code }"
            @tap="switchCategory(category.code)"
          >
            <text>{{ category.desc }}</text>
          </view>
        </scroll-view>
      </view>
      
      <!-- 右侧菜单内容 -->
      <view class="menu-content-area">
        <view v-if="!loading && menuList.length > 0" class="menu-list">
          <view class="category-section" :id="currentCategory">
            <view class="category-title">{{ getCategoryName(currentCategory) }}</view>
            <view
              v-for="item in getMenuByCategory(currentCategory)"
              :key="item.menuId"
              class="menu-item"
              :class="{ 'sold-out': item.status === 'SOLD_OUT' }"
            >
              <image class="menu-image" :src="item.imageUrl || '/static/default-food.png'" mode="aspectFill"/>
              <view class="menu-detail">
                <text class="menu-name">{{ item.name }}</text>
                <text class="menu-desc">{{ item.description || '暂无描述' }}</text>
                <view class="menu-footer">
                  <text class="menu-price">¥{{ item.price || '0' }}</text>
                  
                  <!-- 售罄标签 -->
                  <text v-if="item.status === 'SOLD_OUT'" class="sold-out-tag">已售罄</text>
                  
                  <!-- 添加到购物车控件 -->
                  <view class="cart-controls">
                    <view v-if="getCartItemCount(item.menuId) > 0" class="quantity-control">
                      <text class="control-btn" @tap="decreaseCartItem(item)">-</text>
                      <text class="quantity-text">{{ getCartItemCount(item.menuId) }}</text>
                      <text class="control-btn" :class="{ 'disabled-btn': item.status === 'SOLD_OUT' }" @tap="item.status !== 'SOLD_OUT' && addToCart(item)">+</text>
                    </view>
                    <view v-else class="add-btn" :class="{ 'disabled-btn': item.status === 'SOLD_OUT' }" @tap="item.status !== 'SOLD_OUT' && addToCart(item)">
                      <text class="btn-text">加入购物车</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 购物车浮动栏 -->
    <view v-if="totalItems > 0" class="cart-bar">
      <view class="cart-info" @tap="showCartDrawer">
        <view class="cart-icon-container">
          <text class="cart-icon">🛒</text>
          <text class="cart-badge">{{ totalItems }}</text>
        </view>
        <view class="cart-price">
          <text class="price-text">合计: ¥{{ totalPrice.toFixed(2) }}</text>
        </view>
      </view>
      <view class="checkout-btn" @tap="goToCheckout">
        <text class="checkout-text">去结算</text>
      </view>
    </view>
    
    <!-- 购物车抽屉 -->
    <view v-if="isCartDrawerVisible" class="cart-drawer-container" @tap="hideCartDrawer">
      <view class="cart-drawer-mask"></view>
      <view class="cart-drawer" @tap.stop>
        <view class="cart-drawer-header">
          <text class="drawer-title">购物车</text>
          <text class="close-btn" @tap="hideCartDrawer">×</text>
        </view>
        
        <view class="cart-drawer-content">
          <view v-if="cartItems.length === 0" class="empty-cart">
            <text>购物车是空的</text>
          </view>
          <view v-else class="cart-items-list">
            <view
              v-for="(item, index) in cartItems"
              :key="item.menuId"
              class="cart-item"
            >
              <image class="cart-item-image" :src="item.imageUrl || '/static/default-food.png'" mode="aspectFill"/>
              <view class="cart-item-info">
                <text class="cart-item-name">{{ item.name }}</text>
                <text class="cart-item-price">¥{{ item.price }}</text>
              </view>
              <view class="cart-item-controls">
                <text class="cart-control-btn" @tap="decreaseCartItemById(item.menuId)">-</text>
                <text class="cart-quantity-text">{{ item.quantity }}</text>
                <text class="cart-control-btn" @tap="increaseCartItemById(item.menuId)">+</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="cart-drawer-footer">
          <view class="cart-total">
            <text>共 {{ totalItems }} 件商品</text>
            <text class="cart-total-price">合计: ¥{{ totalPrice.toFixed(2) }}</text>
          </view>
          <view class="cart-actions">
            <view class="clear-cart-btn" @tap="clearCart">
              <text>清空购物车</text>
            </view>
            <view class="drawer-checkout-btn" @tap="goToCheckout">
              <text>去结算</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import {customerGetMenu, customerGetMerchant} from '@/api/customerController';
import {onLoad} from "@dcloudio/uni-app";

// 自定义接口，确保类型安全
interface Menu {
  menuId: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  categoryCode?: string;
  imageUrl?: string;
  status?: string;
}

// 分类接口
interface Category {
  code: string;
  desc: string;
}

// 获取页面参数
const merchantId = ref<string>('');
const merchant = ref<API.MerchantVO | null>(null);
const menuList = ref<Menu[]>([]);
const loading = ref(true);
const currentCategory = ref<string>('');

// 分类数据 - 从后端获取的 MenuCategory 枚举
const categories = ref<Category[]>([
  { code: 'HOT_SALE', desc: '热销菜品' },
  { code: 'SPECIALTY', desc: '特色菜品' },
  { code: 'STAPLE_FOOD', desc: '主食' },
  { code: 'SNACK', desc: '小吃/点心' },
  { code: 'SOUP', desc: '汤品' },
  { code: 'COLD_DISH', desc: '凉菜' },
  { code: 'HOT_DISH', desc: '热菜' },
  { code: 'DESSERT', desc: '甜点' },
  { code: 'BEVERAGE', desc: '饮料' },
  { code: 'ALCOHOL', desc: '酒水' },
  { code: 'SET_MEAL', desc: '套餐' },
  { code: 'OTHER', desc: '其他' },
]);

// 根据分类获取菜单项
const getMenuByCategory = (categoryCode: string) => {
  return menuList.value.filter(item => item.categoryCode === categoryCode);
};

// 切换分类
const switchCategory = (category: string) => {
  currentCategory.value = category;
  // 滚动到对应分类区域
  uni.createSelectorQuery()
    .select(`#${category}`)
    .boundingClientRect(function(rect) {
      if (rect) {
        uni.pageScrollTo({
          scrollTop: rect.top,
          duration: 300
        });
      }
    })
    .exec();
};

// 购物车数据
interface CartItem {
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const cartItems = ref<CartItem[]>([]);
const isCartDrawerVisible = ref(false);

// 显示购物车抽屉
const showCartDrawer = () => {
  isCartDrawerVisible.value = true;
};

// 隐藏购物车抽屉
const hideCartDrawer = () => {
  isCartDrawerVisible.value = false;
};

// 清空购物车
const clearCart = () => {
  cartItems.value = [];
  hideCartDrawer();
};

// 计算购物车总数量
const totalItems = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

// 计算购物车总价
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// 获取购物车中特定菜品的数量
const getCartItemCount = (menuId: string): number => {
  const item = cartItems.value.find(item => item.menuId === menuId);
  return item ? item.quantity : 0;
};

// 添加菜品到购物车
const addToCart = (menu: Menu) => {
  if (!menu.menuId) {
    uni.showToast({
      title: '菜品数据有误',
      icon: 'none'
    });
    return;
  }
  
  // 检查是否售罄
  if (menu.status === 'SOLD_OUT') {
    uni.showToast({
      title: '该菜品已售罄',
      icon: 'none'
    });
    return;
  }
  
  const existingItem = cartItems.value.find(item => item.menuId === menu.menuId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.value.push({
      menuId: menu.menuId,
      name: menu.name || '未命名菜品',
      price: menu.price || 0,
      quantity: 1,
      imageUrl: menu.imageUrl
    });
  }
  
  // 注释掉震动反馈，避免页面抖动
  // uni.vibrateShort();
};

// 在购物车中通过ID增加商品数量
const increaseCartItemById = (menuId: string) => {
  const item = cartItems.value.find(item => item.menuId === menuId);
  if (item) {
    item.quantity += 1;
    // 注释掉震动反馈，避免页面抖动
    // uni.vibrateShort();
  }
};

// 减少购物车中的菜品数量
const decreaseCartItem = (menu: Menu) => {
  if (!menu.menuId) return;
  
  const index = cartItems.value.findIndex(item => item.menuId === menu.menuId);
  
  if (index !== -1) {
    if (cartItems.value[index].quantity > 1) {
      cartItems.value[index].quantity -= 1;
    } else {
      cartItems.value.splice(index, 1);
    }
    
    // 注释掉震动反馈，避免页面抖动
    // uni.vibrateShort();
  }
};

// 在购物车中通过ID减少商品数量
const decreaseCartItemById = (menuId: string) => {
  const index = cartItems.value.findIndex(item => item.menuId === menuId);
  
  if (index !== -1) {
    if (cartItems.value[index].quantity > 1) {
      cartItems.value[index].quantity -= 1;
    } else {
      cartItems.value.splice(index, 1);
    }
    
    // 注释掉震动反馈，避免页面抖动
    // uni.vibrateShort();
  }
};

// 前往结算页面
const goToCheckout = () => {
  if (cartItems.value.length === 0) {
    uni.showToast({
      title: '购物车为空',
      icon: 'none'
    });
    return;
  }
  
  // 将购物车数据存储到本地或全局状态
  uni.setStorageSync('cartItems', JSON.stringify(cartItems.value));
  uni.setStorageSync('merchantId', merchantId.value);
  
  // 隐藏抽屉
  hideCartDrawer();
  
  // 跳转到结算页面
  uni.navigateTo({
    url: '/pages/menu/checkout'
  });
};

// 获取分类名称
const getCategoryName = (code: string) => {
  const category = categories.value.find(c => c.code === code);
  return category ? category.desc : '';
};

// 过滤掉没有菜品的分类
const filteredCategories = computed(() => {
  return categories.value.filter(category => 
    getMenuByCategory(category.code).length > 0
  );
});

// 获取菜单列表
const fetchMenuList = async () => {
  try {
    loading.value = true;
    const res = await customerGetMenu({
      merchantId: merchantId.value
    });

    if (res.data.code === 20000 && res.data.data) {
      // 转换API返回数据为我们的Menu类型
      menuList.value = (res.data.data || []).map((item: any) => {
        // 后端返回的category字段已经是分类编码（如"STAPLE_FOOD"），直接使用它作为categoryCode
        let categoryCode = 'OTHER';
        if (item.category && typeof item.category === 'string') {
          // 确保分类编码是预设的值之一
          const validCategory = categories.value.find(c => c.code === item.category);
          if (validCategory) {
            categoryCode = item.category;
          }
        }
        
        return {
          menuId: item.menuId || '',
          name: item.name || '',
          description: item.description,
          price: Number(item.price || 0),
          category: getCategoryName(categoryCode), // 根据分类编码获取中文显示名
          categoryCode: categoryCode, // 分类编码
          imageUrl: item.imageUrl,
          status: item.status || 'ENABLED' // 默认为启用状态
        };
      });
      
      // 设置默认显示第一个有数据的分类
      if (menuList.value.length > 0) {
        const categoriesWithItems = filteredCategories.value;
        if (categoriesWithItems.length > 0) {
          currentCategory.value = categoriesWithItems[0].code;
        }
      }
    } else {
      await uni.showToast({
        title: '获取菜单失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('获取菜单出错:', error);
    await uni.showToast({
      title: '网络异常，请稍后重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

onLoad((options: any) => {
  merchantId.value = options.id;

  // 页面加载时直接获取数据
  if (merchantId.value) {
    fetchMerchantInfo();
    fetchMenuList();
  } else {
    uni.showToast({
      title: '商家ID不能为空',
      icon: 'none'
    });
  }
});

// 获取商家信息
const fetchMerchantInfo = async () => {
  try {
    const res = await customerGetMerchant({
      merchantId: merchantId.value
    });

    if (res.data.code === 20000 && res.data.data) {
      merchant.value = res.data.data;
    }
  } catch (error) {
    console.error('获取商家信息出错:', error);
  }
};
</script>

<style lang="scss">
.menu-content {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx; /* 为购物车栏留出空间 */
}

.menu-header {
  padding: 20rpx 30rpx;
  background-color: #fff;

  .header-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
}

.merchant-info-container {
  display: flex;
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.merchant-logo {
  width: 120rpx;
  height: 120rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
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
  font-size: 26rpx;
  color: #666;
}

.loading, .empty-list {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200rpx;
  color: #999;
  font-size: 28rpx;
}

/* 新的两栏布局样式 */
.menu-layout {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 200rpx); /* 减去头部和底部的高度 */
}

.category-sidebar {
  width: 180rpx;
  background-color: #f8f8f8;
  border-right: 2rpx solid #eee;
}

.category-scroll-vertical {
  height: 100%;
}

.category-item-vertical {
  padding: 30rpx 10rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  position: relative;
  border-bottom: 2rpx solid #eee;
  
  &.active {
    color: #ff5722;
    font-weight: bold;
    background-color: #fff;
    
    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6rpx;
      height: 40rpx;
      background-color: #ff5722;
      border-radius: 3rpx;
    }
  }
}

.menu-content-area {
  flex: 1;
  overflow-y: auto;
}

.category-section {
  margin-bottom: 30rpx;
}

.category-title {
  padding: 20rpx 24rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  background-color: #fff;
  border-bottom: 2rpx solid #f5f5f5;
}

.menu-list {
  padding: 0;
}

.menu-item {
  display: flex;
  background-color: #fff;
  padding: 24rpx;
  border-bottom: 2rpx solid #f5f5f5;
}

.menu-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  background-color: #eee;
}

.menu-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.menu-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.menu-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.menu-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-price {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff5722;
}

/* 购物车相关样式 */
.cart-controls {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.quantity-control {
  display: flex;
  align-items: center;
  border-radius: 30rpx;
  overflow: hidden;
  background-color: #f8f8f8;
  height: 50rpx;
}

.control-btn {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff5722;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}

.quantity-text {
  width: 60rpx;
  text-align: center;
  font-size: 26rpx;
}

.add-btn {
  background-color: #ff5722;
  border-radius: 30rpx;
  padding: 0 20rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-text {
  color: #fff;
  font-size: 24rpx;
}

.cart-bar {
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
  z-index: 999;
}

.cart-info {
  display: flex;
  align-items: center;
}

.cart-icon-container {
  position: relative;
  margin-right: 20rpx;
}

.cart-icon {
  font-size: 48rpx;
}

.cart-badge {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  background-color: #ff5722;
  color: #fff;
  font-size: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6rpx;
}

.price-text {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.checkout-btn {
  background-color: #ff5722;
  border-radius: 40rpx;
  padding: 0 40rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkout-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
}

/* 购物车抽屉样式 */
.cart-drawer-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.cart-drawer-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.cart-drawer {
  position: absolute;
  bottom: 0; /* 修改为bottom: 0使其从底部显示 */
  left: 0;
  right: 0;
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0; /* 修改边框圆角位置 */
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.1);
  transform: translateY(0);
  animation: slideUp 0.3s ease; /* 修改为slideUp动画 */
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

@keyframes slideUp {
  from {
    transform: translateY(100%); /* 从底部开始 */
  }
  to {
    transform: translateY(0);
  }
}

.cart-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.drawer-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  font-size: 48rpx;
  color: #999;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 20rpx 30rpx;
}

.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200rpx;
  color: #999;
  font-size: 28rpx;
}

.cart-items-list {
  padding-bottom: 20rpx;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #f0f0f0;
}

.cart-item-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  background-color: #eee;
}

.cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cart-item-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.cart-item-price {
  font-size: 26rpx;
  color: #ff5722;
  font-weight: bold;
}

.cart-item-controls {
  display: flex;
  align-items: center;
}

.cart-control-btn {
  width: 50rpx;
  height: 50rpx;
  background-color: #ff5722;
  color: #fff;
  border-radius: 25rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: bold;
}

.cart-quantity-text {
  width: 60rpx;
  text-align: center;
  font-size: 26rpx;
}

.cart-drawer-footer {
  padding: 20rpx 30rpx;
  border-top: 2rpx solid #f0f0f0;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  font-size: 26rpx;
  color: #666;
}

.cart-total-price {
  font-size: 32rpx;
  color: #ff5722;
  font-weight: bold;
}

.cart-actions {
  display: flex;
  justify-content: space-between;
}

.clear-cart-btn {
  flex: 1;
  height: 80rpx;
  border: 2rpx solid #ddd;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  font-size: 28rpx;
  color: #666;
}

.drawer-checkout-btn {
  flex: 2;
  height: 80rpx;
  background-color: #ff5722;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: bold;
  color: #fff;
}

/* 售罄菜品样式 */
.menu-item.sold-out {
  opacity: 0.6;
}

.sold-out-tag {
  display: inline-block;
  padding: 4rpx 12rpx;
  background-color: #f5f5f5;
  color: #999;
  font-size: 24rpx;
  border-radius: 4rpx;
  margin-right: 10rpx;
}

.disabled-btn {
  background-color: #ccc !important;
  cursor: not-allowed;
}
</style> 