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
import { fetchJobCreate } from '@/api/JobApi'
import FormOffer from '@/components/FormOffer'
import { fetchOfferById, fetchOfferCreate, fetchOfferUpdate } from '@/api/OfferApi'
import { OfferFormInterface } from '@/interface/OfferInterface'
import { ContractTypes } from '@/store/ListCandidate'
import { useStoreBreadCrumbName } from '@/util/zustandStorage'


const OfferEdit = () => {
    const router = useRouter();
    const { offerId } = useParams();

    const {
        register,
        formState: { errors },
        handleSubmit,
        getValues,
        setValue,
        control,
    } = useForm()
    const [note, setNote] = useState(null);

    const { startLoading, stopLoading } = useLoading()

    useEffect(() => {
        handleFetchInitData()
    }, [])
    const handleFetchInitData = async () => {
        startLoading()
        const data = await fetchOfferById(`/offer/${offerId}`);
        if (data) {
            stopLoading()
            const contractTypeData = ContractTypes.find(contractType => contractType.value == data.contractType)
            const interviewInfo = {
                value: data.interviewInfo.value,
                titleSelected: `${data.interviewInfo.label} | ${data.interviewers.map((item: SelectInterface) => item.label).join(', ')}`
            }


            setValue("candidate", data.candidate);
            setValue("position", data.position);
            setValue("contractFromDate", data.contractFromDate);
            setValue("basicSalary", data.basicSalary);
            setValue("approver", data.approver);
            setValue("contractToDate", data.contractToDate);
            setValue("dueDate", data.dueDate);
            setValue("contractType", contractTypeData);
            setValue("interviewInfo", interviewInfo);
            setValue("interviewNotes", data.interviewNotes);
            setValue("status", data.status);
            setValue("note", data.note);
            setValue("recruiterOwner", data.recruiterOwner);
            setValue("department", data.department);
            setValue("level", data.level);
            setNote(data.note)
        }
    }




    const handleUpdate = async (dataForm: OfferFormInterface) => {
        startLoading()
        console.log("dataForm", dataForm)

        const res = await fetchOfferUpdate(Number(offerId), {
            ...dataForm, contractType: dataForm?.contractType?.value
        })
        if (res) {
            toast.success(messages.ME024)
            router.push('/offer/offer-list')
            stopLoading()
        } else {
            toast.error(messages.ME023)
            stopLoading()
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
                <BreadcrumbItem size='lg' className='font-bold'>Edit offer</BreadcrumbItem>
            </Breadcrumbs>
            {/* personal info */}
            <FormOffer
                setNote={setNote}
                note={note}
                handleSubmitJob={handleUpdate} register={register} setValue={setValue}
                getValues={getValues} errors={errors} handleSubmit={handleSubmit} control={control} />
        </div>
    )
}

export default OfferEdit

