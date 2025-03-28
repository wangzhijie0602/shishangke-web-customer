declare namespace API {
  type CreateRequest = {
    username: string;
    password: string;
    nickname?: string;
    avatar?: string;
    role?: string;
    status?: string;
  };

  type CustomerAddressCreateRequest = {
    receiverName: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detailAddress: string;
    tag?: string;
    isDefault?: number;
  };

  type customerAddressDeleteParams = {
    addressId: string;
  };

  type customerAddressSetDefaultParams = {
    addressId: string;
  };

  type CustomerAddressUpdateRequest = {
    id: string;
    receiverName: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detailAddress: string;
    tag?: string;
    isDefault?: number;
  };

  type CustomerAddressVO = {
    id?: string;
    customerId?: string;
    receiverName?: string;
    phone?: string;
    province?: string;
    city?: string;
    district?: string;
    detailAddress?: string;
    tag?: string;
    isDefault?: number;
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: number;
  };

  type CustomerCreateRequest = {
    username: string;
    password: string;
    realName?: string;
    avatar?: string;
    gender?: string;
    birthDate?: string;
    preferences?: string;
  };

  type customerGetMenuParams = {
    merchantId: string;
  };

  type customerGetMerchantParams = {
    merchantId: string;
  };

  type customerGetMerchantsParams = {
    pageNumber?: number;
    pageSize?: number;
  };

  type CustomerLoginRequest = {
    username?: string;
    password?: string;
  };

  type customerUpdateBirthdateParams = {
    birthDate: string;
  };

  type customerUpdateGenderParams = {
    gender: string;
  };

  type customerUpdateNicknameParams = {
    nickname: string;
  };

  type customerUpdatePreferencesParams = {
    preferences: string;
  };

  type CustomerVO = {
    id?: string;
    username?: string;
    nickname?: string;
    avatar?: string;
    gender?: string;
    birthDate?: string;
    preferences?: string;
    vipLevel?: number;
    points?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type LoginRequest = {
    username: string;
    password: string;
  };

  type Menu = {
    menuId?: number;
    merchantId?: number;
    name?: string;
    description?: string;
    price?: number;
    category?:
      | "热销菜品"
      | "特色菜品"
      | "主食"
      | "小吃/点心"
      | "汤品"
      | "凉菜"
      | "热菜"
      | "甜点"
      | "饮料"
      | "酒水"
      | "套餐"
      | "其他";
    imageUrl?: string;
    status?: "启用" | "禁用" | "售罄";
    sortOrder?: number;
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: number;
  };

  type MenuCreateRequest = {
    merchantId: string;
    name: string;
    description?: string;
    price: number;
    category?:
      | "热销菜品"
      | "特色菜品"
      | "主食"
      | "小吃/点心"
      | "汤品"
      | "凉菜"
      | "热菜"
      | "甜点"
      | "饮料"
      | "酒水"
      | "套餐"
      | "其他";
    imageUrl?: string;
    status?: string;
    sortOrder?: number;
  };

  type menuDeleteParams = {
    id: string;
  };

  type menuGetByMerchantParams = {
    merchantId: string;
    pageNum?: number;
    pageSize?: number;
  };

  type menuGetParams = {
    id: string;
  };

  type menuListParams = {
    pageNum?: number;
    pageSize?: number;
  };

  type MenuQueryRequest = {
    merchantId?: string;
    name?: string;
    category?:
      | "热销菜品"
      | "特色菜品"
      | "主食"
      | "小吃/点心"
      | "汤品"
      | "凉菜"
      | "热菜"
      | "甜点"
      | "饮料"
      | "酒水"
      | "套餐"
      | "其他";
    status?: "启用" | "禁用" | "售罄";
    minPrice?: number;
    maxPrice?: number;
  };

  type MenuUpdateRequest = {
    menuId: string;
    merchantId?: string;
    name?: string;
    description?: string;
    price?: number;
    category?:
      | "热销菜品"
      | "特色菜品"
      | "主食"
      | "小吃/点心"
      | "汤品"
      | "凉菜"
      | "热菜"
      | "甜点"
      | "饮料"
      | "酒水"
      | "套餐"
      | "其他";
    imageUrl?: string;
    status?: "启用" | "禁用" | "售罄";
    sortOrder?: number;
  };

  type MenuVO = {
    menuId?: string;
    merchantId?: string;
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    imageUrl?: string;
    status?: string;
    sortOrder?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type MerchantCreateRequest = {
    name?: string;
    phone?: string;
    province?: string;
    city?: string;
    district?: string;
    street?: string;
    addressDetail?: string;
    minPrice?: number;
  };

  type merchantDeleteParams = {
    id: string;
  };

  type merchantGetParams = {
    id: string;
  };

  type merchantListParams = {
    pageNum?: number;
    pageSize?: number;
  };

  type MerchantQueryRequest = {
    name?: string;
    phone?: string;
    status?: string;
  };

  type merchantsParams = {
    pageNum?: number;
    pageSize?: number;
  };

  type merchantUpdateAddressParams = {
    id: string;
    province: string;
    city: string;
    district: string;
    street: string;
    addressDetail: string;
  };

  type merchantUpdateBusinesshoursParams = {
    id: string;
    openTime: string;
    closeTime: string;
  };

  type merchantUpdateDescriptionParams = {
    id: string;
    description: string;
  };

  type merchantUpdateLogoParams = {
    id: string;
  };

  type merchantUpdateMinpriceParams = {
    id: string;
    minPrice: number;
  };

  type merchantUpdateNameParams = {
    id: string;
    name: string;
  };

  type merchantUpdatePhoneParams = {
    id: string;
    phone: string;
  };

  type merchantUpdateStatusParams = {
    id: string;
    status: string;
  };

  type MerchantVO = {
    id?: string;
    userId?: string;
    name?: string;
    logo?: string;
    phone?: string;
    province?: string;
    city?: string;
    district?: string;
    street?: string;
    addressDetail?: string;
    openTime?: string;
    closeTime?: string;
    description?: string;
    minPrice?: number;
    status?: string;
    createTime?: string;
  };

  type OrderAddressRequest = {
    id?: string;
    receiverName?: string;
    receiverPhone?: string;
    receiverAddress?: string;
  };

  type OrderAndItemVO = {
    order?: OrderVO;
    orderItem?: OrderItemVO[];
  };

  type orderCancelOrderParams = {
    id: string;
  };

  type OrderCreateCompleteRequest = {
    orderRequest?: OrderCreateRequest;
    orderItemRequests?: OrderItemCreateRequest[];
  };

  type OrderCreateRequest = {
    customerId?: string;
    merchantId?: string;
    receiverName?: string;
    receiverPhone?: string;
    receiverAddress?: string;
    remark?: string;
  };

  type orderGetOrderAndItemParams = {
    id: string;
  };

  type OrderItem = {
    column?: string;
    asc?: boolean;
  };

  type OrderItemCreateRequest = {
    menuId?: string;
    quantity?: number;
  };

  type OrderItemVO = {
    id?: string;
    orderId?: string;
    menuId?: string;
    menuName?: string;
    quantity?: number;
    price?: number;
    totalPrice?: number;
    imageUrl?: string;
  };

  type orderListOrderItemsParams = {
    pageNum?: number;
    pageSize?: number;
  };

  type orderListOrdersParams = {
    pageNum?: number;
    pageSize?: number;
  };

  type OrderQueryRequest = {
    customerId?: string;
    merchantId?: string;
    status?: "待支付" | "已支付" | "准备中" | "配送中" | "已完成" | "已取消";
  };

  type OrderVO = {
    id?: string;
    customerId?: string;
    merchantId?: string;
    merchantName?: string;
    totalAmount?: number;
    actualAmount?: number;
    status?: "待支付" | "已支付" | "准备中" | "配送中" | "已完成" | "已取消";
    receiverName?: string;
    receiverPhone?: string;
    receiverAddress?: string;
    deliveryFee?: number;
    remark?: string;
    expectedDeliveryTime?: string;
    actualDeliveryTime?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type PageMenuVO = {
    records?: MenuVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageMenuVO;
    searchCount?: PageMenuVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageMerchantVO = {
    records?: MerchantVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageMerchantVO;
    searchCount?: PageMerchantVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageOrderAndItemVO = {
    records?: OrderAndItemVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageOrderAndItemVO;
    searchCount?: PageOrderAndItemVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageOrderVO = {
    records?: OrderVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageOrderVO;
    searchCount?: PageOrderVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageUserVO = {
    records?: UserVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageUserVO;
    searchCount?: PageUserVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PasswordRequest = {
    oldPassword?: string;
    newPassword: string;
  };

  type QueryRequest = {
    username?: string;
    phone?: string;
    nickname?: string;
    status?: string;
  };

  type RegisterRequest = {
    username: string;
    password: string;
  };

  type ResultCustomerAddressVO = {
    code?: number;
    msg?: string;
    data?: CustomerAddressVO;
  };

  type ResultCustomerVO = {
    code?: number;
    msg?: string;
    data?: CustomerVO;
  };

  type ResultListCustomerAddressVO = {
    code?: number;
    msg?: string;
    data?: CustomerAddressVO[];
  };

  type ResultListMenu = {
    code?: number;
    msg?: string;
    data?: Menu[];
  };

  type ResultLong = {
    code?: number;
    msg?: string;
    data?: number;
  };

  type ResultMenuVO = {
    code?: number;
    msg?: string;
    data?: MenuVO;
  };

  type ResultMerchantVO = {
    code?: number;
    msg?: string;
    data?: MerchantVO;
  };

  type ResultOrderAndItemVO = {
    code?: number;
    msg?: string;
    data?: OrderAndItemVO;
  };

  type ResultPageMenuVO = {
    code?: number;
    msg?: string;
    data?: PageMenuVO;
  };

  type ResultPageMerchantVO = {
    code?: number;
    msg?: string;
    data?: PageMerchantVO;
  };

  type ResultPageOrderAndItemVO = {
    code?: number;
    msg?: string;
    data?: PageOrderAndItemVO;
  };

  type ResultPageOrderVO = {
    code?: number;
    msg?: string;
    data?: PageOrderVO;
  };

  type ResultPageUserVO = {
    code?: number;
    msg?: string;
    data?: PageUserVO;
  };

  type ResultSaTokenInfo = {
    code?: number;
    msg?: string;
    data?: SaTokenInfo;
  };

  type ResultString = {
    code?: number;
    msg?: string;
    data?: string;
  };

  type ResultUserVO = {
    code?: number;
    msg?: string;
    data?: UserVO;
  };

  type ResultVoid = {
    code?: number;
    msg?: string;
    data?: Record<string, any>;
  };

  type SaTokenInfo = {
    tokenName?: string;
    tokenValue?: string;
    isLogin?: boolean;
    loginId?: Record<string, any>;
    loginType?: string;
    tokenTimeout?: number;
    sessionTimeout?: number;
    tokenSessionTimeout?: number;
    tokenActiveTimeout?: number;
    loginDevice?: string;
    tag?: string;
  };

  type userBanParams = {
    id: string;
  };

  type userDeleteParams = {
    id: string;
  };

  type userGetByIdParams = {
    id: string;
  };

  type userListParams = {
    pageNum?: number;
    pageSize?: number;
  };

  type userLoginParams = {
    remember?: boolean;
  };

  type userUnbanParams = {
    id: string;
  };

  type userUpdateAvatarParams = {
    id: string;
  };

  type userUpdateEmail1Params = {
    id: string;
    email: string;
  };

  type userUpdateEmailParams = {
    email: string;
  };

  type userUpdateNickname1Params = {
    id: string;
    nickname: string;
  };

  type userUpdateNicknameParams = {
    nickname: string;
  };

  type userUpdatePassword1Params = {
    id: string;
  };

  type userUpdatePhoneParams = {
    phone: string;
  };

  type UserVO = {
    id?: string;
    username?: string;
    nickname?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    status?: string;
    role?: string;
    lastLoginTime?: string;
    createdAt?: string;
  };
}
