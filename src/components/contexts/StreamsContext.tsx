import {createContext, FC, ReactNode, useCallback, useEffect, useState} from "react";
import {streamHandler} from "../../data/streams.ts";
import {ChatStreamRequest, ProfileStreamRequest} from "../../proto/transfers/streams.ts";
import {StreamsApi} from "../../data/api.ts";
import profile from "../../data/mobx/profile.ts";

const contextData = {
    initiated: false
};

export const StreamsContext = createContext(contextData)

const GlobalContext: FC<{children: ReactNode}> = ({children}) => {
    const [init, setInit] = useState(true)

    const handleStreams = useCallback(async () => {
        if (init) {
            await streamHandler<ProfileStreamRequest>(init, StreamsApi.streamProfile.bind(StreamsApi), {})
            for (const obj of profile.chatRoles) {
                await streamHandler<ChatStreamRequest>(init, StreamsApi.streamChat.bind(StreamsApi), {chatId: obj.id})
            }
            setInit(false)
            contextData.initiated = true;
        } else {
            streamHandler<ProfileStreamRequest>(init, StreamsApi.streamProfile.bind(StreamsApi), {})
            for (const obj of profile.chatRoles) {
                streamHandler<ChatStreamRequest>(init, StreamsApi.streamChat.bind(StreamsApi), {chatId: obj.id})
            }
        }
    }, [init])

    useEffect(() => {
        handleStreams()
    }, [handleStreams]);

    return (
        <StreamsContext.Provider value={contextData}>
            {children}
        </StreamsContext.Provider>
    )
}

export default GlobalContext