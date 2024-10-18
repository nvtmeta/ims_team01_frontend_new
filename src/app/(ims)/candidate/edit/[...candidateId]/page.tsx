"use client"

import { BreadcrumbItem, Breadcrumbs, Button, Chip, Image, Select, SelectItem } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { MdOutlineUploadFile } from 'react-icons/md'
import { useParams, useRouter } from 'next/navigation'
import { fetchUserList } from '@/api/UserApi'
import { CandidateInterfaceCreate, RecruiterInterface } from '@/interface/CandidateInterface'
import { useForm } from 'react-hook-form'
import messages from '@/messages/messages'
import { fetchCandidateById, fetchCandidatePost, fetchCandidateUpdate, fetchValidateEmailCandidateExisted } from '@/api/CandidateApi'
import toast from 'react-hot-toast'
import { GenderEnum } from '@/enum/GenderEnum'
import { ParseSkillsUtil, parsePositionUtil } from '@/util/parseObjectId'
import useSWR from 'swr'
import { DropdownInterface } from '@/interface/DropdownInterface'
import { fetchDepartmentListApi, fetchPositionListApi, fetchSkillListApi } from '@/api/DropdownApi'
import FormCandidate from '@/components/FormCandidate'
import { SelectInterface } from '@/interface/SelectInterface'
import { useStoreBreadCrumbName } from '@/util/zustandStorage'
import { genders, highestLevels, statusList } from "@/store/ListCandidate";
import useUserData from '@/hooks/userLocalStorage'
import { useLoading } from '@/hooks/useLoading'


const CandidateEdit = () => {
    const router = useRouter();
    const { data: positionList, error: positionListError, isLoading: positionListIsLoading } = useSWR<SelectInterface[]>(`/dropdown/positions`, fetchPositionListApi)
    const { data: skillList, error: skillListError, isLoading: skillListIsLoading } = useSWR<SelectInterface[]>(`/dropdown/skills`, fetchSkillListApi)
    const { candidateId } = useParams();
    const { userData } = useUserData()

    const {
        register,
        formState: { errors },
        setValue,
        handleSubmit,
    } = useForm()


    useEffect(() => {
        handleFetchInitData()
    }, [])

    const [highestLevel, setHighestLevel] = useState<SelectInterface>({} as SelectInterface)
    const [position, setPosition] = useState<SelectInterface>({} as SelectInterface)
    const [skills, setSkills] = useState<SelectInterface[]>([] as SelectInterface[])
    const [status, setStatus] = useState<SelectInterface>({} as SelectInterface)
    const [gender, setGender] = useState<SelectInterface>({} as SelectInterface)
    const [recruiter, setRecruiter] = useState<SelectInterface>(null as unknown as SelectInterface)
    const [oldEmail, setOldEmail] = useState('')
    const [cvUrl, setUrlCv] = useState("")

    const handleFetchInitData = async () => {
        const data = await fetchCandidateById(`/candidate/${candidateId}`)
        if (data) {
            console.log("data", data)
            setValue("fullName", data.fullName);
            setValue("email", data.email);
            setOldEmail(data.email)
            setValue("phone", data.phone);
            setValue("address", data.address);
            setValue("dob", data.dob);
            setValue("note", data.note);
            setValue("yoe", data.yoe);

            setHighestLevel(highestLevels.find(level => level.value == data.highestLevel) as SelectInterface);
            setPosition(data.position);
            setSkills(data.skills);
            setStatus(statusList.find(status => status.value == data.status) as SelectInterface);;
            setGender(genders.find(gender => gender.value == data.gender) as SelectInterface);
            setRecruiter(data.recruiter);
            setUrlCv(data.cvAttachment);
        }
    }
    // console.log("status, gender,skills,positions", status, gender, skills, position)

    const { startLoading, stopLoading } = useLoading()

    const handleEditCandidate = async (dataForm: CandidateInterfaceCreate) => {
        console.log("dataForm", dataForm)
        startLoading()
        // validate email unique
        const isEmailExisted = await fetchValidateEmailCandidateExisted(dataForm.email);
        if (!isEmailExisted || oldEmail == dataForm.email) {
            const result = await fetchCandidateUpdate(Number(candidateId), {
                ...dataForm,
                skillCandidates: skills, // Use the transformed skills array
                position, // Use the transformed position object,
                gender: gender?.value,
                status: status?.value,
                highestLevel: highestLevel?.value,
                recruiter,
                author: { label: userData.username, value: userData.id },
                cvAttachment: cvUrl
            })
            console.log("result", result)
            if (result) {
                toast.success(messages.ME014)
                router.push('/candidate/candidate-list')
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

    const breadcrumbName = useStoreBreadCrumbName(
        (state: any) => state.breadcrumbName
    )


    return (
        <div className='mt-10 '>

            {/* - Display “Candidate list” if user go from candidate list
            screen
            - Display “View Candidate information” if user go from
            candidate information screen */}

            <Breadcrumbs className='mx-6 mb-4' variant='solid' radius='full'>
                <BreadcrumbItem onClick={router.back}
                    size='lg' className='font-bold'>
                    {breadcrumbName}
                </BreadcrumbItem>
                <BreadcrumbItem size='lg' className='font-bold'>Edit candidate information</BreadcrumbItem>
            </Breadcrumbs>
            <FormCandidate setAction={{ setHighestLevel, setPosition, setStatus, setGender, setSkills, setRecruiter, setUrlCv }}
                formInitData={{ highestLevel, position, status, gender, skills, recruiter, cvUrl }}
                skillList={skillList} positionList={positionList}
                handleSubmitCandidate={handleEditCandidate} register={register} errors={errors} handleSubmit={handleSubmit} />
        </div >
    )
}

export default CandidateEdit

