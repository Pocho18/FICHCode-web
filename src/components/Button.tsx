import { ReactNode } from "react"

type ButtonProps = {
    children: ReactNode,
    onClick: ()=>void,
}

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className="text-neutral-200  bg-neutral-800 hover:bg-neutral-700 transition-colors duration-150
        font-bold uppercase text-sm text-center p-2 rounded-sm cursor-pointer relative flex">
        {children}
    </button>
  )
}
