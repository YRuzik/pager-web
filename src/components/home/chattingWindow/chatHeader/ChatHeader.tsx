import {FC} from "react";
import "./chatHeader.scss"
import {ChatMember} from "../../../../testproto/chat/chat_actions.ts";
import AvatarView from "../../../common/avatarView/AvatarView.tsx";

type ChatHeaderProps = {
    chatId: string
    member: ChatMember
}

const ChatHeader: FC<ChatHeaderProps> = ({chatId, member}) => {
    // const chatName = member ? member.Login : chatId ? chatId : ""
    return (
        <div className={"middle-header"}>
            <div className={"chat-info"}>
                <div className={"chat-avatar"}>
                    <AvatarView online={member.Online} size={35}/>
                </div>
                <div className={"info"}>
                    <div>
                        {member ? member.Login : chatId}
                    </div>
                    <span>
                        {member.Online ? "Online" : `last seen ${member.lastSeenMillis} ago`}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader