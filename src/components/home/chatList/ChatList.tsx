import "./chatList.scss"
import {FC, useContext, useEffect, useMemo, useState} from "react";
import {ChatInfo, StreamsContext} from "../../contexts/StreamsContext.tsx";
import {ChatMember} from "../../../testproto/chat/chat_actions.ts";
import {v4 as uuidv4} from 'uuid';
import {observer} from "mobx-react-lite";
import actions from "../../../data/mobx/actions.ts";
import ChatTile from "../../common/chatTile/ChatTile.tsx";

const ChatList = () => {
    const {chats, members, profile} = useContext(StreamsContext)
    // const [chatsState, setChatsState] = useState<ChatInfo[]>([])

    const chatsMemo = useMemo(() => Array.from(chats?.values() ?? []), [chats])

    return (
        <div className={"chat-wrapper"}>
            {chatsMemo.map((chat) => <ChatListEntity key={uuidv4()} chat={chat} profileId={profile?.UserId}
                                                     members={members}/>)}
        </div>
    )
}

type ChatListEntityProps = {
    chat: ChatInfo
    profileId: string
    members: Map<string, ChatMember>
}

const ChatListEntity: FC<ChatListEntityProps> = observer(({chat, profileId, members}) => {
    const selectedChatId = actions.selectedChatId
    const {messages, chatInfo} = chat
    const [member, setMember] = useState<ChatMember | undefined>(undefined)

    useEffect(() => {
        const memberId = chatInfo.MembersId.find((val) => val !== profileId)
        if (memberId && members.has(memberId)) {
            setMember(members.get(memberId))
        }
    }, [chatInfo.MembersId, members, profileId]);

    const lastMessage = useMemo(() => messages.slice(-1)[0], [messages])

    return (
        <>
            {member &&
                <ChatTile member={member} lastMessage={lastMessage} onClick={() => actions.toggleChatId(chatInfo.Id)}
                          isSelected={selectedChatId === chat.chatInfo.Id}/>}
        </>
    )
})

export default ChatList