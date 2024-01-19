import Home from "./pages/Home.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import GlobalContext from "./components/contexts/StreamsContext.tsx";


function App() {
  return (
    <GlobalContext>
        <BrowserRouter>
            <main>
                <Routes>
                    <Route index element={<Home/>}/>
                </Routes>
            </main>
        </BrowserRouter>
    </GlobalContext>
  )
}

export default App
