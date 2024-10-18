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
import FormOffer from '@/components/FormOffer'
import { fetchOfferCreate } from '@/api/OfferApi'
import { OfferFormInterface } from '@/interface/OfferInterface'


const OfferCreate = () => {
    const router = useRouter();

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

    const handlePost = async (dataForm: OfferFormInterface) => {
        startLoading()
        console.log("dataForm", dataForm)

        const res = await fetchOfferCreate({
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

    return (
        <div className='mt-10 '>
            <Breadcrumbs className='mx-6 mb-4' variant='solid' radius='full'>
                <BreadcrumbItem onClick={() => router.push("/offer/offer-list")} size='lg'
                    className='font-bold'>Offer list</BreadcrumbItem>
                <BreadcrumbItem size='lg' className='font-bold'>Create offer</BreadcrumbItem>
            </Breadcrumbs>
            {/* personal info */}
            <FormOffer
                note={note}
                setNote={setNote}
                handleSubmitJob={handlePost} register={register} setValue={setValue}
                getValues={getValues} errors={errors} handleSubmit={handleSubmit} control={control} />
        </div>
    )
}

export default OfferCreate

