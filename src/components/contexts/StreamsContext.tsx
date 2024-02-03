import {createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {StreamsApi} from "../../data/api.ts";
import transfers, {getListByType, getValueByType} from "../../data/mobx/transfers.ts";
import {observer} from "mobx-react-lite";
import {PagerProfile} from "../../testproto/common/common.ts";
import {Chat, ChatMember, ChatMessage, ChatRole} from "../../testproto/chat/chat_actions.ts";
import {TransferObject} from "../../testproto/transfers/item.ts";
import {
    ChatMemberRequest_Type,
    ChatStreamRequest,
    ChatStreamRequest_Type,
    ProfileStreamRequest,
    ProfileStreamRequest_Type
} from "../../testproto/transfers/streams.ts";
import {autorun} from "mobx";
import * as _ from "lodash";
import {handleArrayChangeValue, handleDownStream} from "../../data/utils/transfers.ts";

export interface ChatInfo {
    chatInfo: Chat
    messages: ChatMessage[]
}

export interface ChatsData {
    [id: string]: ChatInfo
}

export interface MembersData {
    [id: string]: ChatMember
}

interface IDataObject {
    profile: PagerProfile
    chatRoles: ChatRole[]

    chats: ChatsData
    members: MembersData
    initList: {
        profile: boolean
        chats: boolean
    }

    handleMessagesPagination: (messages: ChatMessage[], chatId: string) => void,
    handleSetMembers: (memberIdArr: string[]) => Promise<void>
}

const contextData: IDataObject = {
    profile: PagerProfile.create(),
    chatRoles: [],

    chats: {},
    initList: {
        profile: false,
        chats: false
    },
    members: {},

    handleMessagesPagination: () => {
    },
    handleSetMembers: async () => {
    }
};

export const StreamsContext = createContext(contextData)

const GlobalContext: FC<{ children: ReactNode }> = observer(({children}) => {
    const [chats, setChats] = useState<ChatsData>(contextData.chats)
    const [members, setMembers] = useState<MembersData>(contextData.members)
    const [profile, setProfile] = useState<PagerProfile>(contextData.profile)
    const [chatRoles, setChatRoles] = useState<ChatRole[]>(contextData.chatRoles)

    const [initList, setInitList] = useState(contextData.initList)

    const handleChatMessagesPaginationUpdate = useCallback((messages: ChatMessage[], chatId: string) => {
        const chatMd = chats[chatId]
        if (messages.length === chatMd?.messages?.length) {
            return
        } else if (chatMd) {
            chatMd.messages = messages;
            setChats((prevState) => ({...prevState, [chatId]: chatMd}))
            // chatMapCopy.set(chatId, chatMd)
            // setChats(chatMapCopy)
        }
    }, [chats])

    const handleSetMembers = useCallback(async (memberIdArr: string[]) => {
        let noChanges = true;
        const newData: MembersData = {}
        for (const memberId of memberIdArr) {
            if (!members[memberId] && memberId !== profile.UserId) {
                await handleDownStream(false, StreamsApi.streamChatMember, {MemberId: memberId}).then((v) => {
                    newData[memberId] = JSON.parse(new TextDecoder().decode(v[0].Data))
                    noChanges = false;
                    handleDownStream(true, StreamsApi.streamChatMember, {MemberId: memberId})
                })
            }
        }
        if (!noChanges) {
            setMembers((prevState) => ({...prevState, ...newData}))
        }
    }, [members, profile.UserId])

    const handleSetMemberChanges = useCallback((obj: TransferObject) => {
        const member: ChatMember = JSON.parse(new TextDecoder().decode(obj.Data))
        const existsMember = members[member.Id]
        if (!_.isEqual(existsMember, member)) {
            setMembers((prevState) => ({...prevState, [member.Id]: member}))
        }
    }, [members])

    const handleChatMessagesChanges = useCallback((obj: TransferObject) => {
        const message: ChatMessage = JSON.parse(new TextDecoder().decode(obj.Data))
        const chatMd = chats[message.LinkedChatId]
        if (chatMd.messages && !chatMd.messages.find((v) => v.Id === message.Id && v.Text === message.Text && v.Status === message.Status)) {
            setChats((prevState) => ({
                ...prevState,
                [message.LinkedChatId]: {...chatMd, messages: handleArrayChangeValue(chatMd.messages, message)}
            }))
        }
    }, [chats])

    const handleChatChanges = useCallback((obj: TransferObject) => {
        const newChat: Chat = JSON.parse(new TextDecoder().decode(obj.Data))
        const chatMd = chats[newChat.Id]
        if (chatMd && !_.isEqual(chatMd, newChat)) {
            chatMd.chatInfo = newChat
            setChats((prevState) => ({...prevState, [newChat.Id]: chatMd}))
        }
    }, [chats])

    const startProfileStreaming = useCallback(() => {
        handleDownStream<ProfileStreamRequest>(false, StreamsApi.streamProfile, {}).then((v) => {
            handleDownStream<ProfileStreamRequest>(true, StreamsApi.streamProfile, {})
            setProfile(getValueByType<PagerProfile>(ProfileStreamRequest_Type[1], v))
            setChatRoles(getListByType<ChatRole>(ProfileStreamRequest_Type[2], v))
            if (!initList.profile) {
                setInitList((prevState) => ({...prevState, profile: true}))
            }
        })
    }, [initList.profile])

    const startChatStreaming = useCallback(async () => {
        const newMembersData: Map<string, ChatMember> = new Map()
        const newChatsData: ChatsData = {}
        let noChanges = true;
        for (const role of chatRoles) {
            if (!chats[role.Id]) {
                await handleDownStream<ChatStreamRequest>(false, StreamsApi.streamChat, {
                    ChatId: role.Id,
                    RequestedMessages: 1
                }).then(async (v) => {
                    const chat = getValueByType<Chat>(ChatStreamRequest_Type[1], v)
                    const messages = getListByType<ChatMessage>(ChatStreamRequest_Type[2], v)
                    chat.MembersId.forEach((id) => {
                        newMembersData.set(id, ChatMember.create())
                    })
                    newChatsData[chat.Id] = {
                        messages: messages,
                        chatInfo: chat
                    }
                    handleDownStream<ChatStreamRequest>(true, StreamsApi.streamChat, {
                        ChatId: role.Id,
                        RequestedMessages: 0
                    })
                })
                noChanges = false;
            }
        }
        if (!noChanges) {
            setChats((prevState) => ({...prevState, ...newChatsData}))
            await handleSetMembers(Array.from(newMembersData.keys()))
            if (!initList.chats) {
                setInitList((prevState) => ({...prevState, chats: true}))
            }
        } else if (initList.profile && !initList.chats && (chatRoles.length === 0)) {
            setInitList((prevState) => ({...prevState, chats: true}))
        }
    }, [chatRoles, chats, handleSetMembers, initList.chats, initList.profile])

    useEffect(() => {
        startProfileStreaming()
    }, [startProfileStreaming]);

    useEffect(() => {
        startChatStreaming()
    }, [startChatStreaming]);

    //change states from watching streams (all streams are initialized)
    useEffect(() => autorun(() => {
        const object = transfers.lastObject
        if (object !== null) {
            switch (object.Type) {
                case ProfileStreamRequest_Type[1]:
                    setProfile(JSON.parse(new TextDecoder().decode(object.Data)))
                    break;
                case ProfileStreamRequest_Type[2]:
                    setChatRoles((prevState) => handleArrayChangeValue<ChatRole>(prevState, JSON.parse(new TextDecoder().decode(object.Data))))
                    break;
                case ChatStreamRequest_Type[1]:
                    handleChatChanges(object)
                    break;
                case ChatStreamRequest_Type[2]:
                    handleChatMessagesChanges(object)
                    break;
                case ChatMemberRequest_Type[1]:
                    handleSetMemberChanges(object)
                    break;
            }
        }
    }), [handleChatChanges, handleChatMessagesChanges, handleSetMemberChanges])

    //memo for context objs
    const contextProperties = useMemo((): IDataObject => ({
        chats,
        chatRoles,
        profile,
        members,
        handleMessagesPagination: handleChatMessagesPaginationUpdate,
        handleSetMembers,
        initList
    }), [chatRoles, chats, handleChatMessagesPaginationUpdate, handleSetMembers, initList, members, profile])

    return (
        <StreamsContext.Provider
            value={contextProperties}>
            {children}
        </StreamsContext.Provider>
    )
})

export default GlobalContext