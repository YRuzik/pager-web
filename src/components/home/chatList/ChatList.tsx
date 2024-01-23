import "./chatList.scss"
import {FC, useCallback, useContext} from "react";
import {Chat} from "../../../proto/chat/chat_actions.ts";
import {observer} from "mobx-react-lite";
import {StreamsContext} from "../../contexts/StreamsContext.tsx";

const ChatList = observer(() => {
    const {chats} = useContext(StreamsContext)
    return (
        <div className={"chat-wrapper"}>
            {chats.map((chat) => <ChatListEntity key={chat.id} {...chat}/>)}
        </div>
    )
})

const ChatListEntity: FC<Chat> = observer(({id}) => {
    const {setSelectedChatId, selectedChatId} = useContext(StreamsContext)

    const handleSetChat = useCallback((chatId: string) => {
        setSelectedChatId(chatId)
    }, [setSelectedChatId])

    return (
        <button className={`chat-entity-wrapper ${(id === selectedChatId) ? "chat-entity-active" : ""}`}
                onClick={() => {
                    handleSetChat(id)
                }}>
            <div className={"chat-entity-img-wrapper"}></div>
            <div className={"chat-entity-text-wrapper"}>
                <h1>{id}</h1>
            </div>
        </button>
    )
})

export default ChatList