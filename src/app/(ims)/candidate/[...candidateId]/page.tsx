"use client"

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { GrView } from 'react-icons/gr'
import { MdKeyboardArrowDown, MdOutlineDelete } from 'react-icons/md'
import { BreadcrumbItem, Breadcrumbs, Button, Chip, Code, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Input, Link, Pagination, Skeleton, Textarea, useDisclosure } from '@nextui-org/react'
import { fetchCandidateBan, fetchCandidateById } from '@/api/CandidateApi';
import { CandidateInterface, CandidateInterfaceDetail } from '@/interface/CandidateInterface';
import useSWR, { mutate } from 'swr';
import SpinnerLoading from '@/util/SpinnerLoading';
import { formatCandidateGender, formatHighestLevel, getColorByStatus } from '@/util/FormatEnum';
import { DropdownInterface } from '@/interface/DropdownInterface';
import useFormattedDate from '@/hooks/useFormattedDate';
import { SelectInterface } from '@/interface/SelectInterface';
import { useStoreBreadCrumbName } from '@/util/zustandStorage';
import ModalComponent from '@/components/ModalComponent';
import toast from 'react-hot-toast';
import { CandidateStatusEnum } from '@/enum/CandidateEnum';
import useUserData from '@/hooks/userLocalStorage';
import { UserRoleEnum } from '@/enum/UserRoleEnum';
import { FormatDate } from '@/util/FormatDate';
import { AnchorIcon } from '@/icons/AnchorIcon';


