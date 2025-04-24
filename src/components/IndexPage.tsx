import { DocumentPlusIcon, ArrowUpTrayIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import useFiles from "@/hooks/useFiles";
import { motion } from "motion/react";

export default function IndexPage() {
  const { handleCreateFile, handleOpenFile } = useFiles()
  const [tipIndex, setTipIndex] = useState(0)

  // Tips that will rotate
  const tips = [
    "Usa 'Ctrl+S' para guardar tu código.",
    "La estructura básica es: Algoritmo / FinAlgoritmo.",
    "Utiliza 'Si-Entonces-SiNo-FinSi' para estructuras condicionales.",
    "Crea bucles con 'Mientras-Hacer-FinMientras' o 'Repetir-Hasta Que'.",
    "Define variables con 'Definir nombre Como Tipo'."
  ]

  // Rotate tips every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Function to handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleOpenFile(e)
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-bg px-6">
      {/* Logo and welcome section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="flex items-center mb-2">
          <CodeBracketIcon className="w-8 h-8 text-blue-500 mr-2" />
          <h1 className="text-3xl font-bold text-gray-100">FICH<span className="text-blue-500">Code</span></h1>
        </div>
        <p className="text-gray-400 text-sm">Editor de pseudocódigo</p>
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="w-full max-w-2xl bg-panel rounded-lg border border-gray-800 overflow-hidden shadow-lg"
      >
        {/* Tip banner */}
        <div className="bg-blue-900/20 px-4 py-3 border-b border-gray-800">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-xs uppercase font-medium text-gray-400">Tip</span>
          </div>
          <div className="h-6 mt-1 relative overflow-hidden">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-gray-300"
            >
              {tips[tipIndex]}
            </motion.p>
          </div>
        </div>

        {/* Actions section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-200 mb-4">Comenzar</h2>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCreateFile}
              className="flex items-center gap-2 bg-panel hover:bg-hover transition-colors duration-200 text-gray-200 py-3 px-4 rounded border border-gray-700 hover:border-blue-500"
            >
              <DocumentPlusIcon className="w-5 h-5 text-blue-500" />
              <span>Crear nuevo archivo</span>
            </button>

            <label className="flex items-center gap-2 bg-panel hover:bg-hover transition-colors duration-200 text-gray-200 py-3 px-4 rounded border border-gray-700 hover:border-green-500 cursor-pointer">
              <ArrowUpTrayIcon className="w-5 h-5 text-green-500" />
              <span>Abrir archivo existente</span>
              <input
                type="file"
                accept=".psc"
                className="hidden"
                onChange={handleFileInputChange}
                multiple
              />
            </label>
          </div>
          
          {/* Recent files placeholder - could be implemented later */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Archivos recientes</h3>
            <div className="bg-selection/30 rounded p-4 text-center">
              <p className="text-sm text-gray-500">
                Tus archivos recientes aparecerán aquí
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Keyboard shortcuts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-6 grid grid-cols-2 gap-4 max-w-2xl w-full text-sm"
      >
        <div className="col-span-2">
          <h3 className="text-xs uppercase font-medium text-gray-500 mb-2">Atajos de teclado</h3>
        </div>
        {[
          { shortcut: "Ctrl+Alt+N", action: "Nuevo archivo" },
          { shortcut: "Ctrl+Alt+O", action: "Abrir archivo" },
          { shortcut: "Ctrl+Alt+S", action: "Guardar" },
          { shortcut: "Ctrl+Alt+E", action: "Ejecutar" }
        ].map((item, index) => (
          <div key={index} className="flex justify-between bg-panel border border-gray-800 rounded p-2">
            <span className="text-gray-400">{item.action}</span>
            <span className="bg-selection px-2 rounded text-xs font-mono text-gray-300">{item.shortcut}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}