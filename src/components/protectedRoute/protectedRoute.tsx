import {useAuth} from "../../hooks/useAuth.tsx";
import {Navigate, useLocation} from "react-router-dom";

function RequireAuth({ children }:any) {
    const { authed } = useAuth();
    const location = useLocation();

    return authed ? (
        children
    ) : (
        <Navigate to="/login" replace state={{ path: location.pathname }} />
    );
}

export default RequireAuth;