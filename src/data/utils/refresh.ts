import {AuthActionsApi} from "../api.ts";

export async function refreshAccessToken  ()  {
    const refreshToken = localStorage.getItem("refreshToken");
    let accessToken = localStorage.getItem("jwt")
    if (!refreshToken && !accessToken) {
        throw new Error("tokens not found");
    }else {
        await new AuthActionsApi().refresh({refreshToken: refreshToken!,accessToken:accessToken!}).then(response => {
            localStorage.setItem("jwt", response.accessToken);
        }).catch((error)=> {
            throw error
        });
    }
}