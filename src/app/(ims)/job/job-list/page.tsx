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
import { formatCandidateStatus, formatInterviewResult, formatInterviewStatus, formatJobStatus, formatUserStatus, getColorByInterviewStatus, getColorByJobStatus, getColorByStatus, getColorByUserStatus } from '@/util/FormatEnum'
import useSWR, { mutate } from 'swr'
import SpinnerLoading from '@/util/SpinnerLoading'
import { CandidateStatusEnum } from '@/enum/CandidateEnum'
import toast from 'react-hot-toast'
import Select from 'react-select';
import { SelectInterface } from '@/interface/SelectInterface'
import { SearchIcon } from "@/icons/SearchIcon";
import { fetchUserList } from "@/api/UserApi";
import { UserListInterface, UserResponseInterface } from "@/interface/UserInterface";
import { JobStatusList, interviewStatusList, statusList } from "@/store/ListCandidate";
import { selectStyles, selectStylesSearch } from "@/css/SelectStyle";
import { useRouter } from '@/components/usePRouter'
import { SIZE } from '@/constant/ListConstant'
import { fetchSkillListApi } from '@/api/DropdownApi'
import { InterviewListInterface, InterviewResponseInterface } from '@/interface/InterviewInterface'
import { fetchInterviewList } from '@/api/interviewScheduleApi'
import { FormatDate, FormatDateTimeRange } from '@/util/FormatDate'
import { Truncate } from '@/util/truncate'
import useUserData from '@/hooks/userLocalStorage'
import { UserRoleEnum } from '@/enum/UserRoleEnum'
import SelectInterviewers from '@/components/interview/SelectInterviewers'
import { JobListInterface, JobResponseInterface } from '@/interface/JobInterface'
import { fetchJobCreate, fetchJobDelete, fetchJobImport, fetchJobList } from '@/api/JobApi'
import messages from '@/messages/messages'
import * as XLSX from 'xlsx';
import ModalExcel from '@/components/ModalExcel'


