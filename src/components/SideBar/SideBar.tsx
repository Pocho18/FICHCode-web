import { Cog8ToothIcon, DocumentDuplicateIcon, MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import SideBarIcons, { SideBarIconsProps } from "./SideBarIcons";
import { useStore } from "zustand";
import { menuStore } from "@/store/menuStore";

export default function SideBar() {
	const { active, setActive } = useStore(menuStore)
  const menus:  { Icon: SideBarIconsProps['Icon'], label: SideBarIconsProps['label'], id: SideBarIconsProps['id'] }[] = [
    { Icon: DocumentDuplicateIcon, label: "Archivo", id: "archive" },
    { Icon: MagnifyingGlassIcon, label: "Buscar", id: "search" },
    { Icon: Cog8ToothIcon, label: "Configuración", id: "settings" },
  ]

  return (
    <aside className="h-full flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          {menus.map(({ Icon, label, id })=>(
            <SideBarIcons Icon={Icon} label={label} id={id} setActive={setActive} active={active} key={id} />
          ))}
        </div>
          
        <SideBarIcons Icon={UserCircleIcon} label="Iniciar Sesión" id={"user"} setActive={setActive} active={active} />
    </aside>
  )
}
