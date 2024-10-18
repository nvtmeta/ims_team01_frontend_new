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
    formatJobStatus,
    formatUserGender, formatUserStatus,
    getColorByInterviewStatus,
    getColorByJobStatus,
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
import { fetchInterviewById } from '@/api/interviewScheduleApi';
import { InterviewDetailInterface } from '@/interface/InterviewInterface';
import useUserData from '@/hooks/userLocalStorage';
import { UserRoleEnum } from '@/enum/UserRoleEnum';
import useFormattedDate from '@/hooks/useFormattedDate';
import { JobDetailInterface } from '@/interface/JobInterface';
import { fetchJobById } from '@/api/JobApi';


const JobView = () => {
    const { jobId } = useParams();
    const router = useRouter()
    const { data, error, isLoading } = useSWR<JobDetailInterface>(`/job/${jobId}`, fetchJobById)
    const { checkRole } = useUserData()
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
        router.push(`/job/edit/${jobId}`)
        setBreadCrumbName(`View Job details`)
        setBreadCrumbMainName(name)
    }

    //todo: bonus created date and updated date
    return (
        <div className='mt-10 '>
            <div className='flex gap-3 mr-10 ml-4 justify-between '>
                <Breadcrumbs className='mx-6 mb-4' variant='solid' radius='full'>
                    <BreadcrumbItem onClick={() => router.push("/job/job-list")} size='lg'
                        className='font-bold'>Job list</BreadcrumbItem>
                    <BreadcrumbItem size='lg' className='font-bold'>Job Details</BreadcrumbItem>
                </Breadcrumbs>

            </div>
            {/* personal info */}
            <form className='mx-10 p-6 rounded-xl bg-white'>
                <div className='flex justify-end mb-3'>
                    <Code className='' color='warning'>
                        Created on {formattedCreatedDate},
                        last updated by  {formattedUpdatedDate}
                    </Code>
                </div>
                <div className='flex justify-between'>
                    {/* left */}
                    <div className={'flex flex-col gap-4'}>
                        <div className='flex items-center'>
                            <label className='w-40 font-bold' htmlFor='title'>Job title {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='text-gray-600  font-    p-2 '>
                                    {data?.title}
                                </p>
                            </Skeleton>
                        </div>
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='phone'>Start date{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='text-gray-600  font-medium  p-2 '>
                                    {FormatDate(data?.startDate || new Date())}
                                </p>
                            </Skeleton>
                        </div>
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='gender'>Salary range{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96  min-h-8 rounded-lg">
                                <div className='flex items-center'>
                                    <div className='flex items-center gap-3'>
                                        <label className='font-bold'>From</label>
                                        <p className='rounded-xl   p-2 '>
                                            {data?.salaryFrom || "N/A"}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <label className='font-bold'>To</label>
                                        <p className=' rounded-xl  p-2 '>
                                            {data?.salaryTo || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </Skeleton>
                        </div>
                        <div className='flex items-center'>
                            <label className='w-40 font-bold' htmlFor='job'>Working address {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {data?.workingAddress || "N/A"}
                                </p>
                            </Skeleton>
                        </div>
                        <div className='flex items-center justify-start'>
                            <label className='w-40 font-bold' htmlFor='status'>Status{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-full">
                                <Chip
                                    size={"lg"}
                                    color={getColorByJobStatus(data?.status || "N/A") as ("primary" | "default" | "secondary" | "success" | "warning" | "danger")} // Type assertion
                                    className='  font-medium  p-2 '>
                                    {formatJobStatus(data?.status || "N/A")}
                                </Chip>
                            </Skeleton>

                        </div>
                    </div>
                    {/* right */}
                    <div className='flex flex-col gap-4 w-[30rem]'>
                        <div className='flex items-center'>
                            <label className='w-32 font-bold' htmlFor='Skills'>Skills {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-lg">
                                <div className='flex flex-wrap w-96 gap-3'>
                                    {data?.skills?.map((item: SelectInterface) => (
                                        <Chip color='primary' className='text-white'>
                                            {item?.label}
                                        </Chip>
                                    ))}
                                    {data?.skills?.length == 0 && <p className='text-start ml-6'>N/A</p>}
                                </div>
                            </Skeleton>
                        </div>
                        <div className='flex items-center'>
                            <label className='w-32 font-bold' htmlFor='email'>End date {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-h-8 rounded-lg">
                                <p className='text-gray-600 w-96 font-medium  p-2 '>
                                    {FormatDate(data?.endDate || new Date())}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center'>
                            <label className='w-32 font-bold' htmlFor='benefits'>Benefits {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-h-8 rounded-lg">
                                <div className='flex flex-wrap w-96 gap-3'>
                                    {data?.benefits?.map((item: SelectInterface) => (
                                        <Chip color='secondary' className='text-white'>
                                            {item?.label}
                                        </Chip>
                                    ))}
                                    {data?.benefits?.length == 0 && <p className='text-start ml-6'>N/A</p>}
                                </div>
                            </Skeleton>
                        </div>
                        <div className='flex items-center'>
                            <label className='w-32 font-bold' htmlFor='levels'>Levels {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className=" min-h-8 rounded-lg">
                                <div className='flex flex-wrap w-96 gap-3'>
                                    {data?.levels?.map((item: SelectInterface) => (
                                        <Chip color='default' className=''>
                                            {item?.label}
                                        </Chip>
                                    ))}
                                    {data?.levels?.length == 0 && <p className='text-start ml-6'>N/A</p>}
                                </div>
                            </Skeleton>
                        </div>
                        <div className='flex items-center'>
                            <label className='w-32 font-bold' htmlFor='meetingId'>Description{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="w-96 min-h-8 rounded-lg">
                                <p className='bg-slate-100 rounded-xl max-w-96 p-3'>
                                    {data?.description || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                    </div>
                </div>
                {/* submit */}
                <div className="flex justify-center mt-10 space-x-2">

                    {!isInterviewer && <Button onPress={() => handleEdit('Edit Job details')} size='lg' className="grid  cursor-pointer select-none rounded-md border 
                                bg-gradient-to-r from-sky-400 to-blue-500 bg-indigo-500 py-2 px-5 
                                text-center align-middle text-sm text-white shadow font-bold
                                hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600
                             focus:bg-indigo-600 focus:text-white focus:shadow-none">
                        Edit
                    </Button>
                    }
                    <Button onPress={() => router.push("/job/job-list")} size='lg' className="grid  cursor-pointer select-none rounded-md
                                     py-2 px-5 
                                text-center align-middle text-sm text-black hover:bg-slate-100   font-bold
                                  focus:shadow-none">Cancel</Button>
                </div>

            </form>
        </div>
    )
}

export default JobView