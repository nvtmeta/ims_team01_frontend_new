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
import { fetchBenefitListApi, fetchDepartmentListApi, fetchLevelListApi, fetchPositionListApi, fetchSkillListApi } from '@/api/DropdownApi'
import { SelectInterface } from '@/interface/SelectInterface'
import FormUser from "@/components/FormUser";
import { UserFormInterface } from "@/interface/UserInterface";
import { useLoading } from '@/hooks/useLoading'
import FormInterview from '@/components/FormInterview'
import { fetchInterviewCreate, fetchInterviewList } from '@/api/interviewScheduleApi'
import { validateForm } from '@/util/validateForm'
import FormJob from '@/components/FormJob'
import { fetchJobCreate } from '@/api/JobApi'


const JobCreate = () => {
    const router = useRouter();

    const {
        register,
        formState: { errors },
        handleSubmit,
        getValues
    } = useForm()

    const [isEmptyAlert, setIsEmptyAlert] = useState(false);

    const [skills, setSkills] = useState<SelectInterface[]>(null as unknown as SelectInterface[]);
    const [benefits, setBenefits] = useState<SelectInterface[]>(null as unknown as SelectInterface[]);
    const [levels, setLevels] = useState<SelectInterface[]>(null as unknown as SelectInterface[]);

    const { startLoading, stopLoading } = useLoading()

    const handlePostJob = async (dataForm: any) => {
        if (!benefits || !skills || !levels) {
            setIsEmptyAlert(true);
        } else {
            startLoading()

            const res = await fetchJobCreate({
                ...dataForm, benefits,
                skills, levels
            })
            if (res) {
                toast.success(messages.ME016)
                router.push('/job/job-list')
                stopLoading()
            } else {
                toast.error(messages.ME015)
                stopLoading()
            }
        }
    }

    //todo:update all required field of candidate and user

    return (
        <div className='mt-10 '>
            <Breadcrumbs className='mx-6 mb-4' variant='solid' radius='full'>
                <BreadcrumbItem onClick={() => router.push("/job/job-list")} size='lg'
                    className='font-bold'>Job list</BreadcrumbItem>
                <BreadcrumbItem size='lg' className='font-bold'>Create job</BreadcrumbItem>
            </Breadcrumbs>
            {/* personal info */}
            <FormJob
                setAction={{ setSkills, setLevels, setBenefits }}
                formInitData={{ skills, levels, benefits, }}
                isEmptyAlert={isEmptyAlert}
                handleSubmitJob={handlePostJob} register={register}
                getValues={getValues} errors={errors} handleSubmit={handleSubmit} />
        </div>
    )
}
export default JobCreate

