import { InterviewFormInterface } from "@/interface/InterviewInterface";
import { CandidateInterfaceCreate } from "./../interface/CandidateInterface";
import { instanceAxios } from "./axiosConfig";

export const fetchCandidatePage = async (page: number, size: number) => {
  try {
    const result = await instanceAxios.get(
      `/candidate?size=${size}&page=${page}`
    );
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchCandidateSwr = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchCandidatePost = async (candidateInterfaceCreate: any) => {
  try {
    const result = await instanceAxios.post(
      `/candidate`,
      candidateInterfaceCreate
    );
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchCandidateUpdate = async (
  id: number,
  candidateInterfaceCreate: CandidateInterfaceCreate
) => {
  try {
    const result = await instanceAxios.put(
      `/candidate/${id}`,
      candidateInterfaceCreate
    );
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchCandidateById = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchCandidateDelete = async (candidateId: number) => {
  try {
    const result = await instanceAxios.delete(`candidate/${candidateId}`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchCandidateBan = async (candidateId: number) => {
  try {
    const result = await instanceAxios.patch(`candidate/${candidateId}/ban`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchValidateEmailCandidateExisted = async (email: string) => {
  try {
    const result = await instanceAxios.get(`candidate/email/${email}`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
