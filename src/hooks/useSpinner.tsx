import { CircularProgress } from '@nextui-org/react';
import { useState } from 'react';

const useSpinner = () => {
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = () => {
        setIsLoading(true);
    };

    const stopLoading = () => {
        setIsLoading(false);
    };

    const SpinnerMain = () => {
        return isLoading ? (
            <div className="w-full h-full flex justify-center items-center z-50">
                <div className="absolute inset-0  bg-opacity-20 "></div>
                <div className="relative">
                    <CircularProgress label="Chờ chút nhé..." />
                </div>
            </div>

        ) : null;
    };

    return { startLoading, stopLoading, SpinnerMain, isLoading };
};

export default useSpinner;
