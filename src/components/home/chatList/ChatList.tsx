import "./chatList.scss"
import {FC, useContext, useEffect, useMemo, useState} from "react";
import {ChatInfo, MembersData, StreamsContext} from "../../contexts/StreamsContext.tsx";
import {ChatMember, ChatMessage, ChatMessage_MessageStatus} from "../../../testproto/chat/chat_actions.ts";
import {v4 as uuidv4} from 'uuid';
import actions from "../../../data/mobx/actions.ts";
import ChatTile, {ChatTileSkeleton} from "../../common/chatTile/ChatTile.tsx";
import {observer} from "mobx-react-lite";

const ChatList = () => {
    const {chats, members, profile, initList} = useContext(StreamsContext)

    const filterChats = (chats: [string, ChatInfo][]) => {
        chats.sort((a, b) => {
            const firstLastMessage: ChatMessage | undefined = a[1].messages.slice(-1)[0];
            const secondLastMessage: ChatMessage | undefined = b[1].messages.slice(-1)[0];
            return (secondLastMessage?.StampMillis ?? 0) - (firstLastMessage?.StampMillis ?? 0);
        })
        return chats
    }

    const chatsMemo = useMemo(() => filterChats(Object.entries(chats)), [chats])

    return (
        <div className={"chat-wrapper"}>
            {!initList.chats ? [...Array(10)].map(() => <ChatTileSkeleton
                key={uuidv4()}/>) : chatsMemo.map((chat) =>
                <ChatListEntity key={uuidv4()} chat={chat[1]} profileId={profile?.UserId}
                                members={members}/>
            )}
        </div>
    )
}

type ChatListEntityProps = {
    chat: ChatInfo
    profileId: string
    members: MembersData
}

const ChatListEntity: FC<ChatListEntityProps> = observer(({chat, profileId, members}) => {
    const {messages, chatInfo} = chat
    const [member, setMember] = useState<ChatMember | undefined>(undefined)

    useEffect(() => {
        const memberId = chatInfo.MembersId.find((val) => val !== profileId)
        if (memberId && members[memberId]) {
            setMember(members[memberId])
        }
    }, [chatInfo.MembersId, members, profileId]);

    const lastMessage = useMemo(() => messages.slice(-1)[0], [messages])
    const unreadedMessages = useMemo(() => messages.filter((v) => v.Status === ChatMessage_MessageStatus.unread && v.AuthorId !== profileId).length,[messages, profileId])

    return (
        <>
            {member && <ChatTile title={member.Login} online={member.Online} lastMessage={lastMessage}
                                 onClick={() => actions.toggleChatId(chatInfo.Id)}
                                 isSelected={actions.selectedChatId === chat.chatInfo.Id}
                                 unreadMessages={unreadedMessages}/>}
        </>
    )
})

export default ChatList