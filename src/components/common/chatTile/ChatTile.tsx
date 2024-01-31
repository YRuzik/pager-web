import ListTile from "../listTile/ListTile.tsx";
import './chatTile.scss'
import {ChatMember, ChatMessage} from "../../../testproto/chat/chat_actions.ts";
import {FC} from "react";
import AvatarView from "../avatarView/AvatarView.tsx";

type ChatTileProps = {
    member: ChatMember
    lastMessage?: ChatMessage
    onClick: () => void
    isSelected: boolean
}

const ChatTile: FC<ChatTileProps> = (props) => {
    const {member, onClick, lastMessage, isSelected} = props
    const messageStamp = new Date(lastMessage?.StampMillis ?? 0).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    return (
        <ListTile onClick={onClick} isSelected={isSelected}>
            <div className={'chat-tile-wrapper'}>
                <div className={'chat-avatar'}>
                    <AvatarView online={member.Online}/>
                </div>
                <div className={'chat-tile-info'}>
                    <div className={'chat-tile-info-title'}>
                        <div className={'chat-tile-login'}>
                            {member.Login}
                        </div>
                        <div className={'chat-tile-separator'}></div>
                        <div className={'chat-tile-lastMd'}>
                            {messageStamp}
                        </div>
                    </div>
                    <div className={'chat-tile-info-subtitle'}>
                        {lastMessage?.Text ?? ""}
                    </div>
                </div>
            </div>
        </ListTile>
    )
}

export default ChatTile