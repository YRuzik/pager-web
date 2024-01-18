import "./chatList.scss"
import profile from "../../../data/mobx/profile.ts";
import {FC} from "react";
import {Chat} from "../../../proto/chat/chat_actions.ts";
import {observer} from "mobx-react-lite";
import chat from "../../../data/mobx/chat.ts";

const ChatList = observer(() => {
    return (
        <div className={"chat-wrapper"}>
            {chat.chats.map((chat, index) => <ChatListEntity key={index} {...chat}/>)}
        </div>
    )
})

const ChatListEntity: FC<Chat> = observer(({id}) => {
    return (
        <div className={`chat-entity-wrapper ${(id === profile.selectedChatId) ? "chat-entity-active" : ""}`} onClick={() => {
            profile.setSelectedChat(id)
        }}>
            <div className={"chat-entity-img-wrapper"}>

            </div>
            <div className={"chat-entity-text-wrapper"}>
                <h1>{id}</h1>
            </div>
        </div>
    )
})

export default ChatList