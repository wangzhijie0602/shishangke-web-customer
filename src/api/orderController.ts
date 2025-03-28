// @ts-ignore
/* eslint-disable */
import request from "@/requests";

/** 此处后端没有提供注释 POST /api/v1/order */
export async function orderCreateOrder(
  body: API.OrderCreateCompleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultOrderAndItemVO>("/api/v1/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/order/${param0}/cancel */
export async function orderCancelOrder(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.orderCancelOrderParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/v1/order/${param0}/cancel`, {
    method: "POST",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/order/${param0}/orderanditem */
export async function orderGetOrderAndItem(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.orderGetOrderAndItemParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultOrderAndItemVO>(
    `/api/v1/order/${param0}/orderanditem`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /api/v1/order/changeaddress */
export async function orderChangeAddress(
  body: API.OrderAddressRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultVoid>("/api/v1/order/changeaddress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/order/orderitems */
export async function orderListOrderItems(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.orderListOrderItemsParams,
  body: API.OrderQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageOrderAndItemVO>("/api/v1/order/orderitems", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      // pageNum has a default value: 1
      pageNum: "1",
      // pageSize has a default value: 50
      pageSize: "50",
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/order/orders */
export async function orderListOrders(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.orderListOrdersParams,
  body: API.OrderQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageOrderVO>("/api/v1/order/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      // pageNum has a default value: 1
      pageNum: "1",
      // pageSize has a default value: 50
      pageSize: "50",
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}
