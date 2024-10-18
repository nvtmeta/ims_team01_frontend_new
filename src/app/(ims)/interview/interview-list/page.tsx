"use client"

import React, { useEffect, useMemo, useState } from 'react'
import {
    Avatar,
    AvatarGroup,
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Chip,
    Input,
    Pagination,
    Spinner, Tooltip,
    useDisclosure
} from '@nextui-org/react'
import { fetchCandidateDelete, fetchCandidatePage, fetchCandidateSwr } from '@/api/CandidateApi'
import { useStoreBreadCrumbMainName, useStoreBreadCrumbName, useStoreMenuName } from '@/util/zustandStorage'
import ModalComponent from '@/components/ModalComponent'
import { formatCandidateStatus, formatInterviewResult, formatInterviewStatus, formatUserStatus, getColorByInterviewStatus, getColorByStatus, getColorByUserStatus } from '@/util/FormatEnum'
import useSWR, { mutate } from 'swr'
import SpinnerLoading from '@/util/SpinnerLoading'
import { CandidateStatusEnum } from '@/enum/CandidateEnum'
import toast from 'react-hot-toast'
import Select from 'react-select';
import { SelectInterface } from '@/interface/SelectInterface'
import { SearchIcon } from "@/icons/SearchIcon";
import { fetchUserList } from "@/api/UserApi";
import { UserListInterface, UserResponseInterface } from "@/interface/UserInterface";
import { interviewStatusList, statusList } from "@/store/ListCandidate";
import { selectStyles, selectStylesSearch } from "@/css/SelectStyle";
import { useRouter } from '@/components/usePRouter'
import { SIZE } from '@/constant/ListConstant'
import { fetchSkillListApi } from '@/api/DropdownApi'
import { InterviewListInterface, InterviewResponseInterface } from '@/interface/InterviewInterface'
import { fetchInterviewList } from '@/api/interviewScheduleApi'
import { FormatDateTimeRange } from '@/util/FormatDate'
import { Truncate } from '@/util/truncate'
import useUserData from '@/hooks/userLocalStorage'
import { UserRoleEnum } from '@/enum/UserRoleEnum'
import SelectInterviewers from '@/components/interview/SelectInterviewers'
import { loadOptionsCandidate, loadOptionsInterviewer } from '@/util/LoadOptions'
import { AsyncPaginate } from 'react-select-async-paginate'
import { IsCurrentUserInterviewer } from '@/util/isCurrentUserInterviewer'


