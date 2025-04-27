import LayoutMain from "layouts/LayoutMain";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function Router() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<LayoutMain />}>
                <Route path="editor/:codeId" />
            </Route>
        </Routes>
    </BrowserRouter>
  )
}
