"use client"

import { BreadcrumbItem, Breadcrumbs, Button, Chip, Select, SelectItem } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { MdOutlineUploadFile } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { fetchIsUserExistedByEmailOrUsername, fetchUserCreate, fetchUserList } from '@/api/UserApi'
import { useForm } from 'react-hook-form'
import messages from '@/messages/messages'
import { fetchCandidatePost, fetchValidateEmailCandidateExisted } from '@/api/CandidateApi'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import { fetchDepartmentListApi, fetchPositionListApi, fetchSkillListApi } from '@/api/DropdownApi'
import { SelectInterface } from '@/interface/SelectInterface'
import FormUser from "@/components/FormUser";
import { UserFormInterface } from "@/interface/UserInterface";
import { useLoading } from '@/hooks/useLoading'
import { validateForm } from '@/util/validateForm'


const UserCreate = () => {
    const router = useRouter();
    const {
        data: departmentList,
        error: departmentListError,
        isLoading: departmentListIsLoading
    } = useSWR<SelectInterface[]>(`/dropdown/departments`, fetchPositionListApi)
    const {
        data: roleList,
        error: roleListError,
        isLoading: roleListIsLoading
    } = useSWR<SelectInterface[]>(`/dropdown/roles`, fetchSkillListApi)
    // const { data: departmentList, error: departmentListError, isLoading: departmentListIsLoading } = useSWR<DropdownInterface>(`/dropdown/departments`, fetchDepartmentListApi)

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm()

    const [status, setStatus] = useState<SelectInterface>(null as unknown as SelectInterface);
    const [gender, setGender] = useState<SelectInterface>(null as unknown as SelectInterface);
    const [role, setRole] = useState<SelectInterface>(null as unknown as SelectInterface);
    const [department, setDepartment] = useState<SelectInterface>(null as unknown as SelectInterface);

    const [isEmptyAlert, setIsEmptyAlert] = useState(false);
    const { startLoading, stopLoading } = useLoading()

    const handlePostUser = async (dataForm: UserFormInterface) => {
        console.log("dataForm", dataForm)
        // validate email unique
        const isUserExisted = await fetchIsUserExistedByEmailOrUsername(dataForm.email, '');

        const errors = validateForm({ role, gender, status, department });
        console.log("errors", errors);
        if (!isUserExisted) {
            if (Object.keys(errors).length > 0) {
                setIsEmptyAlert(true);
            } else {
                startLoading()
                console.log("dataForm", dataForm)
                console.log("status", status)
                console.log("gender", gender)
                console.log("role", role)
                console.log("department", department)
                const roleData = role ? [{ value: role?.value, label: role?.label }] : []

                const result = await fetchUserCreate({
                    ...dataForm,
                    status: status?.value,
                    gender: gender?.value,
                    roles: roleData,
                    department: department
                })
                console.log("result", result)
                if (result) {
                    toast.success(messages.ME027)
                    router.push('/user/user-list')
                    stopLoading()
                } else {
                    stopLoading()
                    toast.error(messages.ME013)
                }
            }

        } else {
            stopLoading()
            toast.error("Email already exists");
        }
    }


    return (
        <div className='mt-10 '>
            <Breadcrumbs className='mx-6 mb-4' variant='solid' radius='full'>
                <BreadcrumbItem onClick={() => router.push("/user/user-list")} size='lg'
                    className='font-bold'>User List</BreadcrumbItem>
                <BreadcrumbItem size='lg' className='font-bold'>Create user</BreadcrumbItem>
            </Breadcrumbs>
            {/* personal info */}
            <FormUser
                setAction={{ setStatus, setGender, setRole, setDepartment }}
                formInitData={{ role, status, gender, department }}
                roleList={roleList} departmentList={departmentList}
                handleSubmitUser={handlePostUser} register={register}
                isEmptyAlert={isEmptyAlert} errors={errors} handleSubmit={handleSubmit} />
        </div>
    )
}

export default UserCreate

