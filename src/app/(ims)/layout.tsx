"use client"

import React, { useState } from 'react'
import DashboardPage from './dashboard/page'
import Sidebar from '@/components/Sidebar'
import NavBar from '@/components/NavBar'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {

    return (
        <section>
            <div className='flex min-h-fit bg-[#f5f5f7]'>
                <Sidebar />
                <div className='w-full mb-10'>
                    <NavBar />
                    {children}
                </div>
            </div>
        </section>
    )
}