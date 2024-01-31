import "./chatList.scss"
import {FC, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {ChatInfo, StreamsContext} from "../../contexts/StreamsContext.tsx";
import {ChatMember, ChatMessage} from "../../../testproto/chat/chat_actions.ts";
import {v4 as uuidv4} from 'uuid';
import {observer} from "mobx-react-lite";
import actions from "../../../data/mobx/actions.ts";
import ChatTile from "../../common/chatTile/ChatTile.tsx";

const ChatList = observer(() => {
    const {chats, members, profile} = useContext(StreamsContext)

    const filterChats = useCallback((chats: ChatInfo[]) => {
        const copyChats = [...chats]
        copyChats.sort((a, b) => {
            const firstLastMessage: ChatMessage | undefined = a.messages.slice(-1)[0];
            const secondLastMessage: ChatMessage | undefined = b.messages.slice(-1)[0];
            return secondLastMessage.StampMillis - firstLastMessage.StampMillis;
        })
        return copyChats
    }, [])

    const chatsMemo = useMemo(() => filterChats(Array.from(chats.values())), [chats, filterChats])

    return (
        <div className={"chat-wrapper"}>
            {chatsMemo.map((chat) => <ChatListEntity key={uuidv4()} chat={chat} profileId={profile?.UserId}
                                       members={members}/>
            )}
        </div>
    )
})

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
            {member && <ChatTile title={member.Login} online={member.Online} lastMessage={lastMessage}
                                 onClick={() => actions.toggleChatId(chatInfo.Id)}
                                 isSelected={selectedChatId === chat.chatInfo.Id}/>}
        </>
    )
})

export default ChatList