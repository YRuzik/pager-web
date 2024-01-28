import { Route, Routes } from 'react-router-dom';
import RequireAuth from "./components/protectedRoute/protectedRoute.tsx";
import Home from "./pages/Home.tsx";
import Login from "./components/auth/Login.tsx";
import Register from "./components/auth/Register.tsx";
import {MainPage} from "./pages/Main.tsx";
import NotFoundRedirect from "./pages/notFound.tsx";

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