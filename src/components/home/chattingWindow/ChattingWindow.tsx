import {observer} from "mobx-react-lite";
import "./chattingWindow.scss"
import {FC, useCallback, useContext, useEffect, useMemo, useRef} from "react";
import {ChatMessage} from "../../../proto/chat/chat_actions.ts";
import {ChatActionsApi} from "../../../data/api.ts";
import {StreamsContext} from "../../contexts/StreamsContext.tsx";
import profileState from "../../../data/mobx/profile.ts";

const ChattingWindow = observer(() => {
    const {selectedChatId, messages} = useContext(StreamsContext)
    const inputRef = useRef<HTMLInputElement>(null)
    const messagesRef = useRef<HTMLDivElement>(null)

    const visibleMessages = useMemo(() =>
            messages.filter((message) => message.linkedChatId == selectedChatId).reverse()
        , [selectedChatId, messages])

    const handleKeyDownAction = useCallback(() => {
        if (inputRef !== null) {
            inputRef.current!.addEventListener("keydown", async (e) => {
                if (e.code === "Enter") {
                    if ((profileState.profile?.userId !== undefined) && (selectedChatId !== null)) {
                        await new ChatActionsApi().sendMessage({
                            authorId: profileState.profile?.userId,
                            id: "",
                            linkedChatId: selectedChatId,
                            stampMillis: BigInt(new Date().getTime()),
                            status: 4,
                            text: inputRef.current!.value
                        })
                        inputRef.current!.value = "";
                    } else {
                        console.log('userid or chatid undefined')
                    }
                }
            })
        }
    }, [selectedChatId])

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
    const profileId = profileState.profile?.userId;
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