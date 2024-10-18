import { CandidateInterfaceCreate } from '@/interface/CandidateInterface';
import messages from '@/messages/messages';
import React from 'react'
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

export interface PropsInterface {
    handleSubmit: any;
    handleSubmitJob: any;
    register: any;
    isEmptyAlert: boolean;
    getValues: any,
    errors: any,
    formInitData?: {
        skills: SelectInterface[] | undefined,
        levels: SelectInterface[],
        benefits: SelectInterface[],
    },
    setAction: {
        setSkills: any,
        setLevels: any,
        setBenefits: any,
    }
}



export const interviewResult = [
    { label: 'Passed', value: 'PASSED' },
    { label: 'Failed', value: 'FAILED' },
];



const FormJob = ({
    setAction,
    formInitData,
    handleSubmit,
    handleSubmitJob,
    isEmptyAlert,
    register,
    getValues,
    errors
}: PropsInterface) => {
    const router = useRouter();
    const {
        data: skillList,
        error: skillListError,
        isLoading: skillListIsLoading
    } = useSWR<SelectInterface[]>(`/dropdown/skills`, fetchSkillListApi)
    const {
        data: levelList,
        error: levelListError,
        isLoading: levelListIsLoading
    } = useSWR<SelectInterface[]>(`/dropdown/levels`, fetchLevelListApi)
    const {
        data: benefitList,
        error: benefitListError,
        isLoading: benefitListIsLoading
    } = useSWR<SelectInterface[]>(`/dropdown/benefits`, fetchBenefitListApi)



    const { checkRole } = useUserData()

    const isInterviewer = !checkRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.RECRUITER)
    console.log("isInterviewer", isInterviewer)
    return (
        <>
            <form onSubmit={handleSubmit((data: any) => handleSubmitJob(data as CandidateInterfaceCreate))}
                className='mx-10 p-6 rounded-xl bg-white'>
                <div className='flex justify-between'>
                    {/* left */}
                    <div className={'flex flex-col gap-4'}>
                        <div className='flex items-center'>
                            <label className='w-32 font-bold' htmlFor='fullName'>Job title {" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <input
                                disabled={isInterviewer}
                                placeholder="Type a title..."
                                className="border-1 p-3 mt-3
                                   sm:mr-4 sm:mb-0  w-96 rounded-md
                                 outline-none ring-blue-600 focus:ring-1 "
                                {...register("title", { required: true })}
                                aria-invalid={errors.title ? "true" : "false"}
                            />
                        </div>
                        {errors.title && <p role="alert" className='text-red-500 ml-32 mt-3'>{messages.ME002}</p>}
                        <div className='flex items-center h-fit'>
                            <label className='w-32 font-bold' htmlFor='role'>Start Date{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <div className='flex flex-col gap-2 '>
                                <input
                                    disabled={isInterviewer}
                                    type='date' name='startDate' className="w-96  border-2 border-slate-100  p-3 rounded-md
                                    outline-none ring-blue-600 focus:ring-1 "
                                    {...register("startDate", {
                                        required: messages.ME002, validate: (value: any) => {
                                            if (value >= getValues("endDate")) {
                                                return messages.ME017; // End date must be later than Start date
                                            } else {
                                                return true; // Return true if validation passes
                                            }
                                        },
                                    })} />
                                {errors.startDate && <p role="startDate" className='text-red-500 ml-0   mt-3'>{errors.startDate.message?.toString()}</p>}
                            </div>
                        </div>
                        <div className='flex items-center h-fit'>
                            <label className='w-32 font-bold' htmlFor='role'>Salary range{" "}
                            </label>
                            <div className='flex justify-around items-center mt-3 gap-3'>
                                <div className={`flex items-center gap-2  p-3 
                                `}>
                                    <label htmlFor='salaryFrom'>From</label>
                                    <input
                                        className='border-2 border-slate-100 w-44 p-2 rounded-md
                                        outline-none ring-blue-600 focus:ring-1 "'
                                        type='number'
                                        name='salaryFrom'
                                        {...register("salaryFrom", {
                                            required: false
                                        })}
                                    />
                                </div>
                                <div className={`flex items-center gap-2 p-3 
                                    `}>
                                    <label htmlFor='salaryTo'>To</label>
                                    <input
                                        className='border-2 border-slate-100 w-44 p-2 rounded-md
                                        outline-none ring-blue-600 focus:ring-1 "'
                                        type='number'
                                        name='salaryTo'
                                        {...register("salaryTo", {
                                            required: messages.ME002, validate: (value: any) => {
                                                const salaryFrom = parseFloat(getValues("salaryFrom")); // Convert to float
                                                if (value <= salaryFrom) {
                                                    return 'Salary to must be greater than salary from'; // End date must be later than Start date
                                                } else {
                                                    return true; // Return true if validation passes
                                                }
                                            },
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                        {errors.salaryTo && <p role="date" className='text-red-500 ml-auto  mt-3'>{errors.salaryTo.message?.toString()}</p>}
                        <div className='flex items-center '>
                            <label className='w-32 font-bold' htmlFor='note'>Working address{" "}
                            </label>
                            <input
                                placeholder="Type an address..."
                                className="border-1 p-3 mt-3
                                   sm:mr-4 sm:mb-0  w-96 rounded-md
                                 outline-none ring-blue-600 focus:ring-1 "
                                {...register("workingAddress", { required: false })}
                                aria-invalid={errors.workingAddress ? "true" : "false"}
                            />
                        </div>
                    </div>
                    {/* right */}
                    {/* TODO: will done when job open list available */}
                    <div className='flex flex-col gap-4 '>

                        <div className='flex items-center mt-4'>
                            <label className='w-32 font-bold' htmlFor='Skills'>Skills{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Select
                                isClearable
                                isMulti
                                placeholder="Select skills" // Your placeholder text here
                                styles={selectStylesMulti}
                                value={formInitData?.skills}
                                onChange={setAction.setSkills}
                                options={skillList as any}
                            />
                        </div>
                        {(IsEmptyUtil(formInitData?.skills) && isEmptyAlert)
                            && <p className='text-start ml-32 mr-6 text-red-500'>No skills available</p>}

                        <div className='flex items-center h-fit'>
                            <label className='w-32 font-bold' htmlFor='endDate'>End Date{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <div className='flex flex-col gap-2 '>
                                <input
                                    disabled={isInterviewer}
                                    type='date' name='endDate' className="w-96  border-2 border-slate-100  p-3 rounded-md
                                    outline-none ring-blue-600 focus:ring-1 "
                                    {...register("endDate", {
                                        required: messages.ME002, validate: (value: any) => {
                                            if (value <= getValues("startDate")) {
                                                return messages.ME018; // End date must be later than Start date
                                            } else {
                                                return true; // Return true if validation passes
                                            }
                                        },
                                    })} />
                                {errors.endDate && <p role="startTime" className='text-red-500 ml-0   mt-3'>{errors.endDate.message?.toString()}</p>}
                            </div>
                        </div>
                        <div className='flex items-center mt-4'>
                            <label className='w-32 font-bold' htmlFor='Benefits'>Benefits{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Select
                                isClearable
                                isMulti
                                placeholder="Select Benefits" // Your placeholder text here
                                styles={selectStylesMulti}
                                value={formInitData?.benefits}
                                onChange={setAction.setBenefits}
                                options={benefitList as any}
                            />
                        </div>
                        {(IsEmptyUtil(formInitData?.benefits) && isEmptyAlert)
                            && <p className='text-start ml-32 mr-6 text-red-500'>No benefits available</p>}
                        <div className='flex items-center mt-4'>
                            <label className='w-32 font-bold' htmlFor='level'>Level{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Select
                                isDisabled={isInterviewer}
                                isClearable
                                isMulti
                                placeholder="Select levels" // Your placeholder text here
                                styles={selectStylesMulti}
                                value={formInitData?.levels}
                                onChange={setAction.setLevels}
                                options={levelList as any}
                            />
                        </div>
                        {(IsEmptyUtil(formInitData?.levels) && isEmptyAlert)
                            && <p className='text-start ml-32 mr-6 text-red-500'>No levels available</p>}
                        <div className='flex items-center mt-4'>
                            <label className='w-32 font-bold' htmlFor='description'>Description{" "}
                            </label>
                            <Textarea
                                minRows={500}
                                variant='bordered'
                                maxLength={500}
                                type='text'
                                placeholder="Type description..."
                                className={`mt-3 w-96  rounded-md
                                outline-none ring-blue-600 focus:ring-1`}
                                {...register("description", { required: false, maxLength: 500 })}
                                aria-invalid={errors.description ? "true" : "false"}
                            />
                        </div>
                    </div>
                </div>
                {/* submit */}
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
                    <Button onPress={() => router.push("/job/job-list")} size='lg' className="grid  cursor-pointer select-none rounded-md
                                         py-2 px-5
                                    text-center align-middle text-sm text-black hover:bg-slate-100   font-bold
                                      focus:shadow-none">Cancel</Button>
                </div>
            </form>
        </>
    )
}

export default FormJob