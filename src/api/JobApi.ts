import { UserFormInterface } from "@/interface/UserInterface";
import { instanceAxios } from "./axiosConfig";

export const fetchJobList = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchJobCreate = async (data: any) => {
  try {
    const result = await instanceAxios.post(`/job`, data);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchJobImport = async (data: any) => {
  try {
    const result = await instanceAxios.post(`/job/excel`, data);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchJobById = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchJobUpdate = async (id: number, data: any) => {
  try {
    const result = await instanceAxios.put(`/job/${id}`, data);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchJobDelete = async (id: number) => {
  try {
    const result = await instanceAxios.delete(`/job/${id}`);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
