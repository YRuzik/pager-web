import {
    Navigate, useLocation
} from "react-router-dom";
import toast from "react-hot-toast";

const NotFoundRedirect = () => {
    const location = useLocation();
    toast.error('page not found' + location.pathname)
    return <Navigate to="/" />;
};

export default NotFoundRedirect;