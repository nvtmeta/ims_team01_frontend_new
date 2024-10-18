import { instanceAxios } from "./axiosConfig";
import { CandidateInterfaceCreate } from "@/interface/CandidateInterface";
import { UserFormInterface } from "@/interface/UserInterface";
import { SelectInterface } from "@/interface/SelectInterface";

export const fetchUserList = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserById = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchUserByRole = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

// isUserExisted
export const fetchIsUserExistedByEmailOrUsername = async (
  email: string,
  username: string
) => {
  try {
    const result = await instanceAxios.get(
      `user/isUserExisted?email=${email}&username=${username}`
    );
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchRecruiterListApi = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchUserCreate = async (userFormInterface: {
  note: string;
  address: string;
  gender: string;
  phone: string;
  dob: string;
  roles: SelectInterface[];
  fullName: string;
  department: SelectInterface;
  email: string;
  status: string;
}) => {
  try {
    const result = await instanceAxios.post(`/user`, userFormInterface);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchUserUpdate = async (
  userId: number,
  userFormInterface: {
    note: string;
    address: string;
    gender: string;
    phone: string;
    dob: string;
    roles: SelectInterface[];
    fullName: string;
    department: SelectInterface;
    email: string;
    status: string;
  }
) => {
  try {
    const result = await instanceAxios.put(
      `/user/${userId}`,
      userFormInterface
    );
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchUserToggleStatus = async (url: string) => {
  try {
    const result = await instanceAxios.patch(url);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
