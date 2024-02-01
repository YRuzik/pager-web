import {FC, useContext, useEffect, useState} from "react";
import {ChatMember} from "../../../testproto/chat/chat_actions.ts";
import {ClientApi, StreamsApi} from "../../../data/api.ts";
import {handleDownStream} from "../../../data/utils.ts";
import ChatTile, {ChatTileSkeleton} from "../../common/chatTile/ChatTile.tsx";
import {v4 as uuidv4} from 'uuid';
import "./userList.scss"
import actions from "../../../data/mobx/actions.ts";
import {StreamsContext} from "../../contexts/StreamsContext.tsx";

type UserListProps = {
    searchValue: string
}
const UserList: FC<UserListProps> = ({searchValue}) => {
    const {members} = useContext(StreamsContext)
    const [foundedMembers, setFoundedMembers] = useState<ChatMember[]>([])
    const [fetching, setFetching] = useState(false)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        let timerId: NodeJS.Timeout | undefined;
        setFoundedMembers([])
        setNotFound(false)
        if (searchValue.length > 2) {
            setFetching(true)
            timerId = setTimeout(async () => {
                const membersArray: ChatMember[] = []
                await new ClientApi().searchUsersByIdentifier({identifier: searchValue}).then(async (response) => {
                    if (response) {
                        for (const id of response.userIds) {
                            await handleDownStream(false, StreamsApi.streamChatMember, {MemberId: id}).then((v) => {
                                const member: ChatMember = JSON.parse(new TextDecoder().decode(v[0].Data))
                                if (!members.has(member.Id)) {
                                    membersArray.push(member)
                                }
                            })
                        }
                        setFoundedMembers(membersArray)
                    }
                    if (membersArray.length === 0) {
                        setNotFound(true)
                    }
                    setFetching(false)
                })
            }, 500)
        }
        return () => {
            clearTimeout(timerId)
        }
    }, [members, searchValue, searchValue.length])

    return (
        <div className={'user-list-wrapper'}>
            <span className={'span-wrapper'}>Результат поиска</span>
            {!fetching && notFound ?
                <div className={'span-wrapper'}>Пользователи не найдены</div> : null}
            {fetching ? [0, 0, 0].map(() => <ChatTileSkeleton key={uuidv4()}/>) : foundedMembers.map((member) =>
                <ChatTile key={uuidv4()} online={false} title={member.Login}
                          onClick={() => {
                              actions.setMember(member)
                              actions.toggleChatId(undefined)
                          }} isSelected={false}/>)}
        </div>
    )
}

export default UserList