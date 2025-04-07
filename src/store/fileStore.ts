// src/store/fileStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { HistoryType } from "../types"
import { v4 as uuidv4 } from "uuid"

type FileStoreType = {
    activeFile: string | null,
    history: HistoryType[],
    openTabs: string[],
    setActiveFile: (id: HistoryType['id'] | null) => void,
    setHistory: (h: HistoryType) => void,
    clearHistory: () => void,
    editHistoryTitle: (id: HistoryType['id'], title: string) => void,
    editHistoryContent: (h: HistoryType) => void,
    removeHistory: (id: HistoryType['id']) => void,
    exportFile: (id: HistoryType['id']) => void,
    getActiveFile: ()=>HistoryType | null,
    openTab: (id: string) => void,
    closeTab: (id: string) => void,
    closeAllTabs: () => void
}

export const fileStore = create<FileStoreType>()(
    persist(
        (set, get) => ({
            activeFile: null,
            openTabs: [], 
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
                set((state) => {
                    const openTabs = [...state.openTabs];
                    if (id && !openTabs.includes(id)) {
                        openTabs.push(id);
                    }
                    return {...state, activeFile: id, openTabs}
                })
            },
            setHistory: (newFile) => {
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
                set((state) => ({...state, history: [], activeFile: null, openTabs: []}))
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
                    const existingSameTitle = history.findIndex(
                        (file, index) => index !== editHistoryIndex && 
                        file.title.toLowerCase() === title.toLowerCase()
                    )
                    
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
                
                const activeFile = get().activeFile
                let newActiveFile = activeFile
                
                if (activeFile === hId) {
                    newActiveFile = filteredHistory.length > 0 ? filteredHistory[0].id : null
                }
                
                // También eliminar de openTabs
                const openTabs = get().openTabs.filter(id => id !== hId)
                
                set((state) => ({
                    ...state, 
                    history: filteredHistory,
                    activeFile: newActiveFile,
                    openTabs
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
            },
            openTab: (id) => {
                set((state) => {
                    if (!state.openTabs.includes(id)) {
                        return {
                            ...state,
                            openTabs: [...state.openTabs, id],
                            activeFile: id
                        }
                    }
                    return { ...state, activeFile: id }
                })
            },
            closeTab: (id) => {
                set((state) => {
                    const openTabs = state.openTabs.filter(tabId => tabId !== id)
                    let newActiveFile = state.activeFile
                    
                    // If we're closing the active tab, select another one
                    if (state.activeFile === id) {
                        // Get the index of the closed tab
                        const closedIndex = state.openTabs.indexOf(id)
                        
                        if (openTabs.length > 0) {
                            // Try to select the tab to the right, or if it was the rightmost, select the one to the left
                            const newIndex = closedIndex < openTabs.length ? closedIndex : openTabs.length - 1
                            newActiveFile = openTabs[newIndex]
                        } else {
                            newActiveFile = null
                        }
                    }
                    
                    return {
                        ...state,
                        openTabs,
                        activeFile: newActiveFile
                    }
                })
            },
            closeAllTabs: () => {
                set((state) => ({
                    ...state,
                    openTabs: [],
                    activeFile: null
                }))
            }
        }),
        {
            name: 'file-storage',
        }
    )
)