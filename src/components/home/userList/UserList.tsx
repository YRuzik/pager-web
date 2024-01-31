import {FC, useEffect, useState} from "react";
import {ChatMember} from "../../../testproto/chat/chat_actions.ts";
import {ClientActionsApi, StreamsApi} from "../../../data/api.ts";
import {handleDownStream} from "../../../data/utils.ts";
import ChatTile from "../../common/chatTile/ChatTile.tsx";
import {v4 as uuidv4} from 'uuid';
import "./userList.scss"

type UserListProps = {
    searchValue: string
}
const UserList: FC<UserListProps> = ({searchValue}) => {
    const [foundedMembers, setFoundedMembers] = useState<ChatMember[]>([])
    const [error, setError] = useState("")

    useEffect(() => {
        let timerId: NodeJS.Timeout | undefined;
        setError("")
        setFoundedMembers([])
        if (searchValue.length > 3) {
            timerId = setTimeout(async () => {
                const membersArray: ChatMember[] = []
                await new ClientActionsApi().searchUsersByIdentifier({identifier: searchValue}).then(async (response) => {
                    if(!response){
                        return
                    }
                    for (const id of response.userIds) {
                        await handleDownStream(false, StreamsApi.streamChatMember, {MemberId: id}).then((v) => {
                            const member: ChatMember = JSON.parse(new TextDecoder().decode(v[0].Data))
                            membersArray.push(member)
                        })
                    }
                    setFoundedMembers(membersArray)
                })
            }, 500)
        }
        return () => {
            clearTimeout(timerId)
        }
    }, [searchValue, searchValue.length])

    return (
        <div className={'user-list-wrapper'}>
            <span className={'span-wrapper'}>Search results:</span>
            <span>{error}</span>
            {foundedMembers.map((member) => <ChatTile key={uuidv4()} online={false} title={member.Login}
                                                      onClick={() => {
                                                      }} isSelected={false}/>)}
        </div>
    )
}

export default UserList