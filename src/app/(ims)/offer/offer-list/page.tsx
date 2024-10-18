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
import { formatCandidateStatus, formatInterviewResult, formatInterviewStatus, formatJobStatus, formatOfferStatus, formatUserStatus, getColorByInterviewStatus, getColorByJobStatus, getColorByOfferStatus, getColorByStatus, getColorByUserStatus } from '@/util/FormatEnum'
import useSWR, { mutate } from 'swr'
import SpinnerLoading from '@/util/SpinnerLoading'
import { CandidateStatusEnum } from '@/enum/CandidateEnum'
import toast from 'react-hot-toast'
import Select from 'react-select';
import { SelectInterface } from '@/interface/SelectInterface'
import { SearchIcon } from "@/icons/SearchIcon";
import { fetchUserList } from "@/api/UserApi";
import { UserListInterface, UserResponseInterface } from "@/interface/UserInterface";
import { JobStatusList, OfferStatusList, interviewStatusList, statusList } from "@/store/ListCandidate";
import { selectStyles, selectStylesSearch } from "@/css/SelectStyle";
import { useRouter } from '@/components/usePRouter'
import { SIZE } from '@/constant/ListConstant'
import { fetchDepartmentListApi, fetchSkillListApi } from '@/api/DropdownApi'
import { InterviewListInterface, InterviewResponseInterface } from '@/interface/InterviewInterface'
import { fetchInterviewList } from '@/api/interviewScheduleApi'
import { FormatDate, FormatDateTimeRange } from '@/util/FormatDate'
import { Truncate } from '@/util/truncate'
import useUserData from '@/hooks/userLocalStorage'
import { UserRoleEnum } from '@/enum/UserRoleEnum'
import SelectInterviewers from '@/components/interview/SelectInterviewers'
import { JobListInterface, JobResponseInterface } from '@/interface/JobInterface'
import { fetchJobDelete, fetchJobList } from '@/api/JobApi'
import messages from '@/messages/messages'
import { OfferListInterface, OfferResponseInterface } from '@/interface/OfferInterface'
import { fetchOfferList } from '@/api/OfferApi'
import ModalExportExcel from '@/components/ModalExportOffer'
import * as XLSX from 'xlsx';


