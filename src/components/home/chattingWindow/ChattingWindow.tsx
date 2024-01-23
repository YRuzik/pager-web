import {observer} from "mobx-react-lite";
import "./chattingWindow.scss"
import {FC, useCallback, useContext, useEffect, useMemo, useRef} from "react";
import {ChatMessage} from "../../../proto/chat/chat_actions.ts";
import {ChatActionsApi} from "../../../data/api.ts";
import {StreamsContext} from "../../contexts/StreamsContext.tsx";

const ChattingWindow = observer(() => {
    const {selectedChatId, profile} = useContext(StreamsContext)

    const {messages} = useContext(StreamsContext)
    const inputRef = useRef<HTMLInputElement>(null)
    const messagesRef = useRef<HTMLDivElement>(null)

    const visibleMessages = useMemo(() =>
            messages.filter((message) => message.linkedChatId == selectedChatId).reverse()
        , [selectedChatId, messages])

    const handleSendMessage = useCallback(async (
        e: KeyboardEvent,
        chatId: string 
    ) => {
        if (e.code === "Enter") {
            if ((profile?.userId !== undefined)) {
                await new ChatActionsApi().sendMessage({
                    authorId: profile.userId,
                    id: "sdfsdf",
                    linkedChatId: chatId,
                    stampMillis: BigInt(new Date().getTime()),
                    status: 4,
                    text: inputRef.current!.value
                })
                inputRef.current!.value = "";
            } else {
                console.log(`userid ${profile?.userId} not valid`)
            }
        }
    }, [profile])

    useEffect(() => {
        const currentRef = inputRef.current;
        if (currentRef !== null && selectedChatId !== null) {
            currentRef.addEventListener("keydown", (e) => handleSendMessage(e, selectedChatId))
        }
        return () => {
            if (currentRef !== null && selectedChatId !== null) {
                currentRef.removeEventListener("keydown", (e) => handleSendMessage(e, selectedChatId))
            }
        }
    }, [handleSendMessage, inputRef, selectedChatId]);

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
                {visibleMessages.map((message) => <MessageEntity key={message.id} {...message}/>)}
            </div>
            <div className={'input-wrapper'}>
                <input
                    ref={inputRef} placeholder={"some text..."} className={"chatting-input"}/>
            </div>
        </div>
    )
})

const MessageEntity: FC<ChatMessage> = observer(({text, authorId, stampMillis}) => {
    const {profile} = useContext(StreamsContext)
    const profileId = profile?.userId;
    const isMe = authorId === profileId
    const messageStamp = new Date(Number(stampMillis)).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    return (
        <div className={'message'} style={isMe ? {direction: "ltr"} : {direction: "rtl"}}>
            <div className={'message-outer'}>
                <div className={'message-inner'}>
                    <div className={'message-avatar'}>
                        <div className={'message-avatar-handle'}></div>
                    </div>
                    <div className={`message-bubble ${isMe ? 'my-message' : 'other-message'}`}>
                        <div>
                            {text} <span>{messageStamp}</span>
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