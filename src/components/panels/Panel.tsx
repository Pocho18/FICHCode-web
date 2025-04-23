import { menuStore } from "@/contexts/menuStore"
import { useStore } from "zustand"
import FilePanel from "./FilePanel"
import { AnimatePresence, motion } from "motion/react"

export default function Panel() {
  const { openMenu } = useStore(menuStore)
    
  return (
    <AnimatePresence>
      {openMenu ?
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 192 }}
          exit={{ width: 0 }}
          transition={{ duration: 0.1 }}
          className="h-full w-48 bg-panel overflow-hidden text-gray-200"
        >
          {openMenu === "files" && <FilePanel />}
        </motion.div>
        :
        null
      }
    </AnimatePresence>
  )
}