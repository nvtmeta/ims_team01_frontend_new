"use client"

import { BreadcrumbItem, Breadcrumbs, Button, Chip, Select, SelectItem } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { MdOutlineUploadFile } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { fetchRecruiterListApi, fetchUserList } from '@/api/UserApi'
import { CandidateInterfaceCreate, RecruiterInterface } from '@/interface/CandidateInterface'
import { useForm } from 'react-hook-form'
import messages from '@/messages/messages'
import { fetchCandidatePost, fetchValidateEmailCandidateExisted } from '@/api/CandidateApi'
import toast from 'react-hot-toast'
import { GenderEnum } from '@/enum/GenderEnum'
import { ParseSkillsUtil, parsePositionUtil } from '@/util/parseObjectId'
import useSWR from 'swr'
import { DropdownInterface } from '@/interface/DropdownInterface'
import { fetchDepartmentListApi, fetchPositionListApi, fetchSkillListApi } from '@/api/DropdownApi'
import FormCandidate from '@/components/FormCandidate'
import { SelectInterface, SelectInterfacePage } from '@/interface/SelectInterface'
import { useLoading } from '@/hooks/useLoading'


const CandidateCreate = () => {
    const router = useRouter();
    const {
        data: positionList,
        error: positionListError,
        isLoading: positionListIsLoading
    } = useSWR<SelectInterface[]>(`/dropdown/positions`, fetchPositionListApi)
    const {
        data: skillList,
        error: skillListError,
        isLoading: skillListIsLoading
    } = useSWR<SelectInterface[]>(`/dropdown/skills`, fetchSkillListApi)


    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm()

    const [highestLevel, setHighestLevel] = useState<SelectInterface>(null as unknown as SelectInterface)
    const [position, setPosition] = useState<SelectInterface>(null as unknown as SelectInterface)
    const [skills, setSkills] = useState<SelectInterface[]>([] as unknown as SelectInterface[])
    const [status, setStatus] = useState<SelectInterface>(null as unknown as SelectInterface)
    const [gender, setGender] = useState<SelectInterface>(null as unknown as SelectInterface)
    const [recruiter, setRecruiter] = useState<SelectInterface>(null as unknown as SelectInterface)
    const [cvUrl, setUrlCv] = useState("")

    const { startLoading, stopLoading } = useLoading()

    const handlePostCandidate = async (dataForm: CandidateInterfaceCreate) => {
        startLoading()
        console.log("dataForm", dataForm)

        console.log("highestLevel", highestLevel)
        console.log("position", position)
        console.log("skills", skills)
        console.log("gender", gender)
        console.log("status", status)


        // validate email unique
        const isEmailExisted = await fetchValidateEmailCandidateExisted(dataForm.email);
        if (!isEmailExisted) {

            const result = await fetchCandidatePost({
                ...dataForm,
                skillCandidates: skills, // Use the transformed skills array
                position, // Use the transformed position object,
                gender: gender?.value,
                status: status?.value,
                highestLevel: highestLevel?.value,
                recruiter: recruiter,
                cvAttachment: cvUrl
            })
            console.log("result", result)
            if (result) {
                toast.success(messages.ME012)
                router.push('/candidate/candidate-list')
                stopLoading()
            } else {
                toast.error(messages.ME013)
                stopLoading()
            }
        } else {
            stopLoading()
            toast.error("Email already exists");
        }
    }



    return (
        <div className='mt-10 '>
            <Breadcrumbs className='mx-6 mb-4' variant='solid' radius='full'>
                <BreadcrumbItem onClick={() => router.push("/candidate/candidate-list")} size='lg'
                    className='font-bold'>Candidate List</BreadcrumbItem>
                <BreadcrumbItem size='lg' className='font-bold'>Create candidate</BreadcrumbItem>
            </Breadcrumbs>
            {/* personal info */}
            <FormCandidate
                setAction={{ setHighestLevel, setRecruiter, setPosition, setStatus, setGender, setSkills, setUrlCv }}
                formInitData={{ highestLevel, recruiter, position, status, gender, skills, cvUrl }}
                skillList={skillList} positionList={positionList}
                handleSubmitCandidate={handlePostCandidate} register={register}
                errors={errors} handleSubmit={handleSubmit} />
        </div>
    )
}

export default CandidateCreate

