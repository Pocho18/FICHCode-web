import { fileStore } from "@/store/fileStore"
import { Editor, useMonaco } from "@monaco-editor/react"
import { useEffect, useState } from "react"
import { useStore } from "zustand"
import { HistoryType } from "../types"

export default function CodeEditor() {
  const monaco = useMonaco() 
  const { 
    activeFile, 
    history, 
    editHistoryContent, 
    markAsModified 
  } = useStore(fileStore)
  const [code, setCode] = useState(`Algoritmo Ejemplo
  Escribir "Hola mundo"
FinAlgoritmo`)
  
  useEffect(()=>{
    if (!activeFile) return
    const historyIndex = history.findIndex(({ id }) => id === activeFile)
    setCode(history[historyIndex].content)
  }, [activeFile])

  // Editor Config
  useEffect(() => {
    if (!monaco) return
    
    // Registrar el lenguaje personalizado
    monaco.languages.register({ id: "pseudocodigo" })
    monaco.languages.setMonarchTokensProvider("pseudocodigo", {
      keywords: [
        "Algoritmo", "FinAlgoritmo", "Escribir", "Leer", "Si", "Entonces",
        "Sino", "FinSi", "Mientras", "FinMientras", "Repetir", "Hasta Que"
      ],
      tokenizer: {
        root: [
          [/".*?"/, "string"],
          [/\b\d+\b/, "number"],
          [/\b(Algoritmo|FinAlgoritmo|Escribir|Leer|Si|Entonces|Sino|FinSi|Mientras|FinMientras|Repetir|Hasta Que)\b/, "keyword"],
          [/[a-zA-Z_]\w*/, "identifier"],
          [/\/\/.*/, "comment"]
        ],
      },
    })

    // Definir tema personalizado
    monaco.editor.defineTheme("pseudotheme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "c678dd", fontStyle: "bold" },
        { token: "string", foreground: "98c379" },
        { token: "number", foreground: "d19a66" },
        { token: "identifier", foreground: "e5c07b" },
        { token: "comment", foreground: "5c6370", fontStyle: "italic" },
      ],
      colors: {
        "editor.background": "#262626",
        "editorLineNumber.foreground": "#5c6370",
        "editorLineNumber.activeForeground": "#abb2bf",
        "editorCursor.foreground": "#61afef",
        "editor.lineHighlightBackground": "#2f2f2f",
        "editor.selectionBackground": "#3E4451",
        "editor.inactiveSelectionBackground": "#3E445188",
        "editorGutter.background": "#262626",
        "editorWidget.background": "#262626",
      }
    })
  }, [monaco])

  // Manejar cambios en el código
  const handleCodeChange = (value?: string) => {
    setCode(value || "")
    
    // Marcar el archivo como modificado y actualizar su contenido
    if (activeFile && value) {
      markAsModified(activeFile)
      editHistoryContent({
        id: activeFile,
        content: value
      } as HistoryType)
    }
  }
  return (
    <div className="w-full h-full flex-grow overflow-hidden">
      {monaco && (
        <Editor
          height="100%"
          width="100%"
          defaultLanguage="pseudocodigo"
          value={code}
          theme="pseudotheme"
          onChange={handleCodeChange}
          options={{
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontFamily: "Cascadia Code PL, monospace",
          }}
        />
      )}
    </div>
  )
}