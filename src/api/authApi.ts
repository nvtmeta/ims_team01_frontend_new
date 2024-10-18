import { instanceAxios } from "./axiosConfig";

export async function apiAuthSignIn(credentials: any) {
  try {
    const response = await instanceAxios.post(
      "auth/authenticate",
      credentials
      // { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error("Error during authentication:", error);
  }
}
export async function fetchLogOut() {
  try {
    await instanceAxios.get("auth/logout");
  } catch (error) {
    console.error("Error during authentication:", error);
  }
}

export async function fetchEmailExisted(email: string) {
  try {
    const response = await instanceAxios.get(`auth/isEmailExisted/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error during authentication:", error);
  }
}

export async function fetchForgotPassword(email: string) {
  try {
    const response = await instanceAxios.post(`auth/forgot-password/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error during authentication:", error);
  }
}
export async function fetchValidToken(token: string) {
  try {
    const response = await instanceAxios.get(`auth/isTokenValid/${token}`);
    return response.data;
  } catch (error) {
    console.error("Error during authentication:", error);
  }
}
export async function fetchResetPassword(data: any) {
  try {
    const response = await instanceAxios.patch(`auth/reset-password`, data);
    return response.data;
  } catch (error) {
    console.error("Error during authentication:", error);
  }
}
