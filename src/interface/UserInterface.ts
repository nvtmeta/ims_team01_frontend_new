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

export interface UserResponseInterface {
  content: UserListInterface[];
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

export interface UserListInterface {
  id: number;
  username: string;
  email: string;
  phone: string;
  status: CandidateStatusEnum;
  roles: string[];
}

export interface UserDetailInterface {
  fullName: string;
  phone: string;
  email: string;
  status: UserStatusEnum;
  dob: string;
  roles: SelectInterface[];
  department: SelectInterface;
  note: string;
  address: string;
  gender: UserGenderEnum;
}

export interface UserFormInterface {
  fullName: string;
  phone: string;
  email: string;
  status: string;
  dob: string;
  roles: SelectInterface[];
  department: SelectInterface;
  note: string;
  address: string;
  gender: string;
}
export interface UserAuthInterface {
  username: string;
  fullName: string;
  id: number;
  email: string;
  roles: string[];
  departmentName: string;
}
