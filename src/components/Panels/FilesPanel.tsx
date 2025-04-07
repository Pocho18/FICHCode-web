// src/components/Panels/FilesPanel.tsx
import { fileStore } from "@/store/fileStore";
import { HistoryType } from "@/types/index";
import { DocumentPlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "zustand";
import Button from "../Button";

export default function FilesPanel() {
  // STATES
  const { 
    history, 
    clearHistory, 
    editHistoryTitle, 
    removeHistory, 
    setHistory, 
    setActiveFile, 
    activeFile,
    openTab // Add openTab function from store
  } = useStore(fileStore)
  const [editingId, setEditingId] = useState<HistoryType['id'] | null>(null)
  const editableRef = useRef<HTMLInputElement>(null)

  // EVENTS HANDLERS
  // Update to open files in tabs
  const handleClickFile = (id: string) => openTab(id)

  // Eliminar archivo
  const handleRemoveHistory = (id: HistoryType['id']) => {
    if (activeFile === id) {
      const otherFiles = history.filter(h => h.id !== id)
      if (otherFiles.length > 0) {
        setActiveFile(otherFiles[0].id)
      } else {
        setActiveFile(null)
      }
    }
    
    removeHistory(id)
    setEditingId(null)
  }

  // Editar título
  const handleEditTitle = (id: HistoryType['id']) => {
    const newTitle = editableRef.current?.value
    if (newTitle) {
      if (newTitle.trim().length === 0) {
        const historyItem = history.find(h => h.id === id)
        if (historyItem && editableRef.current) {
          editableRef.current.value = historyItem.title
        }
      } else {
        // Asegurar que el archivo tenga extensión .psc
        const formattedTitle = newTitle.endsWith('.psc') ? newTitle : `${newTitle}.psc`
        editHistoryTitle(id, formattedTitle)
      }
    }
    setEditingId(null)
  }

  // Cargar archivos
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const reader = new FileReader()
    reader.onload = () => {
      const newHistory: HistoryType = {
        id: uuidv4(),
        content: reader.result as string,
        title: files[0].name.endsWith('.psc') ? files[0].name : `${files[0].name}.psc`,
        updatedAt: Date.now(),
        createdAt: files[0].lastModified
      }
      setHistory(newHistory)
      openTab(newHistory.id) // Open the file in a tab instead of just setting active file
    }
    reader.onerror = () => {
      console.error("Error al leer el archivo")
    }

    reader.readAsText(files[0], "UTF-8")
  }

  // Crear nuevo archivo
  const handleCreateNewFile = () => {
    const newFile: HistoryType = {
      id: uuidv4(),
      content: `Algoritmo Nuevo\n  // Tu código aquí\nFinAlgoritmo`,
      title: `nuevo_${history.length + 1}.psc`,
      updatedAt: Date.now(),
      createdAt: Date.now()
    }
    setHistory(newFile)
    openTab(newFile.id) // Open the new file in a tab
    setTimeout(() => setEditingId(newFile.id), 100)
  }

  // HOOKS
  useEffect(() => {
    if (editingId && editableRef.current) {
      editableRef.current.focus()
      // Seleccionar el nombre sin la extensión para facilitar la edición
      const value = editableRef.current.value
      const extensionIndex = value.lastIndexOf('.psc')
      if (extensionIndex > 0) {
        editableRef.current.setSelectionRange(0, extensionIndex)
      }
    }
  }, [editingId])

  return (
    <>
      <div className="flex flex-col gap-3 text-neutral-400 text-sm font-semibold">
        <p>ARCHIVOS</p>

        <div className="w-full flex justify-between gap-2">
          <Button onClick={handleCreateNewFile}>
            <DocumentPlusIcon className="w-5 h-5 mr-1" />
            NUEVO
          </Button>

          <Button onClick={() => {}}>
            ABRIR
            <input 
              type="file" 
              accept=".psc,.txt" 
              className="absolute w-full h-full opacity-0 p-2 z-20 cursor-pointer" 
              onChange={handleFileUpload} 
            />
          </Button>
        </div>

        <div className="w-full flex items-center justify-between mt-4">
          <p>HISTORIAL</p>
          
          <button 
            className="cursor-pointer hover:text-red-400 transition-colors duration-200" 
            title="Limpiar Historial" 
            onClick={clearHistory}
            disabled={history.length === 0}
          >
            <TrashIcon className={`w-5 h-5 ${history.length === 0 ? 'opacity-50' : ''}`} />
          </button>
        </div>

        {history.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.map(({ title, id }) => {
              const isEditing = editingId === id
              const isActive = activeFile === id
              
              return (
                <button 
                  key={id} 
                  onClick={() => handleClickFile(id)} 
                  className={`group flex justify-between cursor-pointer p-2 bg-neutral-800 w-full hover:bg-neutral-700 transition-colors duration-200 ${
                    isActive ? 'bg-neutral-700 border-l-2 border-indigo-500' : ''
                  }`}
                >
                  <input 
                    ref={isEditing ? editableRef : null}
                    readOnly={!isEditing} 
                    className={`w-max max-w-24 ${isEditing ? 'outline-white outline-1' : 'truncate cursor-pointer outline-none border-none'}`} 
                    defaultValue={title} 
                    title={title} 
                    onBlur={() => handleEditTitle(id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEditTitle(id)}
                    onDoubleClick={() => setEditingId(id)}
                  />
                  <div className="flex gap-2">
                    <PencilIcon 
                      className={`w-4 opacity-0 hover:text-indigo-500 group-hover:opacity-100 transition-opacity duration-200 ${isEditing ? 'text-indigo-500 opacity-100' : ''}`} 
                      title="Editar Archivo" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(id);
                      }} 
                    />
                    <TrashIcon 
                      className="w-4 opacity-0 hover:text-red-400 group-hover:opacity-100 transition-opacity duration-200" 
                      title="Eliminar Archivo" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveHistory(id);
                      }} 
                    />	
                  </div>		  
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-neutral-500">Historial Vacío!</p>
        )}
      </div>
    </>
  )
}