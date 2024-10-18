"use client"

import { BreadcrumbItem, Breadcrumbs, Button, Chip, Select, SelectItem, useDisclosure } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { MdOutlineUploadFile } from 'react-icons/md'
import { useParams, useRouter } from 'next/navigation'
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
import FormInterview, { interviewResult } from '@/components/FormInterview'
import { fetchInterviewById, fetchInterviewCancel, fetchInterviewCreate, fetchInterviewList, fetchInterviewSubmit, fetchInterviewUpdate } from '@/api/interviewScheduleApi'
import { validateForm } from '@/util/validateForm'
import ModalComponent from '@/components/ModalComponent'
import useUserData from '@/hooks/userLocalStorage'
import { UserRoleEnum } from '@/enum/UserRoleEnum'
import { InterviewStatusEnum } from '@/enum/InterviewEnum'
import { useStoreBreadCrumbMainName, useStoreBreadCrumbName } from '@/util/zustandStorage'
import { InterviewFormInterface, interviewResultInterface } from '@/interface/InterviewInterface'

// TODO:do job edit
// TODO: do reminder btn
const InterviewEdit = () => {
    const router = useRouter();
    const {
        register,
        formState: { errors },
        handleSubmit,
        getValues,
        control,
        setValue,
    } = useForm()

    const { userData, checkRole } = useUserData()


    const isInterviewer = !checkRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.RECRUITER)


    const [isEmptyAlert, setIsEmptyAlert] = useState(false);

    const [interviewers, setInterviewers] = useState<SelectInterface[]>(null as unknown as SelectInterface[]);
    const [candidate, setCandidate] = useState<SelectInterface>(null as unknown as SelectInterface);
    const [job, setJob] = useState<SelectInterface>(null as unknown as SelectInterface);
    const [recruiter, setRecruiter] = useState<SelectInterface>(null as unknown as SelectInterface);
    const [result, setResult] = useState<SelectInterface>(null as unknown as SelectInterface);

    const { startLoading, stopLoading } = useLoading()
    const { interviewId } = useParams();


    useEffect(() => {
        handleFetchInitData()
    }, [])
    const handleFetchInitData = async () => {
        const data = await fetchInterviewById(`/interview-schedule/${interviewId}`);
        if (data) {
            setValue("title", data.title);
            setValue("date", data.date);
            setValue("startTime", data.startTime);
            setValue("endTime", data.endTime);
            setValue("location", data.location);
            setValue("meetingId", data.meetingId);
            setValue("note", data.note);
            setValue("status", data.status);
            setValue("job", data.job);

            setCandidate((data.candidate) as SelectInterface);
            setRecruiter((data.recruiter) as SelectInterface);
            setResult(interviewResult.find(item => item.value == data.result) as SelectInterface);
            setInterviewers(data.interviewers as SelectInterface[]);
            // setJob(data.department as SelectInterface);;
        }
    }


    const handleUpdateInterview = async (dataForm: InterviewFormInterface) => {
        // validate email unique
        const errors = validateForm({ candidate, recruiter })
        if (interviewers?.length === 0 || !interviewers || Object.keys(errors).length > 0) {
            setIsEmptyAlert(true);
        } else {
            startLoading()
            // check data

            const result = await fetchInterviewUpdate(Number(interviewId), {
                ...dataForm, candidate,
                interviewers, recruiter,
                author: { label: userData.username, value: userData.id },
            })
            console.log("result", result)
            if (result) {
                toast.success(messages.ME014)
                router.push('/interview/interview-list')
                stopLoading()
            } else {
                toast.error(messages.ME013)
                stopLoading()
            }
        }
    }

    const handleSubmitResult = async (dataForm: interviewResultInterface) => {
        startLoading()
        const res = await fetchInterviewSubmit(Number(interviewId), {
            note: dataForm.note, result: result?.value
        })
        console.log("res", res)
        if (res) {
            toast.success(messages.ME014)
            router.push('/interview/interview-list')
            stopLoading()
        } else {
            toast.error(messages.ME013)
            stopLoading()
        }

    }

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const handleCancelById = async () => {
        await fetchInterviewCancel(Number(interviewId));
        handleFetchInitData()
        toast.success("Cancel schedule success !")
        router.push('/interview/interview-list')
        onClose()
    }
    const breadcrumbName = useStoreBreadCrumbName(
        (state: any) => state.breadcrumbName
    )
    const breadcrumbMainName = useStoreBreadCrumbMainName(
        (state: any) => state.breadcrumbMainName
    )

    return (
        <div className='mt-10 '>
            <div className='flex gap-3 mr-10 ml-4 justify-between '>
                <Breadcrumbs className='mx-6 mb-4' variant='solid' radius='full'>
                    <BreadcrumbItem onClick={() => router.back()} size='lg'
                        className='font-bold'> {breadcrumbName}</BreadcrumbItem>
                    <BreadcrumbItem size='lg' className='font-bold'>
                        {breadcrumbMainName}
                    </BreadcrumbItem>
                </Breadcrumbs>
                <div>
                    {!isInterviewer && getValues("status") == (InterviewStatusEnum.NEW) &&
                        <Button onPress={onOpen} className='font-medium' variant='shadow' color='danger'>
                            Cancel schedule
                        </Button>
                    }
                </div>
            </div>
            {/* personal info */}
            <FormInterview
                setAction={{ setInterviewers, setCandidate, setJob, setRecruiter, setResult }}
                formInitData={{ candidate, interviewers, job, recruiter, result }}
                isEmptyAlert={isEmptyAlert} control={control}
                handleSubmitInterview={!isInterviewer ? handleUpdateInterview : handleSubmitResult} register={register}
                getValues={getValues} errors={errors} handleSubmit={handleSubmit} />
            <ModalComponent fetchSource={handleCancelById} isOpen={isOpen}
                onOpen={onOpen} onOpenChange={onOpenChange}
                title={"Are you sure you want to cancel this interview?"} />

        </div>
    )
}
export default InterviewEdit

