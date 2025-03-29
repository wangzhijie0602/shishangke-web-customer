// @ts-ignore
/* eslint-disable */
import request from "@/requests";

/** 此处后端没有提供注释 GET /api/v1/pay/${param0} */
export async function paymentConfirmPayment(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.paymentConfirmPaymentParams,
  options?: { [key: string]: any }
) {
  const { paymentId: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/v1/pay/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/pay/create */
export async function paymentCreatePayment(
  body: API.PaymentCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPaymentVO>("/api/v1/pay/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
