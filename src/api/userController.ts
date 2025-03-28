// @ts-ignore
/* eslint-disable */
import request from "@/requests";

/** 此处后端没有提供注释 POST /api/v1/user */
export async function userCreate(
  body: API.CreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.UserVO>("/api/v1/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/user/${param0} */
export async function userGetById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userGetByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultUserVO>(`/api/v1/user/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/user/${param0}/ban */
export async function userBan(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userBanParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/v1/user/${param0}/ban`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/user/${param0}/delete */
export async function userDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/v1/user/${param0}/delete`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/user/${param0}/unban */
export async function userUnban(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userUnbanParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/v1/user/${param0}/unban`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/user/${param0}/update/avatar */
export async function userUpdateAvatar(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userUpdateAvatarParams,
  body: {},
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultString>(`/api/v1/user/${param0}/update/avatar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/user/${param0}/update/email */
export async function userUpdateEmail1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userUpdateEmail1Params,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/v1/user/${param0}/update/email`, {
    method: "POST",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/user/${param0}/update/nickname */
export async function userUpdateNickname1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userUpdateNickname1Params,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/v1/user/${param0}/update/nickname`, {
    method: "POST",
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/user/${param0}/update/password */
export async function userUpdatePassword1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userUpdatePassword1Params,
  body: API.PasswordRequest,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResultVoid>(`/api/v1/user/${param0}/update/password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/user/current */
export async function userGetCurrent(options?: { [key: string]: any }) {
  return request<API.ResultUserVO>("/api/v1/user/current", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/user/list */
export async function userList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userListParams,
  body: API.QueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageUserVO>("/api/v1/user/list", {
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

/** 此处后端没有提供注释 POST /api/v1/user/login */
export async function userLogin(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userLoginParams,
  body: API.LoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultSaTokenInfo>("/api/v1/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v1/user/logout */
export async function userLogout(options?: { [key: string]: any }) {
  return request<API.ResultVoid>("/api/v1/user/logout", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/user/register */
export async function userRegister(
  body: API.RegisterRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultLong>("/api/v1/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/user/update/avatar */
export async function userUpdateAvatar1(
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.ResultString>("/api/v1/user/update/avatar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/user/update/email */
export async function userUpdateEmail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userUpdateEmailParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultVoid>("/api/v1/user/update/email", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/user/update/nickname */
export async function userUpdateNickname(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userUpdateNicknameParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultVoid>("/api/v1/user/update/nickname", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/user/update/password */
export async function userUpdatePassword(
  body: API.PasswordRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultVoid>("/api/v1/user/update/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v1/user/update/phone */
export async function userUpdatePhone(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userUpdatePhoneParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultVoid>("/api/v1/user/update/phone", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
