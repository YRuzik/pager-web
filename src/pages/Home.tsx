import './home.scss'
import ChattingWindow from "../components/home/chattingWindow/ChattingWindow.tsx";
import GlobalContext from "../components/contexts/StreamsContext.tsx";
import LeftColumn from "../components/home/leftColumn/LeftColumn.tsx";
import {refreshAccessToken} from "../data/utils/refresh.ts";
import {decodeToken} from "../data/utils/jwt.ts";
import {useEffect, useState} from "react";
import {useAuth} from "../hooks/useAuth.tsx";

const Home = () => {
    const { logout, authed } = useAuth();
    const [dataTokenExp, setDataTokenExp] = useState<number | null>(null);

    useEffect(() => {
        refreshAccessToken().catch(() => logout());
    }, [logout]);


    useEffect(() => {
        let refreshAccessTokenTimerId: NodeJS.Timeout | undefined;

        const refreshAndSetTokenExp = async () => {
            try {
                await refreshAccessToken();
                const newTokenData = decodeToken();
                if (newTokenData) {
                    setDataTokenExp(newTokenData.exp);
                    refreshAccessTokenTimerId = setTimeout(refreshAndSetTokenExp, (newTokenData.exp - Math.floor(Date.now() / 1000)) * 1000);
                }
            } catch (error) {
                logout();
            }
        };

        const dataToken = decodeToken();
        if (authed && dataToken) {
            setDataTokenExp(dataToken.exp);
            refreshAccessTokenTimerId = setTimeout(refreshAndSetTokenExp, (dataToken.exp - Math.floor(Date.now() / 1000)) * 1000);
        }

        return () => {
            clearTimeout(refreshAccessTokenTimerId);
        };
    }, [authed, dataTokenExp, logout]);

    return (
        <GlobalContext>
            <div className={"home-wrapper"}>
                <div className={"home-chat-list-container"}>
                    <LeftColumn/>
                </div>
                <div className={"home-chat-container"}>
                    <ChattingWindow/>
                </div>
            </div>
        </GlobalContext>
    )
}

export default Home