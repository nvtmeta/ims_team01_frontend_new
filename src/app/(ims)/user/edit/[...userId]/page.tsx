"use client"

import { BreadcrumbItem, Breadcrumbs, Button, Chip, Select, SelectItem } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { MdOutlineUploadFile } from 'react-icons/md'
import { useParams, useRouter } from 'next/navigation'
import { fetchIsUserExistedByEmailOrUsername, fetchUserById, fetchUserCreate, fetchUserList, fetchUserUpdate } from '@/api/UserApi'
import { useForm } from 'react-hook-form'
import messages from '@/messages/messages'
import { fetchCandidatePost, fetchValidateEmailCandidateExisted } from '@/api/CandidateApi'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import { fetchDepartmentListApi, fetchPositionListApi, fetchSkillListApi } from '@/api/DropdownApi'
import { SelectInterface } from '@/interface/SelectInterface'
import FormUser, { userGenders, userStatusList } from "@/components/FormUser";
import { UserFormInterface } from "@/interface/UserInterface";
import { useStoreBreadCrumbName } from '@/util/zustandStorage'
import { useLoading } from '@/hooks/useLoading'
import { validateForm } from '@/util/validateForm'


const UserEdit = () => {
    const router = useRouter();
    const { userId } = useParams();

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
        setValue,
    } = useForm()

    const [status, setStatus] = useState<SelectInterface>(null as unknown as SelectInterface);
    const [gender, setGender] = useState<SelectInterface>(null as unknown as SelectInterface);
    const [role, setRole] = useState<SelectInterface>(null as unknown as SelectInterface);
    const [department, setDepartment] = useState<SelectInterface>(null as unknown as SelectInterface);
    const [oldEmail, setOldEmail] = useState('')

    useEffect(() => {
        handleFetchInitData()
    }, [])
    const handleFetchInitData = async () => {
        const data = await fetchUserById(`/user/${userId}`);
        if (data) {
            setValue("fullName", data.fullName);
            setValue("email", data.email);
            setValue("phone", data.phone);
            setValue("address", data.address);
            setValue("dob", data.dob);
            setValue("note", data.note);
            setOldEmail(data.email)

            setGender(userGenders.find(gender => gender.value == data.gender) as SelectInterface);;
            setStatus(userStatusList.find(status => status.value == data.status) as SelectInterface);;
            setRole(data.roles[0] as SelectInterface);
            setDepartment(data.department as SelectInterface);;
        }
    }

    const { startLoading, stopLoading } = useLoading()
    const [isEmptyAlert, setIsEmptyAlert] = useState(false);


    const handleUpdateUser = async (dataForm: UserFormInterface) => {
        // validate email unique
        const isUserExisted = await fetchIsUserExistedByEmailOrUsername(dataForm.email, '');
        const errors = validateForm({ role, gender, status, department });
        if (Object.keys(errors).length > 0) {
            setIsEmptyAlert(true);
        } else {
            if (!isUserExisted || oldEmail == dataForm.email) {
                startLoading()

                const roleFetched = roleList?.find(e => e.label.toLowerCase() == role?.label.toLowerCase());
                const roleData = role ? [{ value: roleFetched?.value, label: role?.label }] as SelectInterface[] : [];

                const result = await fetchUserUpdate(Number(userId), {
                    ...dataForm,
                    status: status?.value,
                    gender: gender?.value,
                    roles: roleData,
                    department: department,
                })
                if (result) {
                    toast.success(messages.ME027)
                    router.push('/user/user-list')
                    stopLoading()
                } else {
                    stopLoading()
                    toast.error(messages.ME013)
                }
            } else {
                stopLoading()
                toast.error("Email already exists");
            }
        }
    }

    const breadcrumbName = useStoreBreadCrumbName(
        (state: any) => state.breadcrumbName
    )


    console.log("breadcrumbName", breadcrumbName)
    return (
        <div className='mt-10 '>
            <Breadcrumbs className='mx-6 mb-4' variant='solid' radius='full'>
                <BreadcrumbItem onClick={router.back}
                    size='lg' className='font-bold'>
                    {breadcrumbName}
                </BreadcrumbItem>
                <BreadcrumbItem size='lg' className='font-bold'>Edit user</BreadcrumbItem>
            </Breadcrumbs>

            {/* personal info */}
            <FormUser
                setAction={{ setStatus, setGender, setRole, setDepartment }}
                formInitData={{ role, status, gender, department }}
                roleList={roleList} departmentList={departmentList}
                isEmptyAlert={isEmptyAlert} handleSubmitUser={handleUpdateUser} register={register}
                errors={errors} handleSubmit={handleSubmit} />
        </div>
    )
}

export default UserEdit

