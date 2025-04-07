import { create } from "zustand"
import { persist } from "zustand/middleware"
import { HistoryType } from "../types"
import { v4 as uuidv4 } from "uuid"

type FileStoreType = {
    activeFile: string | null,
    history: HistoryType[],
    setActiveFile: (id: HistoryType['id'])=>void,
    setHistory: (h: HistoryType)=>void,
    clearHistory: ()=>void,
    editHistoryTitle: (id: HistoryType['id'], title: string)=>void,
    editHistoryContent: (h: HistoryType)=>void,
    removeHistory: (id: HistoryType['id'])=>void
}

export const fileStore = create<FileStoreType>()(
    
    persist(
        (set, get)=>({
            activeFile: null,
            history: [
                {title: "example-2.psc", content: `Algoritmo Ejemplo\n  Escribir "Hola Mundo"\nFinAlgoritmo`, updatedAt: new Date().getDate(), id: uuidv4()},
                {title: "example-3.psc", content: `Algoritmo Ejemplo\n  Escribir "Hola JS"\nFinAlgoritmo`, updatedAt: new Date().getDate(), id: uuidv4()},
                {title: "example-4.psc", content: `Algoritmo Ejemplo\n  Escribir "Hola TS"\nFinAlgoritmo`, updatedAt: new Date().getDate(), id: uuidv4()},
                {title: "example-5.psc", content: `Algoritmo Ejemplo\n  Escribir "Hola React"\nFinAlgoritmo`, updatedAt: new Date().getDate(), id: uuidv4()}
            ],
            setActiveFile: (id)=>{
                set((state)=>({...state, activeFile: id}))
            },
            setHistory: (k)=>{
                set((state)=>({...state, history: [...state.history, k]}))
            },
            clearHistory: ()=>{
                set((state)=>({...state, history: []}))
            },
            editHistoryContent: (h)=>{
                const history = get().history
                const editHistoryIndex = history.findIndex(({ id }) => id === h.id)
                history[editHistoryIndex].content = h.content
                history[editHistoryIndex].updatedAt = new Date().getDate()
                set((state)=>({...state, history: history}))
            },
            editHistoryTitle: (hId, title)=>{
                const history = get().history
                const editHistoryIndex = history.findIndex(({ id }) => id === hId)
                history[editHistoryIndex].title = title
                set((state)=>({...state, history: history}))
            },
            removeHistory: (hId)=>{
                const history = get().history
                const removeHistoryIndex = history.findIndex(({ id })=>id === hId)
                history.splice(removeHistoryIndex, 1)
                set((state)=>({...state, history: history}))
            }
        }),
        {
            name: 'file-storage',
        }
    )
)