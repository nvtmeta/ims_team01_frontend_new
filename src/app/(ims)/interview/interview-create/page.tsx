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
import FormInterview from '@/components/FormInterview'
import { fetchInterviewCreate, fetchInterviewList } from '@/api/interviewScheduleApi'
import { validateForm } from '@/util/validateForm'


const InterviewCreate = () => {
    const router = useRouter();

    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        getValues
    } = useForm()

    const [isEmptyAlert, setIsEmptyAlert] = useState(false);

    const [interviewers, setInterviewers] = useState<SelectInterface[]>(null as unknown as SelectInterface[]);
    const [candidate, setCandidate] = useState<SelectInterface>(null as unknown as SelectInterface);
    const [job, setJob] = useState<SelectInterface>(null as unknown as SelectInterface);
    const [recruiter, setRecruiter] = useState<SelectInterface>(null as unknown as SelectInterface);
    const [result, setResult] = useState<SelectInterface>(null as unknown as SelectInterface);

    const { startLoading, stopLoading } = useLoading()

    const handlePostInterview = async (dataForm: UserFormInterface) => {
        // validate email unique
        const errors = validateForm({ candidate, recruiter })
        if (!interviewers || Object.keys(errors).length > 0) {
            setIsEmptyAlert(true);
        } else {
            startLoading()
            // check data

            const res = await fetchInterviewCreate({
                ...dataForm, candidate,
                interviewers, recruiter, result: result?.value
            })
            if (res) {
                toast.success(messages.ME022)
                router.push('/interview/interview-list')
                stopLoading()
            } else {
                toast.error(messages.ME021)
                stopLoading()
            }
        }
    }

    //todo:update all required field of candidate and user

    return (
        <div className='mt-10 '>
            <Breadcrumbs className='mx-6 mb-4' variant='solid' radius='full'>
                <BreadcrumbItem onClick={() => router.push("/interview/interview-list")} size='lg'
                    className='font-bold'>Interview Schedule list</BreadcrumbItem>
                <BreadcrumbItem size='lg' className='font-bold'>New interview schedule</BreadcrumbItem>
            </Breadcrumbs>
            {/* personal info */}
            <FormInterview
                setAction={{ setInterviewers, setCandidate, setJob, setRecruiter, setResult }}
                formInitData={{ candidate, interviewers, job, recruiter, result }}
                isEmptyAlert={isEmptyAlert} control={control}
                handleSubmitInterview={handlePostInterview} register={register}
                getValues={getValues} errors={errors} handleSubmit={handleSubmit} />
        </div>
    )
}
export default InterviewCreate

