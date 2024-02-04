import {FC, memo} from "react";
import './messageEntity.scss'
import {ChatMember, ChatMessage, ChatMessage_MessageStatus} from "../../../../testproto/chat/chat_actions.ts";
import Icon, {AppIcons} from "../../../common/icon/Icon.tsx";
import Popup from "reactjs-popup";
import ListTile from "../../../common/listTile/ListTile.tsx";

type MessageEntityProps = {
    message: ChatMessage
    profileId: string | undefined
    onReply: (message: ChatMessage) => void
    member?: ChatMember
    onEdit: (message: ChatMessage) => void
}

const MessageEntity: FC<MessageEntityProps> = memo(({message, profileId, onReply, member, onEdit}) => {
    const {StampMillis, AuthorId, Text, Status, LinkedMessage, Updated} = message
    const isMe = AuthorId === profileId
    const messageStamp = new Date(StampMillis).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

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
                    <Popup
                        position={isMe ? 'left center' : 'right center'} trigger={
                        <div
                            className={`message-bubble ${isMe ? 'my-message' : 'other-message'}`}
                            style={isMe ? {textAlign: 'start'} : {textAlign: 'end'}}>
                            {LinkedMessage && <div className={'reply-message'}>
                                <div className={'reply-message-login'}
                                     style={isMe ? {color: 'white'} : {color: 'black'}}>
                                    {member?.Login}
                                </div>
                                <div className={'reply-message-text'}>
                                    {LinkedMessage.Text}
                                </div>
                            </div>}
                            <div>
                                {Text} <span>{messageStamp} {Updated && "изменено"}</span>
                            </div>
                        </div>
                    }>
                        <div className={'popup-custom'}>
                            <ListTile onClick={() => {
                                onReply(message)
                            }} isSelected={false}>
                                <div className={'message-popup-wrapper'}>
                                    <div>Ответить</div>
                                </div>
                            </ListTile>
                            {isMe && <ListTile onClick={() => {
                                onEdit(message)
                            }} isSelected={false}>
                                <div className={'message-popup-wrapper'}>
                                    <div>Редактировать</div>
                                </div>
                            </ListTile>}
                        </div>
                    </Popup>
                    <div className={'message-spacer'}></div>
                </div>
            </div>
        </div>
    )
})

export default MessageEntity