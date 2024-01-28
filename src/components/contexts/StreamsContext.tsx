import {createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {StreamsApi} from "../../data/api.ts";
import transfers, {getListByType, getValueByType} from "../../data/mobx/transfers.ts";
import {observer} from "mobx-react-lite";
import {Metadata, ServerStreamingClientMethod} from "nice-grpc-web";
import {CallOptions} from "nice-grpc-common";
import {PagerProfile} from "../../testproto/common/common.ts";
import {Chat, ChatMessage, ChatRole} from "../../testproto/chat/chat_actions.ts";
import {TransferObject} from "../../testproto/transfers/item.ts";
import {
    ChatStreamRequest,
    ChatStreamRequest_Type,
    ProfileStreamRequest,
    ProfileStreamRequest_Type
} from "../../testproto/transfers/streams.ts";
import {connectToWebSocket} from "../../data/sockets.ts";
import {autorun} from "mobx";
import {handleArrayChangeValue} from "../../data/utils.ts";

export interface ChatInfo {
    chatInfo?: Chat
    messages?: ChatMessage[]
}

interface IDataObject {
    profile?: PagerProfile
    chatRoles: ChatRole[]

    chats?: Map<string, ChatInfo>

    selectedChatId?: string
    setSelectedChatId: (chatId: string) => void
}

const contextData: IDataObject = {
    profile: undefined,
    chatRoles: [],

    chats: undefined,

    selectedChatId: undefined,
    setSelectedChatId: () => {
    }
};

export const StreamsContext = createContext(contextData)

const GlobalContext: FC<{ children: ReactNode }> = observer(({children}) => {
    const [chats, setChats] = useState<Map<string, ChatInfo> | undefined>(contextData.chats)
    const [profile, setProfile] = useState<PagerProfile | undefined>(contextData.profile)
    const [chatRoles, setChatRoles] = useState<ChatRole[]>(contextData.chatRoles)
    const [selectedChatId, setSelectedChatId] = useState<string | undefined>(contextData.selectedChatId)

    //memo for context objs
    const contextProperties = useMemo((): IDataObject => ({
        chats,
        chatRoles,
        profile,
        selectedChatId,
        setSelectedChatId
    }), [chatRoles, chats, profile, selectedChatId])

    const handleChatMessagesChanges = useCallback((obj: TransferObject) => {
        const message: ChatMessage = JSON.parse(new TextDecoder().decode(obj.Data))
        const chatMapCopy = new Map(chats)
        const chatMd = chatMapCopy.get(message.LinkedChatId)
        if (chatMd?.messages && !chatMd?.messages.find((v) => v.Id === message.Id && v.Text === message.Text)) {
            chatMd.messages = handleArrayChangeValue(chatMd.messages, message)
            chatMapCopy.set(message.LinkedChatId, chatMd)
            setChats(chatMapCopy)
        }
    }, [chats])

    const handleChatChanges = useCallback((obj: TransferObject) => {
        const chatMapCopy = new Map(chats)
        const newChat: Chat = JSON.parse(new TextDecoder().decode(obj.Data))
        const chatMd = chatMapCopy.get(newChat.Id)
        if (chatMd && chatMd?.chatInfo?.Metadata !== newChat.Metadata && chatMd?.chatInfo?.MembersId !== newChat.MembersId) {
            chatMd.chatInfo = newChat
            chatMapCopy.set(newChat.Id, chatMd)
            setChats(chatMapCopy)

        }
    }, [chats])

    //main handler for all streams in application
    const handleDownStream = useCallback(async <T extends object>(
        init: boolean,
        stream: ServerStreamingClientMethod<T, TransferObject>,
        requestBody: T
    ) => {
        const jwt = localStorage.getItem("jwt");
        let ops = {}
        if (init) {
            ops = {watch: "watch"}
        }
        if (jwt) {
            ops = {...ops, jwt: jwt}
        }
        const test: CallOptions = {
            metadata: new Metadata(ops)
        }

        const responses = stream(requestBody, test)

        const dataPackage: TransferObject[] = [];

        for await (const response of responses) {
            if (!init) {
                dataPackage.push(response)
            } else {
                transfers.setToLastObj(response)
            }
        }

        return dataPackage;

    }, [])

    const startProfileStreaming = useCallback(() => {
        handleDownStream<ProfileStreamRequest>(false, StreamsApi.streamProfile, {}).then((v) => {
            handleDownStream<ProfileStreamRequest>(true, StreamsApi.streamProfile, {})
            setProfile(getValueByType<PagerProfile>(ProfileStreamRequest_Type[1], v))
            setChatRoles(getListByType<ChatRole>(ProfileStreamRequest_Type[2], v))
        })
    }, [handleDownStream])

    const startChatStreaming = useCallback(async () => {
        const chatsMap = new Map(chats)
        let noChanges = true;
        for (const role of chatRoles) {
            if (!chatsMap.has(role.Id)) {
                await handleDownStream<ChatStreamRequest>(false, StreamsApi.streamChat, {
                    ChatId: role.Id,
                    RequestedMessages: 1
                }).then((v) => {
                    const chat = getValueByType<Chat>(ChatStreamRequest_Type[1], v)
                    const messages = getListByType<ChatMessage>(ChatStreamRequest_Type[2], v)
                    chatsMap.set(role.Id, {
                        messages: messages,
                        chatInfo: chat
                    })
                    handleDownStream<ChatStreamRequest>(true, StreamsApi.streamChat, {
                        ChatId: role.Id,
                        RequestedMessages: 0
                    })
                })
                noChanges = false;
            }
        }
        if (!noChanges) {
            setChats(chatsMap)
        }
    }, [chatRoles, chats, handleDownStream])

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
            }
        }
    }), [handleChatChanges, handleChatMessagesChanges])

    //connect to users socket server
    useEffect(() => {
        if (profile !== undefined) {
            connectToWebSocket(profile.UserId)
        }
    }, [profile]);

    return (
        <StreamsContext.Provider
            value={contextProperties}>
            {children}
        </StreamsContext.Provider>
    )
})

export default GlobalContext