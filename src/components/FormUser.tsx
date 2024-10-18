import { CandidateInterfaceCreate } from '@/interface/CandidateInterface';
import messages from '@/messages/messages';
import React from 'react'
import { BreadcrumbItem, Breadcrumbs, Button, Chip, SelectItem, Textarea } from '@nextui-org/react'
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { SelectInterface } from '@/interface/SelectInterface';
import { selectStyles } from "@/css/SelectStyle";

export interface PropsInterface {
    roleList: SelectInterface[] | undefined;
    departmentList: SelectInterface[] | undefined;
    handleSubmit: any;
    handleSubmitUser: any;
    register: any;
    isEmptyAlert: any;
    errors: any,
    formInitData?: {
        department: SelectInterface,
        role: SelectInterface,
        status: SelectInterface,
        gender: SelectInterface,
    },
    setAction: {
        setGender: any,
        setStatus: any,
        setRole: any,
        setDepartment: any
    }
}


export const userGenders = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
]
export const userStatusList = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
];

const FormUser = ({
    setAction,
    formInitData,
    roleList,
    departmentList,
    handleSubmit,
    handleSubmitUser,
    register,
    errors,
    isEmptyAlert
}: PropsInterface) => {
    const router = useRouter();
    return (
        <>
            <form onSubmit={handleSubmit((data: any) => handleSubmitUser(data as CandidateInterfaceCreate))}
                className='mx-10 p-6 rounded-xl bg-white'>
                <div className='flex justify-between'>
                    {/* left */}
                    <div className={'flex flex-col gap-4'}>
                        <div className='flex items-center'>
                            <label className='w-36 font-bold' htmlFor='fullName'>Full Name {" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <input
                                placeholder="Type a name..."
                                className="border-1 p-3 mt-3
                                   sm:mr-4 sm:mb-0  w-96 rounded-md
                                 outline-none ring-blue-600 focus:ring-1 "
                                {...register("fullName", { required: true })}
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
                                className="border-1 p-3 mt-3
                                   sm:mr-4 sm:mb-0  w-96 rounded-md
                                 outline-none ring-blue-600 focus:ring-1 "
                                aria-invalid={errors.dob ? "true" : "false"}
                                {...register("dob", { required: false })}
                            />
                        </div>
                        <div className='flex items-center '>
                            <label className='w-36 font-bold' htmlFor='phone'>Phone number{" "}
                            </label>
                            <input
                                type='number'
                                placeholder="Type a number..."
                                className=" border-1 p-3 mt-3
                                   sm:mr-4 sm:mb-0  w-96 rounded-md
                                 outline-none ring-blue-600 focus:ring-1 "
                                aria-invalid={errors.phone ? "true" : "false"}
                                {...register("phone", { required: false })}
                            />
                        </div>
                        <div className='flex items-center h-fit'>
                            <label className='w-36 font-bold' htmlFor='role'>Role{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <div className='flex  flex-wrap gap-2 '>
                                <Select
                                    isClearable
                                    placeholder="Select an role" // Your placeholder text here
                                    styles={selectStyles}
                                    value={formInitData?.role}
                                    onChange={setAction.setRole}
                                    options={roleList as any}
                                />
                            </div>
                        </div>
                        {(!formInitData?.role && isEmptyAlert) && <p className='text-start ml-36  text-red-500'>No role selected</p>}
                        <div className='flex items-center '>
                            <label className='w-36 font-bold'>Status{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Select
                                isClearable
                                placeholder="Select an status" // Your placeholder text here
                                styles={selectStyles}
                                value={formInitData?.status}
                                onChange={setAction.setStatus}
                                options={userStatusList as any}
                            />
                        </div>
                        {(!formInitData?.status && isEmptyAlert) && <p className='text-start ml-36 mr-6 text-red-500'>No status selected</p>}
                    </div>
                    {/* right */}
                    <div className='flex flex-col gap-4 '>
                        <div className='flex items-center'>
                            <label className='w-36 font-bold' htmlFor='email'>Email {" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <input
                                placeholder="Type a email..."
                                className="border-1 p-3 mt-3 w-96 rounded-md
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
                            <p role="alert" className=' text-red-500 ml-36'>{errors.email.message?.toString()}</p>}
                        <div className='flex items-center '>
                            <label className='w-36 font-bold' htmlFor='address'>Address {" "}
                            </label>
                            <input
                                placeholder="Type a address..."
                                className=" border-1 p-3 mt-3
                                   sm:mr-4 sm:mb-0 mb-2 w-96 rounded-md
                                 outline-none ring-blue-600 focus:ring-1 "
                                aria-invalid={errors.address ? "true" : "false"}
                                aria-label='Address'
                                {...register("address", { required: false })}
                            />
                        </div>
                        <div className='flex items-center '>
                            <label className='w-36 font-bold' htmlFor='gender'>Gender{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Select
                                isClearable
                                placeholder="Select an gender" // Your placeholder text here
                                styles={selectStyles}
                                value={formInitData?.gender}
                                onChange={setAction.setGender}
                                options={userGenders as any}
                            />
                        </div>
                        {(!formInitData?.gender && isEmptyAlert) && <p className='text-start ml-36 mr-6 text-red-500'>No gender selected</p>}
                        <div className='flex items-center '>
                            <label className='w-36 font-bold' htmlFor='department'>Department{" "}
                                <span className='text-red-500 '>*</span>
                            </label>
                            <Select
                                isClearable
                                placeholder="Select an department" // Your placeholder text here
                                styles={selectStyles}
                                value={formInitData?.department}
                                onChange={setAction.setDepartment}
                                options={departmentList as any}
                            />
                        </div>
                        {(!formInitData?.department && isEmptyAlert) && <p className='text-start ml-36 mr-6 text-red-500'>No department selected</p>}
                        <div className='flex items-center '>
                            <label className='w-36 font-bold' htmlFor='note'>Note{" "}
                            </label>
                            <Textarea
                                variant='bordered'
                                maxLength={500}
                                type='text'
                                placeholder="Type a note..."
                                className="mt-3 w-96 mb-2   rounded-md  "
                                {...register("note", { required: false, maxLength: 500 })}
                                aria-invalid={errors.note ? "true" : "false"}
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
                    <Button onPress={() => router.push("/user/user-list")} size='lg' className="grid  cursor-pointer select-none rounded-md
                                         py-2 px-5
                                    text-center align-middle text-sm text-black hover:bg-slate-100   font-bold
                                      focus:shadow-none">Cancel</Button>
                </div>
            </form>
        </>
    )
}

export default FormUser