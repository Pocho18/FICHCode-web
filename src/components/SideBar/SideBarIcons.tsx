import { MenuType } from "@/types/index"
import { ComponentType, SVGProps } from "react"

export type SideBarIconsProps = {
    Icon: ComponentType<SVGProps<SVGSVGElement>>,
    label: string,
    id: MenuType,
    setActive: (key: MenuType)=>void,
    active: MenuType
}

export default function SideBarIcons({ Icon, label, id, setActive, active }: SideBarIconsProps) {
  return (
    <button className="group cursor-pointer relative p-2 flex items-center" title={label} onClick={()=>setActive(id)}>
      {active === id && <span className="bg-neutral-200 w-0.5 h-full absolute left-0" />}
      <Icon className={`w-8 h-8 hover:text-neutral-200 transition-colors duration-100
        ${active === id ? 'text-neutral-200':'text-neutral-400'}`} />
    </button>
  )
}