import { fileStore } from "@/store/fileStore"
import { menuStore } from "@/store/menuStore"
import { Editor, useMonaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"
import { useEffect, useState, useRef } from "react"
import { useStore } from "zustand"

export default function CodeEditor() {
  const monaco = useMonaco() 
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null) 
	const { active } = useStore(menuStore)
  const { activeFile, history } = useStore(fileStore)
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

  // Función para configurar el editor basado en el tamaño de la ventana
  const updateEditorForScreenSize = () => {
    if (!editorRef.current) return

    const width = window.innerWidth
    const options = {
      fontSize: width < 576 ? 12 : width < 768 ? 13 : width < 992 ? 14 : 16,
      minimap: { 
        enabled: width > 768,
        scale: 0.8
      },
      wordWrap: "on",
      lineNumbers: width > 576 ? "on" : "off",
    }

    // Actualizar opciones del editor
    editorRef.current.updateOptions(options as editor.IEditorOptions)
    editorRef.current.layout()
  }

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
    updateEditorForScreenSize() 
  }

  useEffect(() => {
    const handleResize = () => {
      updateEditorForScreenSize()
  	}

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

	useEffect(()=>updateEditorForScreenSize(), [active])

  return (
    <div 
      style={{ 
        width: "100%", 
        height: "calc(70vh)",
        minHeight: "300px",
        maxWidth: "100%",
        position: "relative",
        border: "1px solid #444",
        borderRadius: "4px",
        overflow: "hidden"
      }}
    >
      {monaco && (
        <Editor
          height="100%"
          width="100%"
          defaultLanguage="pseudocodigo"
          defaultValue={code}
          theme="pseudotheme"
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
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