const JobListPage = () => {
    const router = useRouter()
    const [currentPage, setCurrentPage] = React.useState(1);
    const [statusSearched, setStatusSearched] = useState({ label: 'All' } as SelectInterface);
    const [searchValue, setSearchValue] = React.useState("");
    const [isSearched, setIsSearched] = useState(false);

    const { checkRole } = useUserData()

    const { data, error, isLoading } = useSWR<JobResponseInterface>(
        useMemo(() => {
            let url = `/job?size=${SIZE}&page=${currentPage - 1}`;
            if (searchValue) {
                url += `&q=${searchValue}`;
            }
            if (statusSearched?.value) {
                url += `&status=${statusSearched.value}`;
            }
            console.log("statusSearched?.value", statusSearched?.value)
            return url;
        }, [currentPage, isSearched]) // Re-run useSWR on state changes
        , fetchJobList);

    const setMenuName = useStoreMenuName(
        (state: any) => state.setMenuName
    );

    const handleRouter = (slug: string) => {
        router.push(slug)
        setMenuName("Job")
    }


    const setBreadCrumbName = useStoreBreadCrumbName(
        (state: any) => state.setBreadCrumbName
    )
    const setBreadCrumbMainName = useStoreBreadCrumbMainName(
        (state: any) => state.setBreadCrumbMainName
    )

    const handleEdit = (item: JobListInterface, name: string) => {
        router.push(`/job/edit/${item?.id}`)
        setBreadCrumbName("Job list")
        setBreadCrumbMainName(name)
    }



    const handleSearch = () => {
        setIsSearched(!isSearched)
    }

    const isInterviewer = !checkRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.RECRUITER)
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [jobId, setJobId] = useState(0)
    const handlePopup = (id: number) => {
        onOpen();
        setJobId(id)
    }

    const handleDeleteById = async () => {
        await fetchJobDelete(Number(jobId));
        toast.success(messages.ME019)
        onClose()
        mutate(`/job?size=${SIZE}&page=${currentPage - 1}`);
    }

    // excel
    const [dataExcel, setDataExcel] = React.useState(null);
    const { isOpen: isOpenExcelModal, onOpen: onOpenExcelModal, onOpenChange: onOpenChangeExcelModal, onClose: onCloseModal } = useDisclosure();

    const handleFileUpload = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            // @ts-ignore
            const workbook = XLSX.read(event.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(sheet);

            setDataExcel(sheetData as any);
        };

        reader.readAsArrayBuffer(file);
        e.target.value = null; // <--- Add this line to reset the file input value
    };

    const handleImportExcel = (e: any) => {
        handleFileUpload(e)
        onOpenExcelModal()
    }

    const fetchAddJob = async () => {
        onCloseModal()
        await fetchJobImport(dataExcel);
        toast.success("Import excel success !")
        mutate(`/job?size=${SIZE}&page=${currentPage - 1}`);
    }
    return (
        <>
            <Breadcrumbs className='mx-6 ' variant='solid' radius='full'>
                <BreadcrumbItem onClick={() => router.push("/interview/interview-list")} size='lg'
                    className='font-bold'>Job List</BreadcrumbItem>
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
                    <Select
                        isClearable
                        placeholder="Select status" // Your placeholder text here
                        styles={selectStylesSearch}
                        value={statusSearched}
                        onChange={setStatusSearched as any}
                        options={JobStatusList as any}
                    />
                    {/* search */}
                    <Button onPress={handleSearch} size='lg' className=' font-medium p-4 bg-gray-500 text-white '>
                        Search
                    </Button>
                </div>

                {!isInterviewer &&
                    <div className=''>
                        <Button onPress={() => handleRouter("/job/job-create")} size='lg' className='bg-gradient-to-r mr-4 w-44 from-sky-400 to-blue-500 font-medium p-4 text-white '>
                            Add new
                        </Button>
                        <label htmlFor='fileInput'
                            className='bg-slate-200 cursor-pointer hover:bg-slate-300 px-6 rounded-xl font-medium p-4 w-44 '>
                            Import
                        </label>
                        <input hidden type='file' id='fileInput' onChange={(e: any) => handleImportExcel(e)} />
                    </div>

                }

            </div>

            <div className='bg-white p-10 m-6 rounded-3xl'>
                <table className="w-full ">
                    <thead>
                        <tr className="bg-gradient-to-r rounded-xl  from-sky-400 to-blue-500  text-left text-xs
                             font-semibold uppercase tracking-widest text-white">
                            <th className="pr-5 pl-4 py-3 rounded-tl-lg">Job Title</th>
                            <th className="pr-5 py-3">Required Skills</th>
                            <th className="pr-5 py-3">Start date </th>
                            <th className="pr-5 py-3">End date</th>
                            <th className="pr-5 py-3">Level</th>
                            <th className="pr-5 py-3">Status</th>
                            <th className="pr-5 py-3  rounded-tr-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-500 ">
                        {data?.content?.map((item: JobListInterface, index: number) => {
                            return (
                                <tr key={index} className={`hover:bg-slate-100 transition rounded-xl  border-2 cursor-pointer  `}>
                                    <td onClick={() => router.push(`/job/${item?.id}`)}
                                        className="border-b border-gray-200 text-sm ">
                                        <p className="font-medium flex items-center gap-2 px-2 py-4 text-lg ">
                                            {item?.title || "N/A"}
                                        </p>
                                    </td>
                                    <td onClick={() => router.push(`/job/${item?.id}`)}
                                        className="border-b border-gray-200  gap-3 justify-start   text-sm ">
                                        <p className="font-medium   py-4 text-lg ">
                                            {Truncate(item?.skills, 20) || "N/A"}
                                        </p>
                                    </td>
                                    <td onClick={() => router.push(`/job/${item?.id}`)}
                                        className=" border-b border-gray-200   gap-3 justify-start  text-sm ">
                                        <p className="font-medium    py-4 text-lg ">
                                            {FormatDate(item?.startDate) || "N/A"}
                                        </p>
                                    </td>
                                    <td onClick={() => router.push(`/job/${item?.id}`)}
                                        className=" border-b font-medium border-gray-200  text-lg ">
                                        <p>
                                            {FormatDate(item?.endDate) || "N/A"}
                                        </p>
                                    </td>
                                    <td onClick={() => router.push(`/job/${item?.id}`)}
                                        className=" border-b font-medium border-gray-200  text-lg ">
                                        <p>
                                            {Truncate(item?.levels, 20) || "N/A"}
                                        </p>
                                    </td>
                                    {/* status */}
                                    <td onClick={() => router.push(`/job/${item?.id}`)}
                                        className=" border-b border-gray-200   text-sm ">
                                        <Chip size='sm' variant='solid'
                                            color={getColorByJobStatus(item?.status) as ("primary" | "default" | "secondary" | "success" | "warning" | "danger")} // Type assertion
                                            className="font-medium   py-4  text-lg ">
                                            {formatJobStatus(item?.status)}
                                        </Chip>
                                    </td>
                                    {/* updated date*/}
                                    <td className='flex py-4 items-center justify-start gap-5'>
                                        <img className='w-10 h-10 hover:scale-90 transition'
                                            onClick={() => router.push(`/job/${item?.id}`)}
                                            src='https://cdn-icons-png.freepik.com/256/4740/4740895.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid' />
                                        {!isInterviewer &&
                                            <>
                                                <img className='w-8 h-8 hover:scale-90 transition rounded-none'
                                                    onClick={() => handleEdit(item, 'Edit Job details')}
                                                    src='https://cdn-icons-png.freepik.com/256/10337/10337458.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid' />
                                                <img className='w-8 h-8 hover:scale-90 transition'
                                                    onClick={() => handlePopup(item.id)}
                                                    src='https://cdn-icons-png.freepik.com/256/6861/6861362.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid' />
                                            </>}
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
                <SpinnerLoading data={data} isLoading={isLoading} error={error} />

                {/* pagination */}
                {searchValue !== null && data?.totalElements == 0 && <p className='text-center mt-4 font-medium'>
                    No job has been found</p>}

                {(isLoading || data?.totalElements !== 0) && <Pagination
                    page={currentPage}
                    onChange={setCurrentPage}
                    className='mt-10 flex justify-center' size='lg' total={data?.totalPages || 100} initialPage={1} />}
                <ModalComponent fetchSource={handleDeleteById} candidateId={jobId} isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange}
                    title={"Are you sure you want to delete this job?"} />
                <ModalExcel data={dataExcel} fetchSource={fetchAddJob} isOpen={isOpenExcelModal} onOpenChange={onOpenChangeExcelModal}
                    title={"Confirm Job Information in Excel"} />

            </div>
        </>
    )
}

export default JobListPage


