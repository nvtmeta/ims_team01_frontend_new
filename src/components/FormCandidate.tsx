import { CandidateInterfaceCreate } from '@/interface/CandidateInterface';
import messages from '@/messages/messages';
import React, { useEffect, useState } from 'react'
import { BreadcrumbItem, Breadcrumbs, Button, Chip, Code, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Popover, PopoverContent, PopoverTrigger, SelectItem, Spinner, Textarea } from '@nextui-org/react'
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { SelectInterface, SelectInterfacePage } from '@/interface/SelectInterface';
import { genders, highestLevels, statusList } from "@/store/ListCandidate";
import { selectStyles, selectStylesMulti } from "@/css/SelectStyle";
import { uploadImage } from '@/util/uploadFile';
import { AnchorIcon } from '@/icons/AnchorIcon';
import SelectRecruiter from './interview/SelectRecruiter';

export interface PropsInterface {
    skillList: SelectInterface[] | undefined;
    positionList: SelectInterface[] | undefined;
    handleSubmit: any;
    handleSubmitCandidate: any;
    register: any;
    errors: any,
    formInitData?: {
        highestLevel: {},
        position: {},
        status: {},
        gender: {},
        recruiter: SelectInterface,
        skills: any,
        cvUrl: string
    },
    setAction: {
        setGender: any,
        setHighestLevel: any,
        setStatus: any,
        setPosition: any,
        setRecruiter: any,
        setSkills: any,
        setUrlCv: any
    }
}


