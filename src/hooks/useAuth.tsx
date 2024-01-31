import React, { useState, createContext, useContext, useMemo } from "react";
import { AuthActionsApi } from "../data/api.ts";
import {RichClientError} from "nice-grpc-error-details";
import {PagerError} from "../testproto/common/errors.ts";
import toast from "react-hot-toast";

interface AuthContextProps {
    authed: boolean;
    setAuthed: React.Dispatch<React.SetStateAction<boolean>>;
    login: (identity: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const sessionStorageValue = sessionStorage.getItem("loggedIn");
    const initialAuthedState = sessionStorageValue !== null ? JSON.parse(sessionStorageValue) : false;
    const [authed, setAuthed] = useState<boolean>(initialAuthedState );

    const login = async (identity: string, password: string): Promise<void> => {
        const result = await AsyncLogin(identity, password);

        if (result) {
            console.log("user has logged in");
            setAuthed(true);
            sessionStorage.setItem("loggedIn", "true");
        }
    };

    const logout = async (): Promise<void> => {
        const result = Logout();

        if (result) {
            console.log("The User has logged out");
            setAuthed(false);
            sessionStorage.setItem("loggedIn", "false");
        }
    };

    const AsyncLogin = async (identity: string, password: string): Promise<boolean> => {
        try {
            const tokens = await new AuthActionsApi().login({
                identity: identity,
                password: password,
            });
            if (!tokens) {
                return false;
            }

            localStorage.setItem("jwt", tokens.accessToken);
            localStorage.setItem("refreshToken", tokens.refreshToken);

            return true;
        }catch (e:unknown) {
            if(e instanceof RichClientError){
                const error =  PagerError.decode(e.extra[0].value)
                    toast.error(error.details)
            }
            return false
        }
    };

    const Logout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("refreshToken");
        return true;
    };

    const authObj = useMemo(() => ({ authed, setAuthed, login, logout }), [authed, setAuthed, login, logout]);

    return <AuthContext.Provider value={authObj}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
