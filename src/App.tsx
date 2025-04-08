// src/App.tsx
import CodeEditor from "@/components/CodeEditor";
import SideBar from "@/components/SideBar/SideBar";
import Panel from "./components/Panels/Panel";
import ActionBar from "./components/ActionBar/ActionBar";
import TabsPanel from "./components/Panels/TabsPanel";
import ExecutionPanel from "./components/Panels/ExecutionPanel";
import { useState } from "react";
import { useStore } from "zustand";
import { fileStore } from "./store/fileStore";
import WelcomePage from "./components/WelcomePage";

export default function App() {
  const [showExecutionPanel, setShowExecutionPanel] = useState(false);
  const { activeFile } = useStore(fileStore)

  // Escuchar eventos de ejecución
  useState(() => {
    const handleExecutionEvent = (event: CustomEvent) => {
      if (event.detail.action === 'start') {
        setShowExecutionPanel(true);
      }
    };

    window.addEventListener('fichcode-execution', handleExecutionEvent as EventListener);

    return () => {
      window.removeEventListener('fichcode-execution', handleExecutionEvent as EventListener);
    };
  });

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-neutral-800">
      <header className="flex h-full">
        <section className="h-full">
          <SideBar />
        </section>
        <Panel />
      </header>

      <main className="grow flex overflow-hidden flex-col bg-neutral-800">
        <section>
          <ActionBar />
        </section>
        
        <section>
          <TabsPanel />
        </section>
        
        <section className="grow flex flex-col w-full h-full relative bg-neutral-800">
          {activeFile ? 
          <>
            <div className="grow max-h-3/4 mt-2">
              <CodeEditor />
            </div>
            <div className="absolute bottom-0 left-0 w-full h-48 bg-neutral-800 overflow-hidden transition-transform duration-300 transform translate-y-0">
              <ExecutionPanel />
            </div>
          </>
          :
          <div className="grow mt-[3px]">
            <WelcomePage />
          </div>

          }
        </section>
      </main>
    </div>
  )
}