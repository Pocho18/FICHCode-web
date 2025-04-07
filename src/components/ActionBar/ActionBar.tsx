import { fileStore } from "@/store/fileStore"
import { HistoryType } from "@/types/index"
import { 
  ArrowDownTrayIcon, 
  DocumentDuplicateIcon, 
  PlayIcon, 
  StopIcon, 
  TrashIcon 
} from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"
import { useStore } from "zustand"

export default function ActionBar() {
  const { activeFile, getActiveFile, exportFile, removeHistory } = useStore(fileStore)
  const [active, setActive] = useState<HistoryType | null>(null)
  const [exec, setExec] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [executionTime, setExecutionTime] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!activeFile) return
    setActive(getActiveFile())
  }, [activeFile, getActiveFile])

  // Simular ejecución de código
  const handleExecution = () => {
    if (isRunning) {
      // Detener ejecución
      if (timer) clearInterval(timer)
      setIsRunning(false)
      setExec(false)
      setExecutionTime(0)
    } else {
      // Iniciar ejecución
      setIsRunning(true)
      setExec(true)
      
      // Simular tiempo de ejecución
      const interval = setInterval(() => {
        setExecutionTime(prev => prev + 0.1)
      }, 100)
      
      setTimer(interval)
      
      // Detener automáticamente después de 5 segundos (simulación)
      setTimeout(() => {
        clearInterval(interval)
        setIsRunning(false)
        setExec(false)
      }, 5000)
    }
  }

  // Manejar exportación del archivo actual
  const handleExport = () => {
    if (activeFile) {
      exportFile(activeFile)
    }
  }

  // Manejar duplicación del archivo actual
  const handleDuplicate = () => {
    // Esta función se podría implementar en el store
    console.log('Duplicar archivo', activeFile)
  }

  // Manejar eliminación del archivo actual
  const handleRemove = () => {
    if (activeFile) {
      if (confirm(`¿Estás seguro de eliminar "${active?.title}"?`)) {
        removeHistory(activeFile)
      }
    }
  }

  return (
    <aside className="flex w-full text-neutral-300 py-2 px-4 items-center justify-between border-b border-neutral-700 bg-neutral-900">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold truncate max-w-60">
          {active?.title || "Sin archivo"}
        </h2>
        
        {isRunning && (
          <span className="text-sm bg-neutral-700 px-2 py-0.5 rounded-md">
            {executionTime.toFixed(1)}s
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Botones de acciones para el archivo */}
        {activeFile && (
          <>
            <button 
              onClick={handleExport} 
              className="p-2 rounded-md hover:bg-neutral-700 transition-colors duration-150"
              title="Exportar archivo"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleDuplicate} 
              className="p-2 rounded-md hover:bg-neutral-700 transition-colors duration-150"
              title="Duplicar archivo"
            >
              <DocumentDuplicateIcon className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleRemove} 
              className="p-2 rounded-md hover:bg-neutral-700 hover:text-red-400 transition-colors duration-150"
              title="Eliminar archivo"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
            
            <div className="w-px h-6 bg-neutral-700 mx-1"></div>
          </>
        )}

        {/* Botón de ejecución */}
        <button 
          onClick={handleExecution}
          disabled={!activeFile}
          className={`flex items-center gap-2 border-2 py-1 px-3 rounded-md cursor-pointer font-bold transition-colors duration-200
            ${!activeFile ? 'opacity-50 cursor-not-allowed bg-neutral-700 border-neutral-700' : 
              exec ? 'bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700' : 
              'bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700'}`}
        >
          {exec ? 
            <>
              <StopIcon className="w-5 h-5" />
              <span>Detener</span>
            </>
            :
            <>
              <PlayIcon className="w-5 h-5" />
              <span>Ejecutar</span>
            </>
          }
        </button>
      </div>
    </aside>
  )
}