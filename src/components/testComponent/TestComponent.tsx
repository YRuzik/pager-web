import {useState} from "react";
import {ChatActionsApi} from "../../data/api.ts";
import {ChatMessage_MessageStatus} from "../../proto/chat/chat_actions.ts";
import {observer} from "mobx-react-lite";
import chat from "../../data/mobx/chat.ts";

const TestComponent = observer(() => {
    const [message, setMessage] = useState('')
    const handleSendMessage = async () => {
        await (new ChatActionsApi()).sendMessage({
            authorId: "sdfsdf",
            linkedChatId: "fsdf",
            stampMillis: 4353234n,
            status: ChatMessage_MessageStatus.sent,
            text: message
        })
    }

    return (
        <div>
            <input
            onChange={(e) => setMessage(e.currentTarget.value)}
            value={message}
            />
            <button onClick={async () => {
                await handleSendMessage()
            }}>
                send message
            </button>
            {chat.messages.map((message, index) => <div key={index}>
                {message.text}
            </div>)}
        </div>
    )
})

export default TestComponent