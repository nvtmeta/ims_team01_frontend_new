// app/providers.tsx
'use client'

import { UserRoleEnum } from '@/enum/UserRoleEnum';
import { LoadingMain, useLoading } from '@/hooks/useLoading';
import useUserData from '@/hooks/userLocalStorage';
import { NextUIProvider } from '@nextui-org/react'
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathName = usePathname()

    const { userData } = useUserData()

    const userRoles = userData?.roles || [];
    const isAdmin = userRoles.includes(UserRoleEnum.ADMIN);
    const isInterviewer = userRoles.includes(UserRoleEnum.INTERVIEWER);

    useEffect(() => {
        if (userData.id) {
            if (!isAdmin && pathName.startsWith('/user')) {
                router.push('/login')
                toast('You do not have permission to view this page')
            }
            if (isInterviewer && pathName.startsWith('/offer')) {
                router.push('/login')
                toast('You do not have permission to view this page')
            }
            console.log("Redirecting from admin route", isAdmin)
        }
    }, [pathName, userData])


    return (
        <NextUIProvider>
            <LoadingMain />
            {children}
        </NextUIProvider>
    )
}