import "./chatList.scss"
import {FC, useContext, useMemo} from "react";
import {ChatInfo, StreamsContext} from "../../contexts/StreamsContext.tsx";
import {ChatMember, ChatMessage, ChatMessage_MessageStatus} from "../../../testproto/chat/chat_actions.ts";
import {v4 as uuidv4} from 'uuid';
import actions from "../../../data/mobx/actions.ts";
import ChatTile, {ChatTileSkeleton} from "../../common/chatTile/ChatTile.tsx";
import {observer} from "mobx-react-lite";

const ChatList = () => {
    const {chats, members, profile, initList} = useContext(StreamsContext)

    const chatsMemo = useMemo(() => {
        const nChats = Array.from(Object.entries(chats));
        nChats.sort((a, b) => {
            const firstLastMessage: ChatMessage | undefined = a[1].messages.slice(-1)[0];
            const secondLastMessage: ChatMessage | undefined = b[1].messages.slice(-1)[0];
            return (secondLastMessage?.StampMillis ?? 0) - (firstLastMessage?.StampMillis ?? 0);
        })
        return nChats
    }, [chats])

    return (
        <div className={"chat-wrapper"}>
            {!initList.chats ? [...Array(10)].map(() => <ChatTileSkeleton
                key={uuidv4()}/>) : chatsMemo.map((chat) =>
                {
                    const memberId = chat[1].chatInfo.MembersId.find((val) => val !== profile.UserId)
                    return <ChatListEntity key={uuidv4()} chat={chat[1]} profileId={profile?.UserId}
                                    member={members[memberId!]}/>
                }
            )}
        </div>
    )
}

type ChatListEntityProps = {
    chat: ChatInfo
    profileId: string
    member: ChatMember
}

const ChatListEntity: FC<ChatListEntityProps> = observer(({chat, profileId, member}) => {
    const {messages, chatInfo} = chat

    const lastMessage = useMemo(() => messages.slice(-1)[0], [messages])
    const unreadedMessages = useMemo(() => messages.filter((v) => v.Status === ChatMessage_MessageStatus.unread && v.AuthorId !== profileId).length,[messages, profileId])

    return (
        <>
            {member && <ChatTile title={member.Login} online={member.Online} lastMessage={lastMessage}
                                 onClick={() => actions.toggleChatId(chatInfo.Id)}
                                 isSelected={actions.selectedChatId === chat.chatInfo.Id}
                                 unreadMessages={(actions.selectedChatId === chat.chatInfo.Id) ? 0 : unreadedMessages}/>}
        </>
    )
})

export default ChatList