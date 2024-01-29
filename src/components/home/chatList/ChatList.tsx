import "./chatList.scss"
import {FC, useCallback, useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {StreamsContext} from "../../contexts/StreamsContext.tsx";
import {Chat, ChatMessage} from "../../../testproto/chat/chat_actions.ts";

const ChatList = observer(() => {
    const {chats} = useContext(StreamsContext)
    return (
        <div className={"chat-wrapper"}>
            {chats.map((chat) => <ChatListEntity key={chat.Id} {...chat}/>)}
        </div>
    )
})

const ChatListEntity: FC<Chat> = observer(({Id}) => {
    const {setSelectedChatId, selectedChatId, messages} = useContext(StreamsContext)
    const [lastMessage, setLastMessage] = useState<ChatMessage | undefined>(undefined)

    const handleSetChat = useCallback((chatId: string) => {
        setSelectedChatId(chatId)
    }, [setSelectedChatId])

    useEffect(() => {
        setLastMessage(messages.filter((message) => message.LinkedChatId === Id).slice(-1)[0])
    }, [Id, messages]);

    return (
        <button className={`chat-entity-wrapper ${(Id === selectedChatId) ? "chat-entity-active" : ""}`}
                onClick={() => {
                    handleSetChat(Id)
                }}>
            <div className={"chat-entity-img-wrapper"}></div>
            <div className={"chat-entity-text-wrapper"}>
                <h1>{Id}</h1>
                {lastMessage?.Text ?? ""}
            </div>
        </button>
    )
})

export default ChatList