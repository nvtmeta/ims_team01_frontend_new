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
import { useStoreBreadCrumbName, useStoreMenuName } from '@/util/zustandStorage'
import ModalComponent from '@/components/ModalComponent'
import { formatCandidateStatus, formatUserStatus, getColorByStatus, getColorByUserStatus } from '@/util/FormatEnum'
import useSWR, { mutate } from 'swr'
import SpinnerLoading from '@/util/SpinnerLoading'
import { CandidateStatusEnum } from '@/enum/CandidateEnum'
import toast from 'react-hot-toast'
import Select from 'react-select';
import { SelectInterface } from '@/interface/SelectInterface'
import { SearchIcon } from "@/icons/SearchIcon";
import { fetchUserList } from "@/api/UserApi";
import { UserListInterface, UserResponseInterface } from "@/interface/UserInterface";
import { statusList } from "@/store/ListCandidate";
import { selectStyles } from "@/css/SelectStyle";
import { useRouter } from '@/components/usePRouter'
import { SIZE } from '@/constant/ListConstant'
import { fetchSkillListApi } from '@/api/DropdownApi'
//TODO: change avatar roles

export const roleImages: { [key: string]: string } = {
    INTERVIEWER: "https://cdn-icons-png.freepik.com/256/7339/7339268.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid",
    RECRUITER: "https://cdn-icons-png.freepik.com/256/6818/6818244.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid",
    MANAGER: "https://cdn-icons-png.freepik.com/256/8955/8955147.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid",
    ADMIN: "https://cdn-icons-png.freepik.com/256/6024/6024190.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid",
    DEFAULT: "https://cdn-icons-png.freepik.com/256/2503/2503707.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid"
};

