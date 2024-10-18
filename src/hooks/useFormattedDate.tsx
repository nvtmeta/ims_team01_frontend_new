import { useState, useEffect } from 'react';

const useFormattedDate = (createdDate: string) => {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const createDate = new Date(createdDate);

        if (createDate.toDateString() === today.toDateString()) {
            setFormattedDate("today");
        } else {
            const formatted = `${createDate.getDate()}/${createDate.getMonth() + 1}/${createDate.getFullYear()}`;
            setFormattedDate(formatted);
        }
    }, [createdDate]);

    return formattedDate;
};

export default useFormattedDate;
