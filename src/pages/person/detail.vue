<template>
  <view class="person-container">
    <!-- 头部信息 -->
    <view class="person-header">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill"
               @click="chooseAvatar"></image>
        <view class="user-detail">
          <text class="username">{{ userInfo.username || '未登录' }}</text>
          <text class="vip-tag" v-if="userInfo.vipLevel">VIP{{ userInfo.vipLevel }}</text>
        </view>
      </view>
    </view>

    <!-- 个人信息卡片 -->
    <view class="info-card" v-if="userInfo.id">
      <view class="info-item" @click="editNickname">
        <text class="item-label">姓名</text>
        <view class="item-value-container">
          <text class="item-value">{{ userInfo.nickname || '未设置' }}</text>
          <text class="edit-icon">></text>
        </view>
      </view>
      <view class="info-item" @click="editGender">
        <text class="item-label">性别</text>
        <view class="item-value-container">
          <text class="item-value">{{ getGenderDisplay(userInfo.gender) || '未设置' }}</text>
          <text class="edit-icon">></text>
        </view>
      </view>
      <view class="info-item" @click="editBirthDate">
        <text class="item-label">生日</text>
        <view class="item-value-container">
          <text class="item-value">{{ userInfo.birthDate || '未设置' }}</text>
          <text class="edit-icon">></text>
        </view>
      </view>
      <view class="info-item">
        <text class="item-label">积分</text>
        <text class="item-value">{{ userInfo.points || 0 }}</text>
      </view>
      <view class="info-item" @click="editPreferences">
        <text class="item-label">偏好</text>
        <view class="item-value-container">
          <text class="item-value">{{ userInfo.preferences || '未设置' }}</text>
          <text class="edit-icon">></text>
        </view>
      </view>
    </view>

    <!-- 登录/退出按钮 -->
    <view class="action-buttons">
      <button class="login-btn" v-if="!userInfo.id" @click="goToLogin">登录/注册</button>
      <button class="logout-btn" v-else @click="handleLogout">退出登录</button>
    </view>
    
    <!-- 日期选择器弹窗 -->
    <view class="date-picker-container" v-if="showDatePickerModal">
      <view class="date-picker-mask" @click="onDateCancel"></view>
      <view class="date-picker-content">
        <view class="date-picker-header">
          <text class="date-picker-title">选择生日</text>
          <text class="date-picker-close" @click="onDateCancel">×</text>
        </view>
        <picker mode="date" class="date-picker" :value="selectedDate" @change="onDateConfirm">
          <view class="picker-view">请选择日期</view>
        </picker>
      </view>
    </view>
    
    <!-- 偏好选择弹窗 -->
    <view class="preferences-container" v-if="showPreferencesModal">
      <view class="preferences-mask" @click="closePreferences"></view>
      <view class="preferences-content">
        <view class="preferences-header">
          <text class="preferences-title">选择偏好标签</text>
          <text class="preferences-close" @click="closePreferences">×</text>
        </view>
        <view class="tags-container">
          <view 
            v-for="(tag, index) in preferencesTags" 
            :key="index" 
            class="tag-item" 
            :class="{ 'tag-selected': tag.selected }"
            @click="toggleTagSelection(index)"
          >
            {{ tag.name }}
          </view>
        </view>
        <view class="preferences-footer">
          <button class="save-btn" @click="savePreferencesSelection">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {useUserInfoStore} from '@/stores/useUserInfoStore';
import {storeToRefs} from 'pinia';
import {onShow} from '@dcloudio/uni-app';
import {
  customerLogout,
  customerUpdateNickname,
  customerUpdateGender,
  customerUpdateBirthdate,
  customerUpdatePreferences,
  customerUpdateAvatar
} from '@/api/customerController';
import {ref} from 'vue';

const userStore = useUserInfoStore();
const {userInfo} = storeToRefs(userStore);

// 性别枚举映射
const genderMapping = {
  'MALE': '男',
  'FEMALE': '女',
  'OTHER': '其他'
};

// 反向映射，用于将显示值转换为API值
const genderReverseMapping = {
  '男': 'MALE',
  '女': 'FEMALE',
  '其他': 'OTHER'
};

// 获取性别显示值
const getGenderDisplay = (genderCode: string | undefined) => {
  if (!genderCode) return '未设置';
  return genderMapping[genderCode as keyof typeof genderMapping] || '未设置';
};

// 页面显示时获取用户信息
onShow(() => {
  userStore.fetchUserInfo();
});

// 前往登录页
const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index'
  });
};

