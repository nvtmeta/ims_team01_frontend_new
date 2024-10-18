import { CandidateInterfaceCreate } from '@/interface/CandidateInterface';
import messages from '@/messages/messages';
import React, { useMemo, useState } from 'react'
import { BreadcrumbItem, Breadcrumbs, Button, Chip, DatePicker, Popover, PopoverContent, PopoverTrigger, SelectItem, Spinner, Textarea, TimeInput } from '@nextui-org/react'
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { SelectInterface } from '@/interface/SelectInterface';
import { selectStyles, selectStylesMulti } from "@/css/SelectStyle";
import InfiniteScroll from 'react-infinite-scroll-component';
import SelectCandidate from './interview/SelectCandidate';
import SelectRecruiter from './interview/SelectRecruiter';
import useSWR from 'swr';
import { fetchUserByRole } from '@/api/UserApi';
import { InterviewerPageInterface } from '@/interface/InterviewInterface';
import { fetchBenefitListApi, fetchLevelListApi, fetchPositionListApi, fetchSkillListApi } from '@/api/DropdownApi';
import useUserData from '@/hooks/userLocalStorage';
import { formatInterviewStatus, formatUserGender, getColorByInterviewStatus } from '@/util/FormatEnum';
import { UserRoleEnum } from '@/enum/UserRoleEnum';
import { IsEmptyUtil } from '@/util/checkEmpty';
import SelectCandidateOffer from './interview/SelectCandidateOffer';
import { ContractTypes } from '@/store/ListCandidate';
import SelectManager from './interview/SelectManager';
import { Controller } from 'react-hook-form';
import { AsyncPaginate } from 'react-select-async-paginate';
import { loadOptionsApprover, loadOptionsCandidate, loadOptionsInterview, loadOptionsRecruiter } from '@/util/LoadOptions';
import { fetchInterviewNoteById } from '@/api/interviewScheduleApi';

export interface PropsInterface {
    handleSubmit: any;
    handleSubmitJob: any;
    register: any;
    getValues: any,
    errors: any,
    control: any,
    setValue: any,
    setNote: any,
    note: any
}


