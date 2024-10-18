'use client';
import messages from '@/messages/messages';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { jwtDecode } from "jwt-decode";
import { fetchResetPassword, fetchValidToken } from '@/api/authApi';
import toast from 'react-hot-toast';
import { setCookie } from 'cookies-next';

const resetPassPage = () => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        getValues
    } = useForm()

    useEffect(() => {
        validationToken()
    }, [])

    const validationToken = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        console.log("token", token)
        if (token) {
            // Validate the token's expiration
            const isValidToken = await fetchValidToken(token);
            if (!isValidToken) {
                toast.error(messages.ME004)
                window.location.href = '/login'
            } else {
                const expirationDate = new Date();
                expirationDate.setTime(expirationDate.getTime() + 60 * 1000); // Set expiration to 60 seconds from now

                setCookie('token', token, { maxAge: Number(expirationDate) });
            }
        } else {
            window.location.href = '/login'
            console.log("Token not found in URL");
            // Display error message or prompt user to request a new link
        }

    }


    const handleResetPassword = async (data: any) => {
        console.log('data', data)
        await fetchResetPassword({ newPassword: data.password })
        toast.success("Reset password success")
        window.location.href = '/login'
    }

    return (
        <div className="flex min-h-screen items-center justify-center text-gray-600 bg-gray-50">
            <div className="relative">
                <div className="hidden sm:block h-56 w-56 text-indigo-300 absolute a-z-10 -left-20 -top-20">
                    <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(0.6) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='none' /><path d='M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5' stroke-width='1' stroke='none' fill='currentColor' /></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(#a)' /></svg>
                </div>
                <div className="hidden sm:block h-28 w-28 text-indigo-300 absolute a-z-10 -right-20 -bottom-20">
                    <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='b' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(0.5) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='none' /><path d='M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5' stroke-width='1' stroke='none' fill='currentColor' /></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(#b)' /></svg>
                </div>
                <div className="relative flex flex-col sm:w-[26rem] rounded-xl border-gray-400 bg-white shadow-medium px-4">
                    <div className="flex-auto p-6">
                        <div className="mb-10 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden">
                            <a href="#" className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-sky-400 to-blue-500  bg-clip-text text-transparent no-underline">
                                <span className="flex-shrink-0 text-3xl font-black  tracking-tight opacity-100">RESET PASSWORD</span>
                            </a>
                        </div>
                        <p className="mb-3 text-center text-gray-500">Please set your new password</p>

                        <form onSubmit={handleSubmit((data: any) => handleResetPassword(data as any))} className="mb-4" action="#" >
                            <div className="mb-4">
                                <label htmlFor="password" className="mb-2 inline-block text-xs font-medium uppercase text-gray-700">
                                    Password </label>
                                <input
                                    {...register("password", {
                                        required: messages.ME002,
                                        minLength: {
                                            value: 7,
                                            message: messages.ME007, // Add error message for minLength
                                        },
                                        pattern: {
                                            value: /^(?=.*\d)(?=.*[A-Za-z])(?=.*[0-9]).{7,}$/,
                                            message: messages.ME007
                                        },
                                    })}
                                    type="text" className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                                    placeholder="Enter your new password" />
                                {errors.password && <p className="text-red-500">{errors.password.message?.toString()}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="mb-2 inline-block text-xs font-medium uppercase text-gray-700">
                                    Re-Password </label>
                                <input
                                    {...register("rePassword", {
                                        required: messages.ME002,
                                        validate: (value) => {
                                            if (value !== getValues("password")) {
                                                return messages.ME006;
                                            }
                                        },
                                    })} // Add validate function to match password
                                    type="text" className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                                    placeholder="Enter your new password" />
                                {errors.rePassword && <p className="text-red-500">{errors.rePassword.message?.toString()}</p>}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type='submit' className="grid  cursor-pointer select-none rounded-md border 
                            bg-gradient-to-r from-sky-400 to-blue-500 bg-indigo-500 py-2 px-5 
                            text-center align-middle text-sm text-white shadow font-bold
                            hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600
                         focus:bg-indigo-600 focus:text-white focus:shadow-none"> Reset
                                </button>
                                <Link href="/login" className="grid  cursor-pointer select-none rounded-md 
                                         py-2 px-5 
                                    text-center align-middle text-sm text-black hover:bg-slate-100   font-bold
                                      focus:shadow-none">Cancel</Link>
                            </div>


                        </form>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default resetPassPage
