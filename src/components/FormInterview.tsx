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
import { fetchPositionListApi, fetchSkillListApi } from '@/api/DropdownApi';
import useUserData from '@/hooks/userLocalStorage';
import { formatInterviewStatus, formatUserGender, getColorByInterviewStatus } from '@/util/FormatEnum';
import { UserRoleEnum } from '@/enum/UserRoleEnum';
import { Controller } from 'react-hook-form';
import { AsyncPaginate } from 'react-select-async-paginate';
import { loadOptionsJob, loadOptionsRecruiter } from '@/util/LoadOptions';

export interface PropsInterface {
    handleSubmit: any;
    handleSubmitInterview: any;
    register: any;
    isEmptyAlert: boolean;
    getValues: any,
    errors: any,
    control: any,
    formInitData?: {
        candidate: SelectInterface,
        job: SelectInterface,
        interviewers: SelectInterface[],
        recruiter: SelectInterface,
        result: SelectInterface,
    },
    setAction: {
        setInterviewers: any,
        setCandidate: any,
        setJob: any,
        setRecruiter: any,
        setResult: any
    }
}



export const interviewResult = [
    { label: 'Passed', value: 'PASSED' },
    { label: 'Failed', value: 'FAILED' },
];



const FormInterview = ({
    setAction,
    formInitData,
    handleSubmit,
    handleSubmitInterview,
    isEmptyAlert,
    register,
    getValues,
    control,
    errors
}: PropsInterface) => {
    const router = useRouter();
    const {
        data: interviewerPage,
        error: interviewerListError,
        isLoading: interviewerListIsLoading
    } = useSWR<InterviewerPageInterface>(`/user/role/interviewer`, fetchUserByRole)
    const { isInterviewerRole, checkRole } = useUserData()

    //todo:job requied true

    const isInterviewer = !checkRole(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.RECRUITER)
    console.log("isInterviewer", isInterviewer)
    return (
        <>
            <form onSubmit={handleSubmit((data: any) => handleSubmitInterview(data as CandidateInterfaceCreate))}
                className='mx-10 p-6 rounded-xl bg-white'>
                <div className='flex justify-between'>
                    {/* left */}
                    <div className={'flex flex-col gap-4'}>
                        <div className='flex items-center'>
                            <label className='w-40 font-bold' htmlFor='fullName'>Schedule title {" "}
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
                        {errors.title && <p role="alert" className='text-red-500 ml-40 mt-3'>{messages.ME002}</p>}
                        <div className='flex items-center '>
                            <SelectCandidate
                                recruiter={formInitData?.candidate} setRecruiter={setAction.setCandidate} />
                        </div>
                        {(!formInitData?.candidate && isEmptyAlert) && <p className='text-start ml-40 mr-6 text-red-500'>No candidate selected</p>}
                        <div className='flex items-center h-fit'>
                            <label className='w-40 font-bold' htmlFor='role'>Schedule time{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <div className='flex flex-col gap-2 '>
                                <input
                                    disabled={isInterviewer}
                                    type='date' name='date' className="w-96  border-2 border-slate-100  p-3 rounded-xl"
                                    {...register("date", { required: true })}
                                />
                                {errors.date && <p role="date" className='text-red-500  mt-3'>{messages.ME002}</p>}
                                <div className='flex justify-around items-center mt-3 gap-10'>
                                    {/* FIXME: only interviewer only have a right to update */}
                                    <div className={`flex items-center gap-2  border-2 border-slate-100 p-2 rounded-xl 
                                    ${isInterviewer ? 'bg-gray-100' : ''}
                                    `}>
                                        <label htmlFor='startTime'>From</label>
                                        <input
                                            disabled={isInterviewer}
                                            type='time'
                                            name='startTime'
                                            {...register("startTime", {
                                                required: messages.ME002, validate: (value: any) => {
                                                    if (value < new Date()) {
                                                        return messages.ME017; // Start date must be later than current date
                                                    } else if (value >= getValues("endTime")) {
                                                        return messages.ME018; // End date must be later than Start date
                                                    } else {
                                                        return true; // Return true if validation passes
                                                    }
                                                },
                                            })}
                                        />
                                    </div>
                                    <div className={`flex items-center gap-2  border-2 border-slate-100 p-2 rounded-xl 
                                    ${isInterviewer ? 'bg-gray-100' : ''}
                                    `}>
                                        <label htmlFor='endTime'>To</label>
                                        <input
                                            disabled={isInterviewer}
                                            type='time'
                                            name='endTime'
                                            {...register("endTime", {
                                                required: messages.ME002, validate: (value: any) => {
                                                    if (value <= getValues("startTime")) {
                                                        return messages.ME018; // End date must be later than Start date
                                                    } else {
                                                        return true; // Return true if validation passes
                                                    }
                                                },
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className='flex items-center justify-between'>
                                    {errors.startTime && <p role="startTime" className='text-red-500 ml-0   mt-3'>{errors.startTime.message?.toString()}</p>}
                                    {errors.endTime && <p role="endTime" className='text-red-500   mt-3'>{errors.endTime.message?.toString()}</p>}
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='note'>Note{" "}
                            </label>
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
                    {/* right */}
                    {/* TODO: will done when job open list available */}
                    <div className='flex flex-col gap-4 '>
                        <div className='flex items-center mt-4'>
                            <label className='w-40 font-bold' htmlFor='interviewers'>Job{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Controller
                                name="job"
                                control={control}
                                rules={{ required: false }}
                                render={({ field: { onChange, value } }) => (
                                    <AsyncPaginate
                                        isDisabled={isInterviewer}
                                        isClearable
                                        placeholder="Select a Job" // Your placeholder text here
                                        styles={selectStyles}
                                        value={value}
                                        loadOptions={loadOptionsJob}
                                        onChange={onChange}
                                    />
                                )}
                            />
                        </div>
                        {errors.job && <p role="alert" className='text-red-500 ml-40 mt-3'>{errors.job.message?.toString()}</p>}
                        <div className='flex items-center mt-4'>
                            <label className='w-40 font-bold' htmlFor='interviewers'>Interviewers{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Select
                                isDisabled={isInterviewer}
                                isClearable
                                isMulti
                                placeholder="Select interviewers" // Your placeholder text here
                                styles={selectStylesMulti}
                                value={formInitData?.interviewers}
                                onChange={setAction.setInterviewers}
                                options={interviewerPage?.content as any}
                            />
                        </div>
                        {((formInitData?.interviewers?.length === 0 || !formInitData?.interviewers) && isEmptyAlert)
                            && <p className='text-start ml-40 mr-6 text-red-500'>No interviewers available</p>}
                        {errors.email &&
                            <p role="alert" className=' text-red-500 ml-32'>{errors.email.message?.toString()}</p>}
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='address'>Location {" "}
                            </label>
                            <input
                                disabled={isInterviewer}
                                placeholder="Type a location..."
                                className=" border-1 p-3 mt-3
                                sm:mr-4 sm:mb-0 mb-2 w-96 rounded-md
                              outline-none ring-blue-600 focus:ring-1 "
                                aria-invalid={errors.location ? "true" : "false"}
                                aria-label='location'
                                {...register("location", { required: false })}
                            />
                        </div>
                        <SelectRecruiter recruiter={formInitData?.recruiter} setRecruiter={setAction.setRecruiter} />
                        {(!formInitData?.recruiter && isEmptyAlert) && <p className='text-start ml-40 mr-6 text-red-500'>No recruiter selected</p>}
                        <div className='flex items-center '>
                            <label className='w-40 font-bold' htmlFor='meetingId'>Meeting ID {" "}
                            </label>
                            <input
                                disabled={isInterviewer}
                                placeholder="Type meeting..."
                                className=" border-1 p-3 mt-3
                               sm:mr-4 sm:mb-0 mb-2 w-96 rounded-md
                             outline-none ring-blue-600 focus:ring-1 "
                                aria-invalid={errors.meetingId ? "true" : "false"}
                                aria-label='Address'
                                {...register("meetingId", { required: false })}
                            />

                        </div>
                        <div className='flex items-center mt-4'>
                            <label className='w-40 font-bold' htmlFor='Result'>Result{" "}
                            </label>
                            <Select
                                isDisabled={!isInterviewer}
                                isClearable
                                placeholder="Select Result" // Your placeholder text here
                                styles={selectStyles}
                                value={formInitData?.result}
                                onChange={setAction.setResult}
                                options={interviewResult as any}
                            />
                        </div>
                        <div className='flex items-center justify-start'>
                            <label className='w-40 font-bold' htmlFor='Status'>Status{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <div className='text-gray-600 font-medium  p-2 '>
                                <Chip
                                    size={"lg"}
                                    color={getColorByInterviewStatus(getValues("status") || "N/A") as ("primary" | "default" | "secondary" | "success" | "warning" | "danger")} // Type assertion
                                    className='  font-medium  p-2 '>
                                    {formatInterviewStatus(getValues("status") || "N/A")}
                                </Chip>
                            </div>
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
                    <Button onPress={() => router.push("/interview/interview-list")} size='lg' className="grid  cursor-pointer select-none rounded-md
                                         py-2 px-5
                                    text-center align-middle text-sm text-black hover:bg-slate-100   font-bold
                                      focus:shadow-none">Cancel</Button>
                </div>
            </form>
        </>
    )
}

export default FormInterview