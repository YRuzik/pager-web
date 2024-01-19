import {observer} from "mobx-react-lite";
import "./chattingWindow.scss"
import {FC, useCallback, useEffect, useMemo, useRef} from "react";
import chat from "../../../data/mobx/chat.ts";
import profile from "../../../data/mobx/profile.ts";
import {ChatMessage} from "../../../proto/chat/chat_actions.ts";
import {ChatActionsApi} from "../../../data/api.ts";

const ChattingWindow = observer(() => {
    const inputRef = useRef<HTMLInputElement>(null)
    const messagesRef = useRef<HTMLDivElement>(null)

    const selectedId = profile.selectedChatId;
    const messages = chat.messages;

    const visibleMessages = useMemo(() =>
            chat.messages.filter((message) => message.linkedChatId == profile.selectedChatId)
        , [selectedId, messages])

    const handleKeyDownAction = useCallback(() => {
        if (inputRef !== null) {
            inputRef.current!.addEventListener("keydown", async function (e) {
                if (e.code === "Enter") {
                    await new ChatActionsApi().sendMessage({
                        authorId: profile.userId,
                        id: "",
                        linkedChatId: profile.selectedChatId ?? "",
                        stampMillis: BigInt(new Date().getTime()),
                        status: 4,
                        text: inputRef.current!.value
                    })
                    inputRef.current!.value = "";
                }
            })
        }
    }, [inputRef])

    useEffect(() => {
        handleKeyDownAction()
    }, [handleKeyDownAction]);

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
                {visibleMessages.map((message, index) => <MessageEntity key={index} {...message}/>)}
            </div>
            <div className={'input-wrapper'}>
                <input
                    ref={inputRef} placeholder={"some text..."} className={"chatting-input"}/>
            </div>
        </div>
    )
})

const MessageEntity: FC<ChatMessage> = ({text, authorId, stampMillis}) => {
    const profileId = profile.userId;
    const isMe = authorId === profileId
    const messageStamp = new Date(Number(stampMillis)).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    return (
        <div className={'message'} style={isMe ? {direction: "ltr"} : {direction: "rtl"}}>
            <div className={'message-outer'}>
                <div className={'message-avatar'}>
                </div>
                <div className={'message-inner'}>
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
}

export default ChattingWindow