const InterviewListPage = () => {
    const router = useRouter()
    const [currentPage, setCurrentPage] = React.useState(1);
    const [statusSearched, setStatusSearched] = useState({ label: 'All' } as SelectInterface);
    const [interviewerSearched, setInterviewerSearched] = useState({ label: 'All' } as SelectInterface);
    const [searchValue, setSearchValue] = React.useState("");
    const [isSearched, setIsSearched] = useState(false);

    const { userData, checkRole } = useUserData()

    const { data, error, isLoading } = useSWR<InterviewResponseInterface>(
        useMemo(() => {
            let url = `/interview-schedule?size=${SIZE}&page=${currentPage - 1}`;
            if (searchValue) {
                url += `&q=${searchValue}`;
            }
            if (interviewerSearched?.value) {
                url += `&interviewer=${interviewerSearched.value}`;
            }
            if (statusSearched?.value) {
                url += `&status=${statusSearched.value}`;
            }
            return url;
        }, [currentPage, isSearched]) // Re-run useSWR on state changes
        , fetchInterviewList);

    const setMenuName = useStoreMenuName(
        (state: any) => state.setMenuName
    );

    const handleRouter = (slug: string) => {
        router.push(slug)
        setMenuName("Interview Schedule")
    }


    const setBreadCrumbName = useStoreBreadCrumbName(
        (state: any) => state.setBreadCrumbName
    )
    const setBreadCrumbMainName = useStoreBreadCrumbMainName(
        (state: any) => state.setBreadCrumbMainName
    )

    const handleEdit = (item: InterviewListInterface, name: string) => {
        router.push(`/interview/edit/${item?.id}`)
        setBreadCrumbName("Interview schedule list")
        setBreadCrumbMainName(name)
    }



    const handleSearch = () => {
        setIsSearched(!isSearched)
        mutate(`/interview-schedule?size=${SIZE}&page=${currentPage - 1}
        &status=${statusSearched?.value}
        &interviewer=${interviewerSearched?.value}
        &q=${searchValue}`);
    }
    const isInterviewer = !checkRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.RECRUITER)




    return (
        <>
            <Breadcrumbs className='mx-6 ' variant='solid' radius='full'>
                <BreadcrumbItem onClick={() => router.push("/interview/interview-list")} size='lg'
                    className='font-bold'>Interview Schedule List</BreadcrumbItem>
            </Breadcrumbs>
            <div className='m-6  rounded-2xl p-3 flex items-center justify-between gap-2'>
                <div className='flex gap-3'>
                    <Input
                        variant='bordered'
                        size='lg'
                        radius="lg"
                        className='w-fit rounded-xl bg-white border-none'
                        placeholder="Type to search..."
                        startContent={
                            <SearchIcon className="text-black/50 mb-0.5   pointer-events-none flex-shrink-0" />
                        }
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <AsyncPaginate
                        isClearable
                        placeholder="Select an interviewer" // Your placeholder text here
                        styles={selectStyles}
                        value={interviewerSearched}
                        loadOptions={loadOptionsInterviewer}
                        onChange={setInterviewerSearched as any}
                    />
                    <Select
                        isClearable
                        placeholder="Select status" // Your placeholder text here
                        styles={selectStylesSearch}
                        value={statusSearched}
                        onChange={setStatusSearched as any}
                        options={interviewStatusList as any}
                    />
                    {/* search */}
                    <Button onPress={handleSearch} size='lg' className=' font-medium p-4 bg-gray-500 text-white '>
                        Search
                    </Button>
                </div>

                {!isInterviewer &&
                    <>
                        <Button onPress={() => handleRouter("/interview/interview-create")} size='lg' className='bg-gradient-to-r w-44 from-sky-400 to-blue-500 font-medium p-4 text-white '>
                            Add new
                        </Button>
                    </>

                }

            </div>

            <div className='bg-white p-10 m-6 rounded-3xl'>
                <table className="w-full ">
                    <thead>
                        <tr className="bg-gradient-to-r rounded-xl  from-sky-400 to-blue-500  text-left text-xs
                             font-semibold uppercase tracking-widest text-white">
                            <th className="pr-5 pl-4 py-3 rounded-tl-lg">Title</th>
                            <th className="pr-5 py-3">Candidate Name</th>
                            <th className="pr-5 py-3">Interviewer </th>
                            <th className="pr-5 py-3">Schedule</th>
                            <th className="pr-5 py-3">Result</th>
                            <th className="pr-5 py-3">Status</th>
                            <th className="pr-5 py-3">Job</th>
                            <th className="pr-5 py-3  rounded-tr-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-500 ">
                        {data?.content?.map((item: InterviewListInterface, index: number) => {
                            return (
                                <tr key={index} className={`hover:bg-slate-100 transition rounded-xl  border-2 cursor-pointer  `}>
                                    {/* name */}
                                    <td onClick={() => router.push(`/interview/${item?.id}`)}
                                        className="border-b border-gray-200 text-sm ">
                                        <p className="font-medium flex items-center gap-2 px-2 py-4 text-lg ">
                                            {item?.title}
                                        </p>
                                    </td>
                                    {/* email */}
                                    <td onClick={() => router.push(`/interview/${item?.id}`)}
                                        className="border-b border-gray-200  gap-3 justify-start   text-sm ">
                                        <p className="font-medium   py-4 text-lg ">
                                            {item?.candidateName}
                                        </p>
                                    </td>
                                    {/* phone */}
                                    <td onClick={() => router.push(`/interview/${item?.id}`)}
                                        className=" border-b border-gray-200   gap-3 justify-start  text-sm ">
                                        <p className="font-medium    py-4 text-lg ">
                                            {Truncate(item?.interviewerName, 20) || "N/A"}
                                        </p>
                                    </td>
                                    <td onClick={() => router.push(`/interview/${item?.id}`)}
                                        className=" border-b font-medium border-gray-200  text-lg ">
                                        <p>{FormatDateTimeRange(item?.schedule)}</p>
                                    </td>
                                    <td onClick={() => router.push(`/interview/${item?.id}`)}
                                        className=" border-b font-medium border-gray-200  text-lg ">
                                        <p>{formatInterviewResult(item?.result) || "N/A"}</p>
                                    </td>
                                    {/* status */}
                                    <td onClick={() => router.push(`/interview/${item?.id}`)}
                                        className=" border-b border-gray-200   text-sm ">
                                        <Chip size='sm' variant='solid'
                                            color={getColorByInterviewStatus(item?.status) as ("primary" | "default" | "secondary" | "success" | "warning" | "danger")} // Type assertion
                                            className="font-medium   py-4  text-lg ">
                                            {formatInterviewStatus(item?.status)}
                                        </Chip>
                                    </td>
                                    <td onClick={() => router.push(`/interview/${item?.id}`)}
                                        className=" border-b font-medium border-gray-200  text-lg ">
                                        <p>{item?.jobName || "N/A"}</p>
                                    </td>

                                    {/* updated date*/}
                                    <td className='flex py-4 items-center justify-start gap-5'>
                                        <img className='w-10 h-10 hover:scale-90 transition'
                                            onClick={() => router.push(`/interview/${item?.id}`)}
                                            src='https://cdn-icons-png.freepik.com/256/4740/4740895.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid' />
                                        {!isInterviewer && <img className='w-8 h-8 hover:scale-90 transition rounded-none'
                                            onClick={() => handleEdit(item, 'Edit Interview schedule details')}
                                            src='https://cdn-icons-png.freepik.com/256/10337/10337458.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid' />
                                        }
                                        {isInterviewer && IsCurrentUserInterviewer(item?.interviewerId, userData.id) && <img className='w-8 h-8 hover:scale-90 transition rounded-none'
                                            onClick={() => handleEdit(item, 'Interview schedule details')}
                                            src='https://cdn-icons-png.freepik.com/512/10976/10976569.png' />}
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
                <SpinnerLoading data={data} isLoading={isLoading} error={error} />

                {/* pagination */}
                {searchValue !== null && data?.totalElements == 0 && <p className='text-center mt-4 font-medium'>
                    No item matches with your search data. Please try
                    again</p>}

                {(isLoading || data?.totalElements !== 0) && <Pagination
                    page={currentPage}
                    onChange={setCurrentPage}
                    className='mt-10 flex justify-center' size='lg' total={data?.totalPages || 100} initialPage={1} />}

            </div >
        </>
    )
}

export default InterviewListPage


