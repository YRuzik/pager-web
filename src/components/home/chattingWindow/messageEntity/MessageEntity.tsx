import {FC, memo, useCallback, useEffect, useRef, useState} from "react";
import './messageEntity.scss'
import {ChatMessage, ChatMessage_MessageStatus} from "../../../../testproto/chat/chat_actions.ts";
import Icon, {AppIcons} from "../../../common/icon/Icon.tsx";
import MessagePopup from "../messagePopup/MessagePopup.tsx";

type MessageEntityProps = {
    message: ChatMessage
    profileId: string | undefined
}

const MessageEntity: FC<MessageEntityProps> = memo(({message, profileId}) => {
    const [popupOpen, setPopupOpen] = useState(false)
    const {StampMillis, AuthorId, Text, Status} = message
    const isMe = AuthorId === profileId
    const messageStamp = new Date(StampMillis).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    const messageRef = useRef<HTMLDivElement>(null)
    
    const handleRightMouseClick = useCallback((e: MouseEvent) => {
        if (e.button === 2) {
            setPopupOpen(true)
        }
    }, [])

    const handleContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault()
    }, [])

    useEffect(() => {
        const currentRef = messageRef.current
        currentRef?.addEventListener('mousedown', handleRightMouseClick)
        document.addEventListener('contextmenu', handleContextMenu)
        return () => {
            currentRef?.removeEventListener('mousedown', handleRightMouseClick)
            document.removeEventListener('contextmenu', handleContextMenu)
        }
    }, [handleContextMenu, handleRightMouseClick]);
    
    return (
        <div className={'message'} style={isMe ? {direction: "ltr"} : {direction: "rtl"}}>
            <div className={'message-outer'}>
                <div className={'message-inner'}>
                    <div className={'message-status'}>{isMe && <>{(Status === ChatMessage_MessageStatus.unread) ?
                        <Icon icon={AppIcons.done} className={'gray-filter'}/> :
                        <Icon icon={AppIcons.doneAll} className={'blue-filter'}/>}</>}</div>
                    <div className={'message-avatar'}>
                        <div className={'message-avatar-handle'}></div>
                    </div>
                    <div ref={messageRef} className={`message-bubble ${isMe ? 'my-message' : 'other-message'}`} style={isMe ? {textAlign: 'start'} : {textAlign: 'end'}}>
                        <MessagePopup isOpen={popupOpen} onClose={() => setPopupOpen(false)}/>
                        <div>
                            {Text} <span>{messageStamp}</span>
                        </div>
                    </div>
                    <div className={'message-spacer'}></div>
                </div>
            </div>
        </div>
    )
})

export default MessageEntity