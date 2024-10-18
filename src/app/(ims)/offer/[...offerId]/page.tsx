"use client"

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Chip,
    Code,
    Skeleton,
    useDisclosure,
} from '@nextui-org/react'
import useSWR, { mutate } from 'swr';
import SpinnerLoading from '@/util/SpinnerLoading';
import {
    ToggleUserActive,
    formatCandidateGender,
    formatContractType,
    formatHighestLevel,
    formatInterviewStatus,
    formatOfferStatus,
    formatUserGender, formatUserStatus,
    getColorByInterviewStatus,
    getColorByOfferStatus,
    getColorByStatus,
    getColorByUserStatus,
    getColorToggleUserActive
} from '@/util/FormatEnum';
import { useStoreBreadCrumbMainName, useStoreBreadCrumbName } from '@/util/zustandStorage';
import { UserDetailInterface, UserResponseInterface } from "@/interface/UserInterface";
import { fetchUserById, fetchUserToggleStatus } from "@/api/UserApi";
import { SelectInterface } from '@/interface/SelectInterface';
import toast from 'react-hot-toast';
import { FormatDate, FormatTime } from '@/util/FormatDate';
import { fetchInterviewById, fetchInterviewReminder } from '@/api/interviewScheduleApi';
import { InterviewDetailInterface } from '@/interface/InterviewInterface';
import useUserData from '@/hooks/userLocalStorage';
import { UserRoleEnum } from '@/enum/UserRoleEnum';
import useFormattedDate from '@/hooks/useFormattedDate';
import { IsCurrentUserInterviewer } from '@/util/isCurrentUserInterviewer';
import Link from 'next/link';
import { OfferDetailInterface } from '@/interface/OfferInterface';
import { OfferStatusEnum } from '@/enum/OfferEnum';
import { fetchOfferAcceptOffer, fetchOfferApprove, fetchOfferCancelOffer, fetchOfferDeclineOffer, fetchOfferMarkSendCandidate, fetchOfferReject } from '@/api/OfferApi';
import { useLoading } from '@/hooks/useLoading';
import ModalComponent from '@/components/ModalComponent';


