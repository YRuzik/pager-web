import {AuthContextProps} from "../interfaces/IAuth.ts";
import {AuthContext} from "../components/contexts/AuthContext.tsx";
import {useContext} from "react";


export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
