import Home from "./pages/Home.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainPage} from "./pages/Main.tsx";
import {useCallback, useEffect} from "react";
import {AuthActionsApi} from "./data/api.ts";
import toast, {ToastBar, Toaster} from 'react-hot-toast';
import NotFoundRedirect from "./pages/notFound.tsx";
import RequireAuth from "./components/protectedRoute/protectedRoute.tsx";
import {useAuth} from "./hooks/useAuth.tsx";
import Login from "./components/auth/Login.tsx";
import Register from "./components/auth/Register.tsx";

const App = () => {
    const {logout} = useAuth()

    const refreshAccessToken = useCallback(async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        let accessToken = localStorage.getItem("jwt")
        if (!refreshToken || !accessToken) {
            await logout()
            return;
        }
        try {
            await new AuthActionsApi().refresh({refreshToken: refreshToken,accessToken:accessToken}).then(response => {
                localStorage.setItem("jwt", response.accessToken);
            });
        } catch (error) {
            await logout()
            toast.error("Ошибка при обновлении токена:" + error);
        }
    }, []);

    useEffect(() => {
        refreshAccessToken();
    }, [refreshAccessToken]);

    return (
        <BrowserRouter>
            <main>
                <Toaster position={"bottom-right"}>
                    {(t) => (
                        <ToastBar toast={t}>
                            {({icon, message}) => (
                                <>
                                    {icon}
                                    {message}
                                    {t.type !== 'loading' && (
                                        <button onClick={() => toast.dismiss(t.id)}>X</button>
                                    )}
                                </>
                            )}
                        </ToastBar>
                    )}
                </Toaster>
                <Routes>
                    <Route path={"/chat"} element={<RequireAuth><Home/></RequireAuth>}/>
                    <Route path={"/login"} element={<Login/>}/>
                    <Route path={"/registration"} element={<Register/>}/>
                    <Route path={'/'} element={<MainPage/>}/>
                    <Route path={'*'} element={<NotFoundRedirect />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;
