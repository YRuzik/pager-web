import {createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {
    ChatStreamRequest,
    ChatStreamRequest_Type,
    ProfileStreamRequest,
    ProfileStreamRequest_Type
} from "../../proto/transfers/streams.ts";
import {StreamsApi} from "../../data/api.ts";
import {Chat, ChatMessage, ChatRole} from "../../proto/chat/chat_actions.ts";
import {PagerProfile} from "../../proto/common/common.ts";
import {MethodInfo, NextServerStreamingFn, RpcOptions, ServerStreamingCall} from "@protobuf-ts/runtime-rpc";
import {TransferObject} from "../../proto/transfers/item.ts";

interface IDataObject {
    init: boolean

    chats: Chat[]
    messages: ChatMessage[]

    profile: PagerProfile | null
    chatRoles: ChatRole[]
    userId: string
    selectedChatId: string | null
    setSelectedChatId: (chatId: string) => void
}

const contextData: IDataObject = {
    init: false,

    chats: [],
    messages: [],

    profile: null,
    chatRoles: [],
    userId: "",

    selectedChatId: null,
    setSelectedChatId: () => {
    }
};

export const StreamsContext = createContext(contextData)

const GlobalContext: FC<{ children: ReactNode }> = ({children}) => {
    const [init, setInit] = useState(true)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [profile, setProfile] = useState<PagerProfile | null>(null)
    const [chatRoles, setChatRoles] = useState<ChatRole[]>([])
    const [chats, setChats] = useState<Chat[]>([])
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

    const userId = "65a9930fc94f6e3800fa6c29"

    const contextProperties = useMemo(():IDataObject  => ({
        messages,
        selectedChatId,
        profile,
        chats,
        init,
        userId,
        setSelectedChatId,
        chatRoles
    }), [chatRoles, chats, init, messages, profile, selectedChatId, userId])

    const handleSetMessages = useCallback((message: ChatMessage) => setMessages([...messages, message]), [messages])
    const handleSetChatRoles = useCallback((role: ChatRole) => setChatRoles([...chatRoles, role]), [chatRoles])
    const handleSetChats = useCallback((chat: Chat) => setChats([...chats, chat]), [chats])

    const actionViaType = useCallback((type: string, jsonString: string) => {
        switch (type) {
            case ProfileStreamRequest_Type[1]:
                setProfile(PagerProfile.fromJsonString(jsonString))
                break;
            case ProfileStreamRequest_Type[2]:
                handleSetChatRoles(ChatRole.fromJsonString(jsonString))
                break;
            case ChatStreamRequest_Type[1]:
                handleSetChats(Chat.fromJsonString(jsonString))
                break;
            case ChatStreamRequest_Type[2]:
                handleSetMessages(ChatMessage.fromJsonString(jsonString))
                break;
        }
    }, [handleSetChatRoles, handleSetChats, handleSetMessages])

    const streamHandler = useCallback(async <T extends object>(
        init: boolean,
        stream: (input: T, options?: RpcOptions) => ServerStreamingCall<T, TransferObject>,
        // toObjectFunc: (type: string, jsonString: string) => void,
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
                        options.meta['user_id'] = "65a9930fc94f6e3800fa6c29";
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
                console.log(response.type)
                actionViaType(response.type, decodedJsonString)
            } catch (e) {
                console.log(e)
            }
        }
    }, [actionViaType])

    console.log(chatRoles)

    const handleStreams = useCallback(async () => {
        if (init) {
            await streamHandler<ProfileStreamRequest>(init, StreamsApi.streamProfile.bind(StreamsApi), {})
            for (const obj of chatRoles) {
                await streamHandler<ChatStreamRequest>(init, StreamsApi.streamChat.bind(StreamsApi), {chatId: obj.id})
            }
            setInit(false)
        } else {
            streamHandler<ProfileStreamRequest>(init, StreamsApi.streamProfile.bind(StreamsApi), {})
            for (const obj of chatRoles) {
                streamHandler<ChatStreamRequest>(init, StreamsApi.streamChat.bind(StreamsApi), {chatId: obj.id})
            }
        }
    }, [chatRoles, init, streamHandler])

    useEffect(() => {
        handleStreams()
    }, [handleStreams]);

    return (
        <StreamsContext.Provider
            value={contextProperties}>
            {children}
        </StreamsContext.Provider>
    )
}

export default GlobalContext