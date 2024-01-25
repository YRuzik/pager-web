import {createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {StreamsApi} from "../../data/api.ts";
import transfers from "../../data/mobx/transfers.ts";
import {observer} from "mobx-react-lite";
import {IInitialList} from "../../interfaces/ICommon.ts";
import {autorun} from "mobx";
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

interface IDataObject {
    profile: PagerProfile | undefined
    chatRoles: ChatRole[]

    chats: Chat[]
    messages: ChatMessage[]

    selectedChatId: string | undefined
    setSelectedChatId: (chatId: string) => void
}

const contextData: IDataObject = {
    profile: undefined,
    chatRoles: [],

    chats: [],
    messages: [],

    selectedChatId: undefined,
    setSelectedChatId: () => {
    }
};

export const StreamsContext = createContext(contextData)

const GlobalContext: FC<{ children: ReactNode }> = observer(({children}) => {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [chats, setChats] = useState<Chat[]>([])
    const [profile, setProfile] = useState<PagerProfile | undefined>(undefined)
    const [chatRoles, setChatRoles] = useState<ChatRole[]>([])
    const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined)

    const [chatsInitMap, setChatsInitMap] = useState<Map<string, {
        initialized: boolean,
        watching: boolean
    }> | undefined>(undefined)

    const [initList, setInitList] = useState<IInitialList>({
        profile: false,
        chat: false
    })

    //memo for context objs
    const contextProperties = useMemo((): IDataObject => ({
        messages,
        chats,
        chatRoles,
        profile,
        selectedChatId,
        setSelectedChatId
    }), [chatRoles, chats, messages, profile, selectedChatId])

    //main handler for all streams in application
    const handleDownStream = useCallback(async <T extends object>(
        init: boolean,
        toggleInit: () => void,
        stream: ServerStreamingClientMethod<T, TransferObject>,
        requestBody: T,
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

        for await (const response of responses) {
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

    //start profile stream by initialization data
    const handleProfileContextStream = useCallback(async () => {
        handleDownStream<ProfileStreamRequest>(initList.profile, () => setInitList({
            ...initList,
            profile: true
        }), StreamsApi.streamProfile, {})
    }, [handleDownStream, initList.profile])

    //construct chats initialization data map
    const handleChatInitList = useCallback(() => {
        if (initList.profile && chatRoles.length > 0) {
            const mapCopy = chatsInitMap === undefined ? new Map() : new Map(chatsInitMap)
            for (const role of chatRoles) {
                if (!mapCopy.has(role.Id)) {
                    mapCopy.set(role.Id, {initialized: false, watching: false})
                }
            }
            setChatsInitMap(mapCopy)
            setInitList((prevState) => ({...prevState, chat: false}))
        }
    }, [chatRoles, initList.profile])

    //start chat streams by initialization data
    const handleChatStreams = useCallback(async () => {
        if (initList.profile && chatsInitMap !== undefined) {
            const mapCopy = new Map(chatsInitMap)
            for (const chatInfo of mapCopy) {
                const chatId = chatInfo[0]
                const chatData = chatInfo[1]
                if (chatData?.initialized === false) {
                    await handleDownStream<ChatStreamRequest>(false, () => {
                    }, StreamsApi.streamChat, {ChatId: chatId})
                    mapCopy.set(chatId, {initialized: true, watching: false})
                } else if (chatData?.watching === false) {
                    handleDownStream<ChatStreamRequest>(true, () => {
                    }, StreamsApi.streamChat, {ChatId: chatId})
                    mapCopy.set(chatId, {initialized: true, watching: true})
                }
            }
            if (!initList.chat) {
                setChatsInitMap(mapCopy)
            }
        }
    }, [chatsInitMap, handleDownStream, initList.profile, initList.chat])

    //observe chat initialization data
    useEffect(() => {
        if (initList.profile && !initList.chat) {
            let allWatching = true;
            chatsInitMap?.forEach((v) => {
                if (!v.watching) {
                    allWatching = false;
                    return false;
                }
            })
            setInitList((prevState) => ({...prevState, chat: allWatching}))
        }
    }, [chatsInitMap, initList.chat]);

    //change states from watching streams (all streams are initialized)
    useEffect(() => autorun(() => {
        const lObj = transfers.lastObject
        if (lObj !== null && initList.chat && initList.profile) {
            switch (lObj.Type) {
                case ProfileStreamRequest_Type[1]:
                    setProfile(transfers.streamValue<PagerProfile>(ProfileStreamRequest_Type[1]))
                    break;
                case ProfileStreamRequest_Type[2]:
                    setChatRoles(transfers.streamListValue<ChatRole>(ProfileStreamRequest_Type[2]))
                    break;
                case ChatStreamRequest_Type[1]:
                    setChats(transfers.streamListValue<Chat>(ChatStreamRequest_Type[1]))
                    break;
                case ChatStreamRequest_Type[2]:
                    setMessages(transfers.streamListValue<ChatMessage>(ChatStreamRequest_Type[2]))
                    break;
            }
        }
    }), [chatsInitMap, initList.profile])

    //set profile md after init
    useEffect(() => {
        if (initList.profile) {
            setProfile(transfers.streamValue<PagerProfile>(ProfileStreamRequest_Type[1]))
            setChatRoles(transfers.streamListValue<ChatRole>(ProfileStreamRequest_Type[2]))
        }
    }, [initList.profile]);

    //set chats md after init
    useEffect(() => {
        if (initList.chat) {
            setChats(transfers.streamListValue<Chat>(ChatStreamRequest_Type[1]))
            setMessages(transfers.streamListValue<ChatMessage>(ChatStreamRequest_Type[2]))
        }
    }, [initList.chat]);

    //start stream funcs
    useEffect(() => {
        handleProfileContextStream()
    }, [handleProfileContextStream]);

    useEffect(() => {
        handleChatInitList()
    }, [handleChatInitList]);

    useEffect(() => {
        handleChatStreams()
    }, [handleChatStreams])

    //connect to users socket server
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