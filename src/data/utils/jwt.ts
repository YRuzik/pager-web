
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";

interface TokenData {
    exp: number;
    identity: string;
    userId: string;
}

export function decodeToken(): TokenData | null {
    const accessToken = localStorage.getItem("jwt")
    if( !accessToken){
        return null
    }
    try {
        return jwtDecode(accessToken);
    } catch (error) {
        toast.error('Ошибка при декодировании токена:');
        return null;
    }
}
