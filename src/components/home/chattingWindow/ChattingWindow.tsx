import "./chattingWindow.scss"
import {useContext, useEffect, useState} from "react";
import {ChatInfo, StreamsContext} from "../../contexts/StreamsContext.tsx";
import {observer} from "mobx-react-lite";
import actions from "../../../data/mobx/actions.ts";
import ChatContent from "./chatContent/ChatContent.tsx";
import ChatHeader from "./chatHeader/ChatHeader.tsx";
import {ChatMember} from "../../../testproto/chat/chat_actions.ts";

const ChattingWindow = observer(() => {
    const selectedChatId = actions.selectedChatId
    const {profile, chats, members} = useContext(StreamsContext)
    const [chat, setChat] = useState<ChatInfo | undefined>(undefined)
    const [member, setMember] = useState<ChatMember | undefined>()

    useEffect(() => {
        if (chat) {
            const memberId = chat.chatInfo.MembersId.find((val) => val !== profile.UserId)
            if (memberId) {
                setMember(members.get(memberId))
            } else {
                setMember(undefined)
            }
        }
    }, [chat, members, profile.UserId]);
    
    useEffect(() => {
        if (chats && selectedChatId) {
            setChat(chats.get(selectedChatId))
        }
    }, [chats, selectedChatId]);

    return (
        <div className={"messages-layout"}>
            {(selectedChatId && chat && member) && <>
                <ChatHeader chatId={chat.chatInfo.Id} member={member}/>
                <ChatContent chat={chat} profileId={profile?.UserId}/>
            </>}
        </div>
    )
})

export default ChattingWindow