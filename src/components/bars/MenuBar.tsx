import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'motion/react'
import { ChangeEvent, HTMLInputTypeAttribute, SVGProps, useEffect, useRef, useState } from 'react'

export type MenuBarProps = {
	items: {
		type?: HTMLInputTypeAttribute | "link"
		label: string
		Icon?: React.FC<SVGProps<SVGSVGElement>>
		iconColor?: string,
		strokeIcon?: "stroke-1" | "stroke-2" | "stroke-3" | "stroke-current"
		command: ((e: ChangeEvent<HTMLInputElement>) => void) | (() => void)
	}[]
}

export default function MenuBar({ items }: MenuBarProps) {
	const menuRef = useRef<HTMLDivElement>(null)
	const [menuOpen, setMenuOpen] = useState(false)

	useEffect(()=>{
		const handleClickOutside = (e: MouseEvent)=>{
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setMenuOpen(false)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)

		return ()=>{
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [])
	
	return (
		<div className='flex relative z-30 transition-opacity duration-150' ref={menuRef} >
			<button onClick={()=>setMenuOpen(!menuOpen)} className={`hover:bg-hover rounded-md p-0.5 cursor-pointer transition-colors duration-150 ${menuOpen && 'bg-hover'}`}>
				<EllipsisHorizontalIcon className='w-5 h-5' />
			</button>
			<AnimatePresence>
				{menuOpen ?
					<motion.div 
						key="box"
						transition={{ duration: 0.1 }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed left-52.5 top-22 bg-bg border-neutral-700 border shadow-md rounded-md flex flex-col gap-1 w-max p-1 py-1.5'
					>
						{items.map(({ type="button", label, Icon, iconColor, strokeIcon, command })=>{
							const handleEvent = (e: ChangeEvent<HTMLInputElement> | undefined)=>{
								if (e) command(e)
								else return command

								setMenuOpen(false)
							}
					
							return (
								<button key={label} className='hover:bg-hover transition-colors duration-150 py-1 px-2 rounded-sm flex items-center w-full gap-2 relative cursor-pointer z-20'>
									{ Icon && <Icon className={`w-5 h-5 ${strokeIcon} ${iconColor}`} /> }
									<p>{label}</p>
									{type === "file" && <input type={type} onChange={handleEvent} className='absolute w-full h-full opacity-0 z-10' />}
									{type !== "file" && <input type={type} onClick={handleEvent as ()=>void} className='absolute w-full h-full opacity-0 z-10 cursor-pointer'/>}
								</button>
							)
						})}
					</motion.div>
					: 
					null
				}
			</AnimatePresence>	
		</div>
	)
}
