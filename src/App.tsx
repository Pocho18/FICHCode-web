import CodeEditor from "@/components/CodeEditor";
import SideBar from "@/components/SideBar/SideBar";
import Panel from "./components/Panels/Panel";

export default function App() {
  return (
    <div className="w-screen h-screen flex bg-neutral-800">
      <header className="w-max flex">
        <section className="">
          <SideBar />
        </section>
        <Panel />
      </header>

      <main className="grow flex">
        <section className="grow flex flex-col">
          <CodeEditor />
        </section>
      </main>

    </div>
  )
}
