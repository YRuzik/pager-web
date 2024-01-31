import {FC, memo} from "react";
import './messageEntity.scss'

type MessageEntityProps = {
    text: string | undefined,
    authorId: string,
    stampMillis: number,
    profileId: string | undefined
}

const MessageEntity: FC<MessageEntityProps> = memo(({text, authorId, stampMillis, profileId}) => {
    const isMe = authorId === profileId
    const messageStamp = new Date(stampMillis).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
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

export default MessageEntity