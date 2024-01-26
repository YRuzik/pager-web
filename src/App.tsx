import Home from "./pages/Home.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainPage} from "./pages/Main.tsx";
import {useEffect} from "react";
import toast, {ToastBar, Toaster} from 'react-hot-toast';
import NotFoundRedirect from "./pages/notFound.tsx";
import RequireAuth from "./components/protectedRoute/protectedRoute.tsx";
import {useAuth} from "./hooks/useAuth.tsx";
import Login from "./components/auth/Login.tsx";
import Register from "./components/auth/Register.tsx";
import {refreshAccessToken} from "./data/utils/refresh.ts";

const App = () => {
    const {logout} = useAuth()

    useEffect(() => {
        refreshAccessToken().catch(()=>logout());
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
