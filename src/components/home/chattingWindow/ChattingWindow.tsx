import "./chattingWindow.scss"
import {useContext, useEffect, useState} from "react";
import {ChatInfo, StreamsContext} from "../../contexts/StreamsContext.tsx";
import {observer} from "mobx-react-lite";
import actions from "../../../data/mobx/actions.ts";
import ChatContent from "./chatContent/ChatContent.tsx";
import ChatHeader from "./chatHeader/ChatHeader.tsx";

const ChattingWindow = observer(() => {
    const selectedChatId = actions.selectedChatId
    const member = actions.selectedMember
    const {profile, chats, members} = useContext(StreamsContext)
    const [chat, setChat] = useState<ChatInfo | undefined>(undefined)

    useEffect(() => {
        if (chat) {
            const memberId = chat.chatInfo.MembersId.find((val) => val !== profile.UserId)
            if (memberId) {
                actions.setMember(members.get(memberId))
            } else {
                actions.setMember(undefined)
            }
        }
    }, [chat, members, profile.UserId]);
    
    useEffect(() => {
        if (chats && selectedChatId) {
            setChat(chats.get(selectedChatId))
        } else {
            setChat(undefined)
        }
    }, [chats, selectedChatId]);

    return (
        <div className={"messages-layout"}>
            {((selectedChatId && chat && member) || (selectedChatId === undefined && member !== undefined)) && <>
                <ChatHeader chat={chat?.chatInfo} member={member}/>
                <ChatContent chat={chat} profileId={profile.UserId} member={member}/>
            </>}
        </div>
    )
})

export default ChattingWindow