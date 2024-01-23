import "./chatList.scss"
import {FC, useCallback, useContext, useEffect, useState} from "react";
import {Chat, ChatMessage} from "../../../proto/chat/chat_actions.ts";
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
    const {setSelectedChatId, selectedChatId, messages} = useContext(StreamsContext)
    const [lastMessage, setLastMessage] = useState<ChatMessage | undefined>(undefined)

    const handleSetChat = useCallback((chatId: string) => {
        setSelectedChatId(chatId)
    }, [setSelectedChatId])

    useEffect(() => {
        setLastMessage(messages.filter((message) => message.linkedChatId === id).slice(-1)[0])
    }, [id, messages]);

    return (
        <button className={`chat-entity-wrapper ${(id === selectedChatId) ? "chat-entity-active" : ""}`}
                onClick={() => {
                    handleSetChat(id)
                }}>
            <div className={"chat-entity-img-wrapper"}></div>
            <div className={"chat-entity-text-wrapper"}>
                <h1>{id}</h1>
                {lastMessage?.text ?? ""}
            </div>
        </button>
    )
})

export default ChatList