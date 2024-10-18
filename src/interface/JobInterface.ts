import { JobStatusEnum } from "@/enum/JobEnum";
import { SelectInterface } from "./SelectInterface";

export interface JobResponseInterface {
  content: JobListInterface[];
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

export interface JobListInterface {
  id: number;
  title: string;
  skills: string; // note the ? symbol, indicating that skills is optional
  levels: string;
  benefits: string; // note the ? symbol, indicating that benefits is optional
  startDate: string; // format: "YYYY-MM-DD"
  endDate: string; // format: "YYYY-MM-DD"
  status: JobStatusEnum;
}

export interface JobDetailInterface {
  id: number;
  title: string;
  skills: SelectInterface[]; // note the ? symbol, indicating that skills is optional
  levels: SelectInterface[];
  benefits: SelectInterface[]; // note the ? symbol, indicating that benefits is optional
  startDate: string; // format: "YYYY-MM-DD"
  endDate: string; // format: "YYYY-MM-DD"
  status: JobStatusEnum;
  createdDate: string;
  updatedDate: string;
  salaryFrom: string;
  salaryTo: string;
  workingAddress: string;
  description: string;
}
export interface JobFormExcelInterface {
  title: string;
  skills: string; // note the ? symbol, indicating that skills is optional
  levels: string;
  benefits: string; // note the ? symbol, indicating that benefits is optional
  startDate: any; // format: "YYYY-MM-DD"
  endDate: any; // format: "YYYY-MM-DD"
  salaryFrom: any;
  salaryTo: any;
  workingAddress: string;
  description: string;
}
