'use client';

import messages from '@/messages/messages';
import { redirect, useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getCookie, setCookie, deleteCookie, hasCookie, getCookies } from 'cookies-next';
import { apiAuthSignIn } from '@/api/authApi';
import { useLoading } from '@/hooks/useLoading';
import useSpinner from '@/hooks/useSpinner';
import Link from 'next/link';

const LoginPage = () => {
    const router = useRouter()
    const params = useParams();
    const redirectUrl = new URLSearchParams(window.location.search).get('redirect');

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm()

    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 60 * 1000); // Set expiration to 60 seconds from now


    const { startLoading, stopLoading, SpinnerMain, isLoading } = useSpinner()
    //TODO: remember me
    const handleSubmitLogin = async (data: any) => {
        try {
            startLoading()
            const userData = await apiAuthSignIn({
                username: data.username,
                password: typeof data.password !== 'number' ? data.password : Number(data.password)
            });
            if (userData) {
                // Assuming the response contains the user data
                const { token, ...userInfo } = userData;
                console.log("userData", userData)

                // Save the user data in localStorage
                localStorage.setItem('userData', JSON.stringify(userInfo));

                setCookie('token', token, { maxAge: Number(expirationDate) });

                toast.success('Login successfully');
                router.push(decodeURIComponent(redirectUrl || '/')); // Redirect to the URL specified in the redirect query parameter
            }
            else {
                stopLoading()
                toast.error(messages.ME001);
            }
        }
        catch (error) {
            stopLoading()
            console.log(error)
        }
    }
    return (
        <div className="flex min-h-screen items-center justify-center text-gray-600 bg-gray-50">
            <div className="relative">
                <div className="hidden sm:block h-56 w-56 text-indigo-300 absolute a-z-10 -left-20 -top-20">
                    <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(0.6) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='none' /><path d='M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5' strokeWidth='1' stroke='none' fill='currentColor' /></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(#a)' /></svg>
                </div>
                <div className="hidden sm:block h-28 w-28 text-indigo-300 absolute a-z-10 -right-20 -bottom-20">
                    <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='b' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(0.5) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='none' /><path d='M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5' strokeWidth='1' stroke='none' fill='currentColor' /></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(#b)' /></svg>
                </div>
                <div className="relative flex flex-col sm:w-[26rem] rounded-xl border-gray-400 bg-white shadow-medium px-4">
                    <div className="flex-auto p-6">
                        <div className="mb-10 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden">
                            <img src="https://cdn-icons-png.freepik.com/256/13065/13065925.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid" className='w-10 mr-3' alt="" />
                            <a href="#" className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-sky-400 to-blue-500  bg-clip-text text-transparent no-underline">
                                <span className="flex-shrink-0 text-3xl font-black  tracking-tight opacity-100">IMS Recruitment</span>
                            </a>
                        </div>
                        <form onSubmit={handleSubmit((data: any) => handleSubmitLogin(data as any))}
                            id="" className="mb-4" action="#" method="POST">
                            <div className="mb-4">
                                <input
                                    type="text" className="block w-full cursor-text appearance-none rounded-md border
                                 border-gray-400 bg--100 py-4 px-5 text-sm outline-none
                                  focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                                    id="email"
                                    placeholder="Enter your username"
                                    {...register("username", { required: true })}
                                    aria-invalid={errors.fullName ? "true" : "false"}
                                />
                                {errors.username && <p role="alert" className='text-red-500  mt-3'>{messages.ME002}</p>}
                            </div>
                            <div className="mb-5 mt-5">
                                <div className="relative  w-full ">
                                    <input type="password" id="password"
                                        className="relative w-full block flex-auto cursor-text appearance-none
                                     rounded-md border border-gray-400 bg--100 py-4 px-5 text-sm
                                      outline-none focus:border-indigo-500 focus:bg-white
                                       focus:text-gray-600 focus:shadow"
                                        placeholder="Password"
                                        {...register("password", {
                                            required: messages.ME002,
                                            minLength: {
                                                value: 3,
                                                message: "Password must be at least 3 characters long",
                                            },
                                        })}
                                        aria-invalid={errors.password ? "true" : "false"}
                                    />
                                    {errors.password && <p role="alert" className='text-red-500  mt-3'>{errors.password.message as string}</p>}
                                </div>
                            </div>
                            <div className="mb-4">
                                {/* <div className="block">
                                    <Checkbox color='primary' defaultSelected>Remember me?</Checkbox>
                                </div> */}
                            </div>
                            <div className="mb-4">

                                {isLoading ?
                                    <button disabled type='submit' className={`grid w-full cursor-pointer select-none rounded-md border 
                                 py-4 px-5
                                text-center align-middle text-sm text-white shadow font-bold
                                bg-slate-400 hover:text-white`} >
                                        Signing in...
                                    </button>
                                    : <button type='submit' className={`grid w-full cursor-pointer select-none rounded-md border 
                               bg-gradient-to-r from-sky-400 to-blue-500 bg-indigo-500 py-4 px-5
                               text-center align-middle text-sm text-white shadow font-bold
                               hover:border-indigo-600 hover:bg-indigo-600 hover:text-white
                              `} >
                                        Sign in
                                    </button>}

                            </div>
                        </form>
                        <div className="flex justify-between">
                            <Link href="/forgot-password" className="cursor-pointer mx-auto text-black no-underline hover:text-blue-500">
                                <p className="text-sm ">Forgot Password?</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    )
}

export default LoginPage