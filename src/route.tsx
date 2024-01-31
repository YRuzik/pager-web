import { Route, Routes } from 'react-router-dom';
import RequireAuth from "./components/common/protectedRoute/protectedRoute.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import {MainPage} from "./pages/main/Main.tsx";
import NotFoundRedirect from "./pages/RedirectPage.tsx";

const AppRoutes = () => (
    <Routes>
        <Route path="/chat" element={<RequireAuth><Home/></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Register />} />
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
);

export default AppRoutes;