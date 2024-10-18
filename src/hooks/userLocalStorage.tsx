// useUserData.js
import { UserRoleEnum } from '@/enum/UserRoleEnum';
import { UserAuthInterface } from '@/interface/UserInterface';
import { useState, useEffect } from 'react';

const useUserData = () => {
    const [userData, setUserData] = useState<UserAuthInterface>({} as UserAuthInterface);

    useEffect(() => {
        // Retrieve user data from localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []); // Empty dependency array to run the effect only once

    const checkRole = (...roles: string[]) => {
        return roles.some(role => userData.roles && userData.roles.includes(role));
    };

    const isInterviewerRole = () => {
        return checkRole(UserRoleEnum.INTERVIEWER);
    };


    return { userData, checkRole, isInterviewerRole };
};

export default useUserData;
