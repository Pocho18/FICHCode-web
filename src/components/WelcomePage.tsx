// src/components/WelcomePage.tsx
import { FolderOpen, FileText, Code, PlusSquare, Github, BookOpen, Zap, Clock } from "lucide-react";
import { useStore } from "zustand";
import { fileStore } from "@/store/fileStore";
import { v4 as uuidv4 } from "uuid";
import { HistoryType } from "@/types/index";

interface MenuStore {
  setState: (state: { active: string }) => void;
}

interface ZustandDevtools {
  __ZUSTAND_DEVTOOLS__?: {
    getStore?: (storeName: string) => MenuStore | undefined;
  };
}

const WelcomePage = () => {
  const { history, setHistory, openTab } = useStore(fileStore);

  const handleNewFile = () => {
    const newFile: HistoryType = {
      id: uuidv4(),
      content: `Algoritmo Nuevo\n  // Tu código aquí\nFinAlgoritmo`,
      title: `nuevo_${history.length + 1}.psc`,
      updatedAt: Date.now(),
      createdAt: Date.now()
    };
    setHistory(newFile);
    openTab(newFile.id);
  };

  const getRecentFiles = () => {
    // Ordenar archivos por fecha de actualización, los más recientes primero
    return [...history]
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, 3); // Mostrar solo los 3 más recientes
  };

  const handleOpenRecent = (id: string) => {
    openTab(id);
  };

  // Verificar si hay archivos recientes
  const recentFiles = getRecentFiles();

  return (
    <div className="flex items-center justify-center h-full w-full bg-neutral-900 text-gray-300 overflow-auto">
      <div className="max-w-4xl w-full p-6">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Code className="w-16 h-16 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-blue-400 mb-2">Bienvenido al Editor de Pseudocódigo</h1>
          <p className="text-gray-400 text-lg">Tu espacio para escribir, ejecutar y aprender algoritmos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 hover:border-blue-500 transition-colors duration-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
              <PlusSquare className="mr-2" size={20} />
              Comenzar
            </h2>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={handleNewFile}
                  className="w-full text-left flex items-center p-3 hover:bg-neutral-700 rounded transition-colors"
                >
                  <FileText className="mr-3 text-blue-400" size={18} />
                  <span>Crear nuevo archivo</span>
                </button>
              </li>
              <li>
                <label 
                  className="w-full text-left flex items-center p-3 hover:bg-neutral-700 rounded transition-colors cursor-pointer"
                >
                  <FolderOpen className="mr-3 text-blue-400" size={18} />
                  <span>Abrir archivo</span>
                  <input 
                    type="file" 
                    accept=".psc,.txt" 
                    className="hidden" 
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;
                      
                      const reader = new FileReader();
                      reader.onload = () => {
                        const newFile: HistoryType = {
                          id: uuidv4(),
                          content: reader.result as string,
                          title: files[0].name.endsWith('.psc') ? files[0].name : `${files[0].name}.psc`,
                          updatedAt: Date.now(),
                          createdAt: files[0].lastModified
                        };
                        setHistory(newFile);
                        openTab(newFile.id);
                      };
                      reader.readAsText(files[0], "UTF-8");
                    }}
                  />
                </label>
              </li>
            </ul>
          </div>
          
          <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
              <Zap className="mr-2" size={20} />
              Para empezar rápido
            </h2>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => {
                    const algoritmoEjemplo: HistoryType = {
                      id: uuidv4(),
                      content: `Algoritmo SumaNumeros
  // Este algoritmo suma dos números ingresados por el usuario
  Definir num1, num2, resultado Como Entero
  
  Escribir "Ingrese el primer número:"
  Leer num1
  
  Escribir "Ingrese el segundo número:"
  Leer num2
  
  resultado <- num1 + num2
  
  Escribir "La suma de ", num1, " y ", num2, " es: ", resultado
FinAlgoritmo`,
                      title: "suma_numeros.psc",
                      updatedAt: Date.now(),
                      createdAt: Date.now()
                    };
                    setHistory(algoritmoEjemplo);
                    openTab(algoritmoEjemplo.id);
                  }}
                  className="w-full text-left flex items-center p-3 hover:bg-neutral-700 rounded transition-colors"
                >
                  <BookOpen className="mr-3 text-blue-400" size={18} />
                  <span>Algoritmo de Ejemplo</span>
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left flex items-center p-3 hover:bg-neutral-700 rounded transition-colors"
                  onClick={() => {
                    // Abrir menú de archivos
                    const menuStore = (window as ZustandDevtools).__ZUSTAND_DEVTOOLS__?.getStore?.("menu-storage") as MenuStore | undefined;
                    if (menuStore) {
                      menuStore.setState({ active: "archive" });
                    }
                  }}
                >
                  <Github className="mr-3 text-blue-400" size={18} />
                  <span>Explorar archivos</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
            <Clock className="mr-2" size={20} />
            Archivos recientes
          </h2>
          
          {recentFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentFiles.map(file => (
                <button
                  key={file.id}
                  onClick={() => handleOpenRecent(file.id)}
                  className="flex flex-col p-4 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <FileText className="text-blue-400 mr-2" size={16} />
                    <span className="font-medium truncate">{file.title}</span>
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    Última modificación: {new Date(file.updatedAt || Date.now()).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center p-4">No hay archivos recientes</p>
          )}
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">Puedes comenzar creando un nuevo archivo o abriendo uno existente.</p>
          <p>Usa Ctrl+Tab para navegar entre pestañas y Ctrl+W para cerrarlas.</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;