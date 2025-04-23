import { SVGProps } from "react";
import { useStore } from "zustand";
import { menuStore, MenuStoreType } from "@/contexts/menuStore";
import { DocumentDuplicateIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SideBar() {
  const { openMenu, setOpenMenu } = useStore(menuStore)
  const menuConfig: Pick<SideBarIconProps, 'Icon' | 'label' | 'id'>[] = [
    { Icon: DocumentDuplicateIcon, label: 'Archivo', id: 'files' },
    { Icon: MagnifyingGlassIcon, label: 'Buscar', id: 'search' }
  ]

  return (
    <aside className="h-full text-gray-500 flex flex-col gap-2">
      {menuConfig.map(({ Icon, label, id }) => (
        <SideBarIcon 
          key={id}
          Icon={Icon} 
          label={label} 
          id={id} 
          openMenu={openMenu} 
          setOpenMenu={setOpenMenu} 
        />
      ))}
    </aside>
  )
}

// ICONS
type SideBarIconProps = {
  Icon: React.FC<SVGProps<SVGSVGElement>>
  label: string
  id: MenuStoreType['openMenu'],
  openMenu: MenuStoreType['openMenu'],
  setOpenMenu: MenuStoreType['setOpenMenu']
}

function SideBarIcon({ Icon, label, id, openMenu, setOpenMenu }: SideBarIconProps){
  return (
    <button 
      className={`relative px-2 py-1 cursor-pointer flex items-center hover:text-neutral-200 transition-colors duration-100 ${openMenu === id && 'text-neutral-200'}`}
      title={label} 
      onClick={()=>setOpenMenu(id)}
    >
      <span className={`bg-gray-100 absolute left-0 h-full w-0.5 opacity-0 transition-opacity duration-100 ${openMenu === id && "opacity-100"}`}/> 
      <Icon className="w-9 h-10" />
    </button>
  )
}