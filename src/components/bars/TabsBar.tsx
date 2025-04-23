import { fileStore, FileStoreType, FileType } from "@/contexts/fileStore";
import useFiles from "@/hooks/useFiles";
import { PlayIcon, XMarkIcon, DocumentPlusIcon, DocumentDuplicateIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { useStore } from "zustand";

export default function TabsBar() {
  const { openFiles, activeFile, setActiveFile, getFileInfo, removeOpenFile } = useStore(fileStore);
  const { handleCreateFile, handleDuplicateFile } = useFiles()
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  // Función para comprobar si se necesitan los botones de desplazamiento
  const checkScrollButtons = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 1); // -1 para evitar problemas de precisión
    }
  };

  // Efecto para ajustar el scroll a la pestaña activa cuando cambia
  useEffect(() => {
    if (activeFile && tabsContainerRef.current) {
      const activeTab = document.getElementById(`tab-${activeFile}`);
      if (activeTab) {
        const containerRect = tabsContainerRef.current.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();
        
        if (tabRect.right > containerRect.right) {
          tabsContainerRef.current.scrollLeft += (tabRect.right - containerRect.right + 10);
        } else if (tabRect.left < containerRect.left) {
          tabsContainerRef.current.scrollLeft -= (containerRect.left - tabRect.left + 10);
        }
      }
      
      // Comprobar si los botones de desplazamiento son necesarios
      checkScrollButtons();
    }
  }, [activeFile]);

  // Observer para monitorear cambios en el contenedor de tabs
  useEffect(() => {
    const container = tabsContainerRef.current;
    if (container) {
      // Comprobar botones de desplazamiento inicialmente
      checkScrollButtons();
      
      // Configurar el observer de resize
      const resizeObserver = new ResizeObserver(() => {
        checkScrollButtons();
      });
      
      resizeObserver.observe(container);
      
      // Añadir listener para el evento scroll
      container.addEventListener('scroll', checkScrollButtons);
      
      return () => {
        resizeObserver.disconnect();
        container.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, []);

  // También verificar cuando cambian los archivos abiertos
  useEffect(() => {
    checkScrollButtons();
  }, [openFiles]);
  
  // Funciones de desplazamiento
  const scrollLeft = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  if (openFiles.length === 0) return null;

  return (
    <aside className="w-full bg-panel h-10 flex items-center justify-between shadow-sm">
      {/* Contenedor principal que ocupa el espacio flexible */}
      <div className="flex-1 relative h-full overflow-hidden">
        {/* Botón de desplazamiento izquierdo - fuera del flujo con position absolute */}
        {showLeftScroll && (
          <div className="absolute left-0 top-0 z-20 h-full flex items-center">
            <button 
              onClick={scrollLeft}
              className="h-full px-1 flex items-center justify-center bg-panel hover:bg-selection text-neutral-400 hover:text-neutral-200 transition-all"
              aria-label="Desplazar a la izquierda"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Sombra de desvanecimiento izquierda */}
        {showLeftScroll && (
          <div className="absolute left-6 top-0 h-full w-8 z-10 bg-gradient-to-r from-panel to-transparent pointer-events-none" />
        )}
      
        {/* Contenedor de tabs con scroll - ahora con padding para dar espacio a los botones */}
        <div 
          ref={tabsContainerRef}
          className="flex h-full w-full overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            paddingLeft: showLeftScroll ? '24px' : '0px',
            paddingRight: showRightScroll ? '24px' : '0px'
          }}
        >
          {openFiles.map((id) => {
            const fileInfo = getFileInfo(id);
            return fileInfo && (
              <TabItem 
                key={id} 
                name={fileInfo.name} 
                id={id} 
                isActive={activeFile === id} 
                setActiveFile={setActiveFile} 
                removeOpenFile={removeOpenFile} 
              />
            );
          })}
        </div>
        
        {/* Sombra de desvanecimiento derecha */}
        {showRightScroll && (
          <div className="absolute right-6 top-0 h-full w-8 z-10 bg-gradient-to-l from-panel to-transparent pointer-events-none" />
        )}
        
        {/* Botón de desplazamiento derecho - fuera del flujo con position absolute */}
        {showRightScroll && (
          <div className="absolute right-0 top-0 z-20 h-full flex items-center">
            <button 
              onClick={scrollRight}
              className="h-full px-1 flex items-center justify-center bg-panel hover:bg-selection text-neutral-400 hover:text-neutral-200 transition-all"
              aria-label="Desplazar a la derecha"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Botones de acción modernos */}
      <div className="flex items-center gap-2 px-3">
        <button 
          className="flex items-center justify-center w-8 h-8 rounded-full bg-panel hover:bg-selection text-neutral-400 hover:text-neutral-200 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-green-500"
          aria-label="Nuevo archivo"
          title="Nuevo archivo"
        >
          <DocumentPlusIcon className="w-4 h-4" onClick={handleCreateFile} />
        </button>
        
        <button 
          className="flex items-center justify-center w-8 h-8 rounded-full bg-panel hover:bg-selection text-neutral-400 hover:text-neutral-200 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label="Duplicar archivo"
          title="Duplicar archivo"
        >
          <DocumentDuplicateIcon className="w-4 h-4" onClick={handleDuplicateFile} />
        </button>
        
        <button 
          className="cursor-pointer flex items-center justify-center gap-1 text-neutral-200 font-medium py-1 px-4 bg-green-700 hover:bg-green-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:ring-offset-panel"
          aria-label="Ejecutar código"
          title="Ejecutar"
        >
          <PlayIcon className="w-4 h-4" />
          <span className="text-sm">EJEC.</span>
        </button>
      </div>
    </aside>
  );
}

/********************
  TABS ITEM
********************/
type TabItemProps = {
  name: FileType['name']
  id: string
  isActive: boolean
  setActiveFile: FileStoreType['setActiveFile'],
  removeOpenFile: FileStoreType['removeOpenFile']
}

function TabItem({ name, isActive, id, setActiveFile, removeOpenFile }: TabItemProps) {
  
  const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    setTimeout(() => removeOpenFile(id), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setActiveFile(id);
    }
  };

  return (
    <motion.div
      id={`tab-${id}`}
      initial={false}
      exit={{ opacity: 0, width: 0 }}
      transition={{ duration: 0.1 }}
      onClick={() => setActiveFile(id)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="tab"
      aria-selected={isActive}
      className={`group relative h-full w-max max-w-40 px-2 cursor-pointer 
          transition-all duration-150 flex items-center justify-between gap-2 
          border-r border-black focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-500
          ${isActive 
        ? "bg-hover text-neutral-300" 
        : "text-neutral-400 hover:bg-selection hover:text-neutral-300"}`}
    >
      <p className="w-full text-sm truncate" title={name}>
        {name}
      </p>
      
      <button
        aria-label={`Cerrar archivo ${name}`}
        title="Cerrar archivo"
        onClick={handleClose}
        className="flex items-center justify-center p-1 relative hover:bg-hover rounded-md transition-all duration-150"
      >
        <XMarkIcon 
          className={`h-4 w-4 relative transition-opacity duration-150
          ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} 
        />
      </button>      
    </motion.div>
        
  )
}