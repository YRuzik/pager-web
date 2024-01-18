import {observer} from "mobx-react-lite";
import "./chattingWindow.scss"
import {FC, useEffect, useRef, useState} from "react";
import chat from "../../../data/mobx/chat.ts";
import profile from "../../../data/mobx/profile.ts";
import {ChatMessage} from "../../../proto/chat/chat_actions.ts";
import {ChatActionsApi} from "../../../data/api.ts";

const ChattingWindow = observer(() => {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const messagesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMessages(chat.messages.filter((message) => message.linkedChatId == profile.selectedChatId))
        if (messagesRef !== null) {
            messagesRef.current!.scrollTop = messagesRef.current!.scrollHeight
        }
    }, [profile.selectedChatId, chat.messages, messagesRef])

    useEffect(() => {
        if (inputRef !== null) {
            inputRef.current!.addEventListener("keydown", async function (e) {
                if (e.code === "Enter") {
                    await new ChatActionsApi().sendMessage({
                        authorId: profile.userId,
                        id: "ut eu reprehenderit",
                        linkedChatId: profile.selectedChatId ?? "",
                        stampMillis: 4749530n,
                        status: 4,
                        text: inputRef.current!.value
                    })
                    inputRef.current!.value = "";
                }
            })
        }
    }, [inputRef]);

    console.log(messages)

    return (
        <div ref={messagesRef} className={"chatting-window-wrapper"}>
            <div className={'all-messages-wrapper'}>
                {messages.map((message, index) => <MessageEntity key={index} {...message}/>)}
            </div>
            <input
                ref={inputRef} placeholder={"some text..."} className={"chatting-input"}/>
        </div>
    )
})

const MessageEntity: FC<ChatMessage> = ({text, authorId}) => {
    const isMe = authorId === profile.userId
    return (
        <div className={'message-wrapper'} style={{justifyContent: isMe ? "end" : "start"}}>
            <div className={`message-container ${isMe ? "my-message" : "other-message"}`}>
                {text}
            </div>
        </div>
    )
}

export default ChattingWindow