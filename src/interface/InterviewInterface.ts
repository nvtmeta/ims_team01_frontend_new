import { InterviewResultEnum } from "./../enum/InterviewEnum";
import {
  CandidateStatusEnum,
  HighestLevelEnum,
  PositionEnum,
} from "@/enum/CandidateEnum";
import { GenderEnum } from "@/enum/GenderEnum";
import { SkillEnum } from "@/enum/SkillEnum";
import { DropdownInterface } from "./DropdownInterface";
import { SelectInterface } from "./SelectInterface";
import { UserGenderEnum } from "@/enum/UserGenderEnum";
import { UserStatusEnum } from "@/enum/UserStatusEnum";
import { InterviewStatusEnum } from "@/enum/InterviewEnum";

export interface InterviewResponseInterface {
  content: InterviewListInterface[];
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

export interface InterviewerPageInterface {
  content: SelectInterface[];
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

export interface InterviewListInterface {
  id: number;
  title: string;
  candidateName: string;
  interviewerName: string;
  interviewerId: string;
  schedule: string; // or Date if you want to store it as a Date object
  result: string; // or string if you want to store a string result
  status: string;
  jobName: string; // or string if you want to store a job name
}

export interface InterviewDetailInterface {
  title: string;
  date: string;
  startTime: string;
  endTime: string; // or Date if you want to store it as a Date object
  location: string; // or string if you want to store a string result
  meetingId: string;
  note: string; //
  result: InterviewResultEnum;
  status: InterviewStatusEnum;
  interviewers: SelectInterface[]; //
  candidate: SelectInterface; //
  recruiter: SelectInterface; //
  author: SelectInterface; //
  job: SelectInterface;
  createdDate: string;
  updatedDate: string;
}

export interface InterviewFormInterface {
  title: string;
  date: string;
  startTime: string;
  endTime: string; // or Date if you want to store it as a Date object
  location: string; // or string if you want to store a string result
  meetingId: string;
  note: string; //
  interviewers: SelectInterface[]; //
  candidate: SelectInterface; //
  recruiter: SelectInterface; //
  job: SelectInterface;
  result: InterviewResultEnum;
  status: InterviewStatusEnum;
}

export interface interviewResultInterface {
  note: string;
  result: InterviewResultEnum;
}