const UserListPage = () => {
    const router = useRouter()
    const [currentPage, setCurrentPage] = React.useState(1);
    const [roleSearched, setRoleSearched] = useState({ label: 'All' } as SelectInterface);
    const [searchValue, setSearchValue] = React.useState("");
    const [isSearched, setIsSearched] = useState(false);
    const {
        data: roleList,
        error: roleListError,
        isLoading: roleListIsLoading
    } = useSWR<SelectInterface[]>(`/dropdown/roles`, fetchSkillListApi)

    const { data, error, isLoading } = useSWR<UserResponseInterface>(
        useMemo(() => {
            let url = `/user?size=${SIZE}&page=${currentPage - 1}`;
            if (searchValue) {
                url += `&q=${searchValue}`;
            }
            if (roleSearched?.value) {
                url += `&role=${roleSearched.value}`;
            }
            return url;
        }, [currentPage, isSearched]) // Re-run useSWR on state changes
        , fetchUserList);

    const setMenuName = useStoreMenuName(
        (state: any) => state.setMenuName
    );

    const handleRouter = (slug: string) => {
        router.push(slug)
        setMenuName("User Management")
    }

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();


    const setBreadCrumbName = useStoreBreadCrumbName(
        (state: any) => state.setBreadCrumbName
    )

    const handleEdit = (item: UserListInterface) => {
        router.push(`/user/edit/${item?.id}`)
        setBreadCrumbName(`List user management`)
    }


    const [candidateId, setCandidateId] = useState(0)
    const handlePopup = (candidateId: number) => {
        onOpen();
        setCandidateId(candidateId)
    }


    const handleSearch = () => {
        console.log("statusSearched", roleSearched)
        console.log("searchValue", searchValue)
        setIsSearched(!isSearched)
        // mutate(`/candidate?size=${5}&page=${currentPage - 1}&status=${statusSearched?.value}&q=${searchValue}`);
    }


    return (
        <>
            <Breadcrumbs className='mx-6 ' variant='solid' radius='full'>
                <BreadcrumbItem onClick={() => router.push("/candidate/candidate-list")} size='lg'
                    className='font-bold'>User List</BreadcrumbItem>
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
                        placeholder="Select an role" // Your placeholder text here
                        styles={selectStyles}
                        value={roleSearched}
                        onChange={setRoleSearched as any}
                        options={roleList as any}
                    />

                    {/* search */}
                    <Button onPress={handleSearch} size='lg' className=' font-medium p-4 bg-gray-500 text-white '>
                        Search
                    </Button>
                </div>

                {/* search */}
                <Button onPress={() => handleRouter("/user/user-create")} size='lg'
                    className='bg-gradient-to-r w-44 from-sky-400 to-blue-500 font-medium p-4 text-white '>
                    Add new
                </Button>
            </div>

            <div className='bg-white p-10 m-6 rounded-3xl'>
                <table className="w-full ">
                    <thead>
                        <tr className="bg-gradient-to-r rounded-xl  from-sky-400 to-blue-500  text-left text-xs
                             font-semibold uppercase tracking-widest text-white">
                            <th className="pr-5 pl-4 py-3 rounded-tl-lg">Username</th>
                            <th className="pr-5 py-3">Email</th>
                            <th className="pr-5 py-3">Phone No.</th>
                            <th className="pr-5 py-3">Role</th>
                            <th className="pr-5 py-3">Status</th>
                            <th className="pr-5 py-3  rounded-tr-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-500 ">
                        {data?.content?.map((item: UserListInterface, index: number) => {
                            return (
                                <tr key={index} className={`hover:bg-slate-100 transition rounded-xl  border-2 cursor-pointer  `}>
                                    {/* name */}
                                    <td onClick={() => router.push(`/user/${item?.id}`)}
                                        className="border-b border-gray-200 text-sm ">
                                        <p className="font-medium flex items-center gap-2 px-2 py-4 text-lg ">
                                            {item?.username}
                                        </p>
                                    </td>
                                    {/* email */}
                                    <td onClick={() => router.push(`/user/${item?.id}`)}
                                        className="border-b border-gray-200  gap-3 justify-start   text-sm ">
                                        <p className="font-medium   py-4 text-lg ">
                                            {item?.email}
                                        </p>
                                    </td>
                                    {/* phone */}
                                    <td onClick={() => router.push(`/user/${item?.id}`)}
                                        className=" border-b border-gray-200   gap-3 justify-start  text-sm ">
                                        <p className="font-medium    py-4 text-lg ">
                                            {item?.phone || "N/A"}
                                        </p>
                                    </td>
                                    <td onClick={() => router.push(`/user/${item?.id}`)}
                                        className=" border-b font-medium text-xl border-gray-200 ">
                                        {item.roles[0]}
                                    </td>
                                    {/* status */}
                                    <td onClick={() => router.push(`/user/${item?.id}`)}
                                        className=" border-b border-gray-200   text-sm ">
                                        <Chip size='sm' variant='solid'
                                            color={getColorByUserStatus(item?.status) as ("primary" | "default" | "secondary" | "success" | "warning" | "danger")} // Type assertion
                                            className="font-medium   py-4  text-lg ">
                                            {formatUserStatus(item?.status)}
                                        </Chip>
                                    </td>
                                    {/* updated date*/}
                                    <td className='flex py-4 items-center justify-start gap-5'>
                                        <img className='w-10 h-10 hover:scale-90 transition'
                                            onClick={() => router.push(`/user/${item?.id}`)}
                                            src='https://cdn-icons-png.freepik.com/256/4740/4740895.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid' />
                                        <img className='w-8 h-8 hover:scale-90 transition rounded-none'
                                            onClick={() => handleEdit(item)}
                                            src='https://cdn-icons-png.freepik.com/256/10337/10337458.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid' />
                                        {item.status == CandidateStatusEnum.OPEN &&
                                            <img className='w-8 h-8 hover:scale-90 transition'
                                                onClick={() => handlePopup(item.id)}
                                                src='https://cdn-icons-png.freepik.com/256/6861/6861362.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid' />
                                        }
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

            </div>
        </>
    )
}

export default UserListPage


