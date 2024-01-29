import Home from "./pages/Home.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainPage} from "./pages/Main.tsx";
import {useCallback, useEffect} from "react";
import {AuthActionsApi} from "./data/api.ts";


const App = () => {
    const refreshAccessToken = useCallback(async () => {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
            return;
        }
        try {
            await new AuthActionsApi().refresh({refreshToken: refreshToken, accessToken: ""}).then(response => {
                    localStorage.setItem("jwt", response.accessToken)
                }
            )
        } catch (e) {
            console.error("Ошибка при обновлении токена:", e);
        }
    }, [])
    useEffect(() => {
        refreshAccessToken();
    }, [refreshAccessToken]);
    return (
            <BrowserRouter>
                <main>
                    <Routes>
                        <Route index element={<MainPage/>}/>
                        <Route path={"/chat"} element={<Home/>}/>
                    </Routes>
                </main>
            </BrowserRouter>
    )
}

export default App