// 处理退出登录
const handleLogout = async () => {
  try {
    const res = await customerLogout();
    if (res.data.code === 20000) {
      // 清空用户信息
      await userStore.initUserInfo();
      await uni.showToast({
        title: '退出登录成功',
        icon: 'success'
      });
      // 退出后返回上一页
      await uni.navigateBack();
    } else {
      await uni.showToast({
        title: res.data.msg || '退出失败',
        icon: 'none'
      });
    }
  } catch (error) {
    await uni.showToast({
      title: '网络异常，请稍后再试',
      icon: 'none'
    });
  }
};

// 选择头像
const chooseAvatar = () => {
  if (!userInfo.value.id) return;

  uni.chooseImage({
    count: 1,
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];

      uni.showLoading({
        title: '上传中...'
      });

      // 使用完整的URL地址
      // 不使用环境变量，直接使用绝对路径
      uni.uploadFile({
        url: 'http://localhost:8081/api/v1/customer/update/avatar', // uni-app会自动添加baseURL
        filePath: tempFilePath,
        name: 'file',
        success: (uploadRes) => {
          try {
            const response = JSON.parse(uploadRes.data);
            if (response.code === 20000) {
              // 更新成功，刷新用户信息
              userStore.fetchUserInfo();
              uni.showToast({
                title: '头像更新成功',
                icon: 'success'
              });
            } else {
              uni.showToast({
                title: response.msg || '上传失败',
                icon: 'none'
              });
            }
          } catch (error) {
            console.error('上传失败:', error);
            uni.showToast({
              title: '头像上传失败',
              icon: 'none'
            });
          } finally {
            uni.hideLoading(); // 确保这里也会隐藏加载提示
          }
        },
        fail: (error) => {
          console.error('上传失败:', error);
          uni.showToast({
            title: '头像上传失败',
            icon: 'none'
          });
          uni.hideLoading(); // 失败时也要隐藏加载提示
        }
      });
    },
    fail: () => {
      // 选择图片失败时也需要处理
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      });
    }
  });
};

// 编辑姓名
const editNickname = () => {
  uni.showModal({
    title: '修改姓名',
    editable: true,
    placeholderText: '请输入姓名',
    content: userInfo.value.nickname || '',
    success: async (res) => {
      if (res.confirm && res.content) {
        try {
          const response = await customerUpdateNickname({nickname: res.content});
          if (response.data.code === 20000) {
            await userStore.fetchUserInfo();
            await uni.showToast({title: '修改成功', icon: 'success'});
          } else {
            await uni.showToast({title: response.data.msg || '修改失败', icon: 'none'});
          }
        } catch (error) {
          await uni.showToast({title: '网络异常，请稍后再试', icon: 'none'});
        }
      }
    }
  });
};

// 编辑性别
const editGender = () => {
  uni.showActionSheet({
    itemList: ['男', '女', '其他'],
    success: async (res) => {
      const displayValues = ['男', '女', '其他'];
      const displayGender = displayValues[res.tapIndex];
      // 转换为API需要的枚举值
      const apiGender = genderReverseMapping[displayGender as keyof typeof genderReverseMapping];

      try {
        const response = await customerUpdateGender({gender: apiGender});
        if (response.data.code === 20000) {
          await userStore.fetchUserInfo();
          await uni.showToast({title: '修改成功', icon: 'success'});
        } else {
          await uni.showToast({title: response.data.msg || '修改失败', icon: 'none'});
        }
      } catch (error) {
        console.error('更新性别失败:', error);
        await uni.showToast({title: '网络异常，请稍后再试', icon: 'none'});
      }
    }
  });
};

// 编辑生日
const editBirthDate = () => {
  showDatePickerModal.value = true;
};

// 引入日期选择相关变量
const showDatePickerModal = ref(false);
const selectedDate = ref(userInfo.value.birthDate || '');

// 日期选择确认
const onDateConfirm = (e: any) => {
  const date = e.detail.value;
  updateBirthDate(date);
  showDatePickerModal.value = false;
};

// 日期选择取消
const onDateCancel = () => {
  showDatePickerModal.value = false;
};

// 用于更新生日的方法
const updateBirthDate = async (date: string) => {
  try {
    const response = await customerUpdateBirthdate({birthDate: date});
    if (response.data.code === 20000) {
      userStore.fetchUserInfo();
      uni.showToast({title: '修改成功', icon: 'success'});
    } else {
      uni.showToast({title: response.data.msg || '修改失败', icon: 'none'});
    }
  } catch (error) {
    uni.showToast({title: '网络异常，请稍后再试', icon: 'none'});
  }
};

// 编辑偏好
const editPreferences = () => {
  showPreferencesModal.value = true;
  initPreferencesTags();
};

