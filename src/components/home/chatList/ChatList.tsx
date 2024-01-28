import "./chatList.scss"
import {FC, useCallback, useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {ChatInfo, StreamsContext} from "../../contexts/StreamsContext.tsx";
import {ChatMessage} from "../../../testproto/chat/chat_actions.ts";
import {v4 as uuidv4} from 'uuid';

const ChatList = observer(() => {
    const {chats} = useContext(StreamsContext)
    const [chatsState, setChatsState] = useState<ChatInfo[]>([])
    useEffect(() => {
        setChatsState(Array.from(chats?.values() ?? []))
    }, [chats]);
    return (
        <div className={"chat-wrapper"}>
            {chatsState.map((chat) => <ChatListEntity key={uuidv4()} {...chat}/>)}
        </div>
    )
})

const ChatListEntity: FC<ChatInfo> = observer(({chatInfo, messages}) => {
    const {setSelectedChatId, selectedChatId} = useContext(StreamsContext)
    const [lastMessage, setLastMessage] = useState<ChatMessage | undefined>(undefined)

    const handleSetChat = useCallback((chatId: string) => {
        setSelectedChatId(chatId)
    }, [setSelectedChatId])

    useEffect(() => {
        if (messages) {
            setLastMessage(messages.slice(-1)[0])
        }
    }, [messages]);

    return (
        <button className={`chat-entity-wrapper ${(chatInfo?.Id === selectedChatId) ? "chat-entity-active" : ""}`}
                onClick={() => {
                    if (chatInfo) {
                        handleSetChat(chatInfo?.Id)
                    }
                }}>
            <div className={"chat-entity-img-wrapper"}></div>
            <div className={"chat-entity-text-wrapper"}>
                <h1>{chatInfo?.Id}</h1>
                {lastMessage?.Text ?? ""}
            </div>
        </button>
    )
})

export default ChatList