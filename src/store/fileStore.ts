import { create } from "zustand"
import { persist } from "zustand/middleware"
import { HistoryType } from "../types"
import { v4 as uuidv4 } from "uuid"

type FileStoreType = {
    activeFile: string | null,
    history: HistoryType[],
    setActiveFile: (id: HistoryType['id'] | null) => void,
    setHistory: (h: HistoryType) => void,
    clearHistory: () => void,
    editHistoryTitle: (id: HistoryType['id'], title: string) => void,
    editHistoryContent: (h: HistoryType) => void,
    removeHistory: (id: HistoryType['id']) => void,
    exportFile: (id: HistoryType['id']) => void,
    getActiveFile: ()=>HistoryType | null
}

export const fileStore = create<FileStoreType>()(
    persist(
        (set, get) => ({
            activeFile: null,
            history: [
                {
                    title: "ejemplo.psc", 
                    content: `Algoritmo Ejemplo
  Escribir "Hola Mundo"
FinAlgoritmo`, 
                    updatedAt: Date.now(), 
                    createdAt: Date.now(), 
                    id: uuidv4()
                },
            ],
            setActiveFile: (id) => {
                set((state) => ({...state, activeFile: id}))
            },
            setHistory: (newFile) => {
                // Verificar si ya existe un archivo con el mismo nombre
                const history = get().history
                const existingFileIndex = history.findIndex(
                    file => file.title.toLowerCase() === newFile.title.toLowerCase()
                )
                
                if (existingFileIndex >= 0) {
                    const baseName = newFile.title.replace(/\.psc$/, '')
                    const newTitle = `${baseName}_copy.psc`
                    newFile.title = newTitle
                }
                
                set((state) => ({...state, history: [...state.history, newFile]}))
            },
            clearHistory: () => {
                set((state) => ({...state, history: [], activeFile: null}))
            },
            editHistoryContent: (h) => {
                const history = get().history
                const editHistoryIndex = history.findIndex(({ id }) => id === h.id)
                if (editHistoryIndex >= 0) {
                    const updatedHistory = [...history]
                    updatedHistory[editHistoryIndex] = {
                        ...updatedHistory[editHistoryIndex],
                        content: h.content,
                        updatedAt: Date.now()
                    }
                    set((state) => ({...state, history: updatedHistory}))
                }
            },
            editHistoryTitle: (hId, title) => {
                const history = get().history
                const editHistoryIndex = history.findIndex(({ id }) => id === hId)
                if (editHistoryIndex >= 0) {
                    // Comprobar si ya existe un archivo con ese nombre
                    const existingSameTitle = history.findIndex(
                        (file, index) => index !== editHistoryIndex && 
                        file.title.toLowerCase() === title.toLowerCase()
                    )
                    
                    // Si existe, añadir un sufijo
                    let finalTitle = title
                    if (existingSameTitle >= 0) {
                        const baseName = title.replace(/\.psc$/, '')
                        finalTitle = `${baseName}_${Date.now().toString().slice(-4)}.psc`
                    }
                    
                    const updatedHistory = [...history]
                    updatedHistory[editHistoryIndex] = {
                        ...updatedHistory[editHistoryIndex],
                        title: finalTitle,
                        updatedAt: Date.now()
                    }
                    set((state) => ({...state, history: updatedHistory}))
                }
            },
            removeHistory: (hId) => {
                const history = get().history
                const filteredHistory = history.filter(({ id }) => id !== hId)
                
                // Si eliminamos el archivo activo, debemos cambiar activeFile
                const activeFile = get().activeFile
                let newActiveFile = activeFile
                
                if (activeFile === hId) {
                    newActiveFile = filteredHistory.length > 0 ? filteredHistory[0].id : null
                }
                
                set((state) => ({
                    ...state, 
                    history: filteredHistory,
                    activeFile: newActiveFile
                }))
            },
            exportFile: (id) => {
                const { history } = get()
                const fileToExport = history.find(file => file.id === id)
                
                if (!fileToExport) return
                
                // Crear un objeto Blob con el contenido
                const blob = new Blob([fileToExport.content], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                
                // Crear un elemento <a> para descargar el archivo
                const a = document.createElement('a')
                a.href = url
                a.download = fileToExport.title
                document.body.appendChild(a)
                a.click()
                
                // Limpiar
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
            },
            getActiveFile: ()=>{
                const activeIndex = get().history.findIndex(({id})=>id === get().activeFile)
                if (activeIndex !== -1) return get().history[activeIndex]
                else return null
            }
        }),
        {
            name: 'file-storage',
        }
    )
)