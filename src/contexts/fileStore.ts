import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import * as monaco from "monaco-editor";
import { 
  formatDate, 
  generateUniqueName, 
  updateFileName, 
  updateContent, 
  toggleFileFavorite 
} from './fileHelpers';

/**
 * Representa un archivo en el sistema.
 */
export type FileType = {
  name: string
  content: string
  createdAt: string
  updatedAt: string
  path?: string
  favorite?: boolean
}

/**
 * Define el estado del store de archivos.
 */
export type FileStoreType = {
  editorModels: Record<string, monaco.editor.ITextModel>
  setEditorModel: (id: string, model: monaco.editor.ITextModel) => void
  getEditorModel: (id: string) => monaco.editor.ITextModel | null

  activeFile: string
  prevActiveFile: string[]
  setActiveFile: (id: string) => void

  openFiles: string[]
  setOpenFiles: (id: string) => void
  removeOpenFile: (id: string) => void

  files: (FileType & { id: string })[]
  addFile: (file: FileType) => string
  getFileInfo: (id: string) => FileType | null
  editTitle: (id: string, name: string) => boolean
  editContentCode: (id: string, content: string) => void
  getUniqueFileName: (name: string) => string
  toggleFavorite: (id: string) => void
  renameFile: (id: string, newName: string) => boolean
  getFileByName: (name: string) => (FileType & { id: string }) | null

  moveFileToBin: (id: string) => void
  restoreFileFromBin: (id: string) => void
  emptyBin: () => void

  binFiles: (FileType & { id: string })[]
}

/**
 * Archivos por defecto al iniciar la aplicación.
 */
const DEFAULT_FILES: (FileType & { id: string })[] = [
  {
    id: uuidv4(),
    name: "HolaMundo.psc",
    content: `Algoritmo HolaMundo\n    Escribir "¡Hola mundo!"\nFinAlgoritmo`,
    createdAt: formatDate(),
    updatedAt: formatDate(),
    favorite: false,
  },
  {
    id: uuidv4(),
    name: "Condicional.psc",
    content: `Algoritmo Condicional\n    Definir edad Como Entero\n    Escribir "Ingrese su edad:"\n    Leer edad\n    Si edad >= 18 Entonces\n        Escribir "Es mayor de edad"\n    SiNo\n        Escribir "Es menor de edad"\n    FinSi\nFinAlgoritmo`,
    createdAt: formatDate(),
    updatedAt: formatDate(),
    favorite: false,
  },
  {
    id: uuidv4(),
    name: "RepetirHasta.psc",
    content: `Algoritmo RepetirHasta\n    Definir contador Como Entero\n    contador <- 1\n    Repetir\n        Escribir "Contador: ", contador\n        contador <- contador + 1\n    Hasta Que contador > 5\nFinAlgoritmo`,
    createdAt: formatDate(),
    updatedAt: formatDate(),
    favorite: false,
  },
]

