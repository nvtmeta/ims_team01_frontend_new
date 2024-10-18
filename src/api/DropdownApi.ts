import { instanceAxios } from "./axiosConfig";

export const fetchPositionListApi = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchSkillListApi = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchBenefitListApi = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchLevelListApi = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchDepartmentListApi = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
