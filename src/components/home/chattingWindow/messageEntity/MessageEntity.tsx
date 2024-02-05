import {FC, memo} from "react";
import './messageEntity.scss'
import {ChatMember, ChatMessage, ChatMessage_MessageStatus} from "../../../../testproto/chat/chat_actions.ts";
import Icon, {AppIcons} from "../../../common/icon/Icon.tsx";
import Popup from "reactjs-popup";
import ListTile from "../../../common/listTile/ListTile.tsx";
import {MessageActions} from "../chatContent/ChatContent.tsx";

type MessageEntityProps = {
    message: ChatMessage
    profileId: string | undefined
    selectMessage: (message: ChatMessage) => void
    member?: ChatMember
    setMessageAction: (action: MessageActions) => void
    id: string
    scrollToMessage: (id: string) => void
}

const MessageEntity: FC<MessageEntityProps> = memo((
    {
        message,
        profileId,
        selectMessage,
        member,
        setMessageAction,
        id,
        scrollToMessage
    }
) => {
    const {StampMillis, AuthorId, Text, Status, LinkedMessage, Updated} = message
    const isMe = AuthorId === profileId
    const messageStamp = new Date(StampMillis).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

    return (
        <div className={`message`} id={id} style={isMe ? {direction: "ltr"} : {direction: "rtl"}}>
            <div className={'message-outer'}>
                <div className={'message-inner'}>
                    <div className={'message-status'}>{isMe && <>{(Status === ChatMessage_MessageStatus.unread) ?
                        <Icon icon={AppIcons.done} className={'gray-filter'}/> :
                        <Icon icon={AppIcons.doneAll} className={'blue-filter'}/>}</>}</div>
                    <div className={'message-avatar'}>
                        <div className={'message-avatar-handle'}></div>
                    </div>
                    <Popup
                        on={"right-click"}
                        keepTooltipInside={true}
                        position={['top center', 'bottom center',]} trigger={
                        <div
                            className={`message-bubble ${isMe ? 'my-message' : 'other-message'}`}
                            style={isMe ? {textAlign: 'start'} : {textAlign: 'end'}}>
                            {LinkedMessage &&
                                <div onClick={() => {
                                    scrollToMessage(LinkedMessage.Id)
                                }} className={'reply-message'}>
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
                                selectMessage(message)
                                setMessageAction(MessageActions.reply)
                            }} isSelected={false}>
                                <div className={'list-tile-wrap'}>
                                    <Icon icon={AppIcons.reply} size={17}/>
                                    <div>
                                        <h5>Ответить</h5>
                                    </div>
                                </div>
                            </ListTile>
                            {isMe && <ListTile onClick={() => {
                                selectMessage(message)
                                setMessageAction(MessageActions.edit)
                            }} isSelected={false}>
                                <div className={'list-tile-wrap'}>
                                    <Icon icon={AppIcons.pencil} size={17}/>
                                    <div>
                                        <h5>Редактировать</h5>
                                    </div>
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