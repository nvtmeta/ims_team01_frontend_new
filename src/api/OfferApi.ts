import { instanceAxios } from "./axiosConfig";

export const fetchOfferList = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchOfferCreate = async (data: any) => {
  try {
    const result = await instanceAxios.post(`/offer`, data);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchOfferApprove = async (id: number) => {
  try {
    const result = await instanceAxios.put(`/offer/approve/${id}`);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchOfferReject = async (id: number) => {
  try {
    const result = await instanceAxios.put(`/offer/reject/${id}`);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchOfferMarkSendCandidate = async (id: number) => {
  try {
    const result = await instanceAxios.put(
      `/offer/markOfferCandidateSend/${id}`
    );
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchOfferAcceptOffer = async (id: number) => {
  try {
    const result = await instanceAxios.put(`/offer/accept/${id}`);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchOfferDeclineOffer = async (id: number) => {
  try {
    const result = await instanceAxios.put(`/offer/decline/${id}`);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchOfferCancelOffer = async (id: number) => {
  try {
    const result = await instanceAxios.put(`/offer/cancel/${id}`);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
export const fetchOfferById = async (url: string) => {
  try {
    const result = await instanceAxios.get(url);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchOfferUpdate = async (id: number, data: any) => {
  try {
    const result = await instanceAxios.put(`/offer/${id}`, data);
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
};
// export const fetchOfferDelete = async (id: number) => {
//   try {
//     const result = await instanceAxios.delete(`/offer/${id}`);
//     return result.data;
//   } catch (error: any) {
//     console.log(error);
//   }
// };
