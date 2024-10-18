"use client"

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Chip,
    Skeleton,
} from '@nextui-org/react'
import useSWR, { mutate } from 'swr';
import SpinnerLoading from '@/util/SpinnerLoading';
import {
    ToggleUserActive,
    formatCandidateGender,
    formatHighestLevel,
    formatUserGender, formatUserStatus,
    getColorByStatus,
    getColorByUserStatus,
    getColorToggleUserActive
} from '@/util/FormatEnum';
import { useStoreBreadCrumbName } from '@/util/zustandStorage';
import { UserDetailInterface, UserResponseInterface } from "@/interface/UserInterface";
import { fetchUserById, fetchUserToggleStatus } from "@/api/UserApi";
import { SelectInterface } from '@/interface/SelectInterface';
import toast from 'react-hot-toast';
import { FormatDate } from '@/util/FormatDate';


const UserView = () => {
    const { userId } = useParams();
    const router = useRouter()
    const { data: userData, error, isLoading } = useSWR<UserDetailInterface>(`/user/${userId}`, fetchUserById)


    const setBreadCrumbName = useStoreBreadCrumbName(
        (state: any) => state.setBreadCrumbName
    )
    const handleEdit = () => {
        router.push(`/user/edit/${userId}`)
        setBreadCrumbName(`View User information`)
    }


    const handleToggleActive = async () => {
        await fetchUserToggleStatus(`/user/${userId}/toggle-status`);
        mutate(`/user/${userId}`, async () => {
            return await fetchUserById(`/user/${userId}`);
        });
        toast.success("Toggle user status success !")
    }

    ``
    return (
        <div className='mt-10 '>
            <div className='flex gap-3 mr-10 ml-4 justify-between '>
                <Breadcrumbs className='mx-6 mb-4' variant='solid' radius='full'>
                    <BreadcrumbItem onClick={() => router.push("/user/user-list")} size='lg'
                        className='font-bold'>User List</BreadcrumbItem>
                    <BreadcrumbItem size='lg' className='font-bold'>User information</BreadcrumbItem>
                </Breadcrumbs>

            </div>
            {/* personal info */}
            <form className='mx-10 p-6 rounded-xl bg-white'>
                <Button onPress={handleToggleActive} variant='shadow' size='lg' radius='full' className='block   ml-auto w-32 mb-4'
                    color={getColorToggleUserActive(userData?.status as any) as any}>
                    {ToggleUserActive(userData?.status as string)}</Button>
                <div className='flex justify-between'>
                    {/* left */}
                    <div className={'flex flex-col gap-4'}>
                        <div className='flex items-center'>
                            <label className='w-32 font-bold' htmlFor='fullName'>Full Name {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='text-gray-600  font-    p-2 '>
                                    {userData?.fullName}
                                </p>
                            </Skeleton>
                        </div>
                        <div className='flex items-center '>
                            <label className='w-32 font-bold' htmlFor='dob'>D.O.B {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {(FormatDate(userData?.dob as string)) || "N/A"}
                                </p>
                            </Skeleton>
                        </div>
                        <div className='flex items-center '>
                            <label className='w-32 font-bold' htmlFor='phone'>Phone number{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='text-gray-600  font-medium  p-2 '>
                                    {userData?.phone || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center '>
                            <label className='w-32 font-bold' htmlFor='phone'>Role{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-24 min-h-8 rounded-full">
                                <div className='flex flex-wrap gap-2 '>
                                    {userData?.roles?.map((role: SelectInterface) => (
                                        <Chip color='success' className='text-white'>
                                            {role.label}
                                        </Chip>
                                    ))}
                                    {userData?.roles?.length == 0 && <p>N/A</p>}
                                </div>
                            </Skeleton>

                        </div>
                        <div className='flex items-center '>
                            <label className='w-32 font-bold' htmlFor='phone'>Status{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-24 min-h-8 rounded-full">
                                <Chip
                                    size={"lg"}
                                    color={getColorByUserStatus(userData?.status || "N/A") as ("primary" | "default" | "secondary" | "success" | "warning" | "danger")} // Type assertion
                                    className='  font-medium  p-2 '>
                                    {formatUserStatus(userData?.status || "N/A")}
                                </Chip>
                            </Skeleton>

                        </div>
                    </div>
                    {/* right */}
                    <div className='flex flex-col gap-4 w-[30rem]'>
                        <div className='flex items-center'>
                            <label className='w-32 font-bold' htmlFor='email'>Email {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {userData?.email}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center '>
                            <label className='w-32 font-bold' htmlFor='address'>Address {" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {userData?.address || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center'>
                            <label className='w-32 font-bold' htmlFor='gender'>Gender{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-full">
                                <Chip color='secondary' className='text-white  font-medium  p-2'>
                                    {formatUserGender(userData?.gender || "N/A")}
                                </Chip>
                            </Skeleton>

                        </div>
                        <div className='flex items-center '>
                            <label className='w-36 font-bold' htmlFor='gender'>Department{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-[23rem] min-h-8 rounded-lg">
                                <p className='text-gray-600 font-medium  p-2 '>
                                    {userData?.department?.label || "N/A"}
                                </p>
                            </Skeleton>

                        </div>
                        <div className='flex items-center '>
                            <label className='w-32 font-bold' htmlFor='gender'>Note{" "}
                            </label>
                            <Skeleton isLoaded={!isLoading} className="min-w-96 min-h-8 rounded-lg">
                                <p className='bg-slate-100 rounded-xl w-96  p-2 '>
                                    {userData?.note || "N/A"}
                                </p>
                            </Skeleton>

                        </div>

                    </div>
                </div>
                {/* submit */}
                <div className="flex justify-center mt-10 space-x-2">
                    <Button onPress={() => handleEdit()} size='lg' className="grid  cursor-pointer select-none rounded-md border 
                                bg-gradient-to-r from-sky-400 to-blue-500 bg-indigo-500 py-2 px-5 
                                text-center align-middle text-sm text-white shadow font-bold
                                hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600
                             focus:bg-indigo-600 focus:text-white focus:shadow-none">
                        Edit
                    </Button>
                    <Button onPress={() => router.push("/user/user-list")} size='lg' className="grid  cursor-pointer select-none rounded-md
                                     py-2 px-5 
                                text-center align-middle text-sm text-black hover:bg-slate-100   font-bold
                                  focus:shadow-none">Cancel</Button>
                </div>

            </form>
        </div>
    )
}

export default UserView