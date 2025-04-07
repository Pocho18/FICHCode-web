// src/components/Panels/TabsPanel.tsx
import { fileStore } from "@/store/fileStore";
import { HistoryType } from "@/types/index";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useStore } from "zustand";

export default function FileTabs() {
  const { 
    activeFile, 
    setActiveFile, 
    history,
    openTabs,
    closeTab
  } = useStore(fileStore);

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

  return (
    <div className="flex w-full h-10 bg-neutral-900 overflow-x-auto hide-scrollbar">
      {openTabs.length > 0 ? (
        openTabs.map(tabId => {
          const file = getFileById(tabId);
          if (!file) return null;

          const isActive = activeFile === tabId;
          
          return (
            <div 
              key={tabId}
              onClick={() => handleTabClick(tabId)} 
              className={`flex items-center justify-between min-w-32 max-w-48 px-3 py-1 text-neutral-300 cursor-pointer border-r border-neutral-700 hover:bg-neutral-800 transition-colors ${
                isActive ? 'bg-neutral-700 border-b-2 border-b-indigo-500' : 'bg-neutral-900'
              }`}
            >
              <span className="text-sm truncate" title={file.title}>
                {file.title}
              </span>
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