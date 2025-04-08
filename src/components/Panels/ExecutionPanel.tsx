import { useEffect, useState } from "react";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { fileStore } from "@/store/fileStore";
import { useStore } from "zustand";

type ExecutionState = 'idle' | 'running' | 'finished' | 'error';

// Crear un tipo para un evento de ejecución personalizado
interface ExecutionEvent extends CustomEvent {
  detail: {
    action: 'start' | 'stop' | 'output';
    data?: string;
    error?: string;
  };
}

export default function ExecutionPanel() {
  const [output, setOutput] = useState<string[]>([]);
  const [executionState, setExecutionState] = useState<ExecutionState>('idle');
  const [isVisible, setIsVisible] = useState(false);
  const { activeFile, getActiveFile } = useStore(fileStore);

  // Función para manejar eventos de ejecución
  useEffect(() => {
    const handleExecutionEvent = (event: Event) => {
      const customEvent = event as ExecutionEvent;
      
      if (customEvent.detail.action === 'start') {
        setExecutionState('running');
        setIsVisible(true);
        setOutput([]);
      } else if (customEvent.detail.action === 'stop') {
        setExecutionState('finished');
      } else if (customEvent.detail.action === 'output') {
        if (customEvent.detail.data) {
          setOutput(prev => [...prev, customEvent.detail.data!]);
        }
        if (customEvent.detail.error) {
          setOutput(prev => [...prev, `Error: ${customEvent.detail.error}`]);
          setExecutionState('error');
        }
      }
    };

    // Registrar el listener para el evento personalizado
    window.addEventListener('fichcode-execution', handleExecutionEvent);

    return () => {
      window.addEventListener('fichcode-execution', handleExecutionEvent);
    };
  }, []);

  // Simular la ejecución del pseudocódigo actual
  const simulateExecution = () => {
    const currentFile = getActiveFile();
    if (!currentFile) return;

    // Extraer sentencias de escritura (Escribir) del pseudocódigo
    const content = currentFile.content;
    const writeStatements = content.match(/Escribir\s+"([^"]*)"/g) || [];
    
    // Iniciar ejecución
    const startEvent = new CustomEvent('fichcode-execution', {
      detail: { action: 'start' }
    });
    window.dispatchEvent(startEvent);

    // Simular la salida de las sentencias de escritura
    let delay = 500;
    writeStatements.forEach((statement) => {
      setTimeout(() => {
        const text = statement.match(/Escribir\s+"([^"]*)"/)?.[1] || '';
        const outputEvent = new CustomEvent('fichcode-execution', {
          detail: { action: 'output', data: text }
        });
        window.dispatchEvent(outputEvent);
      }, delay);
      delay += 500;
    });

    // Finalizar ejecución después de procesar todas las sentencias
    setTimeout(() => {
      const stopEvent = new CustomEvent('fichcode-execution', {
        detail: { action: 'stop' }
      });
      window.dispatchEvent(stopEvent);
    }, delay);
  };

  const clearOutput = () => {
    setOutput([]);
  };

  const closePanel = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-neutral-900 border-t border-neutral-700 text-neutral-200 h-48 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center p-2 border-b border-neutral-700 bg-neutral-800">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm">Salida de Ejecución</h3>
          {executionState === 'running' && (
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          )}
          {executionState === 'error' && (
            <span className="inline-block h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={clearOutput}
            className="p-1 rounded hover:bg-neutral-700 transition-colors"
            title="Limpiar salida"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={closePanel}
            className="p-1 rounded hover:bg-neutral-700 transition-colors"
            title="Cerrar panel"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-2 font-mono text-sm bg-neutral-950">
        {output.length > 0 ? (
          output.map((line, index) => (
            <div key={index} className="mb-1">
              {line}
            </div>
          ))
        ) : (
          <div className="text-neutral-500 italic">
            {executionState === 'running' 
              ? 'Ejecutando...' 
              : 'No hay salida de ejecución'}
          </div>
        )}
      </div>
    </div>
  );
}