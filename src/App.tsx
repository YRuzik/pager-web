import { BrowserRouter } from 'react-router-dom';
import toast, { ToastBar, Toaster } from 'react-hot-toast';
import AppRoutes from "./route.tsx";
import {StrictMode} from "react";

const App = () => {
    return (
        <StrictMode>
            <BrowserRouter>
                <main>
                    <Toaster position="bottom-right">
                        {(t) => (
                            <ToastBar toast={t}>
                                {({ icon, message }) => (
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
                    <AppRoutes />
                </main>
            </BrowserRouter>
        </StrictMode>
    );
};

export default App;