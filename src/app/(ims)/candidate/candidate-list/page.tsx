"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { BreadcrumbItem, Breadcrumbs, Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Input, Pagination, Spinner, useDisclosure } from '@nextui-org/react'
import { CandidateInterface, CandidateResponseInterface } from '@/interface/CandidateInterface'
import { fetchCandidateDelete, fetchCandidatePage, fetchCandidateSwr } from '@/api/CandidateApi'
import { useStoreBreadCrumbName, useStoreMenuName } from '@/util/zustandStorage'
import ModalComponent from '@/components/ModalComponent'
import { formatCandidateStatus, getColorByStatus } from '@/util/FormatEnum'
import useSWR, { mutate } from 'swr'
import SpinnerLoading from '@/util/SpinnerLoading'
import { CandidateStatusEnum } from '@/enum/CandidateEnum'
import toast from 'react-hot-toast'
import Select from 'react-select';
import { SelectInterface } from '@/interface/SelectInterface'
import { SearchIcon } from "@/icons/SearchIcon";
import { statusList } from "@/store/ListCandidate";
import { selectStyles } from "@/css/SelectStyle";
import { useRouter } from '@/components/usePRouter'
import useUserData from '@/hooks/userLocalStorage'
import { UserRoleEnum } from '@/enum/UserRoleEnum'
import { SIZE } from '@/constant/ListConstant'


