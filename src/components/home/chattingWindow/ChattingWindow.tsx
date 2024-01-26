import {observer} from "mobx-react-lite";
import "./chattingWindow.scss"
import {FC, useCallback, useContext, useEffect, useMemo, useRef} from "react";
import {ChatActionsApi} from "../../../data/api.ts";
import {StreamsContext} from "../../contexts/StreamsContext.tsx";
import {ChatMessage} from "../../../testproto/chat/chat_actions.ts";
import {asyncFuncHandler} from "../../../data/utils/error.ts";
import {useAuth} from "../../../hooks/useAuth.tsx";

const ChattingWindow = observer(() => {
    const {logout} = useAuth();
    const {selectedChatId, profile} = useContext(StreamsContext)

    const {messages} = useContext(StreamsContext)
    const inputRef = useRef<HTMLInputElement>(null)
    const messagesRef = useRef<HTMLDivElement>(null)

    const visibleMessages = useMemo(() =>
            messages.filter((message) => message.LinkedChatId == selectedChatId).reverse()
        , [selectedChatId, messages])

    const handleSendMessage = useCallback(async (
        chatId: string
    ) => {
        if ((profile?.UserId !== undefined)) {
            await asyncFuncHandler(async () => {
                await new ChatActionsApi().sendMessage({
                    AuthorId: profile.UserId,
                    Id: "",
                    LinkedChatId: chatId,
                    StampMillis: new Date().getTime(),
                    Status: 4,
                    Text: inputRef.current!.value
                })
                inputRef.current!.value = ""
            }, async ()=>{
                await logout()
            })
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
    }, [messagesRef, messages]);

    return (
        <div className={"chatting-window-wrapper"}>
            <div ref={messagesRef} className={'all-messages-wrapper'}>
                {visibleMessages.map((message) => <MessageEntity key={message.Id} {...message}/>)}
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