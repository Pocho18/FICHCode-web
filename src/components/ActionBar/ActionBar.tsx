import { fileStore } from "@/store/fileStore"
import { HistoryType } from "@/types/index"
import { PlayIcon, StopIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"
import { useStore } from "zustand"

export default function ActionBar() {
  const { activeFile, getActiveFile } = useStore(fileStore)
	const [active, setActive] = useState<HistoryType | null>(null)
	const [exec, setExec] = useState(false)

	useEffect(()=>{
		if (!activeFile) return
		setActive(getActiveFile())
	}, [activeFile])

  return (
    <aside className="flex w-full text-neutral-300 py-1 px-4 items-center justify-between">
			<div>
				<h2 className="text-xl font-bold">{active?.title}</h2>
			</div>

			<div className="pt-2">
				<button 
					onClick={()=>setExec(!exec)}
					className={`flex items-center gap-1 border-2 p-1 rounded-md cursor-pointer font-extrabold
						${exec ? 'bg-red-500 border-red-500':'bg-green-600 border-green-600'}`}
				>
					{exec ? 
						<>
							<StopIcon className="w-6 h-6 stroke-3" />
							<p>Detener</p>
						</>
						:
						<>
							<PlayIcon className="w-6 h-6 stroke-3" />
							<p>Ejecutar</p>
						</>
						
					}
				</button>
			</div>
    </aside>
  )
}
