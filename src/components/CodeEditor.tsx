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
    markAsModified,
    markAsSaved
  } = useStore(fileStore)
  const [code, setCode] = useState(`Algoritmo Ejemplo
  Escribir "Hola mundo"
FinAlgoritmo`)
  
  useEffect(()=>{
    console.log(activeFile)
    if (!activeFile) return
    const historyIndex = history.findIndex(({ id }) => id === activeFile)
    setCode(history[historyIndex].content)
  }, [activeFile, history])

  // Editor Config
  useEffect(() => {
    if (!monaco) return
    
    // Registrar el lenguaje personalizado
    monaco.languages.register({ id: "pseudocodigo" })
    
    // Define sugerencias de autocompletado para pseudocódigo
    monaco.languages.registerCompletionItemProvider('pseudocodigo', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        // Palabras clave del pseudocódigo con descripciones
        const suggestions = [
          {
            label: 'Algoritmo',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Algoritmo ',
            detail: 'Define el inicio de un algoritmo',
            documentation: 'Palabra clave para iniciar la definición de un algoritmo. Ejemplo: Algoritmo NombreAlgoritmo',
            range
          },
          {
            label: 'FinAlgoritmo',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'FinAlgoritmo',
            detail: 'Define el fin de un algoritmo',
            documentation: 'Palabra clave para finalizar la definición de un algoritmo.',
            range
          },
          {
            label: 'Escribir',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'Escribir ',
            detail: 'Muestra información en la consola',
            documentation: 'Muestra texto o el valor de una variable en la consola. Ejemplo: Escribir "Hola Mundo"',
            range
          },
          {
            label: 'Leer',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'Leer ',
            detail: 'Lee un valor ingresado por el usuario',
            documentation: 'Lee un valor ingresado por el usuario y lo almacena en una variable. Ejemplo: Leer nombre',
            range
          },
          {
            label: 'Si',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Si  Entonces\n\t\nFinSi',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Estructura condicional Si-Entonces',
            documentation: 'Ejecuta un bloque de código si la condición es verdadera. Ejemplo: Si edad >= 18 Entonces',
            range
          },
          {
            label: 'Sino',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Sino\n\t',
            detail: 'Parte alternativa de una estructura Si-Entonces',
            documentation: 'Define el bloque de código que se ejecuta cuando la condición del Si es falsa.',
            range
          },
          {
            label: 'Mientras',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Mientras  Hacer\n\t\nFinMientras',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Bucle Mientras-Hacer',
            documentation: 'Ejecuta un bloque de código mientras la condición sea verdadera. Ejemplo: Mientras contador <= 10 Hacer',
            range
          },
          {
            label: 'Para',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Para  <- 1 Hasta  Con Paso 1 Hacer\n\t\nFinPara',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Bucle Para (for)',
            documentation: 'Bucle que se ejecuta un número determinado de veces. Ejemplo: Para i <- 1 Hasta 10 Con Paso 1 Hacer',
            range
          },
          {
            label: 'Repetir',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Repetir\n\t\nHasta Que ',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Bucle Repetir-Hasta Que',
            documentation: 'Ejecuta un bloque de código al menos una vez, hasta que la condición sea verdadera.',
            range
          },
          {
            label: 'Definir',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Definir  Como ',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Define una variable',
            documentation: 'Define una variable con un tipo específico. Ejemplo: Definir nombre Como Caracter',
            range
          },
          {
            label: 'Dimension',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'Dimension [,]',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Define un arreglo',
            documentation: 'Define un arreglo con dimensiones específicas. Ejemplo: Dimension numeros[10]',
            range
          },
          {
            label: 'Funcion',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'Funcion  ()\n\t\nFinFuncion',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Define una función',
            documentation: 'Define una función que puede recibir parámetros y retornar un valor.',
            range
          },
          // Snippets comunes
          {
            label: 'Si-Entonces-Sino',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'Si ${1:condicion} Entonces\n\t${2:// código si verdadero}\nSino\n\t${3:// código si falso}\nFinSi',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Estructura completa Si-Entonces-Sino',
            documentation: 'Inserta una estructura condicional completa con bloques verdadero y falso.',
            range
          },
          {
            label: 'Para-Bucle',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'Para ${1:i} <- ${2:1} Hasta ${3:10} Con Paso ${4:1} Hacer\n\t${5:// código a repetir}\nFinPara',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Bucle Para completo',
            documentation: 'Inserta un bucle Para completo con valores iniciales típicos.',
            range
          },
          {
            label: 'AlgoritmoBase',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'Algoritmo ${1:NombreAlgoritmo}\n\t${2:// Tu código aquí}\nFinAlgoritmo',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Estructura base de un algoritmo',
            documentation: 'Inserta la estructura básica de un algoritmo completo.',
            range
          }
        ];

        return { suggestions };
      }
    });
    
    monaco.languages.setMonarchTokensProvider("pseudocodigo", {
      keywords: [
        "Algoritmo", "FinAlgoritmo", "Escribir", "Leer", "Si", "Entonces",
        "Sino", "FinSi", "Mientras", "Hacer", "FinMientras", "Para", "Con", 
        "Paso", "FinPara", "Repetir", "Hasta", "Que", "Definir", "Como",
        "Dimension", "Funcion", "FinFuncion", "Procedimiento", "FinProcedimiento",
        "Entero", "Real", "Caracter", "Logico", "Segun", "FinSegun", "De", "Otro", "Modo"
      ],
      tokenizer: {
        root: [
          [/".*?"/, "string"],
          [/'.*?'/, "string"],
          [/\b\d+(\.\d+)?\b/, "number"],
          [/\b(Algoritmo|FinAlgoritmo|Escribir|Leer|Si|Entonces|Sino|FinSi|Mientras|Hacer|FinMientras|Para|Con|Paso|FinPara|Repetir|Hasta|Que|Definir|Como|Dimension|Funcion|FinFuncion|Procedimiento|FinProcedimiento|Entero|Real|Caracter|Logico|Segun|FinSegun|De|Otro|Modo)\b/, "keyword"],
          [/[a-zA-Z_]\w*/, "identifier"],
          [/\/\/.*/, "comment"]
        ],
      },
    });

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
    });
    
    // Configurar acciones de guardar
    monaco.editor.addEditorAction({
      id: 'save-file',
      label: 'Guardar archivo',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS
      ],
      run: (editor) => {
        if (activeFile) {
          const content = editor.getValue();
          editHistoryContent({
            id: activeFile,
            content
          } as HistoryType);
          markAsSaved(activeFile);
        }
      }
    });
    
  }, [monaco, activeFile, editHistoryContent, markAsSaved]);

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
            fontSize: 14,
            minimap: { enabled: false },
            lineNumbers: "on",
            folding: true,
            wordWrap: "on",
            autoIndent: "advanced",
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true
          }}
        />
      )}
    </div>
  )
}