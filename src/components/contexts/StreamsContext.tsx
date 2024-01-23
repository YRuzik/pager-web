import {createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {
    ChatStreamRequest, ChatStreamRequest_Type,
    ProfileStreamRequest,
    ProfileStreamRequest_Type
} from "../../proto/transfers/streams.ts";
import {StreamsApi} from "../../data/api.ts";
import {Chat, ChatMessage, ChatRole} from "../../proto/chat/chat_actions.ts";
import {MethodInfo, NextServerStreamingFn, RpcOptions, ServerStreamingCall} from "@protobuf-ts/runtime-rpc";
import {TransferObject} from "../../proto/transfers/item.ts";
import {PagerProfile} from "../../proto/common/common.ts";
import {connectToWebSocket} from "../../data/sockets.ts";
import transfers from "../../data/mobx/transfers.ts";
import {observer} from "mobx-react-lite";
import {IInitialList} from "../../interfaces/ICommon.ts";
import {autorun} from "mobx";

interface IDataObject {
    profile: PagerProfile | null
    chatRoles: ChatRole[]

    chats: Chat[]
    messages: ChatMessage[]

    selectedChatId: string | null
    setSelectedChatId: (chatId: string) => void
}

const contextData: IDataObject = {
    profile: null,
    chatRoles: [],

    chats: [],
    messages: [],

    selectedChatId: null,
    setSelectedChatId: () => {}
};

export const StreamsContext = createContext(contextData)

const GlobalContext: FC<{ children: ReactNode }> = observer(({children}) => {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [chats, setChats] = useState<Chat[]>([])
    const [profile, setProfile] = useState<PagerProfile | null>(null)
    const [chatRoles, setChatRoles] = useState<ChatRole[]>([])
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

    const [initList, setInitList] = useState<IInitialList>({
        profile: false,
        chat: false
    })

    const contextProperties = useMemo((): IDataObject => ({
        messages,
        chats,
        chatRoles,
        profile,
        selectedChatId,
        setSelectedChatId
    }), [chatRoles, chats, messages, profile, selectedChatId])

    const handleDownStream = useCallback(async <T extends object>(
        init: boolean,
        toggleInit: () => void,
        stream: (input: T, options?: RpcOptions) => ServerStreamingCall<T, TransferObject>,
        requestBody: T,
    ) => {
        const watchHeaderOps: RpcOptions = {
            interceptors: [
                {
                    interceptServerStreaming(next: NextServerStreamingFn, method: MethodInfo, input: object, options: RpcOptions): ServerStreamingCall {
                        if (!options.meta) {
                            options.meta = {}
                        }
                        if (init) {
                            options.meta['watch'] = 'watch';
                        }
                        const jwt = localStorage.getItem("jwt");
                        if (jwt) {
                            options.meta['jwt'] = jwt;
                        }
                        return next(method, input, options)
                    }
                }
            ],
        }

        !init ? console.log("initialize") : console.log("watching")

        const call = stream(requestBody, watchHeaderOps)

        for await (const response of call.responses) {
            try {
                transfers.setToMap(response)
            } catch (e) {
                console.log(e)
            }
        }

        if (!init) {
            toggleInit()
        }
    }, [])

    const handleProfileContextStream = useCallback(async () => {
        handleDownStream<ProfileStreamRequest>(initList.profile, () => setInitList({
            ...initList,
            profile: true
        }), StreamsApi.streamProfile.bind(StreamsApi), {})
    }, [handleDownStream, initList.profile])

    const handleChatContextStream = useCallback(async () => {
        if (initList.profile && chatRoles.length > 0) {
            for (const obj of chatRoles) {
                if (!initList.chat) {
                    await handleDownStream<ChatStreamRequest>(initList.chat, () => {
                    }, StreamsApi.streamChat.bind(StreamsApi), {chatId: obj.id})
                } else {
                    handleDownStream<ChatStreamRequest>(initList.chat, () => setInitList({
                        ...initList,
                        chat: true
                    }), StreamsApi.streamChat.bind(StreamsApi), {chatId: obj.id})
                }
            }
            if (!initList.chat) {
                setInitList({
                    ...initList,
                    chat: true
                })
            }
        }
    }, [initList, chatRoles, handleDownStream])

    useEffect(() => autorun(() => {
        const lObj = transfers.lastObject
        if (lObj !== null && initList.chat && initList.profile) {
            switch (lObj.type) {
                case ProfileStreamRequest_Type[1]:
                    setProfile(transfers.streamValue<PagerProfile>(ProfileStreamRequest_Type[1], PagerProfile))
                    break;
                case ProfileStreamRequest_Type[2]:
                    setChatRoles(transfers.streamListValue<ChatRole>(ProfileStreamRequest_Type[2], ChatRole))
                    break;
                case ChatStreamRequest_Type[1]:
                    setChats(transfers.streamListValue<Chat>(ChatStreamRequest_Type[1], Chat))
                    break;
                case ChatStreamRequest_Type[2]:
                    setMessages(transfers.streamListValue<ChatMessage>(ChatStreamRequest_Type[2], ChatMessage))
                    break;
            }
        }
    }), [initList.chat, initList.profile])

    useEffect(() => {
        if (initList.profile) {
            console.log("profile initiated")
            setProfile(transfers.streamValue<PagerProfile>(ProfileStreamRequest_Type[1], PagerProfile))
            setChatRoles(transfers.streamListValue<ChatRole>(ProfileStreamRequest_Type[2], ChatRole))
        }
    }, [initList.profile]);

    useEffect(() => {
        if (initList.chat) {
            console.log("chat initiated")
            setChats(transfers.streamListValue<Chat>(ChatStreamRequest_Type[1], Chat))
            setMessages(transfers.streamListValue<ChatMessage>(ChatStreamRequest_Type[2], ChatMessage))
        }
    }, [initList.chat]);

    useEffect(() => {
        handleProfileContextStream()
    }, [handleProfileContextStream]);

    useEffect(() => {
        handleChatContextStream()
    }, [handleChatContextStream]);

    useEffect(() => {
        connectToWebSocket()
    }, []);

    return (
        <StreamsContext.Provider
            value={contextProperties}>
            {children}
        </StreamsContext.Provider>
    )
})

export default GlobalContext