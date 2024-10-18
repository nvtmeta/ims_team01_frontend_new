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
} from '@nextui-org/react'
import useSWR, { mutate } from 'swr';
import SpinnerLoading from '@/util/SpinnerLoading';
import {
    ToggleUserActive,
    formatCandidateGender,
    formatHighestLevel,
    formatInterviewStatus,
    formatUserGender, formatUserStatus,
    getColorByInterviewStatus,
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
import { InterviewStatusEnum } from '@/enum/InterviewEnum';


const InterviewView = () => {
    const { interviewId } = useParams();
    const router = useRouter()
    const { data, error, isLoading } = useSWR<InterviewDetailInterface>(`/interview-schedule/${interviewId}`, fetchInterviewById)
    const { checkRole, userData } = useUserData()
    const isInterviewer = !checkRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.RECRUITER)

    const formattedCreatedDate = useFormattedDate(data?.createdDate || "");
    const formattedUpdatedDate = useFormattedDate(data?.updatedDate || "");

    const setBreadCrumbName = useStoreBreadCrumbName(
        (state: any) => state.setBreadCrumbName
    )
    const setBreadCrumbMainName = useStoreBreadCrumbMainName(
        (state: any) => state.setBreadCrumbMainName
    )
    const handleEdit = (name: string) => {
        router.push(`/interview/edit/${interviewId}`)
        setBreadCrumbName(`View Interview schedule details`)
        setBreadCrumbMainName(name)
    }

    const isSubmitInterviewer = data?.interviewers.some((e: SelectInterface) => e.value == userData.id)


    const handleSendReminder = async () => {
        await fetchInterviewReminder(Number(interviewId))
        toast.success("Send reminder success")
    }


    return (
        <div className='mt-10 '>
            <div className='flex gap-3 mr-10 ml-4 justify-between '>
                <Breadcrumbs className='mx-6 mb-4' variant='solid' radius='full'>
                    <BreadcrumbItem onClick={() => router.push("/interview/interview-list")} size='lg'
                        className='font-bold'>Interview schedule list</BreadcrumbItem>
                    <BreadcrumbItem size='lg' className='font-bold'>interview schedule details</BreadcrumbItem>
                </Breadcrumbs>
                {!isInterviewer && ![InterviewStatusEnum.CANCELLED, InterviewStatusEnum.CLOSED, InterviewStatusEnum.INTERVIEWED].includes(data?.status as any) &&
                    <Button onPress={handleSendReminder} color='primary' variant='shadow' className='w-fit'>
                        Send reminder
                    </Button>
                }
            </div>
            {/* personal info */}
            <form className='mx-10 p-6 rounded-xl bg-white'>
                <div className='flex justify-end  items-center gap-3  mb-3'>

                    <Code className='w-fit' color='warning'>
                        Created on {formattedCreatedDate},
                        last updated by {data?.author?.label} {formattedUpdatedDate}
                    </Code>
                </div>
                <div className='flex justify-between'>
                    {/* left */}
                    <div className={'flex flex-col gap-4'}>
                        <div className='flex items-center'>
                            <label className='w-40 font-bold' htmlFor='title'>Schedule title {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='text-gray-600  font-    p-2 '>
                                    {data?.title}
                                </p>
                            </Skeleton>
                        </div>
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='candidate'>Candidate name{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {data?.candidate?.label}
                                </p>
                            </Skeleton>
                        </div>
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='phone'>Schedule time{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='text-gray-600  font-medium  p-2 '>
                                    {FormatDate(data?.date || new Date())}
                                </p>
                                <span className='p-2'>
                                    From {data?.startTime?.replace(":00", "")} to {data?.endTime?.replace(":00", "")}
                                </span>
                            </Skeleton>

                        </div>
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='gender'>Note{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='bg-slate-100 rounded-xl w-96  p-2 '>
                                    {data?.note || "N/A"}
                                </p>
                            </Skeleton>
                        </div>

                    </div>
                    {/* right */}
                    <div className='flex flex-col gap-4 w-[30rem]'>
                        <div className='flex items-center'>
                            <label className='w-40 font-bold' htmlFor='job'>Job {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {data?.job?.label || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center'>
                            <label className='w-40 font-bold' htmlFor='interviewers'>interviewers {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-lg">
                                <div className='flex flex-wrap w-96 gap-3'>
                                    {data?.interviewers?.map((item: SelectInterface) => (
                                        <Chip color='success' className='text-white'>
                                            {item?.label}
                                        </Chip>
                                    ))}
                                    {data?.interviewers?.length == 0 && <p className='text-start ml-6'>N/A</p>}

                                </div>
                            </Skeleton>

                        </div>
                        <div className='flex items-center'>
                            <label className='w-40 font-bold' htmlFor='email'>Location {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {data?.location || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='recruiter'>Recruiter owner {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {data?.recruiter?.label || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center'>
                            <label className='w-40 font-bold' htmlFor='meetingId'>Meeting ID{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-full">
                                <Link target='_blank' href={`${data?.meetingId}`}>
                                    <Chip
                                        color='secondary' className='text-white  font-medium  p-2'>
                                        {formatUserGender(data?.meetingId || "N/A")}
                                    </Chip>
                                </Link>
                            </Skeleton>

                        </div>
                        <div className='flex items-center justify-start'>
                            <label className='w-40 font-bold' htmlFor='result'>Result{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Skeleton isLoaded={!isLoading} className="  min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {data?.result || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center justify-start'>
                            <label className='w-40 font-bold' htmlFor='status'>Status{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-full">
                                <Chip
                                    size={"lg"}
                                    color={getColorByInterviewStatus(data?.status || "N/A") as ("primary" | "default" | "secondary" | "success" | "warning" | "danger")} // Type assertion
                                    className='  font-medium  p-2 '>
                                    {formatInterviewStatus(data?.status || "N/A")}
                                </Chip>
                            </Skeleton>

                        </div>

                    </div>
                </div>
                {/* submit */}
                <div className="flex justify-center mt-10 space-x-2">

                    {isInterviewer && isSubmitInterviewer &&
                        <Button onPress={() => handleEdit('Interview schedule details')} size='lg' className="grid  cursor-pointer select-none rounded-md border 
                          bg-gradient-to-r from-sky-400 to-blue-500 bg-indigo-500 py-2 px-5 
                          text-center align-middle text-sm text-white shadow font-bold
                          hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600
                       focus:bg-indigo-600 focus:text-white focus:shadow-none">
                            Submit result
                        </Button>
                    }
                    {!isInterviewer && <Button onPress={() => handleEdit('Edit Interview schedule details')} size='lg' className="grid  cursor-pointer select-none rounded-md border 
                                bg-gradient-to-r from-sky-400 to-blue-500 bg-indigo-500 py-2 px-5 
                                text-center align-middle text-sm text-white shadow font-bold
                                hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600
                             focus:bg-indigo-600 focus:text-white focus:shadow-none">
                        Edit
                    </Button>}
                    <Button onPress={() => router.push("/interview/interview-list")} size='lg' className="grid  cursor-pointer select-none rounded-md
                                     py-2 px-5 
                                text-center align-middle text-sm text-black hover:bg-slate-100   font-bold
                                  focus:shadow-none">Cancel</Button>
                </div>

            </form>
        </div>
    )
}

export default InterviewView