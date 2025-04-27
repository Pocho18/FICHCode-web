import { Outlet } from 'react-router-dom'
import SideBar from "@/components/bars/SideBar"
import TabsBar from "@/components/bars/TabsBar"
import Panel from "@/components/panels/Panel"
import { useStore } from 'zustand'
import { fileStore } from '@/contexts/fileStore'
import useFiles from '@/hooks/useFiles'
import { useEffect, useRef } from 'react'

export default function LayoutMain() {
	
	const { addFile } = useStore(fileStore)
	const { handleOpenFile } = useFiles()
	const appRef = useRef<HTMLDivElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	
	useEffect(()=>{
		const handleKeyDown = (e: KeyboardEvent)=>{
			if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "n") {
				addFile({ name: "Nuevo.psc", content: "Algoritmo\n    // Tu código aquí\nFinAlgoritmo", createdAt: new Date().toDateString(), updatedAt: new Date().toDateString() })
			}
			
			if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "o") {
				fileInputRef.current?.click()
			}
		}
		
		const node = appRef.current
		if (node) node.addEventListener("keydown", handleKeyDown)
			
		return ()=>{
			if (node) node.removeEventListener("keydown", handleKeyDown)
			}
	}, [])
	return (
		<div ref={appRef} tabIndex={0} className="w-screen h-screen bg-bg flex flex-col overflow-hidden">
			<input type="file" ref={fileInputRef} onChange={handleOpenFile} className="hidden" accept=".psc" />
			<header className="px-1 py-2">
				<button className="text-gray-100 font-bold text-2xl cursor-pointer py-0.5 px-2 hover:bg-hover transition-colors duration-100 rounded-lg">
					FICHCode
				</button>
			</header>
			
			<main className="flex h-full w-full overflow-hidden">
				<section className="flex h-full flex-shrink-0">
					<SideBar />
					<Panel />
				</section>
				<section className="grow overflow-hidden">
					<TabsBar />
					<div className="w-full h-full">
						<Outlet />
					</div>
				</section>
			</main>
		</div>
	)
}
