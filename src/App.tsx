import Home from "./pages/Home.tsx";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import {MainPage} from "./pages/Main.tsx";
import {useCallback, useEffect, useState} from "react";
import {AuthActionsApi} from "./data/api.ts";
import toast, {ToastBar, Toaster} from 'react-hot-toast';
import NotFoundRedirect from "./pages/notFound.tsx";
import {RpcError} from "@protobuf-ts/runtime-rpc";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const refreshAccessToken = useCallback(async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        let accessToken = localStorage.getItem("jwt")
        if (!refreshToken || !accessToken) {
            return;
        }
        try {
            await new AuthActionsApi().Refresh({refreshToken: refreshToken,accessToken:accessToken}).response.then(response => {
                localStorage.setItem("jwt", response.accessToken);
                setIsAuthenticated(true);
            });
        } catch (e:unknown) {
            const error = e as RpcError;
            toast.error("Ошибка при обновлении токена:" + error.message);
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
                    <Route path="/" element={<Outlet />}>
                        {isAuthenticated ? (
                            <Route index element={<Home />} />
                        ) : (
                            <Route index element={<MainPage />} />
                        )}
                    </Route>
                    <Route path={'*'} element={<NotFoundRedirect />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;
