import { menuStore } from "@/store/menuStore"
import { useStore } from "zustand"
import FilesPanel from "./FilesPanel"

export default function Panel() {
  const { active } = useStore(menuStore)

  return (
    active ? (
      <aside className="bg-neutral-900 h-full w-50 p-3 overflow-y-auto">
        {active === 'archive' && <FilesPanel />}
      </aside>
    ) : null
  )
}