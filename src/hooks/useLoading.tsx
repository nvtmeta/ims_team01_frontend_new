'use client';

import { CircularProgress } from '@nextui-org/react';
import { create } from 'zustand'

type SpinnerState = {
    isLoading: boolean;
};

type SpinnerActions = {
    startLoading: () => void;
    stopLoading: () => void;
};

const useLoading = create<SpinnerState & SpinnerActions>((set) => ({
    isLoading: false,
    startLoading: () => set({ isLoading: true }),
    stopLoading: () => set({ isLoading: false })
}));

const LoadingMain = () => {
    const isLoading = useLoading((state: any) => state.isLoading);

    return isLoading ? (
        <div className="fixed backdrop-blur-sm  top-0 left-0 w-full h-full flex justify-center items-center z-50">
            <div className="absolute inset-0"></div>
            <div className="relative">
                <CircularProgress label="loading..." />
            </div>
        </div>
    ) : null;
};

export { useLoading, LoadingMain };