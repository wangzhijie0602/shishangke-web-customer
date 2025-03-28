// @ts-ignore
/* eslint-disable */
import request from "@/requests";

/** 此处后端没有提供注释 GET /api/v1/menu/${param0}/delete */
export async function menuDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.menuDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultString>(`/api/v1/menu/${param0}/delete`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/menu/${param0}/get */
export async function menuGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.menuGetParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultMenuVO>(`/api/v1/menu/${param0}/get`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/menu/create */
export async function menuCreate(
  body: API.MenuCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>("/api/v1/menu/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/menu/list */
export async function menuList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.menuListParams,
  body: API.MenuQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageMenuVO>("/api/v1/menu/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      // pageNum has a default value: 1
      pageNum: "1",
      // pageSize has a default value: 10
      pageSize: "10",
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/menu/merchant/${param0} */
export async function menuGetByMerchant(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.menuGetByMerchantParams,
  body: API.MenuQueryRequest,
  options?: { [key: string]: any }
) {
  const { merchantId: param0, ...queryParams } = params;
  return request<API.ResultPageMenuVO>(`/api/v1/menu/merchant/${param0}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      // pageNum has a default value: 1
      pageNum: "1",
      // pageSize has a default value: 50
      pageSize: "50",
      ...queryParams,
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/menu/update */
export async function menuUpdate(
  body: API.MenuUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>("/api/v1/menu/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/menu/upload/image */
export async function menuUploadImage(
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.ResultString>("/api/v1/menu/upload/image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