const OfferListPage = () => {
    const router = useRouter()
    const [currentPage, setCurrentPage] = React.useState(1);
    const [statusSearched, setStatusSearched] = useState({ label: 'All' } as SelectInterface);
    const [departmentSearched, setDepartmentSearched] = useState({ label: 'All' } as SelectInterface);
    const [searchValue, setSearchValue] = React.useState("");
    const [isSearched, setIsSearched] = useState(false);

    const { checkRole } = useUserData()

    const {
        data: departmentList,
        error: departmentListError,
        isLoading: departmentListIsLoading
    } = useSWR<SelectInterface[]>(`/dropdown/departments`, fetchDepartmentListApi)


    const { data, error, isLoading } = useSWR<OfferResponseInterface>(
        useMemo(() => {
            let url = `/offer?size=${SIZE}&page=${currentPage - 1}`;
            if (searchValue) {
                url += `&q=${searchValue}`;
            }
            if (statusSearched?.value) {
                url += `&status=${statusSearched.value}`;
            }
            if (departmentSearched?.value) {
                url += `&departmentId=${departmentSearched.value}`;
            }
            console.log("url", url)
            return url;
        }, [currentPage, isSearched]) // Re-run useSWR on state changes
        , fetchOfferList);

    const setMenuName = useStoreMenuName(
        (state: any) => state.setMenuName
    );

    const handleRouter = (slug: string) => {
        router.push(slug)
        setMenuName("Offer")
    }


    const setBreadCrumbName = useStoreBreadCrumbName(
        (state: any) => state.setBreadCrumbName
    )
    const setBreadCrumbMainName = useStoreBreadCrumbMainName(
        (state: any) => state.setBreadCrumbMainName
    )

    const handleEdit = (item: OfferListInterface, name: string) => {
        router.push(`/offer/edit/${item?.id}`)
        setBreadCrumbName("Offer list")
        setBreadCrumbMainName(name)
    }



    const handleSearch = () => {
        setIsSearched(!isSearched)
    }
    const isInterviewer = !checkRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.RECRUITER)
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const handlePopup = () => {
        onOpen();
    }
    const handleExportOffer = async (data: any) => {

        const dataOffer = await fetchOfferList(`/offer?size=${50}&page=${currentPage - 1}?
        contractFromDate=${data.contractFromDate}&contractToDate=${data.contractToDate}`)
        console.log("dataOffer", dataOffer)
        const dataForSheet = dataOffer.content.map((item: any) => ({
            candidateName: item.candidateName,
            department: item.department,
            email: item.email,
            status: item.status,
            contractFromDate: item.contractFromDate,
            contractToDate: item.contractToDate
        }));

        const sheet = XLSX.utils.json_to_sheet(dataForSheet);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

        const fromDate = data.contractFromDate;
        const toDate = data.contractToDate;
        const filename = `Offerlist-${fromDate}_${toDate}.xlsx`;

        XLSX.writeFile(workbook, filename);

        toast.success("Export excel success !")
        onClose();
    }

    return (
        <>
            <Breadcrumbs className='mx-6 ' variant='solid' radius='full'>
                <BreadcrumbItem onClick={() => router.push("/offer/offer-list")} size='lg'
                    className='font-bold'>Offer List</BreadcrumbItem>
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
                        placeholder="Select department" // Your placeholder text here
                        styles={selectStylesSearch}
                        value={departmentSearched}
                        onChange={setDepartmentSearched as any}
                        options={departmentList as any}
                    />
                    <Select
                        isClearable
                        placeholder="Select status" // Your placeholder text here
                        styles={selectStylesSearch}
                        value={statusSearched}
                        onChange={setStatusSearched as any}
                        options={OfferStatusList as any}
                    />
                    {/* search */}
                    <Button onPress={handleSearch} size='lg' className=' font-medium p-4 bg-gray-500 text-white '>
                        Search
                    </Button>
                </div>
                <div>
                    <Button onPress={() => handleRouter("/offer/offer-create")} size='lg' className='bg-gradient-to-r w-44 mr-4 from-sky-400 to-blue-500 font-medium p-4 text-white '>
                        Add new
                    </Button>
                    {!isInterviewer && <Button onPress={handlePopup} size='lg' variant='shadow'
                        className=' font-medium p-4 w-44 '>
                        Export
                    </Button>}
                </div>

            </div>

            <div className='bg-white p-10 m-6 rounded-3xl'>
                <table className="w-full ">
                    <thead>
                        <tr className="bg-gradient-to-r rounded-xl  from-sky-400 to-blue-500  text-left text-xs
                             font-semibold uppercase tracking-widest text-white">
                            <th className="pr-5 pl-4 py-3 rounded-tl-lg">Candidate name</th>
                            <th className="pr-5 py-3">Email</th>
                            <th className="pr-5 py-3">Approver </th>
                            <th className="pr-5 py-3">Department</th>
                            <th className="pr-5 py-3">Notes</th>
                            <th className="pr-5 py-3">Status</th>
                            <th className="pr-5 py-3  rounded-tr-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-500 ">
                        {data?.content?.map((item: OfferListInterface, index: number) => {
                            return (
                                <tr key={index} className={`hover:bg-slate-100 transition rounded-xl  border-2 cursor-pointer  `}>
                                    <td onClick={() => router.push(`/offer/${item?.id}`)}
                                        className="border-b border-gray-200 text-sm ">
                                        <p className="font-medium flex items-center gap-2 px-2 py-4 text-lg ">
                                            {item?.candidateName || "N/A"}
                                        </p>
                                    </td>
                                    <td onClick={() => router.push(`/offer/${item?.id}`)}
                                        className="border-b border-gray-200  gap-3 justify-start   text-sm ">
                                        <p className="font-medium   py-4 text-lg ">
                                            {item?.email || "N/A"}
                                        </p>
                                    </td>
                                    <td onClick={() => router.push(`/offer/${item?.id}`)}
                                        className=" border-b border-gray-200   gap-3 justify-start  text-sm ">
                                        <p className="font-medium    py-4 text-lg ">
                                            {item?.approver || "N/A"}
                                        </p>
                                    </td>
                                    <td onClick={() => router.push(`/offer/${item?.id}`)}
                                        className=" border-b font-medium border-gray-200  text-lg ">
                                        <p>
                                            {item?.department || "N/A"}
                                        </p>
                                    </td>
                                    <td onClick={() => router.push(`/offer/${item?.id}`)}
                                        className=" border-b font-medium border-gray-200  text-lg ">
                                        <p>
                                            {item?.note || "N/A"}
                                        </p>
                                    </td>
                                    {/* status */}
                                    <td onClick={() => router.push(`/offer/${item?.id}`)}
                                        className=" border-b border-gray-200   text-sm ">
                                        <Chip size='sm' variant='solid'
                                            color={getColorByOfferStatus(item?.status) as ("primary" | "default" | "secondary" | "success" | "warning" | "danger")} // Type assertion
                                            className="font-medium   py-4  text-lg ">
                                            {formatOfferStatus(item?.status)}
                                        </Chip>
                                    </td>
                                    {/* updated date*/}
                                    <td className='flex py-4 items-center justify-start gap-5'>
                                        <img className='w-10 h-10 hover:scale-90 transition'
                                            onClick={() => router.push(`/offer/${item?.id}`)}
                                            src='https://cdn-icons-png.freepik.com/256/4740/4740895.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid' />
                                        <img className='w-8 h-8 hover:scale-90 transition rounded-none'
                                            onClick={() => handleEdit(item, 'Edit Offer details')}
                                            src='https://cdn-icons-png.freepik.com/256/10337/10337458.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid' />
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
                <SpinnerLoading data={data} isLoading={isLoading} error={error} />

                {/* pagination */}
                {searchValue !== null && data?.totalElements == 0 && <p className='text-center mt-4 font-medium'>
                    No Offer has been found</p>}

                {(isLoading || data?.totalElements !== 0) && <Pagination
                    page={currentPage}
                    onChange={setCurrentPage}
                    className='mt-10 flex justify-center z-0' size='lg' total={data?.totalPages || 100} initialPage={1} />}
                <ModalExportExcel handleSubmitExport={handleExportOffer} isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange}
                    title={"Are you sure you want to cancel this offer?"} />

            </div>
        </>
    )
}

export default OfferListPage