const CandidateView = () => {
    const { candidateId } = useParams();
    const { userData, checkRole } = useUserData()
    const router = useRouter()
    const { data: candidateData, error, isLoading: isCandidateLoading } = useSWR<CandidateInterfaceDetail>(`/candidate/${candidateId}`, fetchCandidateById)
    const formattedCreatedDate = useFormattedDate(candidateData?.createdDate || "");
    const formattedUpdatedDate = useFormattedDate(candidateData?.updatedDate || "");

    const setBreadCrumbName = useStoreBreadCrumbName(
        (state: any) => state.setBreadCrumbName
    )
    const handleEdit = () => {
        router.push(`/candidate/edit/${candidateId}`)
        setBreadCrumbName(`View Candidate information`)
    }

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const handlePopup = () => {
        onOpen();
    }

    const [isBanned, setIsBanned] = useState(false)
    const handleBanById = async () => {
        await fetchCandidateBan(Number(candidateId));
        toast.success("Ban candidate success !")
        router.push(`/candidate/${candidateId}`)
        onClose()
        setIsBanned(true)
    }
    return (
        <div className='mt-10 '>
            <div className='flex gap-3 mr-10 ml-4 justify-between '>
                <Breadcrumbs className='mx-6 mb-4' variant='solid' radius='full'>
                    <BreadcrumbItem onClick={() => router.push("/candidate/candidate-list")} size='lg' className='font-bold'>Candidate List</BreadcrumbItem>
                    <BreadcrumbItem size='lg' className='font-bold'>Candidate information</BreadcrumbItem>
                </Breadcrumbs>
                {(candidateData?.status != CandidateStatusEnum.BANNED
                    && !isBanned
                    && checkRole(UserRoleEnum.ADMIN, UserRoleEnum.RECRUITER, UserRoleEnum.MANAGER)) &&
                    <Button onPress={handlePopup} color='danger'>
                        <Image className='w-4 h-4 rounded-none' src='https://cdn-icons-png.freepik.com/256/11424/11424039.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid' />
                        <span>Ban candidate</span>
                    </Button>
                }
                <ModalComponent fetchSource={handleBanById} candidateId={Number(candidateId)} isOpen={isOpen}
                    onOpen={onOpen} onOpenChange={onOpenChange}
                    title={"Are you sure you want to ban this candidate?"} />
            </div>
            {/* {!candidateData ?
                < SpinnerLoading data={candidateData} isLoading={isLoading} error={error} />
                    } */}
            {/* personal info */}
            <form className='mx-10 p-6 rounded-xl bg-white'>
                <div className='flex justify-between'>
                    <p className='text-blue-500 font-medium mb-4 text-xl'>I. Personal Information</p>
                    <Code color='warning'>
                        Created on {formattedCreatedDate},
                        last updated by {candidateData?.author?.label} {formattedUpdatedDate}
                    </Code>
                </div>
                <div className='flex justify-between'>

                    {/* left */}
                    <div>
                        <div className='flex items-center '>
                            <label className='w-32 font-bold' htmlFor='fullName'>Full Name {" "}
                                <span className='text-red-500 '>*</span>
                            </label>

                            <Skeleton isLoaded={!isCandidateLoading} className="min-w-44 min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium p-2 '>
                                    {candidateData?.fullName}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center mt-3'>
                            <label className='w-32 font-bold' htmlFor='dob'>D.O.B {" "}
                            </label>
                            <Skeleton isLoaded={!isCandidateLoading} className="min-w-44 min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {(FormatDate(candidateData?.dob as string)) || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center mt-3'>
                            <label className='w-32 font-bold' htmlFor='phone'>Phone number{" "}
                            </label>
                            <Skeleton isLoaded={!isCandidateLoading} className="min-w-44 min-h-8 rounded-lg">
                                <p className='text-gray-600  font-medium  p-2 '>
                                    {candidateData?.phone || "N/A"}
                                </p>
                            </Skeleton>

                        </div>

                    </div>
                    {/* right */}
                    <div className='flex flex-col gap-3 w-[30rem]'>
                        <div className='flex items-center'>
                            <label className='w-32 font-bold' htmlFor='email'>Email {" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Skeleton isLoaded={!isCandidateLoading} className="min-w-44 min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {candidateData?.email}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center '>
                            <label className='w-32 font-bold' htmlFor='address'>Address {" "}
                            </label>
                            <Skeleton isLoaded={!isCandidateLoading} className="min-w-44 min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {candidateData?.address || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center '>
                            <label className='w-32 font-bold' htmlFor='gender'>Gender{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Skeleton isLoaded={!isCandidateLoading} className="min-w-24 min-h-8 rounded-full">
                                <Chip color='secondary' className='text-white    font-medium  p-2'>
                                    {formatCandidateGender(candidateData?.gender || "N/A")}
                                </Chip>
                            </Skeleton>
                        </div>

                    </div>
                </div>
                {/* II. professional information */}

                <p className='text-blue-500 mt-8 text-xl font-medium mb-4 '>
                    II. Professional information</p>
                <div className='flex justify-between'>
                    {/* left */}
                    <div>
                        <div className='flex items-center'>
                            <label className='w-32 font-bold' htmlFor='fullName'>CV Attachment {" "}
                            </label>
                            <div className="flex items-center p-2 bg-slate-50 justify-between max-w-96 rounded-xl">
                                <Link
                                    showAnchorIcon
                                    href={candidateData?.cvAttachment}
                                    anchorIcon={<AnchorIcon />}
                                    target="_blank"
                                >
                                    {/* @ts-ignore */}
                                    {candidateData?.cvAttachment ? candidateData.cvAttachment!.match(/%2F([^?]+)\?/)[1].replace(/_(.*)$/, '') : ''}
                                </Link>
                            </div>
                        </div>
                        <div className='flex items-center mt-4'>
                            <label className='w-32 font-bold' htmlFor='position'>Position {" "}
                                <span className='text-red-500'>*</span>
                            </label>
                            <Skeleton isLoaded={!isCandidateLoading} className="min-w-44 min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {candidateData?.position?.label || "N/A"}
                                </p>
                            </Skeleton>

                        </div>

                        <div className='flex items-center mt-4'>
                            <label className='w-32 font-bold' htmlFor='phone'>Skills{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Skeleton isLoaded={!isCandidateLoading} className="min-w-44 min-h-8 rounded-lg">
                                <div className='flex flex-wrap w-96 gap-3'>
                                    {candidateData?.skills?.map((skill: SelectInterface) => (
                                        <Chip color='success' className='text-white'>
                                            {skill.label}
                                        </Chip>
                                    ))}
                                    {candidateData?.skills?.length == 0 && <Chip>"N/A"</Chip>}

                                </div>
                            </Skeleton>
                        </div>
                        <div className='flex items-center mt-6'>
                            <label className='w-32 font-bold' htmlFor='recruiter'>Recruiter {" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Skeleton isLoaded={!isCandidateLoading} className="min-w-44 min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {candidateData?.recruiter?.label || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                    </div>
                    {/* right */}
                    <div className='flex flex-col gap-3 w-[30rem]'>
                        <div className='flex items-center gap-2'>
                            <label className='w-28 font-bold' htmlFor='note'>Note: {" "}
                            </label>
                            <Skeleton isLoaded={!isCandidateLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='bg-slate-100 rounded-xl max-w-96 p-3'>
                                    {candidateData?.note || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center mt-4'>
                            <label className='w-32 font-bold' htmlFor='position'>Status {" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Skeleton isLoaded={!isCandidateLoading} className="min-w-44 min-h-8 rounded-lg">
                                <Chip color={getColorByStatus(candidateData?.status || "") as ("primary" | "default" | "secondary" | "success" | "warning" | "danger")}
                                    className='p-2 '>
                                    {candidateData?.status}
                                </Chip>
                            </Skeleton>
                        </div>
                        <div className='flex items-center'>
                            <label className='w-32 font-bold' htmlFor='gender'>Year of Experience {" "}
                            </label>
                            <Skeleton isLoaded={!isCandidateLoading} className="min-w-44 min-h-8 rounded-lg">
                                <p className='text-gray-600 font-bold  p-2 '>
                                    {candidateData?.yoe || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center mt-4'>
                            <label className='w-32 font-bold' htmlFor='position'>Highest level {" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Skeleton isLoaded={!isCandidateLoading} className="min-w-44 min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {formatHighestLevel(candidateData?.highestLevel || "N/A")}
                                </p>
                            </Skeleton>

                        </div>
                    </div>
                </div>

                {/* submit */}
                <div className="flex justify-center mt-10 space-x-2">
                    {checkRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.RECRUITER) &&
                        <Button onPress={() => handleEdit()} size='lg' className="grid  cursor-pointer select-none rounded-md border 
                          bg-gradient-to-r from-sky-400 to-blue-500 bg-indigo-500 py-2 px-5 
                          text-center align-middle text-sm text-white shadow font-bold
                          hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600
                       focus:bg-indigo-600 focus:text-white focus:shadow-none">
                            Edit
                        </Button>
                    }
                    <Button onPress={() => router.push("/candidate/candidate-list")} size='lg' className="grid  cursor-pointer select-none rounded-md 
                                     py-2 px-5 
                                text-center align-middle text-sm text-black hover:bg-slate-100   font-bold
                                  focus:shadow-none">Cancel</Button>
                </div>

            </form >
        </div >
    )
}

export default CandidateView