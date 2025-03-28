// @ts-ignore
/* eslint-disable */
import request from "@/requests";

/** 此处后端没有提供注释 POST /api/v1/customer/address/add */
export async function customerAddressAdd(
  body: API.CustomerAddressCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>("/api/v1/customer/address/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/customer/address/default */
export async function customerAddressDefault(options?: { [key: string]: any }) {
  return request<API.ResultCustomerAddressVO>(
    "/api/v1/customer/address/default",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /api/v1/customer/address/delete/${param0} */
export async function customerAddressDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customerAddressDeleteParams,
  options?: { [key: string]: any }
) {
  const { addressId: param0, ...queryParams } = params;
  return request<API.ResultString>(
    `/api/v1/customer/address/delete/${param0}`,
    {
      method: "POST",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 GET /api/v1/customer/address/list */
export async function customerAddressList(options?: { [key: string]: any }) {
  return request<API.ResultListCustomerAddressVO>(
    "/api/v1/customer/address/list",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /api/v1/customer/address/set-default/${param0} */
export async function customerAddressSetDefault(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customerAddressSetDefaultParams,
  options?: { [key: string]: any }
) {
  const { addressId: param0, ...queryParams } = params;
  return request<API.ResultString>(
    `/api/v1/customer/address/set-default/${param0}`,
    {
      method: "POST",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /api/v1/customer/address/update */
export async function customerAddressUpdate(
  body: API.CustomerAddressUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>("/api/v1/customer/address/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/customer/current */
export async function customerGetCurrent(options?: { [key: string]: any }) {
  return request<API.ResultCustomerVO>("/api/v1/customer/current", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/customer/login */
export async function customerLogin(
  body: API.CustomerLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultCustomerVO>("/api/v1/customer/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/customer/logout */
export async function customerLogout(options?: { [key: string]: any }) {
  return request<API.ResultString>("/api/v1/customer/logout", {
    method: "POST",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/customer/menu/${param0} */
export async function customerGetMenu(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customerGetMenuParams,
  options?: { [key: string]: any }
) {
  const { merchantId: param0, ...queryParams } = params;
  return request<API.ResultListMenu>(`/api/v1/customer/menu/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/customer/merchant/${param0} */
export async function customerGetMerchant(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customerGetMerchantParams,
  options?: { [key: string]: any }
) {
  const { merchantId: param0, ...queryParams } = params;
  return request<API.ResultMerchantVO>(`/api/v1/customer/merchant/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/customer/merchants */
export async function customerGetMerchants(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customerGetMerchantsParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageMerchantVO>("/api/v1/customer/merchants", {
    method: "GET",
    params: {
      // pageNumber has a default value: 1
      pageNumber: "1",
      // pageSize has a default value: 10
      pageSize: "10",
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/customer/register */
export async function customerRegister(
  body: API.CustomerCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>("/api/v1/customer/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/customer/update/avatar */
export async function customerUpdateAvatar(
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.ResultString>("/api/v1/customer/update/avatar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/customer/update/birthdate */
export async function customerUpdateBirthdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customerUpdateBirthdateParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>("/api/v1/customer/update/birthdate", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/customer/update/gender */
export async function customerUpdateGender(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customerUpdateGenderParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>("/api/v1/customer/update/gender", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/customer/update/nickname */
export async function customerUpdateNickname(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customerUpdateNicknameParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>("/api/v1/customer/update/nickname", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/customer/update/preferences */
export async function customerUpdatePreferences(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customerUpdatePreferencesParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>("/api/v1/customer/update/preferences", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
