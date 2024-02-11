import {FC, useCallback, useEffect, useState} from "react";
import "./chatHeader.scss"
import {Chat, ChatMember} from "../../../../testproto/chat/chat_actions.ts";
import AvatarView from "../../../common/avatarView/AvatarView.tsx";

type ChatHeaderProps = {
    chat?: Chat
    member: ChatMember
}

const ChatHeader: FC<ChatHeaderProps> = ({member}) => {
    return (
        <div className={"middle-header"}>
            <div className={"chat-info"}>
                <div className={"chat-avatar"}>
                    <AvatarView online={member.Online} size={35}/>
                </div>
                <div className={"info"}>
                    <PersonalHeader {...member}/>
                </div>
            </div>
        </div>
    )
}

const PersonalHeader: FC<ChatMember> = ({Login, Online, lastSeenMillis}) => {
    const millisToString = useCallback(() => {
        const millisNow = Date.now()
        const secondsNow = millisNow / 1000
        const secondsLast = lastSeenMillis / 1000

        const dif = secondsNow - secondsLast

        const minute = 60;
        const hour = minute * 60;
        const day = hour * 24;

        if (dif >= day) {
            return `${(dif / day).toFixed(0)} д. назад`
        } else if (dif >= hour) {
            return `${(dif / hour).toFixed(0)} ч. назад`
        } else if (dif >= minute) {
            return `${(dif / minute).toFixed(0)} мин. назад`
        } else {
            return `недавно`
        }
    }, [lastSeenMillis])
    
    const [wasOnline, setWasOnline] = useState(millisToString())

    useEffect(() => {
        let timerId: NodeJS.Timeout | undefined = undefined
        if (!Online) {
            timerId = setInterval(() => {
                setWasOnline(millisToString())
            }, 1000 * 60)
        }

        return () => {
            clearInterval(timerId)
        }
        
    }, [Online, millisToString]);
    return (
        <>
            <div>
                <h5>{Login}</h5>
            </div>
            <span>
                        {Online ? "В сети" : `Последний раз был в сети ${wasOnline}`}
                </span>
        </>
    )
}

// const GroupHeader: FC<Chat> = ({Metadata, MembersId}) => {
//     return (
//         <>
//             <div>
//                 <h5>{Metadata?.Title}</h5>
//             </div>
//             <span>
//                         {`${MembersId.length} members`}
//                 </span>
//         </>
//     )
// }

export default ChatHeader