const OfferView = () => {
    const { offerId } = useParams();
    const router = useRouter()
    const { data, error, isLoading } = useSWR<OfferDetailInterface>(`/offer/${offerId}`, fetchInterviewById)
    const { checkRole, userData } = useUserData()
    const isInterviewer = !checkRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.RECRUITER)
    const isRoleManageAndAdmin = checkRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
    const isRecruiter = checkRole(UserRoleEnum.RECRUITER)
    const canEdit = () => {
        return (
            ![OfferStatusEnum.CANCELLED, OfferStatusEnum.DECLINED_OFFER, OfferStatusEnum.REJECTED_OFFER].includes(data?.status as any) &&
            ((isRecruiter && (data?.status !== OfferStatusEnum.APPROVED_OFFER && data?.status !== OfferStatusEnum.REJECTED_OFFER)) ||
                (!isInterviewer && !isRecruiter))
        );
    };

    const formattedCreatedDate = useFormattedDate(data?.createdDate || "");
    const formattedUpdatedDate = useFormattedDate(data?.updatedDate || "");

    const setBreadCrumbName = useStoreBreadCrumbName(
        (state: any) => state.setBreadCrumbName
    )
    const setBreadCrumbMainName = useStoreBreadCrumbMainName(
        (state: any) => state.setBreadCrumbMainName
    )
    const handleEdit = (name: string) => {
        router.push(`/offer/edit/${offerId}`)
        setBreadCrumbName(`View offer details`)
        setBreadCrumbMainName(name)
    }
    const { startLoading, stopLoading } = useLoading()

    const handleApproveOffer = async () => {
        startLoading()
        await fetchOfferApprove(Number(offerId))
        toast.success("Approve offer success !")
        mutate(`/offer/${offerId}`)
        stopLoading()
    }
    const handleRejectOffer = async () => {
        startLoading()
        await fetchOfferReject(Number(offerId))
        toast.success("Reject offer success !")
        mutate(`/offer/${offerId}`)
        stopLoading()
    }

    const handleMarkOffer = async () => {
        startLoading()
        await fetchOfferMarkSendCandidate(Number(offerId))
        toast.success(" Mark offer as sent to candidate success !")
        mutate(`/offer/${offerId}`)
        stopLoading()

    }
    const handleAcceptOffer = async () => {
        startLoading()
        await fetchOfferAcceptOffer(Number(offerId))
        toast.success(" Accept offer success !")
        mutate(`/offer/${offerId}`)
        stopLoading()

    }
    const handleDeclineOffer = async () => {
        startLoading()
        await fetchOfferDeclineOffer(Number(offerId))
        toast.success(" Decline offer success !")
        mutate(`/offer/${offerId}`)
        stopLoading()

    }
    const handleCancelOffer = async () => {
        startLoading()
        await fetchOfferCancelOffer(Number(offerId))
        mutate(`/offer/${offerId}`)
        onClose()
        toast.success("Cancel offer success !")
        stopLoading()
    }
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const handlePopup = () => {
        onOpen();
    }
    return (
        <div className='mt-10 '>
            <div className='flex gap-3 mr-10 ml-4 justify-between '>
                <Breadcrumbs className='mx-6 mb-4' variant='solid' radius='full'>
                    <BreadcrumbItem onClick={() => router.push("/offer/offer-list")} size='lg'
                        className='font-bold'>Offer list</BreadcrumbItem>
                    <BreadcrumbItem size='lg' className='font-bold'>Offer details</BreadcrumbItem>
                </Breadcrumbs>
                {![OfferStatusEnum.CANCELLED, OfferStatusEnum.DECLINED_OFFER, OfferStatusEnum.REJECTED_OFFER].includes(data?.status as any) &&
                    <div className='flex gap-3 ml-4 justify-between '>
                        {data?.status == OfferStatusEnum.APPROVED_OFFER && <Button onPress={handleMarkOffer} color='default' variant='shadow' className='w-fit'>
                            Mark offer as sent to candidate
                        </Button>}
                        {data?.status == OfferStatusEnum.WAITING_FOR_RESPONSE && <Button onPress={handleAcceptOffer} color='success' variant='shadow' className='w-fit'>
                            Accepted Offer
                        </Button>}
                        {data?.status == OfferStatusEnum.WAITING_FOR_RESPONSE && <Button onPress={handleDeclineOffer} color='warning' variant='shadow' className='w-fit'>
                            Declined Offer
                        </Button>}
                        {isRoleManageAndAdmin && data?.status == OfferStatusEnum.WAITING_FOR_APPROVAL &&
                            <Button onPress={handleApproveOffer} color='primary' variant='shadow' className='w-fit'>
                                Approve offer </Button>}
                        {isRoleManageAndAdmin && data?.status == OfferStatusEnum.WAITING_FOR_APPROVAL &&
                            <Button onPress={handleRejectOffer} color='warning' variant='shadow' className='w-fit'>
                                Reject offer
                            </Button>}
                        {data?.status !== OfferStatusEnum.CANCELLED &&
                            <Button onPress={handlePopup} color='danger' variant='shadow' className='w-fit'>
                                Cancel offer
                            </Button>}
                    </div>
                }
            </div>
            {/* personal info */}
            <form className='mx-10 p-6 rounded-xl bg-white'>
                <div className='flex justify-end  items-center gap-3  mb-3'>
                    <Code className='w-fit' color='warning'>
                        Created on {formattedCreatedDate},
                        last updated by {formattedUpdatedDate}
                    </Code>
                </div>
                <div className='flex justify-between'>
                    {/* left */}
                    <div className={'flex flex-col gap-4'}>
                        <div className='flex items-center'>
                            <label className='w-40 font-bold' htmlFor='Candidate'>Candidate {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='text-gray-600  font-    p-2 '>
                                    {data?.candidate.label || "N/A"}
                                </p>
                            </Skeleton>
                        </div>
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='Position'>Position{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {data?.position?.label || "N/A"}
                                </p>
                            </Skeleton>
                        </div>
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='Schedule time'>Approver{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='text-gray-600  font-medium  p-2 '>
                                    {data?.approver.label || "N/A"}
                                </p>
                            </Skeleton>
                        </div>
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='Interview'>Interview info{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <div className='text-gray-600  font-medium  p-2 '>
                                    {data?.interviewInfo?.label || "N/A"}
                                    <p>
                                        Interviewers:
                                        <span>
                                            {data?.interviewers?.map((item: SelectInterface) => (
                                                <span className='ml-2' key={item.value}>{item.label}, </span>
                                            ))}
                                        </span>
                                    </p>
                                </div>
                            </Skeleton>
                        </div>
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='Interview'>Contract period{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <span className=' p-2 '>From {FormatDate(data?.contractFromDate as string)} to {FormatDate(data?.contractToDate as string)}</span>
                            </Skeleton>
                        </div>
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='Interview'>Interview note{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='bg-slate-100 rounded-xl w-96  p-2 '>
                                    {data?.interviewNotes || "N/A"}
                                </p>
                            </Skeleton>
                        </div>
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='Interview'>Status{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <Chip size='sm' variant='solid'
                                    color={getColorByOfferStatus(data?.status || "N/A") as ("primary" | "default" | "secondary" | "success" | "warning" | "danger")} // Type assertion
                                    className="font-medium   py-4  text-lg ">
                                    {formatOfferStatus(data?.status || "N/A")}
                                </Chip>
                            </Skeleton>
                        </div>
                    </div>
                    {/* right */}
                    <div className='flex flex-col gap-4 w-[30rem]'>
                        <div className='flex items-center'>
                            <label className='w-40 font-bold' htmlFor='contract type'>Contract type {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {formatContractType(data?.contractType || "N/A")}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center'>
                            <label className='w-40 font-bold' htmlFor='interviewers'>Level {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-lg">
                                <div className='flex flex-wrap w-96 gap-3'>
                                    {data?.level?.label}
                                </div>
                            </Skeleton>

                        </div>
                        <div className='flex items-center'>
                            <label className='w-40 font-bold' htmlFor='email'>Department {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {data?.department?.label || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='recruiter'>Recruiter owner {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {data?.recruiterOwner?.label || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center'>
                            <label className='w-40 font-bold' htmlFor='meetingId'>Due date{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-full">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {data?.dueDate || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center justify-start'>
                            <label className='w-40 font-bold' htmlFor='result'>Basic Salary{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Skeleton isLoaded={!isLoading} className="  min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {data?.basicSalary || "N/A"}
                                </p>
                            </Skeleton>
                        </div>
                        <div className='flex items-center justify-start'>
                            <label className='w-40 font-bold' htmlFor='note'>Note{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-full">
                                <p className='bg-slate-100 rounded-xl w-96  p-2 '>
                                    {data?.note || "N/A"}
                                </p>
                            </Skeleton>
                        </div>

                    </div>
                </div>
                {/* submit */}
                <div className="flex justify-center mt-10 space-x-2">
                    {canEdit()
                        && <Button onPress={() => handleEdit('Edit Interview schedule details')} size='lg' className="grid  cursor-pointer select-none rounded-md border 
                                bg-gradient-to-r from-sky-400 to-blue-500 bg-indigo-500 py-2 px-5 
                                text-center align-middle text-sm text-white shadow font-bold
                                hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600
                             focus:bg-indigo-600 focus:text-white focus:shadow-none">
                            Edit
                        </Button>}
                    <Button onPress={() => router.push("/offer/offer-list")} size='lg' className="grid  cursor-pointer select-none rounded-md
                                     py-2 px-5 
                                text-center align-middle text-sm text-black hover:bg-slate-100   font-bold
                                  focus:shadow-none">Cancel</Button>
                    <ModalComponent fetchSource={handleCancelOffer} isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange}
                        title={"Are you sure you want to cancel this offer?"} />

                </div>

            </form>
        </div>
    )
}

export default OfferView