import { fileStore } from "@/store/fileStore";
import { HistoryType } from "@/types/index";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "zustand";
import Button from "../Button";

export default function FilesPanel() {
  // STATES
	const { history, clearHistory, editHistoryTitle, removeHistory, setHistory, setActiveFile } = useStore(fileStore)
	const [editingId, setEditingId] = useState<HistoryType['id'] | null>(null)
  const editableRef = useRef<HTMLInputElement>(null)

  // EVENTS HANDLERS
  const handleClickFile = (id: string)=>setActiveFile(id)

  const handleRemoveHistory = (id: HistoryType['id'])=>{
    removeHistory(id)
    setEditingId(null)
  }

  const handleEditTile = (id: HistoryType['id'])=>{
    const newTitle = editableRef.current?.value
    if (newTitle) {
      if (newTitle.length === 0) {
        const oldTitle = history.findIndex(h => h.id === id)
        editableRef.current!.value = history[oldTitle].title
      }else {
        if (newTitle.endsWith('.psc')) editHistoryTitle(id, newTitle)
        else editHistoryTitle(id, `${newTitle}.psc`)
      }
    }
    setEditingId(null)
  }

  const handleFileUp = (e: ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files
    if (!file) return

    const reader = new FileReader()
    reader.onload = ()=>{
      const newHistory: HistoryType = {
        id: uuidv4(),
        content: reader.result as string,
        title: file[0].name,
        updatedAt: new Date().getDate(),
        createdAt: file[0].lastModified
      }
      setHistory(newHistory)
    }
    reader.onerror = ()=> {
      console.error("Error al leer el archivo")
    }

    reader.readAsText(file[0], "UTF-8")
  }

  // HOOKS
  useEffect(()=>{
    if (!editableRef.current) return
    editableRef.current.focus()
  }, [editableRef.current])

  return (
    <>
        <div className="flex flex-col gap-3 text-neutral-400 text-sm font-semibold">
            <p>ARCHIVOS</p>

            <div className="w-full flex justify-center">
                <Button onClick={()=>{}}>
                  ABRIR ARCHIVO
                  <input type='file' className="absolute w-full h-full opacity-0 p-2 z-20 cursor-pointer" onChange={handleFileUp} />
                </Button>
            </div>

            <div className="w-full flex items-center justify-between mt-4">
                <p>HISTORIAL</p>
                
                <button className="cursor-pointer hover:text-red-400 transition-colors duration-200" title="Limpiar Historial" onClick={clearHistory}>
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>

						{history.length>0 ?
            <div className="space-y-2">
            {history.map(({ title, id })=>{
              const isEditing = editingId === id
              return (
                <button key={id} onClick={()=>handleClickFile(id)} className="group flex justify-between cursor-pointer p-2 bg-neutral-800 w-full hover:bg-neutral-700 focus:bg-neutral-700 transition-colors duration-200">
                  <input 
                    ref={isEditing ? editableRef:null}
                    readOnly={!isEditing} 
                    className={`w-max max-w-24 outline-white ${isEditing ? 'outline-1':'truncate cursor-pointer outline-none border-none'}`} 
                    defaultValue={title} 
                    title={title} 
                    onBlur={()=>handleEditTile(id)}
                    onDoubleClick={()=>setEditingId(id)}
                  />
                  <div className="flex gap-2">
                    <PencilIcon className={`w-4 opacity-0 hover:text-indigo-500 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 ${isEditing && 'text-indigo-500'}`} title="Editar Archivo" onClick={()=>setEditingId(id)} />
                    <TrashIcon className="w-4 opacity-0  hover:text-red-400 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-20" title="Eliminar Archivo" onClick={()=>handleRemoveHistory(id)} />	
                  </div>		  
                </button>
              )
            })}
          </div>
          :
          <p className="text-center text-neutral-500">Historial Vacío!</p>}
        </div>
    </>
  )
}
