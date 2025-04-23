import { useStore } from "zustand";
import Editor from "./components/editor/Editor";
import Panel from "./components/panels/Panel";
import SideBar from "./components/bars/SideBar";
import TabsBar from "./components/bars/TabsBar";
import { fileStore } from "./contexts/fileStore";
import IndexPage from "./components/IndexPage";

export default function App() {
  const { openFiles, activeFile } = useStore(fileStore)

  return (
    <div className="w-screen h-screen bg-bg flex flex-col overflow-hidden">
      <header className="px-1 py-2">
        <button className="text-gray-100 font-bold text-2xl cursor-pointer py-0.5 px-2 hover:bg-hover transition-colors duration-100 rounded-lg">
          FICHCode
        </button>
      </header>

      <main className="flex h-full w-full overflow-hidden">
        <section className="flex h-full flex-shrink-0">
          <SideBar />
          <Panel />
        </section>
        <section className="flex-1 flex-col h-full overflow-hidden">
          <TabsBar />
          <div className="w-full h-full">
            {openFiles.length > 0 && activeFile !== "" ? <Editor />:<IndexPage />}
          </div>
        </section>
      </main>
    </div>
  )
}