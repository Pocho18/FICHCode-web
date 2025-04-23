import { Editor as MonacoEditor, useMonaco } from "@monaco-editor/react"
import * as monacoTypes from 'monaco-editor'
import { useEffect, useRef, useState } from "react"
import { menuStore } from "@/contexts/menuStore"
import { useStore } from "zustand"
import { fileStore } from "@/contexts/fileStore"
import { motion } from "motion/react"

export default function Editor() {
  const monaco = useMonaco()
  const editorRef = useRef<monacoTypes.editor.IStandaloneCodeEditor | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { openMenu } = useStore(menuStore)
  const { activeFile, getFileInfo, editContentCode, setEditorModel, getEditorModel } = useStore(fileStore)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [editorLoaded, setEditorLoaded] = useState(false) 
  const [changingFile, setChangingFile] = useState(true)

  useEffect(()=>{
    // Marca como "cambiando archivo" por un breve período
    if (activeFile) {
      setChangingFile(true)
      setTimeout(()=>setChangingFile(false), 50) // Reducido a 50ms para hacerlo más sutil
    }
  }, [activeFile])

  // Settear el código por defecto y editarlo
  useEffect(()=>{
    if (!editorRef.current || !monaco) return

    const handleFileChange = async ()=> {
      const fileinfo = getFileInfo(activeFile)
      if (!fileinfo) return

      let model = getEditorModel(activeFile)
      if (!model) {
        model = monaco.editor.createModel(fileinfo.content, "fichlang", monaco.Uri.parse(`file://project/${activeFile}`))
      }
      
      setEditorModel(activeFile, model)
      model.onDidChangeContent(()=> {
        const currentContent = model.getValue()
        editContentCode(activeFile, currentContent)
      })

      editorRef.current?.setModel(model)
    }
    
    handleFileChange()
  }, [activeFile, editorRef.current, monaco, editorLoaded])

  // Configuración del lenguaje y tema
  useEffect(() => {
    if (!monaco) return

    if (!monaco.languages.getLanguages().some(lang => lang.id === "fichlang")) {
      monaco.languages.register({ id: "fichlang" })

      monaco.languages.setMonarchTokensProvider("fichlang", {
        tokenizer: {
          root: [
            [/\/\/.*/, "comment"],
            [/\b(Algoritmo|FinAlgoritmo|Leer|Escribir|Si|Entonces|SiNo|FinSi|Mientras|Hacer|FinMientras|Repetir|Hasta Que|Segun|Hacer|FinSegun|De Otro Modo|Dimension)\b/i, "keyword"],
            [/\b(Verdadero|Falso)\b/i, "constant.boolean"],
            [/\b\d+(\.\d+)?\b/, "number"],
            [/".*?"/, "string"],
            [/[+\-*/=<>]/, "operator"],
            [/[a-zA-Z_]\w*/, "identifier"],
          ],
        },
      })

      monaco.editor.defineTheme("fich-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "5c6370", fontStyle: "italic" },
          { token: "keyword", foreground: "c678dd", fontStyle: "bold" },
          { token: "number", foreground: "d19a66" },
          { token: "string", foreground: "98c379" },
          { token: "constant.boolean", foreground: "e06c75", fontStyle: "bold" },
          { token: "operator", foreground: "56b6c2" },
          { token: "identifier", foreground: "e5c07b" },
        ],
        colors: {
          "editor.background": "#21252b",
          "editor.foreground": "#abb2bf",
          "editor.lineHighlightBackground": "#2c313a",
          "editorCursor.foreground": "#528bff",
          "editorLineNumber.foreground": "#636d83",
          "editor.selectionBackground": "#3e4451",
        },
      })
    }

    monaco.editor.setTheme("fich-dark")
    setEditorLoaded(true)
  }, [monaco])

  // Efecto para manejar el resize del editor cuando cambia el panel
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }
    
    // Actualizar al montar, cuando cambia openMenu, y en resize
    updateDimensions()
    
    // Esperar a que DOM se actualice después de cambios en openMenu
    const timeoutId = setTimeout(() => {
      updateDimensions()
      if (editorRef.current) {
        editorRef.current.layout()
      }
    }, 100)
    
    // Listener para window resize
    window.addEventListener('resize', updateDimensions)
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateDimensions)
    }
  }, [openMenu, editorRef.current])

  // Actualiza el editor cuando sus dimensiones cambian
  useEffect(() => {
    if (editorRef.current && dimensions.width > 0 && dimensions.height > 0) {
      editorRef.current.layout()
    }
  }, [dimensions])

  const handleEditorDidMount = (editor: monacoTypes.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    // Forzar layout inicial
    setTimeout(() => editor.layout(), 100);
  }

  return (
    <motion.div 
      ref={containerRef} 
      className="h-full w-full flex overflow-hidden"
      style={{ opacity: changingFile ? 0.8 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <MonacoEditor
        onMount={handleEditorDidMount}
        width="100%"
        height="100%"
        defaultLanguage="fichlang"
        theme="fich-dark"
        options={{
          fontFamily: "Cascadia Code, monospace",
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 16 },
          automaticLayout: true,
        }}
      />
    </motion.div>
  )
}