const FormOffer = ({
    handleSubmit,
    handleSubmitJob,
    register,
    setNote,
    note,
    getValues,
    errors,
    setValue,
    control
}: PropsInterface) => {
    const router = useRouter();
    const {
        data: positionList,
        error: positionListError,
        isLoading: positionListIsLoading
    } = useSWR<SelectInterface[]>(`/dropdown/positions`, fetchPositionListApi)
    const {
        data: levelList,
        error: levelListError,
        isLoading: levelListIsLoading
    } = useSWR<SelectInterface[]>(`/dropdown/levels`, fetchLevelListApi)
    const {
        data: departmentList,
        error: departmentListError,
        isLoading: departmentListIsLoading
    } = useSWR<SelectInterface[]>(`/dropdown/departments`, fetchPositionListApi)



    const { userData, checkRole } = useUserData()

    const isInterviewer = !checkRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.RECRUITER)

    const handleFetchNoteInterview = async (id: number) => {
        console.log("id", id)
        setNote(await fetchInterviewNoteById(id))
    }

    return (
        <>
            <form onSubmit={handleSubmit((data: any) => handleSubmitJob(data as CandidateInterfaceCreate))}
                className='mx-10 p-6 rounded-xl bg-white'>
                {/* left */}
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-4  '>
                        <div className='flex items-center h-fit'>
                            <label className='w-40 font-bold' htmlFor='role'>Candidate{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <div className='flex flex-col gap-2 mt-3'>
                                <Controller
                                    name="candidate"
                                    control={control}
                                    rules={{ required: messages.ME002 }}
                                    render={({ field: { onChange, value } }) => (
                                        <AsyncPaginate
                                            isClearable
                                            placeholder="Select a candidate" // Your placeholder text here
                                            styles={selectStyles}
                                            value={value}
                                            loadOptions={loadOptionsCandidate}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                {errors.candidate && <p role="alert" className='text-red-500   mt-3'>{errors.candidate.message?.toString()}</p>}                        </div>
                        </div>
                        <div className='flex items-center h-fit'>
                            <label className='w-40 font-bold' htmlFor='role'>Position{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <div className='flex flex-col gap-2 mt-3'>
                                <Controller
                                    name="position"
                                    control={control}
                                    rules={{ required: messages.ME002 }}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            isClearable
                                            placeholder="Select a position" // Your placeholder text here
                                            styles={selectStyles}
                                            value={value}
                                            onChange={onChange}
                                            options={positionList as any}
                                        />
                                    )}
                                />
                                {errors.position && <p role="alert" className='text-red-500  mt-3'>{errors.position.message?.toString()}</p>}
                            </div>
                        </div>
                        <div className='flex items-center h-fit'>
                            <label className='w-40 font-bold' htmlFor='Approver'>Approver{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <div className='flex flex-col gap-2 mt-3'>
                                <Controller
                                    name="approver"
                                    control={control}
                                    rules={{ required: messages.ME002 }}
                                    render={({ field: { onChange, value } }) => (
                                        <AsyncPaginate
                                            isClearable
                                            placeholder="Select an approver" // Your placeholder text here
                                            styles={selectStyles}
                                            value={value}
                                            loadOptions={loadOptionsApprover}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                {errors.approver && <p role="alert" className='text-red-500  mt-3'>{errors.approver.message?.toString()}</p>}
                            </div>
                        </div>

                        <div className='flex items-center h-fit mt-3'>
                            <label className='w-40 font-bold' htmlFor='role'>Interview Info{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <div className='flex flex-col gap-2 '>
                                <Controller
                                    name="interviewInfo"
                                    control={control}
                                    rules={{ required: messages.ME002 }}
                                    render={({ field: { onChange, value } }) => (
                                        <AsyncPaginate
                                            isClearable
                                            value={value && { ...value, label: value?.titleSelected || value.label }}
                                            placeholder="Select an interviewInfo title" // Your placeholder text here
                                            styles={selectStyles}
                                            loadOptions={loadOptionsInterview}
                                            onChange={(option) => {
                                                onChange(option);
                                                handleFetchNoteInterview(option?.value as any);
                                            }}
                                        />
                                    )}
                                />
                                {errors.interviewInfo && <p role="alert" className='text-red-500  mt-3'>{errors.interviewInfo.message?.toString()}</p>}
                            </div>
                        </div>
                        <div className='flex  flex-col h-fit mt-3'>
                            <div className='flex items-center 3'>
                                <label className='w-40 font-bold' htmlFor='role'>Contract Period{" "}
                                    <span className='text-red-500 '>*</span>
                                </label>
                                <div className='ml-2 flex items-center gap-2'>
                                    <label htmlFor='contractFromDate'>From</label>
                                    <input
                                        type='date' name='contractFromDate' className="  border-2 border-slate-100  p-2 rounded-xl"
                                        {...register("contractFromDate", {
                                            required: messages.ME002, validate: (value: any) => {
                                                if (value >= getValues("contractToDate")) {
                                                    return messages.ME017; // End date must be later than Start date
                                                } else {
                                                    return true; // Return true if validation passes
                                                }
                                            },
                                        })}
                                    />
                                    <label htmlFor='contractToDate'>To</label>
                                    <input
                                        type='date' name='contractToDate' className="  border-2 border-slate-100  p-2 rounded-xl"
                                        {...register("contractToDate", {
                                            required: messages.ME002, validate: (value: any) => {
                                                if (value <= getValues("contractFromDate")) {
                                                    return messages.ME018; // End date must be later than Start date
                                                } else {
                                                    return true; // Return true if validation passes
                                                }
                                            },
                                        })}
                                    />
                                </div>
                            </div>
                            <div className='flex items-center justify-between mt-6 ml-40'>
                                {errors.contractFromDate && <p role="contractFromDate" className='text-red-500  '>{errors.contractFromDate.message?.toString()}</p>}
                                {errors.contractToDate && <p role="contractToDate" className='text-red-500  '>{errors.contractToDate.message?.toString()}</p>}
                            </div>
                        </div>
                        <div className='flex items-center mt-3'>
                            <label className='w-40 font-bold' htmlFor='note'>Interview Notes{" "}
                            </label>
                            <p className='bg-slate-50 p-2 rounded-xl'>{note || "N/A"} </p>
                        </div>
                    </div>

                    {/* right */}
                    <div className={'flex flex-col gap-4'}>
                        <div className='flex items-center h-fit mt-4'>
                            <label className='w-40 font-bold' htmlFor='endDate'>Contract Type{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <div className='flex flex-col gap-2 '>
                                <Controller
                                    name="contractType"
                                    control={control}
                                    rules={{ required: messages.ME002 }}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            isClearable
                                            placeholder="Select contractType" // Your placeholder text here
                                            styles={selectStyles}
                                            value={value}
                                            onChange={onChange}
                                            options={ContractTypes as any}
                                        />
                                    )}
                                />
                                {errors.contractType && <p role="alert" className='text-red-500  mt-3'>{errors.contractType.message?.toString()}</p>}
                            </div>
                        </div>
                        <div className='flex items-center mt-4'>
                            <label className='w-40 font-bold' htmlFor='level'>Level{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Controller
                                name="level"
                                control={control}
                                rules={{ required: messages.ME002 }}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        isClearable
                                        placeholder="Select levels" // Your placeholder text here
                                        styles={selectStyles}
                                        value={value}
                                        onChange={onChange}
                                        options={levelList as any}
                                    />
                                )}
                            />
                        </div>
                        {errors.level && <p role="alert" className='text-red-500 ml-40 mt-3'>{errors.level.message?.toString()}</p>}
                        <div className='flex items-center mt-4'>
                            <label className='w-40 font-bold' htmlFor='department'>Department{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Controller
                                name="department"
                                control={control}
                                rules={{ required: messages.ME002 }}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        isClearable
                                        placeholder="Select department" // Your placeholder text here
                                        styles={selectStyles}
                                        value={value}
                                        onChange={onChange}
                                        options={departmentList as any}
                                    />
                                )}
                            />
                        </div>
                        {errors.department && <p role="alert" className='text-red-500 ml-40 mt-3'>{errors.department.message?.toString()}</p>}
                        <div className='flex flex-col '>
                            <div className='flex items-center'>
                                <label className='w-40 font-bold' htmlFor='recruiterOwner'>Recruiter Owner{" "}
                                    <span className='text-red-500 '>*</span>
                                </label>
                                <Controller
                                    name="recruiterOwner"
                                    control={control}
                                    rules={{ required: messages.ME002 }}
                                    render={({ field: { onChange, value } }) => (
                                        <AsyncPaginate
                                            isClearable
                                            placeholder="Select an recruiter" // Your placeholder text here
                                            styles={selectStyles}
                                            value={value}
                                            loadOptions={loadOptionsRecruiter}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                            </div>
                            {errors.recruiterOwner && <p role="alert" className='text-red-500 ml-40 mt-3'>{errors.recruiterOwner.message?.toString()}</p>}
                            <Button
                                onPress={() => {
                                    setValue('recruiterOwner', { value: userData.id, label: `${userData.fullName} (${userData.username})` })
                                }}
                                className='block mt-4 w-24 ml-40'>
                                Assign me
                            </Button>
                        </div>
                        <div className='flex items-center mt-4'>
                            <label className='w-40 font-bold' htmlFor='dueDate'>Due date{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <input
                                min={`${new Date().toISOString().split('T')[0]}`}
                                type='date'
                                placeholder="Enter basic salary..."
                                className="border-1 p-3 mt-3
                                   sm:mr-4 sm:mb-0  w-96 rounded-md
                                 outline-none ring-blue-600 focus:ring-1 "
                                {...register("dueDate", { required: messages.ME002 })}
                                aria-invalid={errors.title ? "true" : "false"}
                            />
                        </div>
                        {errors.dueDate && <p role="dueDate" className='text-red-500 ml-40 mt-3'>{errors.dueDate.message?.toString()}</p>}
                        <div className='flex items-center mt-4'>
                            <label className='w-40 font-bold' htmlFor='level'>Basic salary{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <input
                                type='number'
                                placeholder="Enter basic salary..."
                                className="border-1 p-3 mt-3
                                   sm:mr-4 sm:mb-0  w-96 rounded-md
                                 outline-none ring-blue-600 focus:ring-1 "
                                {...register("basicSalary", { required: messages.ME002 })}
                                aria-invalid={errors.title ? "true" : "false"}
                            />
                        </div>
                        {errors.basicSalary && <p role="dueDate" className='text-red-500 ml-40 mt-3'>{errors.basicSalary.message?.toString()}</p>}
                        <div className='flex items-center mt-4'>
                            <label className='w-40 font-bold' htmlFor='level'>Note{" "}
                            </label>
                            {/* TODO: format description */}
                            <Textarea
                                minRows={500}
                                variant='bordered'
                                maxLength={500}
                                type='text'
                                placeholder="Type a note..."
                                className={`mt-3 w-96  outline-none ring-blue-600 focus:ring-1   mb-2
                                   rounded-md`}
                                {...register("note", { required: false, maxLength: 500 })}
                                aria-invalid={errors.note ? "true" : "false"}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-10 space-x-2">
                    {isInterviewer ?
                        <Button type='submit' size='lg' className="grid  cursor-pointer select-none rounded-md border
                 bg-gradient-to-r from-sky-400 to-blue-500 bg-indigo-500 py-2 px-5
                 text-center align-middle text-sm text-white shadow font-bold
                 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600
              focus:bg-indigo-600 focus:text-white focus:shadow-none">
                            Submit result
                        </Button> : <Button type='submit' size='lg' className="grid  cursor-pointer select-none rounded-md border
                 bg-gradient-to-r from-sky-400 to-blue-500 bg-indigo-500 py-2 px-5
                 text-center align-middle text-sm text-white shadow font-bold
                 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600
              focus:bg-indigo-600 focus:text-white focus:shadow-none">
                            Submit
                        </Button>
                    }
                    <Button onPress={() => router.push("/offer/offer-list")} size='lg' className="grid  cursor-pointer select-none rounded-md
                                         py-2 px-5
                                    text-center align-middle text-sm text-black hover:bg-slate-100   font-bold
                                      focus:shadow-none">Cancel</Button>
                </div>
                {/* submit */}

            </form >
        </>
    )
}

export default FormOffer