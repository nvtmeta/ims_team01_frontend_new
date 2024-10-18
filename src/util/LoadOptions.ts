import { fetchUserList } from "@/api/UserApi";
import { SIZE } from "@/constant/ListConstant";
import { CandidateInterface } from "@/interface/CandidateInterface";
import { InterviewListInterface } from "@/interface/InterviewInterface";
import { SelectInterface } from "@/interface/SelectInterface";
import { UserListInterface } from "@/interface/UserInterface";
import { GroupBase, OptionsOrGroups, SelectInstance } from "react-select";

export type OptionType = {
  value: number;
  label: string;
};

export const loadOptionsUser = async (
  prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>
) => {
  const url = `/user?size=3&page=${prevOptions.length / 3}`;
  const data = await fetchUserList(url);

  const filteredOptions: OptionType[] = data.content.map(
    (user: UserListInterface) => ({
      value: user.id,
      label: user.username,
    })
  );

  const hasMore = data.totalPages > Math.ceil((prevOptions.length + 3) / 3);

  return {
    options: filteredOptions,
    hasMore,
  };
};

export const loadOptionsCandidate = async (
  search: string,
  prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>
) => {
  let url = `/candidate/status/no-ban?page=${
    prevOptions.length / SIZE
  }&size=${SIZE}`;
  if (search) {
    url += `&q=${search}`;
  }

  const data = await fetchUserList(url);

  const filteredOptions: OptionType[] = data.content
    .filter((item: SelectInterface) => {
      const name = item.label.toLowerCase();
      const searchQuery = search.toLowerCase();
      return name.includes(searchQuery);
    })
    .map((item: SelectInterface) => ({
      value: item.value,
      label: item.label,
    }));

  if (filteredOptions.length === 0) {
    return { options: [], hasMore: false };
  }

  const hasMore =
    data.totalPages > Math.ceil((prevOptions.length + SIZE) / SIZE);

  return {
    options: filteredOptions,
    hasMore,
  };
};

export const loadOptionsApprover = async (
  search: string,
  prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>
) => {
  let url = `/user/role/manager?page=${prevOptions.length / SIZE}&size=${SIZE}`;
  if (search) {
    url += `&q=${search}`;
  }

  const data = await fetchUserList(url);

  const filteredOptions: OptionType[] = data.content
    .filter((item: SelectInterface) => {
      const name = item.label.toLowerCase();
      const searchQuery = search.toLowerCase();
      return name.includes(searchQuery);
    })
    .map((item: SelectInterface) => ({
      value: item.value,
      label: item.label,
    }));

  if (filteredOptions.length === 0) {
    return { options: [], hasMore: false };
  }

  const hasMore =
    data.totalPages > Math.ceil((prevOptions.length + SIZE) / SIZE);

  return {
    options: filteredOptions,
    hasMore,
  };
};

export const loadOptionsRecruiter = async (
  search: string,
  prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>
) => {
  let url = `/user/role/recruiter?page=${
    prevOptions.length / SIZE
  }&size=${SIZE}`;
  if (search) {
    url += `&q=${search}`;
  }

  const data = await fetchUserList(url);

  const filteredOptions: OptionType[] = data.content
    .filter((item: SelectInterface) => {
      const name = item.label.toLowerCase();
      const searchQuery = search.toLowerCase();
      return name.includes(searchQuery);
    })
    .map((item: SelectInterface) => ({
      value: item.value,
      label: item.label,
    }));

  if (filteredOptions.length === 0) {
    return { options: [], hasMore: false };
  }

  const hasMore =
    data.totalPages > Math.ceil((prevOptions.length + SIZE) / SIZE);

  return {
    options: filteredOptions,
    hasMore,
  };
};

export const loadOptionsInterview = async (
  search: string,
  prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>
) => {
  let url = `/interview-schedule?page=${
    prevOptions.length / SIZE
  }&size=${SIZE}`;
  if (search) {
    url += `&q=${search}`;
  }

  const data = await fetchUserList(url);

  const filteredOptions: OptionType[] = data.content
    .filter((item: InterviewListInterface) => {
      const name = item.title.toLowerCase();
      const searchQuery = search.toLowerCase();
      return name.includes(searchQuery);
    })
    .map((item: InterviewListInterface) => ({
      value: item.id,
      label: item.title,
      titleSelected: `${item.title} | ${item.interviewerName}`,
    }));

  if (filteredOptions.length === 0) {
    return { options: [], hasMore: false };
  }

  const hasMore =
    data.totalPages > Math.ceil((prevOptions.length + SIZE) / SIZE);

  return {
    options: filteredOptions,
    hasMore,
  };
};

export const loadOptionsJob = async (
  search: string,
  prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>
) => {
  let url = `/job/status/OPEN?page=${prevOptions.length / SIZE}&size=${SIZE}`;
  if (search) {
    url += `&q=${search}`;
  }

  const data = await fetchUserList(url);

  const filteredOptions: OptionType[] = data.content
    .filter((item: SelectInterface) => {
      const name = item.label.toLowerCase();
      const searchQuery = search.toLowerCase();
      return name.includes(searchQuery);
    })
    .map((item: SelectInterface) => ({
      value: item.value,
      label: item.label,
    }));

  if (filteredOptions.length === 0) {
    return { options: [], hasMore: false };
  }

  const hasMore =
    data.totalPages > Math.ceil((prevOptions.length + SIZE) / SIZE);

  return {
    options: filteredOptions,
    hasMore,
  };
};

export const loadOptionsInterviewer = async (
  search: string,
  prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>
) => {
  let url = `/interview-schedule/interviewers?page=${
    prevOptions.length / SIZE
  }&size=${SIZE}`;
  if (search) {
    url += `&q=${search}`;
  }

  const data = await fetchUserList(url);

  const filteredOptions: OptionType[] = data.content
    .filter((item: SelectInterface) => {
      const name = item.label.toLowerCase();
      const searchQuery = search.toLowerCase();
      return name.includes(searchQuery);
    })
    .map((item: SelectInterface) => ({
      value: item.value,
      label: item.label,
    }));

  if (filteredOptions.length === 0) {
    return { options: [], hasMore: false };
  }

  const hasMore =
    data.totalPages > Math.ceil((prevOptions.length + SIZE) / SIZE);

  return {
    options: filteredOptions,
    hasMore,
  };
};
