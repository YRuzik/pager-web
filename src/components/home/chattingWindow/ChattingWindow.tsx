import {observer} from "mobx-react-lite";
import "./chattingWindow.scss"
import {FC, useCallback, useContext, useEffect, useRef, useState} from "react";
import {ChatActionsApi} from "../../../data/api.ts";
import {ChatInfo, StreamsContext} from "../../contexts/StreamsContext.tsx";
import {ChatMessage} from "../../../testproto/chat/chat_actions.ts";

const ChattingWindow = observer(() => {
    const {selectedChatId, profile, chats} = useContext(StreamsContext)
    const [chat, setChat] = useState<ChatInfo | undefined>(undefined)
    const inputRef = useRef<HTMLInputElement>(null)
    const messagesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (chats && selectedChatId) {
            setChat(chats.get(selectedChatId))
        }
    }, [chats, selectedChatId]);



    const handleSendMessage = useCallback(async (
        chatId: string
    ) => {
        if ((profile?.UserId !== undefined)) {
            await new ChatActionsApi().sendMessage({
                AuthorId: profile.UserId,
                Id: "",
                LinkedChatId: chatId,
                StampMillis: new Date().getTime(),
                Status: 4,
                Text: inputRef.current!.value
            })
            inputRef.current!.value = ""
        } else {
            console.log(`userid ${profile?.UserId} not valid`)
        }
    }, [profile])

    const handleEventListener = useCallback(async (
        e: KeyboardEvent,
    ) => {
        if (e.code === "Enter") {
            if (selectedChatId) await handleSendMessage(selectedChatId)
        }
    }, [handleSendMessage, selectedChatId])

    useEffect(() => {
        const currentRef = inputRef.current;
        if (currentRef !== null && selectedChatId !== null) {
            currentRef.addEventListener("keydown", handleEventListener)
        }
        return () => {
            if (currentRef !== null && selectedChatId !== null) {
                currentRef.removeEventListener("keydown", handleEventListener)
            }
        }
    }, [handleEventListener, handleSendMessage, inputRef, selectedChatId]);

    useEffect(() => {
        if (messagesRef !== null) {
            if ((messagesRef.current!.scrollTop - 50) !== messagesRef.current!.scrollHeight) {
                messagesRef.current!.scrollTop = messagesRef.current!.scrollHeight
            }
        }
    }, [messagesRef]);

    return (
        <div className={"chatting-window-wrapper"}>
            <div ref={messagesRef} className={'all-messages-wrapper'}>
                {chat?.messages ? chat?.messages.reverse().map((message) => <MessageEntity
                    key={message.Id} {...message}/>) : null}
            </div>
            <div className={'input-wrapper'}>
                <input
                    ref={inputRef} placeholder={"some text..."} className={"chatting-input"}/>
            </div>
        </div>
    )
})

const MessageEntity: FC<ChatMessage> = observer(({Text, AuthorId, StampMillis}) => {
    const {profile} = useContext(StreamsContext)
    const profileId = profile?.UserId;
    const isMe = AuthorId === profileId
    const messageStamp = new Date(StampMillis).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    return (
        <div className={'message'} style={isMe ? {direction: "ltr"} : {direction: "rtl"}}>
            <div className={'message-outer'}>
                <div className={'message-inner'}>
                    <div className={'message-avatar'}>
                        <div className={'message-avatar-handle'}></div>
                    </div>
                    <div className={`message-bubble ${isMe ? 'my-message' : 'other-message'}`}>
                        <div>
                            {Text} <span>{messageStamp}</span>
                        </div>
                    </div>
                    <div className={'message-spacer'}></div>
                </div>
                <div className={'message-status'}></div>
            </div>
        </div>
    )
})

export default ChattingWindow