// 偏好选择相关变量
const showPreferencesModal = ref(false);
const preferencesTags = ref([
  { name: '美食', selected: false },
  { name: '旅游', selected: false },
  { name: '购物', selected: false },
  { name: '健身', selected: false },
  { name: '电影', selected: false },
  { name: '音乐', selected: false },
  { name: '读书', selected: false },
  { name: '游戏', selected: false },
  { name: '摄影', selected: false }
]);

// 初始化标签选中状态
const initPreferencesTags = () => {
  const currentPreferences = userInfo.value.preferences || '';
  const selectedTags = currentPreferences.split(',').filter(tag => tag.trim());
  
  preferencesTags.value.forEach(tag => {
    tag.selected = selectedTags.includes(tag.name);
  });
};

// 切换标签选中状态
const toggleTagSelection = (index: number) => {
  preferencesTags.value[index].selected = !preferencesTags.value[index].selected;
};

// 关闭偏好选择
const closePreferences = () => {
  showPreferencesModal.value = false;
};

// 保存选中的偏好标签
const savePreferencesSelection = async () => {
  const selectedTags = preferencesTags.value.filter(tag => tag.selected);
  const tagsString = selectedTags.map(tag => tag.name).join(',');
  
  try {
    const response = await customerUpdatePreferences({preferences: tagsString});
    if (response.data.code === 20000) {
      userStore.fetchUserInfo();
      uni.showToast({title: '修改成功', icon: 'success'});
    } else {
      uni.showToast({title: response.data.msg || '修改失败', icon: 'none'});
    }
  } catch (error) {
    uni.showToast({title: '网络异常，请稍后再试', icon: 'none'});
  } finally {
    showPreferencesModal.value = false;
  }
};
</script>

<style lang="scss">
.person-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.person-header {
  padding: 40rpx 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .user-info {
    display: flex;
    align-items: center;

    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      background-color: #eee;
    }

    .user-detail {
      margin-left: 30rpx;

      .username {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 10rpx;
      }

      .vip-tag {
        font-size: 24rpx;
        color: #fff;
        background-color: #ff9500;
        padding: 4rpx 12rpx;
        border-radius: 20rpx;
      }
    }
  }
}

.info-card {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 20rpx;

  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 0;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .item-label {
      font-size: 28rpx;
      color: #666;
    }

    .item-value {
      font-size: 28rpx;
      color: #333;
    }

    .item-value-container {
      display: flex;
      align-items: center;

      .edit-icon {
        margin-left: 10rpx;
        color: #999;
        font-size: 24rpx;
      }
    }
  }
}

.action-buttons {
  margin-top: 60rpx;
  padding: 0 20rpx;

  .login-btn, .logout-btn {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 32rpx;
    color: #fff;
  }

  .login-btn {
    background-color: #ff4d4f;
  }

  .logout-btn {
    background-color: #ff4d4f;
  }
}

.date-picker-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;

  .date-picker-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .date-picker-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    padding: 30rpx;

    .date-picker-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20rpx 30rpx;
      border-bottom: 1rpx solid #eee;

      .date-picker-title {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
        flex: 1;
        text-align: center;
      }

      .date-picker-close {
        font-size: 40rpx;
        color: #999;
        width: 60rpx;
        height: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .date-picker {
      width: 100%;
      padding: 40rpx 0;
    }

    .picker-view {
      text-align: center;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 32rpx;
      color: #333;
      background-color: #f8f8f8;
      border-radius: 8rpx;
      margin: 0 20rpx;
    }
  }
}

.preferences-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;

  .preferences-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .preferences-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    padding: 30rpx;
    max-height: 70vh;
    overflow-y: auto;

    .preferences-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20rpx 30rpx;
      border-bottom: 1rpx solid #eee;

      .preferences-title {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
        flex: 1;
        text-align: center;
      }

      .preferences-close {
        font-size: 40rpx;
        color: #999;
        width: 60rpx;
        height: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .tags-container {
      padding: 30rpx 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      .tag-item {
        padding: 15rpx 25rpx;
        border: 1px solid #ddd;
        border-radius: 30rpx;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        font-size: 28rpx;
        color: #666;

        &.tag-selected {
          background-color: #ff4d4f;
          color: #fff;
          border-color: #ff4d4f;
        }
      }
    }

    .preferences-footer {
      padding: 20rpx 0;
      display: flex;
      justify-content: center;

      .save-btn {
        width: 90%;
        height: 80rpx;
        line-height: 80rpx;
        background-color: #ff4d4f;
        color: #fff;
        border-radius: 40rpx;
        font-size: 32rpx;
        text-align: center;
      }
    }
  }
}
</style> 