const FormCandidate = ({
    setAction,
    formInitData,
    skillList,
    positionList,
    handleSubmit,
    handleSubmitCandidate,
    register,
    errors
}: PropsInterface) => {
    const router = useRouter();

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const url = await uploadImage(e, 'team01');
            setAction.setUrlCv(url);
        } catch (error) {
            console.log("Error:", error);
            // Handle the error
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit((data: any) => handleSubmitCandidate(data as CandidateInterfaceCreate))}
                className='mx-10 p-6 rounded-xl bg-white'>
                <p className='text-blue-500 font-medium mb-4 text-xl'>I. Personal Information</p>


                <div className='flex justify-between'>
                    {/* left */}
                    <div>
                        <div className='flex items-center'>
                            <label className='w-36 font-bold' htmlFor='fullName'>Full Name {" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <input
                                placeholder="Type a name..."
                                className="ml-4 border-1 p-3 mt-3
                                   sm:mr-4 sm:mb-0 mb-2 w-96 rounded-md  
                                 outline-none ring-blue-600 focus:ring-1 "
                                {...register("fullName", { required: messages.ME002 })}
                                aria-invalid={errors.fullName ? "true" : "false"}
                            />
                        </div>
                        {errors.fullName && <p role="alert" className='text-red-500 ml-36 mt-3'>{messages.ME002}</p>}
                        <div className='flex items-center '>
                            <label className='w-36 font-bold' htmlFor='dob'>D.O.B {" "}
                            </label>
                            <input
                                type='date'
                                max={`${new Date().toISOString().split('T')[0]}`}
                                placeholder="Type a name..."
                                className="ml-4 border-1 p-3 mt-3
                                   sm:mr-4 sm:mb-0 mb-2 w-96 rounded-md  
                                 outline-none ring-blue-600 focus:ring-1 "
                                aria-invalid={errors.dob ? "true" : "false"}
                                {...register("dob", { required: false })}
                            />
                        </div>
                        {errors.dob && <p role="alert" className=' text-red-500 ml-36 mt-3'>{messages.ME002}</p>}
                        <div className='flex items-center '>
                            <label className='w-36 font-bold' htmlFor='phone'>Phone number{" "}
                            </label>
                            <input
                                type='number'
                                placeholder="Type a number..."
                                className="ml-4 border-1 p-3 mt-3
                                   sm:mr-4 sm:mb-0 mb-2 w-96 rounded-md  
                                 outline-none ring-blue-600 focus:ring-1 "
                                aria-invalid={errors.phone ? "true" : "false"}
                                {...register("phone", { required: false })}
                            />
                        </div>
                        {errors.phone && <p role="alert" className=' text-red-500 mt-3 ml-36'>{messages.ME002}</p>}

                    </div>
                    {/* right */}
                    <div className='flex flex-col gap-3'>
                        <div className='flex items-center'>
                            <label className='w-28 font-bold' htmlFor='email'>Email {" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <input
                                placeholder="Type a email..."
                                className="ml-4 border-1 p-3 mt-3 
                                   sm:mr-4 sm:mb-0 mb-2 w-96 rounded-md  
                                 outline-none ring-blue-600 focus:ring-1 "
                                aria-invalid={errors.email ? "true" : "false"}
                                aria-label='Email'
                                {...register("email", {
                                    required: messages.ME002, pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: messages.ME009
                                    }
                                })}
                            />
                        </div>
                        {errors.email &&
                            <p role="alert" className=' text-red-500 ml-32'>{errors.email.message?.toString()}</p>}
                        <div className='flex items-center '>
                            <label className='w-28 font-bold' htmlFor='address'>Address {" "}
                            </label>
                            <input
                                placeholder="Type a address..."
                                className="ml-4 border-1 p-3 mt-3
                                   sm:mr-4 sm:mb-0 mb-2 w-96 rounded-md  
                                 outline-none ring-blue-600 focus:ring-1 "
                                aria-invalid={errors.address ? "true" : "false"}
                                aria-label='Address'
                                {...register("address", { required: false })}
                            />
                        </div>
                        {errors.address && <p role="alert" className='text-red-500 ml-32'>{messages.ME002}</p>}
                        <div className='flex items-center'>
                            <label className='w-32 font-bold' htmlFor='gender'>Gender{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Select
                                isClearable
                                placeholder="Select an gender" // Your placeholder text here
                                styles={selectStyles}
                                value={formInitData?.gender}
                                onChange={setAction.setGender}
                                options={genders as any}
                            />

                        </div>
                        {errors.gender && <p role="alert" className=' text-red-500 ml-32'>{messages.ME002}</p>}

                    </div>
                </div>
                {/* II. professional information */}

                <p className='text-blue-500 mt-8 text-xl font-medium mb-4'>
                    II. Professional information</p>
                <div className='flex justify-between'>
                    {/* left */}
                    <div>
                        <div className='flex items-center'>
                            <label className='w-40 font-bold' htmlFor='fullName'>CV Attachment {" "}
                            </label>
                            <div className="flex items-center justify-between w-96 border-slate-100 border-2 border-solid 
                             p-4 rounded-md">
                                <input hidden onChange={(e) => handleImage(e)} type="file"
                                    className="w-full text-gray-500 font-bold text-sm 
                                     file:cursor-pointer cursor-pointer file:border-0
                                      file:py-2 file:px-4 file:mr-4   
                                      file:bg-gray-100 file:hover:bg-gray-100 file:text-black rounded"
                                    id="fileInput" // Add an ID to the input element
                                />
                                <label
                                    htmlFor="fileInput" // Reference the input element
                                    className="cursor-pointer flex justify-start items-center  text-black
                                    font-bold  rounded text-sm w-full"
                                >
                                    <AnchorIcon className='text-blue-500' />
                                    {/* <img className='w-10 object-contain  h-10' src='https://cdn-icons-png.freepik.com/256/7475/7475712.png?semt=ais_hybrid' /> */}
                                    <p className='ml-3  h-fit'>
                                        {/* @ts-ignore */}
                                        {formInitData?.cvUrl ? formInitData?.cvUrl!.match(/%2F([^?]+)\?/)[1].replace(/_(.*)$/, '') : 'Upload file'}
                                    </p>
                                </label>

                            </div>
                        </div>
                        <div className='flex items-center mt-5'>
                            <label className='w-40 font-bold' htmlFor='position'>Position {" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Select
                                isClearable
                                placeholder="Select an position" // Your placeholder text here
                                styles={selectStyles}
                                value={formInitData?.position}
                                onChange={setAction.setPosition}
                                options={positionList as any}
                            />
                        </div>
                        <div className='flex items-center mt-4'>
                            <label className='w-40 font-bold' htmlFor='phone'>Skills{" "}
                                <span className='text-red-500 '>*</span>
                            </label>

                            <Select
                                isClearable
                                isMulti
                                placeholder="Select an skill" // Your placeholder text here
                                styles={selectStylesMulti}
                                value={formInitData?.skills}
                                onChange={setAction.setSkills}
                                options={skillList as any}
                            />

                        </div>

                        {errors.skills && <p role="alert" className=' text-red-500 ml-32 mt-2'>{messages.ME002}</p>}
                        <SelectRecruiter recruiter={formInitData?.recruiter} setRecruiter={setAction.setRecruiter} />

                    </div>
                    {/* right */}
                    <div className='flex flex-col gap-3'>
                        <div className='flex items-center'>
                            <label className='w-28 font-bold' htmlFor='note'>Note: {" "}
                            </label>
                            <Textarea
                                variant='bordered'
                                maxLength={500}
                                type='text'
                                placeholder="Type a note..."
                                className=" p-3 mt-3
                                   sm:mr-4 sm:mb-0  w-96 rounded-md  "
                                {...register("note", { required: false, maxLength: 500 })}
                                aria-invalid={errors.note ? "true" : "false"}
                            />
                        </div>
                        {errors.note && <p role="alert" className=' text-red-500 ml-32 mt-2'>{messages.ME002}</p>}
                        <div className='flex items-center mt-4'>
                            <label className='w-32 font-bold' htmlFor='status'>Status {" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Select
                                isClearable
                                placeholder="Select an status" // Your placeholder text here
                                styles={selectStyles}
                                value={formInitData?.status}
                                onChange={setAction.setStatus}
                                options={statusList.slice(0, 2) as any}
                            />
                        </div>
                        {errors.status && <p role="alert" className=' text-red-500 ml-32 mt-2'>{messages.ME002}</p>}
                        <div className='flex items-center'>
                            <label className='w-32 font-bold' htmlFor='gender'>Year of Experience {" "}
                            </label>
                            <input
                                min={0}
                                type='number'
                                placeholder="Type a number..."
                                className="border-1 p-3 mt-3
                                   sm:mr-4 sm:mb-0 mb-2 w-96 rounded-md  
                                 outline-none ring-blue-600 focus:ring-1 "
                                {...register("yoe")}
                            />
                        </div>
                        <div className='flex items-center mt-4'>
                            <label className='w-32 font-bold' htmlFor='Highest Level'>Highest level {" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Select
                                isClearable
                                placeholder="Select an highest Level" // Your placeholder text here
                                styles={selectStyles}
                                value={formInitData?.highestLevel}
                                onChange={setAction.setHighestLevel}
                                options={highestLevels as any}
                            />
                        </div>
                    </div>
                </div>


                {/* submit */}
                <div className="flex justify-center mt-10 space-x-2">
                    <Button type='submit' size='lg' className="grid  cursor-pointer select-none rounded-md border 
                                    bg-gradient-to-r from-sky-400 to-blue-500 bg-indigo-500 py-2 px-5 
                                    text-center align-middle text-sm text-white shadow font-bold
                                    hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600
                                 focus:bg-indigo-600 focus:text-white focus:shadow-none">
                        Submit
                    </Button>
                    <Button onPress={() => router.push("/candidate/candidate-list")} size='lg' className="grid  cursor-pointer select-none rounded-md 
                                         py-2 px-5 
                                    text-center align-middle text-sm text-black hover:bg-slate-100   font-bold
                                      focus:shadow-none">Cancel</Button>
                </div>
            </form >
        </>
    )
}

export default FormCandidate