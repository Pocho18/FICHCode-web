// src/App.tsx
import CodeEditor from "@/components/CodeEditor";
import SideBar from "@/components/SideBar/SideBar";
import Panel from "./components/Panels/Panel";
import ActionBar from "./components/ActionBar/ActionBar";
import TabsPanel from "./components/Panels/TabsPanel";

export default function App() {
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
        
        <section className="grow flex flex-col w-full h-full mt-2">
          <CodeEditor />
        </section>
      </main>
    </div>
  )
}