import './home.scss'
import ChatList from "../components/home/chatList/ChatList.tsx";
import ChattingWindow from "../components/home/chattingWindow/ChattingWindow.tsx";
import GlobalContext from "../components/contexts/StreamsContext.tsx";

const Home = () => {
    return (
        <GlobalContext>
            <div className={"home-wrapper"}>
                <div className={"home-chat-list-container"}>
                    <ChatList/>
                </div>
                <div className={"home-chat-container"}>
                    <ChattingWindow/>
                </div>
            </div>
        </GlobalContext>
    )
}

export default Home