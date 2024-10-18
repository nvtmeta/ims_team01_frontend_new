"use client"
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, User, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, useDisclosure } from "@nextui-org/react";
import { IoIosLogOut } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { menuLink } from "./Sidebar";
import { useStoreMenuName } from "@/util/zustandStorage";
import useUserData from "@/hooks/userLocalStorage";
import ModalComponent from "./ModalComponent";
import { roleImages } from "@/app/(ims)/user/user-list/page";
import { fetchLogOut } from "../api/authApi";
import { deleteCookie } from "cookies-next";
import toast from "react-hot-toast";

const NavBar = () => {

    const menuName = useStoreMenuName((state: any) => state.menuName)

    const router = useRouter();

    const { userData } = useUserData()

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();


    const handleLogOut = async () => {
        await fetchLogOut()
        deleteCookie('token')
        localStorage.removeItem('userData');
        router.push("/login")
        toast.success('Logged out successfully')
    }

    return (
        <div className="flex  backdrop-blur-sm bg-white 
        p-4  items-center justify-between ">
            <p className="font-bold text-black text-3xl">{menuName}</p>
            <div className="flex items-center gap-4 mr-4">
                <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                        <User
                            className="cursor-pointer font-bold bg-slate-100 rounded-2xl p-3"
                            name={userData.fullName}
                            description={`${userData.departmentName} department`}
                            avatarProps={{
                                src: (userData?.roles && userData.roles.length > 0 && roleImages[userData.roles[0]]) || roleImages.Default
                            }}
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User Actions" variant="flat">
                        <DropdownItem key="profile" className="h-14 gap-2">
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold">{userData.email}</p>
                        </DropdownItem>
                        <DropdownItem onPress={onOpen} key="logout" color="danger">
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <ModalComponent type='logout' fetchSource={handleLogOut} isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    title={"Are you sure you want to log out?"} />
            </div>
        </div>
    );
}


export default NavBar