import Home from "./pages/Home.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
        <main>
            <Routes>
                <Route index element={<Home/>}/>
            </Routes>
        </main>
    </BrowserRouter>
  )
}

export default App
