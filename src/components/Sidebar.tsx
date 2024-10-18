'use client';

import { UserRoleEnum } from '@/enum/UserRoleEnum';
import useUserData from '@/hooks/userLocalStorage';
import { useStoreMenuName } from '@/util/zustandStorage';
import { Image } from '@nextui-org/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { AiFillHome } from 'react-icons/ai';
import { FaFileAlt, FaUserFriends } from 'react-icons/fa';
import { HiBriefcase } from 'react-icons/hi2';
import { MdTask } from 'react-icons/md';
import { RiCalendarScheduleFill } from 'react-icons/ri';

export const menuLink = [
    {
        id: 0,
        name: 'Home',
        icon: <AiFillHome />,
        img: 'https://cdn-icons-png.freepik.com/256/2626/2626923.png?semt=ais_hybrid',
        slug: '/'
    },
    {
        id: 1,
        name: 'Candidate',
        icon: <HiBriefcase />,
        img: 'https://cdn-icons-png.freepik.com/256/4091/4091517.png?semt=ais_hybrid',
        slug: '/candidate/candidate-list'
    },
    {
        id: 2,
        name: 'Job',
        icon: <MdTask />,
        img: 'https://cdn-icons-png.freepik.com/256/4972/4972201.png?semt=ais_hybrid',
        slug: '/job/job-list'
    },
    {
        id: 3,
        name: 'Interview Schedule',
        icon: <RiCalendarScheduleFill />,
        img: 'https://cdn-icons-png.freepik.com/256/3448/3448286.png?semt=ais_hybrid',
        slug: '/interview/interview-list'
    },
    {
        id: 4,
        name: 'Offer',
        icon: <FaFileAlt />,
        img: 'https://cdn-icons-png.freepik.com/256/11714/11714379.png?semt=ais_hybrid',
        slug: '/offer/offer-list',
    },
    {
        id: 5,
        name: 'User',
        icon: <FaUserFriends />,
        img: "https://cdn-icons-png.freepik.com/256/9512/9512791.png?semt=ais_hybrid",
        slug: '/user/user-list'
    },
]


const Sidebar = () => {
    const [isLinkActive, setLinkActive] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const { userData } = useUserData()
    // Use a state to store the filtered menu links
    const [filteredMenuLink, setFilteredMenuLink] = useState([] as any);


    useEffect(() => {
        const userRoles = userData?.roles || [];
        const isAdmin = userRoles.includes(UserRoleEnum.ADMIN);
        const isInterviewer = userRoles.includes(UserRoleEnum.INTERVIEWER);

        if (isAdmin) {
            setFilteredMenuLink(menuLink);
        } else if (isInterviewer) {
            setFilteredMenuLink(menuLink.filter(link => [1, 2, 3].includes(link.id)));
        } else {
            setFilteredMenuLink(menuLink.filter(link => link.id !== 5));
        }
    }, [userData]);

    const setMenuName = useStoreMenuName(
        (state: any) => state.setMenuName
    );
    const handleRedirect = (item: any) => {
        setLinkActive(item.slug)
        setMenuName(item.name)
    }
    //todo: BRL-23-01
    return (
        <div
            onMouseOver={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}
            className="min-h-[50rem]  bg-[#f5f5f7]">
            <div className={`h-full  transition-width ${isHovered ? 'w-64 transition-all' : 'w-20 transition-all'} `}>
                <div className="flex h-full flex-grow flex-col overflow-y-auto rounded-br-xl  bg-white pt-5 shadow-sm">
                    <Link onClick={() => handleRedirect({ name: "Home", slug: "/" })} href={"/"} className={`flex gap-3  items-center px-4  ${isHovered && 'ml-10 transition-all'}`}>
                        <img className="h-12 w-auto max-w-full align-middle" src="https://cdn-icons-png.freepik.com/256/13065/13065925.png?ga=GA1.1.1725227974.1708702988&semt=ais_hybrid" alt="" />
                        {isHovered && <span className='font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-indigo-500
                        text-transparent bg-clip-text text-3xl transition-all
                        '>IMS</span>}
                    </Link>

                    <div className="flex mt-3 ml-2 flex-1 flex-col">
                        <nav className="flex-1 mt-8 flex gap-5 flex-col">
                            {filteredMenuLink.map((item: any, index: number) => (
                                <Link key={index} onClick={() => handleRedirect(item)}
                                    href={item.slug} title="" className={`flex cursor-pointer py-3 items-center transition-all
                                     px-4 text-xl font-medium text-blue-500 outline-none  h-16
                                      duration-100 ease-in-out focus:border-l-4 ${isLinkActive === item.slug ? 'border-l-4 border-blue-500 bg-slate-50' : ''}`}>
                                    {/* <span className='mr-2 text-2xl transition-all'>
                                        {item.icon}
                                    </span> */}
                                    <img className='w-8 mr-6' src={item.img} alt={item.name} />
                                    <span className='transition-all'>
                                        {item.id == 3 ? (isHovered && 'Interview') : (isHovered && item.name)}

                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Sidebar
