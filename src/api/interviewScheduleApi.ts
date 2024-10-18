import { UserFormInterface } from "@/interface/UserInterface";
import { instanceAxios } from "./axiosConfig";

export const fetchInterviewList = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchInterviewById = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchInterviewNoteById = async (id: number) => {
  try {
    const result = await instanceAxios.get(`/interview-schedule/note/${id}`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

// // isUserExisted
// export const fetchIsUserExistedByEmailOrUsername = async (
//   email: string,
//   username: string
// ) => {
//   try {
//     const result = await instanceAxios.get(
//       `user/isUserExisted?email=${email}&username=${username}`
//     );
//     return result.data;
//   } catch (error) {
//     console.log(error);
//   }
// };
// export const fetchRecruiterListApi = async (url: string) => {
//   try {
//     const result = await instanceAxios.get(url);
//     return result.data;
//   } catch (error: any) {
//         console.log(error)
//   }
// };

export const fetchInterviewCreate = async (data: any) => {
  try {
    const result = await instanceAxios.post(`/interview-schedule`, data);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchInterviewUpdate = async (id: number, data: any) => {
  try {
    const result = await instanceAxios.put(`/interview-schedule/${id}`, data);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchInterviewCancel = async (id: number) => {
  try {
    const result = await instanceAxios.put(`/interview-schedule/cancel/${id}`);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchInterviewSubmit = async (id: number, data: any) => {
  try {
    const result = await instanceAxios.put(
      `/interview-schedule/submit/${id}`,
      data
    );
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchInterviewReminder = async (id: number) => {
  try {
    const result = await instanceAxios.post(
      `/interview-schedule/reminder/${id}`
    );
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
