import { fileStore } from "@/store/fileStore";
import { HistoryType } from "@/types/index";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";

export default function FileTabs() {
  const { 
    activeFile, 
    setActiveFile, 
    history,
    openTabs,
    closeTab,
    reorderTabs,
    getModifiedFiles,  // Nueva función que necesitaremos implementar
  } = useStore(fileStore);

  const [draggedTab, setDraggedTab] = useState<string | null>(null);
  const [dragOverTab, setDragOverTab] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const modifiedFiles = getModifiedFiles ? getModifiedFiles() : [];

  // Get file details from history
  const getFileById = (id: string): HistoryType | undefined => {
    return history.find(file => file.id === id);
  };

  // Handle tab click to activate file
  const handleTabClick = (id: string) => {
    setActiveFile(id);
  };

  // Handle close tab
  const handleCloseTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    closeTab(id);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTab(id);
    e.dataTransfer.effectAllowed = 'move';
    // Add a ghost image
    const ghostElement = document.createElement('div');
    ghostElement.classList.add('bg-indigo-500', 'opacity-50', 'p-2', 'rounded');
    ghostElement.textContent = getFileById(id)?.title || '';
    document.body.appendChild(ghostElement);
    e.dataTransfer.setDragImage(ghostElement, 0, 0);
    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedTab !== id) {
      setDragOverTab(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedTab && draggedTab !== targetId) {
      const sourceIndex = openTabs.findIndex(id => id === draggedTab);
      const targetIndex = openTabs.findIndex(id => id === targetId);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        reorderTabs(sourceIndex, targetIndex);
      }
    }
    setDraggedTab(null);
    setDragOverTab(null);
  };

  const handleDragEnd = () => {
    setDraggedTab(null);
    setDragOverTab(null);
  };

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+Tab to go to next tab
    if (e.ctrlKey && e.key === 'Tab') {
      e.preventDefault();
      if (openTabs.length <= 1) return;
      
      const currentIndex = openTabs.findIndex(id => id === activeFile);
      if (currentIndex === -1) return;
      
      const nextIndex = e.shiftKey 
        ? (currentIndex - 1 + openTabs.length) % openTabs.length 
        : (currentIndex + 1) % openTabs.length;
      
      setActiveFile(openTabs[nextIndex]);
    }
    
    // Ctrl+W to close current tab
    if (e.ctrlKey && e.key === 'w') {
      e.preventDefault();
      if (activeFile) {
        closeTab(activeFile);
      }
    }
  }, [activeFile, openTabs, setActiveFile, closeTab]);

  // Set up keyboard handlers
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Scroll active tab into view
  useEffect(() => {
    if (activeFile && tabsRef.current) {
      const activeTabElement = tabsRef.current.querySelector(`[data-tab-id="${activeFile}"]`);
      if (activeTabElement) {
        activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }
  }, [activeFile]);

  return (
    <div 
      ref={tabsRef}
      className="flex w-full h-10 bg-neutral-900 overflow-x-auto hide-scrollbar"
    >
      {openTabs.length > 0 ? (
        openTabs.map(tabId => {
          const file = getFileById(tabId);
          if (!file) return null;

          const isActive = activeFile === tabId;
          const isModified = modifiedFiles.includes(tabId);
          const isDragging = draggedTab === tabId;
          const isOver = dragOverTab === tabId;
          
          return (
            <div 
              key={tabId}
              data-tab-id={tabId}
              onClick={() => handleTabClick(tabId)} 
              draggable
              onDragStart={(e) => handleDragStart(e, tabId)}
              onDragOver={(e) => handleDragOver(e, tabId)}
              onDrop={(e) => handleDrop(e, tabId)}
              onDragEnd={handleDragEnd}
              className={`flex items-center justify-between w-max h-max min-w-32 max-w-48 px-3 py-2 text-neutral-300 cursor-pointer border-r border-neutral-700 hover:bg-neutral-800 transition-colors ${
                isActive ? 'bg-neutral-700 border-b-2 border-b-indigo-500' : 'bg-neutral-900'
              } ${isDragging ? 'opacity-50' : 'opacity-100'} ${isOver ? 'border-l-2 border-l-indigo-500' : ''}`}
            >
              <div className="flex items-center">
                {isModified && (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2" title="Archivo modificado"></span>
                )}
                <span className="text-sm truncate max-w-20" title={file.title}>
                  {file.title}
                </span>
              </div>
              <button 
                className="ml-2 text-neutral-400 hover:text-red-400 transition-colors"
                onClick={(e) => handleCloseTab(e, tabId)}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          );
        })
      ) : (
        <div className="flex items-center justify-center w-full h-full text-neutral-500 text-xs">
          No hay archivos abiertos
        </div>
      )}
    </div>
  );
}