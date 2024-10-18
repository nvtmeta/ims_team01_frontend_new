import { JobStatusEnum } from "@/enum/JobEnum";
import { SelectInterface } from "./SelectInterface";
import { OfferContractTypeEnum, OfferStatusEnum } from "@/enum/OfferEnum";

export interface OfferResponseInterface {
  content: OfferListInterface[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface OfferListInterface {
  id: number;
  candidateName: string;
  email: string; // note the ? symbol, indicating that skills is optional
  approver: string;
  department: string; // note the ? symbol, indicating that benefits is optional
  note: string; // format: "YYYY-MM-DD"
  status: OfferStatusEnum; // format: "YYYY-MM-DD"
}

export interface OfferFormInterface {
  candidate: SelectInterface;
  contractType: SelectInterface; // adjust the type if needed
  position: SelectInterface;
  level: SelectInterface;
  approver: SelectInterface;
  department: SelectInterface;
  interviewInfo: SelectInterface;
  recruitmentOwner: SelectInterface;
  status: OfferStatusEnum; // adjust the type if needed
  dueDate: string; // format: '2024-01-01'
  contractFromDate: string; // format: '2024-01-01'
  contractToDate: string; // format: '2024-01-18'
  basicSalary: number;
  note: string;
}

export interface OfferDetailInterface {
  candidate: SelectInterface;
  contractType: string; // adjust the type if needed
  position: SelectInterface;
  level: SelectInterface;
  approver: SelectInterface;
  department: SelectInterface;
  interviewInfo: SelectInterface;
  interviewers: SelectInterface[];
  interviewNotes: string;
  recruiterOwner: SelectInterface;
  status: OfferStatusEnum; // adjust the type if needed
  dueDate: string; // format: '2024-01-01'
  contractFromDate: string; // format: '2024-01-01'
  contractToDate: string; // format: '2024-01-18'
  basicSalary: number;
  note: string;
  createdDate: string;
  updatedDate: string;
}

// // export interface interviewResultInterface {
// //   note: string;
// //   result: InterviewResultEnum;
// // }
