import {AuthActionsApi} from "../api.ts";

export async function refreshAccessToken  ()  {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("jwt")
        await new AuthActionsApi().refresh({refreshToken: refreshToken ?? "",accessToken:accessToken ?? ""}).then(response => {
            localStorage.setItem("jwt", response.accessToken);
        }).catch((error)=> {
            throw error
        });

}