import { create } from "zustand";

export type openMenuType = null | 'files' | 'search'

export type MenuStoreType = {
    openMenu: openMenuType,
    setOpenMenu: (key: openMenuType)=>void
}

export const menuStore = create<MenuStoreType>((set, get)=>({
    openMenu: null,
    setOpenMenu: (key)=>{
        const valueMenu = get().openMenu === key ? null:key
        set((state)=>({ ...state, openMenu: valueMenu }))
    }
})) 