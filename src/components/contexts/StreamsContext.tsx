import {createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {
    ChatStreamRequest,
    ChatStreamRequest_Type,
    ProfileStreamRequest,
    ProfileStreamRequest_Type
} from "../../proto/transfers/streams.ts";
import {StreamsApi} from "../../data/api.ts";
import {Chat, ChatMessage, ChatRole} from "../../proto/chat/chat_actions.ts";
import {MethodInfo, NextServerStreamingFn, RpcOptions, ServerStreamingCall} from "@protobuf-ts/runtime-rpc";
import {TransferObject} from "../../proto/transfers/item.ts";
import profile from "../../data/mobx/profile.ts";
import {PagerProfile} from "../../proto/common/common.ts";

interface IDataObject {
    init: boolean

    chats: Chat[]
    messages: ChatMessage[]

    selectedChatId: string | null
    setSelectedChatId: (chatId: string) => void
}

const contextData: IDataObject = {
    init: false,

    chats: [],
    messages: [],

    selectedChatId: null,
    setSelectedChatId: () => {
    }
};

export const StreamsContext = createContext(contextData)

const GlobalContext: FC<{ children: ReactNode }> = ({children}) => {
    const [init, setInit] = useState(true)
    // const [profile, setProfile] = useState<PagerProfile | null>(null)
    // const [chatRoles, setChatRoles] = useState<ChatRole[]>([])
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [chats, setChats] = useState<Chat[]>([])
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

    const contextProperties = useMemo(():IDataObject  => ({
        messages,
        selectedChatId,
        chats,
        init,
        setSelectedChatId,
    }), [chats, init, messages, selectedChatId])

    // const handleSetMessages = useCallback((message: ChatMessage) => setMessages([...messages, message]), [messages])
    // const handleSetChats = useCallback((chat: Chat) => setChats([...chats, chat]), [chats])

    console.log(messages)

    const actionViaType = useCallback((type: string, jsonString: string) => {
        switch (type) {
            case ProfileStreamRequest_Type[1]:
                profile.setProfile(PagerProfile.fromJsonString(jsonString))
                break;
            case ProfileStreamRequest_Type[2]:
                profile.setChatRoles(ChatRole.fromJsonString(jsonString))
                break;
            case ChatStreamRequest_Type[1]:
                setChats((prevState) => [...prevState, Chat.fromJsonString(jsonString)])
                break;
            case ChatStreamRequest_Type[2]:
                setMessages((prevState) => [...prevState, ChatMessage.fromJsonString(jsonString)])
                break;
        }
    }, [])

    const streamHandler = useCallback(async <T extends object>(
        init: boolean,
        stream: (input: T, options?: RpcOptions) => ServerStreamingCall<T, TransferObject>,
        toObjectFunc: (type: string, jsonString: string) => void,
        requestBody: T,
    ) => {
        const watchHeaderOps: RpcOptions = {
            interceptors: [
                {
                    interceptServerStreaming(next: NextServerStreamingFn, method: MethodInfo, input: object, options: RpcOptions): ServerStreamingCall {
                        if (!options.meta) {
                            options.meta = {}
                        }
                        if (!init) {
                            options.meta['watch'] = 'watch';
                        }
                        const jwt = localStorage.getItem("jwt");
                        if (jwt) {
                            options.meta['jwt'] = jwt;
                        }
                        console.log(jwt)
                        return next(method, input, options)
                    }
                }
            ]
        }

        init ? console.log("init") : console.log("watching")

        const call = stream(requestBody, watchHeaderOps)

        for await (const response of call.responses) {
            try {
                const decodedJsonString = new TextDecoder().decode(response.data);
                toObjectFunc(response.type, decodedJsonString)
                console.log('decode done')
            } catch (e) {
                console.log(e)
            }
        }
    }, [])

    const streamController = useCallback(async () => {
        if (init) {
            await streamHandler<ProfileStreamRequest>(init, StreamsApi.streamProfile.bind(StreamsApi), actionViaType, {})
            for (const obj of profile.chatRoles) {
                await streamHandler<ChatStreamRequest>(init, StreamsApi.streamChat.bind(StreamsApi), actionViaType, {chatId: obj.id})
            }
            setInit(false)
        } else {
            streamHandler<ProfileStreamRequest>(init, StreamsApi.streamProfile.bind(StreamsApi), actionViaType, {})
            for (const obj of profile.chatRoles) {
                streamHandler<ChatStreamRequest>(init, StreamsApi.streamChat.bind(StreamsApi), actionViaType, {chatId: obj.id})
            }
        }
    }, [actionViaType, init, streamHandler, profile.chatRoles])

    useEffect(() => {
        streamController()
    }, [streamController]);

    return (
        <StreamsContext.Provider
            value={contextProperties}>
            {children}
        </StreamsContext.Provider>
    )
}

export default GlobalContext