import { create } from "zustand";

export const useStoreMenuName = create((set) => ({
  menuName: "",
  setMenuName: (newState: string) => set({ menuName: newState }),
}));

export const useStoreBreadCrumbName = create((set) => ({
  breadcrumbName: "",
  setBreadCrumbName: (newState: string) => set({ breadcrumbName: newState }),
}));

export const useStoreBreadCrumbMainName = create((set) => ({
  breadcrumbMainName: "",
  setBreadCrumbMainName: (newState: string) =>
    set({ breadcrumbMainName: newState }),
}));
