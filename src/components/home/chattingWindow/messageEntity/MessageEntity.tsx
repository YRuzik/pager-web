import {FC, memo} from "react";
import './messageEntity.scss'
import {ChatMessage} from "../../../../testproto/chat/chat_actions.ts";

type MessageEntityProps = {
    message: ChatMessage
    profileId: string | undefined
}

const MessageEntity: FC<MessageEntityProps> = memo(({message, profileId}) => {
    const {StampMillis, AuthorId, Text} = message
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

export default MessageEntity