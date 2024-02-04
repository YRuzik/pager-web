import ListTile from "../listTile/ListTile.tsx";
import './chatTile.scss'
import {ChatMessage} from "../../../testproto/chat/chat_actions.ts";
import {FC, memo} from "react";
import AvatarView from "../avatarView/AvatarView.tsx";
import SkeletonContainer from "../skeletonContainer/SkeletonContainer.tsx";

type ChatTileProps = {
    online: boolean
    title: string
    lastMessage?: ChatMessage
    onClick: () => void
    isSelected: boolean
    unreadMessages: number
}

const ChatTile: FC<ChatTileProps> = memo((props) => {
    const {online, onClick, lastMessage, isSelected, title, unreadMessages} = props
    const messageStamp = new Date(lastMessage?.StampMillis ?? 0).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    return (
        <ListTile onClick={onClick} isSelected={isSelected}>
            <div className={'chat-tile-wrapper'}>
                <div className={'chat-avatar'}>
                    <AvatarView online={online}/>
                </div>
                <div className={'chat-tile-info'}>
                    <div className={'chat-tile-info-title'}>
                        <div className={'chat-tile-login'}>
                            <h5>{title}</h5>
                        </div>
                        <div className={'chat-tile-separator'}></div>
                        <div className={'chat-tile-lastMd'}>
                            <span>{lastMessage ? messageStamp : ""}</span>
                        </div>
                    </div>
                    <div className={'chat-tile-info-subtitle'}>
                        <div className={'chat-tile-last-message'}>
                            <span>{lastMessage?.Text ?? ""}</span>
                        </div>
                        {unreadMessages !== 0 && <div className={'unread-message-badge'}>
                            {unreadMessages}
                        </div>}
                    </div>
                </div>
            </div>
        </ListTile>
    )
})

export default ChatTile

export const ChatTileSkeleton = () => {
    return (
        <ListTile onClick={() => {
        }} isSelected={false}>
            <div className={'chat-tile-wrapper'}>
                <div className={'chat-avatar chat-skeleton-avatar'}>
                    <SkeletonContainer height={50}/>
                </div>
                <div className={'chat-tile-info'}>
                    <div className={'chat-tile-info-subtitle'} style={{paddingBottom: '5px'}}>
                        <SkeletonContainer height={15}/>
                    </div>
                    <div className={'chat-tile-info-subtitle'}>
                        <SkeletonContainer height={15}/>
                    </div>
                </div>
            </div>
        </ListTile>
    )
}