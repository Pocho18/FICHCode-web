import { fileStore, FileStoreType } from "@/contexts/fileStore";
import { 
  DocumentPlusIcon, 
  ArrowUpTrayIcon, 
  TrashIcon
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, useRef, useState } from "react";
import { useStore } from "zustand";
import MenuBar, { MenuBarProps } from "@/components/bars/MenuBar";
import useFiles from "@/hooks/useFiles";

export default function FilePanel() {
  const { 
    files, 
    activeFile, 
    editTitle, 
    moveFileToBin, 
    setActiveFile
  } = useStore(fileStore)  
  const { handleCreateFile, handleOpenFile } = useFiles()
  
  // ---------------- MENU ----------------
  const menuOptions: MenuBarProps['items'] = [
    { 
      label: "Subir Archivo", 
      Icon: ArrowUpTrayIcon, 
      iconColor: "text-blue-500", 
      type: "file", 
      command: handleOpenFile
    },
    { 
      label: "Crear Archivo", 
      Icon: DocumentPlusIcon, 
      iconColor: "text-orange-500", 
      command: handleCreateFile
    }
  ]
  
  // ----------- HTML ----------
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2.5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-bold">ARCHIVOS</h2>
        <MenuBar items={menuOptions} />
      </div>

      <div className="overflow-y-auto scroll-smooth scrollbar 
        [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:opacity-0
        dark:[&::-webkit-scrollbar-track]:bg-panel
        dark:[&::-webkit-scrollbar-thumb]:bg-[rgba(0,0,0,.3)]

        "
      >
        {files.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center">
            No hay archivos disponibles
          </div>
        ) : (
          files.map(({ name, id }) => (
            <FileItem 
              key={id} 
              name={name} 
              id={id} 
              activeFile={activeFile}
              editTitle={editTitle} 
              moveFileToBin={moveFileToBin} 
              setActiveFile={setActiveFile} 
            />
          ))
        )}
      </div>
     </div>
  )
}

//  *** ------------ ***
//       FILE ITEM 
// *** ------------- ***
type FileItemProps = {
  name: string
  id: string
  activeFile: FileStoreType['activeFile']
  editTitle: FileStoreType['editTitle']
  moveFileToBin: FileStoreType['moveFileToBin']
  setActiveFile: FileStoreType['setActiveFile']
}

function FileItem({ name, id, editTitle, moveFileToBin, setActiveFile, activeFile }: FileItemProps) {
  const [editing, setEditing] = useState(false)
  const inputTitleRef = useRef<HTMLInputElement>(null)
  
  // ---------- EDIT TITLE ------------
  const handleSelectTitle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (inputTitleRef.current) {
      setEditing(true)
      const pscIndex = name.indexOf('.psc')
      inputTitleRef.current.focus()
      inputTitleRef.current.readOnly = false
      inputTitleRef.current.setSelectionRange(0, pscIndex !== -1 ? pscIndex : name.length)
    }
  }

  const handleEditTitle = (e: ChangeEvent<HTMLInputElement>) => {
    if (inputTitleRef.current) {
      setEditing(false)
      inputTitleRef.current.readOnly = true
      
      let newName = e.target.value
      if (!newName.trim()) newName = name // No permitir nombres vacíos
      if (!newName.endsWith(".psc")) newName = `${newName}.psc`
      
      editTitle(id, newName)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      inputTitleRef.current?.blur()
    } else if (e.key === 'Escape') {
      setEditing(false)
      if (inputTitleRef.current) {
        inputTitleRef.current.value = name
        inputTitleRef.current.readOnly = true
      }
    }
  }

  // Manejar la eliminación con confirmación
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    moveFileToBin(id)
  }

  // ---------- HTML -----------
  return (
    <div 
      onClick={() => setActiveFile(id)} 
      className={`group px-3 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100 ${
        activeFile === id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500' : ''
      }`}
    >
      <div className="flex items-center flex-1 min-w-0" title={name}>
        <DocumentPlusIcon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
        <input 
          defaultValue={name} 
          onBlur={handleEditTitle} 
          onKeyDown={handleKeyDown}
          className={`w-full truncate text-sm ${
            editing 
              ? 'cursor-text bg-white dark:bg-gray-700 border border-blue-500 px-1 rounded' 
              : 'cursor-pointer outline-none border-none bg-transparent pointer-events-none'
          }`}
          ref={inputTitleRef} 
          readOnly={!editing}
          spellCheck={false}
        />
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <PencilIcon 
          title="Cambiar Nombre" 
          onClick={handleSelectTitle} 
          className={`w-4 h-4 hover:text-blue-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-100 ${
            activeFile === id && 'opacity-100'
          } ${editing && 'opacity-100 text-blue-400'}`} 
        />
        <TrashIcon 
          title="Eliminar"
          onClick={handleDelete} 
          className={`w-4 h-4 opacity-0 hover:text-red-400 group-hover:opacity-100 cursor-pointer transition-all duration-100 ${activeFile === id && 'opacity-100'}`} 
        />
      </div>
    </div>
  )
}