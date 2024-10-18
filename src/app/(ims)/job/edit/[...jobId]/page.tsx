"use client"

import { BreadcrumbItem, Breadcrumbs, Button, Chip, Select, SelectItem } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { MdOutlineUploadFile } from 'react-icons/md'
import { useParams, useRouter } from 'next/navigation'
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
import { fetchJobById, fetchJobCreate, fetchJobUpdate } from '@/api/JobApi'
import { useStoreBreadCrumbName } from '@/util/zustandStorage'

const JobEdit = () => {
    const router = useRouter();

    const { jobId } = useParams()

    const {
        register,
        formState: { errors },
        handleSubmit,
        getValues,
        setValue,
    } = useForm()

    const [isEmptyAlert, setIsEmptyAlert] = useState(false);

    const [skills, setSkills] = useState<SelectInterface[]>(null as unknown as SelectInterface[]);
    const [benefits, setBenefits] = useState<SelectInterface[]>(null as unknown as SelectInterface[]);
    const [levels, setLevels] = useState<SelectInterface[]>(null as unknown as SelectInterface[]);

    const { startLoading, stopLoading } = useLoading()

    useEffect(() => {
        handleFetchInitData()
    }, [])

    const handleFetchInitData = async () => {
        const data = await fetchJobById(`/job/${jobId}`)
        if (data) {
            console.log("data", data)
            setValue("title", data.title);
            setValue("startDate", data.startDate);
            setValue("salaryFrom", data.salaryFrom);
            setValue("salaryTo", data.salaryTo);
            setValue("workingAddress", data.workingAddress);
            setValue("endDate", data.endDate);
            setValue("description", data.description);

            setBenefits(data.benefits);
            setSkills(data.skills);
            setLevels(data.levels);
        }
    }

    const handleUpdateJob = async (dataForm: UserFormInterface) => {
        if (!benefits || !skills || !levels) {
            setIsEmptyAlert(true);
        } else {
            startLoading()

            const res = await fetchJobUpdate(Number(jobId), {
                ...dataForm, benefits,
                skills, levels
            })
            if (res) {
                toast.success(messages.ME014)
                router.push('/job/job-list')
                stopLoading()
            } else {
                toast.error(messages.ME013)
                stopLoading()
            }
        }
    }

    //todo:update all required field of candidate and user
    const breadcrumbName = useStoreBreadCrumbName(
        (state: any) => state.breadcrumbName
    )

    return (
        <div className='mt-10 '>
            <Breadcrumbs className='mx-6 mb-4' variant='solid' radius='full'>
                <BreadcrumbItem onClick={() => router.back()} size='lg'
                    className='font-bold'>{breadcrumbName}</BreadcrumbItem>
                <BreadcrumbItem size='lg' className='font-bold'>Edit Job details</BreadcrumbItem>
            </Breadcrumbs>
            {/* personal info */}
            <FormJob
                setAction={{ setSkills, setLevels, setBenefits }}
                formInitData={{ skills, levels, benefits, }}
                isEmptyAlert={isEmptyAlert}
                handleSubmitJob={handleUpdateJob} register={register}
                getValues={getValues} errors={errors} handleSubmit={handleSubmit} />
        </div>
    )
}
export default JobEdit

