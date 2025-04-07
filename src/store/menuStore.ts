import { create } from "zustand"
import { MenuType } from "../types"

type MenuStoreType = {
    active: MenuType,
    setActive: (key: MenuType)=>void
}

export const menuStore = create<MenuStoreType>((set)=>({
    active: null,
    setActive: (key)=>{
        set((state)=>{
            const activeValue = state.active === key ? null:key
            return {...state, active: activeValue}
        })
    }
}))