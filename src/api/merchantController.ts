// @ts-ignore
/* eslint-disable */
import request from "@/requests";

/** 此处后端没有提供注释 GET /api/v1/merchant/${param0}/delete */
export async function merchantDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.merchantDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/v1/merchant/${param0}/delete`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/merchant/${param0}/get */
export async function merchantGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.merchantGetParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultMerchantVO>(`/api/v1/merchant/${param0}/get`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update/address */
export async function merchantUpdateAddress(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.merchantUpdateAddressParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/v1/merchant/${param0}/update/address`, {
    method: "POST",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update/businesshours */
export async function merchantUpdateBusinesshours(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.merchantUpdateBusinesshoursParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(
    `/api/v1/merchant/${param0}/update/businesshours`,
    {
      method: "POST",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update/description */
export async function merchantUpdateDescription(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.merchantUpdateDescriptionParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(
    `/api/v1/merchant/${param0}/update/description`,
    {
      method: "POST",
      params: {
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update/logo */
export async function merchantUpdateLogo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.merchantUpdateLogoParams,
  body: {},
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/v1/merchant/${param0}/update/logo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update/minprice */
export async function merchantUpdateMinprice(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.merchantUpdateMinpriceParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/v1/merchant/${param0}/update/minprice`, {
    method: "POST",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update/name */
export async function merchantUpdateName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.merchantUpdateNameParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/v1/merchant/${param0}/update/name`, {
    method: "POST",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update/phone */
export async function merchantUpdatePhone(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.merchantUpdatePhoneParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/v1/merchant/${param0}/update/phone`, {
    method: "POST",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update/status */
export async function merchantUpdateStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.merchantUpdateStatusParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/v1/merchant/${param0}/update/status`, {
    method: "POST",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/merchant/create */
export async function merchantCreate(
  body: API.MerchantCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultLong>("/api/v1/merchant/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/merchant/list */
export async function merchantList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.merchantListParams,
  body: API.MerchantQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageMerchantVO>("/api/v1/merchant/list", {
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

/** 此处后端没有提供注释 POST /api/v1/merchant/merchants */
export async function merchants(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.merchantsParams,
  body: API.MerchantQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageMerchantVO>("/api/v1/merchant/merchants", {
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
