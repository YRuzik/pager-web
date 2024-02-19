import { Route, Routes } from 'react-router-dom';
import RequireAuth from './components/common/protectedRoute/protectedRoute.tsx';
import Home from './pages/Home.tsx';
import { MainPage } from './pages/main/Main.tsx';
import NotFoundRedirect from './pages/RedirectPage.tsx';
import AuthPage from './pages/auth/AuthPage.tsx';

const AppRoutes = () => (
    <Routes>
        <Route
            path="/chat"
            element={
                <RequireAuth>
                    <Home />
                </RequireAuth>
            }
        />
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<NotFoundRedirect />} />
        <Route path="/auth/:action" element={<AuthPage />} />
    </Routes>
);

export default AppRoutes;
