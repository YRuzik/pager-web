import React from "react";

export interface AuthContextProps {
    authed: boolean;
    setAuthed: React.Dispatch<React.SetStateAction<boolean>>;
    login: (identity: string, password: string) => Promise<void>;
    logout:() => void;
}