export const fileStore = create<FileStoreType>()(
  persist(
    (set, get) => ({
      editorModels: {},
      setEditorModel: (id, model) => {
        set((state) => ({
          editorModels: { ...state.editorModels, [id]: model }
        }))
      },
      getEditorModel: (id) => get().editorModels[id] ?? null,

      activeFile: "",
      prevActiveFile: [],
      setActiveFile: (id) => {
        if (id === get().activeFile) return
        
        get().setOpenFiles(id)
        set((state) => ({ 
          activeFile: id, 
          prevActiveFile: [state.activeFile, ...state.prevActiveFile].filter(Boolean)
        }))
      },

      openFiles: [],
      setOpenFiles: (id) => {
        if (get().openFiles.includes(id)) return
        set((state) => ({ openFiles: [...state.openFiles, id] }))
      },
      removeOpenFile: (id) => {
        set((state) => {
          const newOpenFiles = state.openFiles.filter((fileId) => fileId !== id)
          
          let newActiveFile = ""
          if (state.activeFile === id && newOpenFiles.length > 0) {
            newActiveFile = newOpenFiles[0]
          }
          
          return { 
            openFiles: newOpenFiles,
            activeFile: id === state.activeFile ? newActiveFile : state.activeFile
          }
        })
      },

      files: DEFAULT_FILES,
      addFile: (file) => {
        const uniqueName = get().getUniqueFileName(file.name)
        const newFile = { 
          ...file, 
          name: uniqueName,
          id: uuidv4(), 
          createdAt: formatDate(), 
          updatedAt: formatDate() 
        }
        
        set((state) => ({ files: [...state.files, newFile] }))
        get().setActiveFile(newFile.id)
        return newFile.id
      },
      getFileInfo: (id) => {
        return get().files.find((file) => file.id === id) ?? null
      },
      editTitle: (id, name) => {
        const [success, updatedFiles] = updateFileName(id, name, get().files)
        if (success) {
          set({ files: updatedFiles })
        }
        return success
      },

      editContentCode: (id, content) => {
        const currentFile = get().getFileInfo(id)
        if (currentFile && currentFile.content !== content) {
          const updatedFiles = updateContent(id, content, get().files)
          set({ files: updatedFiles })
        }
      },

      getUniqueFileName: (name) => generateUniqueName(name, get().files),

      toggleFavorite: (id) => {
        const updatedFiles = toggleFileFavorite(id, get().files)
        set({ files: updatedFiles })
      },

      renameFile: (id, newName) => {
        const [success, updatedFiles] = updateFileName(id, newName, get().files)
        if (success) {
          set({ files: updatedFiles })
        }
        return success
      },

      getFileByName: (name) => {
        return get().files.find((file) => 
          file.name.toLowerCase() === name.toLowerCase()
        ) ?? null
      },

      moveFileToBin: (id) => {
        const fileToMove = get().files.find((file) => file.id === id)
        if (!fileToMove) return

        const newFiles = get().files.filter(file => file.id !== id)
        const isActive = get().activeFile === id
        
        // Si estamos moviendo el archivo activo, necesitamos cambiar el activeFile
        if (isActive) {
          // Primero, actualizar la lista de archivos abiertos
          const newOpenFiles = get().openFiles.filter(fileId => fileId !== id)
          
          // Buscar el archivo anterior en el historial que todavía exista
          const validPrevFile = get().prevActiveFile.find(prevId => 
            prevId !== id && newFiles.some(file => file.id === prevId)
          )
          
          // Establecer el nuevo archivo activo
          let newActiveFile = ""
          if (validPrevFile) {
            newActiveFile = validPrevFile
          } else if (newFiles.length > 0) {
            newActiveFile = newFiles[0].id
          }
          
          set({
            files: newFiles,
            binFiles: [...get().binFiles, fileToMove],
            activeFile: newActiveFile,
            openFiles: newOpenFiles,
            prevActiveFile: get().prevActiveFile.filter(prevId => 
              prevId !== id && newFiles.some(file => file.id === prevId)
            )
          })
        } else {
          // Si no es el archivo activo, simplemente actualizamos los arrays
          set(state => ({
            files: newFiles,
            binFiles: [...state.binFiles, fileToMove],
            openFiles: state.openFiles.filter(fileId => fileId !== id),
            prevActiveFile: state.prevActiveFile.filter(prevId => 
              prevId !== id && newFiles.some(file => file.id === prevId)
            )
          }))
        }
      },

      restoreFileFromBin: (id) => {
        const fileToRestore = get().binFiles.find((file) => file.id === id)
        if (fileToRestore) {
          const uniqueName = get().getUniqueFileName(fileToRestore.name)
          const fileWithUniqueName = { ...fileToRestore, name: uniqueName }
          
          set((state) => ({
            files: [...state.files, fileWithUniqueName],
            binFiles: state.binFiles.filter((file) => file.id !== id)
          }))
        }
      },

      emptyBin: () => {
        set({ binFiles: [] })
      },

      binFiles: [],
    }),
    {
      name: "files-storage",
      partialize: (state) => ({
        files: state.files,
        binFiles: state.binFiles,
        activeFile: state.activeFile,
        openFiles: state.openFiles,
        prevActiveFile: state.prevActiveFile,
      }),
    }
  )
)