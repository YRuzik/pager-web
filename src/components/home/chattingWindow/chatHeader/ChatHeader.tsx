import {FC} from "react";
import "./chatHeader.scss"
import {Chat, ChatMember, ChatType} from "../../../../testproto/chat/chat_actions.ts";
import AvatarView from "../../../common/avatarView/AvatarView.tsx";

type ChatHeaderProps = {
    chat?: Chat
    member: ChatMember
}

const ChatHeader: FC<ChatHeaderProps> = ({chat, member}) => {
    const {Login} = member

    const PersonalHeader = () => {
        return (
            <>
                <div>
                    {Login}
                </div>
                <span>
                        {member.Online ? "Online" : `last seen ${member.lastSeenMillis} ago`}
                </span>
            </>
        )
    }

    const GroupHeader = () => {
        return (
            <>
                <div>
                    {chat?.Metadata?.Title}
                </div>
                <span>
                        {`${chat?.MembersId.length} members`}
                </span>
            </>
        )
    }

    return (
        <div className={"middle-header"}>
            <div className={"chat-info"}>
                <div className={"chat-avatar"}>
                    <AvatarView online={member.Online} size={35}/>
                </div>
                <div className={"info"}>
                    {chat ? chat.Type === ChatType.personal ? <PersonalHeader/> : <GroupHeader/> : <PersonalHeader/>}
                </div>
            </div>
        </div>
    )
}

export default ChatHeader