const CandidateList = () => {
    const router = useRouter()
    const { userData, checkRole } = useUserData()
    const [currentPage, setCurrentPage] = React.useState(1);
    // search
    const [statusSearched, setStatusSearched] = useState({ label: 'All' } as SelectInterface);
    const [searchValue, setSearchValue] = React.useState("");
    // const { data, error, isLoading } =
    //     useSWR<CandidateResponseInterface>(`/candidate?size=${5}&page=${currentPage - 1}&q=${searchValue}&status=${statusSearched?.value || ''}`,
    //         fetchCandidateSwr)
    const [isSearched, setIsSearched] = useState(false);

    const { data, error, isLoading } = useSWR<CandidateResponseInterface>(
        useMemo(() => {
            let url = `/candidate?size=${SIZE}&page=${currentPage - 1}`;
            if (searchValue) {
                url += `&q=${searchValue}`;
            }
            if (statusSearched?.value) {
                url += `&status=${statusSearched.value}`;
            }
            return url;
        }, [currentPage, isSearched]) // Re-run useSWR on state changes
        , fetchCandidateSwr);

    const setMenuName = useStoreMenuName(
        (state: any) => state.setMenuName
    );

    const handleRouter = (slug: string) => {
        router.push(slug)
        // NProgress.start();
        setMenuName("Candidate")
    }

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();



    const setBreadCrumbName = useStoreBreadCrumbName(
        (state: any) => state.setBreadCrumbName
    )

    const handleEdit = (item: CandidateInterface) => {
        router.push(`/candidate/edit/${item?.id}`)
        setBreadCrumbName(`Candidate list`)
    }


    const [candidateId, setCandidateId] = useState(0)
    const handlePopup = (candidateId: number) => {
        onOpen();
        setCandidateId(candidateId)
    }

    const handleDeleteById = async () => {
        await fetchCandidateDelete(candidateId);
        mutate(`/candidate?size=${SIZE}&page=${currentPage - 1}`);
        toast.success("Delete candidate success !")
        onClose()
    }



    const handleSearch = () => {
        console.log("statusSearched", statusSearched)
        console.log("searchValue", searchValue)
        setIsSearched(!isSearched)
        // mutate(`/candidate?size=${5}&page=${currentPage - 1}&status=${statusSearched?.value}&q=${searchValue}`);
    }


    const role = checkRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.INTERVIEWER)

    // candidate FIXME:fix up file, download file
    return (
        <>
            <Breadcrumbs className='mx-6 ' variant='solid' radius='full'>
                <BreadcrumbItem onClick={() => router.push("/candidate/candidate-list")} size='lg' className='font-bold'>Candidate List</BreadcrumbItem>
            </Breadcrumbs>
            <div className='m-6  rounded-2xl p-3 flex items-center justify-between gap-2'>
                <div className='flex gap-3'>
                    <Input
                        variant='bordered'
                        size='lg'
                        radius="lg"
                        className='w-96 rounded-xl bg-white border-none'
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
                        styles={selectStyles}
                        value={statusSearched}
                        onChange={setStatusSearched as any}
                        options={statusList as any}
                    />

                    {/* search */}
                    <Button onPress={handleSearch} size='lg' className=' font-medium p-4 bg-gray-500 text-white '>
                        Search
                    </Button>
                </div>

                {/* search */}

                {checkRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.RECRUITER) &&
                    <>
                        <Button onPress={() => handleRouter("/candidate/candidate-create")} size='lg' className='bg-gradient-to-r w-44 from-sky-400 to-blue-500 font-medium p-4 text-white '>
                            Add new
                        </Button>
                    </>

                }

            </div>

            <div className='bg-white p-10 m-6 rounded-3xl'>
                <table className="w-full ">
                    <thead>
                        <tr className="bg-gradient-to-r rounded-xl  from-sky-400 to-blue-500 text-left text-xs
                             font-semibold uppercase tracking-widest text-white">
                            <th className="pr-5 pl-4 py-3 rounded-tl-lg">Name</th>
                            <th className="pr-5 py-3">Phone No.</th>
                            <th className="pr-5 py-3">Email</th>
                            <th className="pr-5 py-3">Current Position</th>
                            <th className="pr-5 py-3">Owner HR</th>
                            <th className="pr-5 py-3">Status</th>
                            <th className="pr-5 py-3  rounded-tr-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-500 ">

                        {data?.content?.map((item: CandidateInterface, index: number) => {
                            return (
                                <tr key={index} className={`hover:bg-slate-100 transition rounded-xl  border-2 cursor-pointer  `}>
                                    {/* name */}
                                    <td onClick={() => router.push(`/candidate/${item?.id}`)} className="border-b  border-gray-200 text-sm ">
                                        <div className="font-medium flex items-center gap-2 pl-4 py-4 text-lg ">
                                            <span className=''>
                                                {item?.fullName}
                                            </span>
                                        </div>
                                    </td>

                                    {/* phone */}
                                    <td onClick={() => router.push(`/candidate/${item?.id}`)} className=" border-b border-gray-200   gap-3 justify-start  text-sm ">
                                        <p className="font-medium   py-4 text-lg ">
                                            {item?.phone || "N/A"}
                                        </p>
                                    </td>
                                    {/* email */}
                                    <td onClick={() => router.push(`/candidate/${item?.id}`)} className="border-b border-gray-200  gap-3 justify-start   text-sm ">
                                        <p className="font-medium   py-4 text-lg ">
                                            {item?.email}
                                        </p>
                                    </td>


                                    {/* current_position */}
                                    <td onClick={() => router.push(`/candidate/${item?.id}`)} className=" border-b border-gray-200   text-sm ">

                                        <p className="font-medium    py-4 text-lg ">
                                            {item?.positionName || "N/A"}
                                        </p>
                                    </td>
                                    {/* owner-Hr */}
                                    <td onClick={() => router.push(`/candidate/${item?.id}`)} className=" border-b border-gray-200   text-sm ">
                                        <p className="font-medium   py-4 text-lg ">
                                            {item?.recruiterName || "N/A"}
                                        </p>
                                    </td>

                                    {/* status */}
                                    <td onClick={() => router.push(`/candidate/${item?.id}`)} className="text-center border-b border-gray-200   text-sm ">
                                        <Chip size='sm' variant='solid' color={getColorByStatus(item?.status) as ("primary" | "default" | "secondary" | "success" | "warning" | "danger")} // Type assertion
                                            className="font-medium  py-4  text-lg ">
                                            {formatCandidateStatus(item?.status)}
                                        </Chip>
                                    </td>
                                    {/* updated date*/}
                                    <td className='flex py-4 items-center justify-start gap-5'>
                                        <img className='w-10 h-10 hover:scale-90 transition' onClick={() => router.push(`/candidate/${item?.id}`)} src='https://cdn-icons-png.freepik.com/256/4740/4740895.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid' />
                                        {checkRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.RECRUITER) &&
                                            <>
                                                <img className='w-8 h-8 hover:scale-90 transition rounded-none'
                                                    onClick={() => handleEdit(item)}
                                                    src='https://cdn-icons-png.freepik.com/256/10337/10337458.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid' />
                                                {item.status == CandidateStatusEnum.OPEN &&
                                                    <img className='w-8 h-8 hover:scale-90 transition'
                                                        onClick={() => handlePopup(item.id)}
                                                        src='https://cdn-icons-png.freepik.com/256/6861/6861362.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid' />
                                                }
                                            </>

                                        }
                                    </td>

                                </tr>
                            )
                        })}

                    </tbody>
                </table>

                <SpinnerLoading data={data} isLoading={isLoading} error={error} />
                {/* pagination */}
                {searchValue !== null && data?.totalElements == 0 && <p className='text-center font-medium'>
                    No item matches with your search data. Please try
                    again</p>}

                {(isLoading || data?.totalElements !== 0) && <Pagination
                    page={currentPage}
                    onChange={setCurrentPage}
                    className='mt-10 flex justify-center' size='lg' total={data?.totalPages || 100} initialPage={1} />}
                <ModalComponent fetchSource={handleDeleteById} candidateId={candidateId} isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange}
                    title={"Are you sure you want to delete this candidate?"} />
            </div>
        </>
    )
}

export default CandidateList


