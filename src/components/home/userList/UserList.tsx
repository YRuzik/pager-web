import {FC, useCallback, useContext, useEffect, useState} from "react";
import {ChatMember, ChatType} from "../../../testproto/chat/chat_actions.ts";
import {ClientApi, StreamsApi} from "../../../data/api.ts";
import ChatTile from "../../common/chatTile/ChatTile.tsx";
import {v4 as uuidv4} from 'uuid';
import "./userList.scss"
import actions from "../../../data/mobx/actions.ts";
import {ChatInfo, StreamsContext} from "../../contexts/StreamsContext.tsx";
import {handleDownStream} from "../../../data/utils/transfers.ts";

interface PersonalChat {
    member: ChatMember
    chat: ChatInfo
}

type UserListProps = {
    searchValue: string
}

const UserList: FC<UserListProps> = ({searchValue}) => {
    const {members, chats, profile} = useContext(StreamsContext)
    const [localChats, setLocalChats] = useState<{ groupChats: ChatInfo[], personalChats: PersonalChat[] }>({
        groupChats: [],
        personalChats: []
    })
    const [globalItems, setGlobalItems] = useState<{ chats: ChatInfo[], members: ChatMember[] }>({
        chats: [],
        members: []
    })
    const [notFound, setNotFound] = useState<{local: boolean, global: boolean}>({local: false, global: false})

    const handleLocalItems = useCallback(() => {
        setNotFound((prevState) => ({...prevState, local: false}))
        const membersArray = Object.entries(members).map((memberInfo) => memberInfo[1])
        const chatsArray = Object.entries(chats).map((chatInfo) => chatInfo[1])

        const personalChats: PersonalChat[] = []

        const foundedMembers = membersArray
            .filter((member) => member.Login.includes(searchValue))
        foundedMembers.forEach((member) => {
            const personalChat = chatsArray.find((v) => (v.chatInfo.Type === ChatType.personal) && (v.chatInfo.MembersId.includes(member.Id)))
            if (personalChat) {
                personalChats.push({member: member, chat: personalChat})
            }
        })

        const groupChats = chatsArray
            .filter((chat) => chat.chatInfo.Type === ChatType.group && chat.chatInfo.Metadata && chat.chatInfo.Metadata?.Title.includes(searchValue))

        if (groupChats.length === 0 && personalChats.length === 0) {
           setNotFound((prevState) => ({...prevState, local: true}))
        }

        setLocalChats({personalChats, groupChats})
    }, [searchValue])

    const handleGlobalItems = useCallback(async () => {
        const membersArray: ChatMember[] = []
        await new ClientApi().searchUsersByIdentifier({identifier: searchValue}).then(async (response) => {
            if (response) {
                for (const id of response.userIds) {
                    await handleDownStream(false, StreamsApi.streamChatMember, {MemberId: id}).then((v) => {
                        const member: ChatMember = JSON.parse(new TextDecoder().decode(v[0].Data))
                        if (!members[member.Id] && (member.Id !== profile.UserId)) {
                            membersArray.push(member)
                        }
                    })
                }
            }
            if (membersArray.length === 0) {
                setNotFound((prevState) => ({...prevState, global: true}))
            } else {
                setNotFound((prevState) => ({...prevState, global: false}))
                setGlobalItems((prevState) => ({...prevState, members: membersArray}))
            }
        })
    }, [profile.UserId, searchValue])

    useEffect(() => {
        let timerId: NodeJS.Timeout | undefined;
        handleLocalItems()
        if (searchValue.length > 2) {
            timerId = setTimeout(async () => handleGlobalItems(), 500)
        }
        return () => {
            clearTimeout(timerId)
        }
    }, [handleGlobalItems, handleLocalItems, members, searchValue, searchValue.length])

    return (
        <div className={'user-list-wrapper'}>
            {notFound.local && ((notFound.global && searchValue.length > 2) || (!notFound.global && searchValue.length <= 2)) ?
                <span className={'user-list-label-wrapper'}>Чаты и пользователи не найдены</span> : null}
            {/*{localChats.groupChats.map((v) => <ChatTile key={uuidv4()} online={false}*/}
            {/*                                       title={v.chatInfo.Metadata?.Title ?? "chat"}*/}
            {/*                                       onClick={() => {*/}

            {/*                                       }} isSelected={false}/>)}*/}
            {localChats.personalChats.map((v) => <ChatTile key={uuidv4()} online={false} title={v.member.Login}
                                                     onClick={() =>
                                                         actions.toggleChatId(v.chat.chatInfo.Id)
                                                     } isSelected={false} unreadMessages={0}/>)}
            {(searchValue.length > 2 && !notFound.global && (globalItems.members.length !== 0)) &&
                <>
                    <span className={'user-list-label-wrapper'}>Глобальный поиск</span>
                    {(globalItems.members.length !== 0) &&
                        globalItems.members.map((member) =>
                        <ChatTile key={uuidv4()} online={false} title={member.Login}
                                  onClick={() => {
                                      actions.setMember(member)
                                      actions.toggleChatId(undefined)
                                  }} isSelected={false} unreadMessages={0}/>)}
                </>}
        </div>
    )
}

export default UserList