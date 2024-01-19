import chat from "./mobx/chat.ts";
import {Chat, ChatMessage, ChatRole} from "../proto/chat/chat_actions.ts";
import {MethodInfo, NextServerStreamingFn, RpcOptions, ServerStreamingCall} from "@protobuf-ts/runtime-rpc";
import {TransferObject} from "../proto/transfers/item.ts";
import {
    ChatStreamRequest,
    ChatStreamRequest_Type,
    ProfileStreamRequest,
    ProfileStreamRequest_Type
} from "../proto/transfers/streams.ts";
import {StreamsApi} from "./api.ts";
import profile from "./mobx/profile.ts";
import {PagerProfile} from "../proto/common/common.ts";

export const initializeStreams = async (init: boolean) => {
    if (init) {
        await streamHandler<ProfileStreamRequest>(init, StreamsApi.streamProfile.bind(StreamsApi), {})
        for (const obj of profile.chatRoles) {
            await streamHandler<ChatStreamRequest>(init, StreamsApi.streamChat.bind(StreamsApi), {chatId: obj.id})
        }
        return true
    } else {
        streamHandler<ProfileStreamRequest>(init, StreamsApi.streamProfile.bind(StreamsApi), {})
        for (const obj of profile.chatRoles) {
            streamHandler<ChatStreamRequest>(init, StreamsApi.streamChat.bind(StreamsApi), {chatId: obj.id})
        }
    }
}

export const streamHandler = async <T extends object>(
    init: boolean,
    stream: (input: T, options?: RpcOptions) => ServerStreamingCall<T, TransferObject>,
    prepareItem: T,
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
                    options.meta['user_id'] = profile.userId;
                    return next(method, input, options)
                }
            }
        ]
    }

    init ? console.log("init") : console.log("watching")

    const call = stream(prepareItem, watchHeaderOps)

    for await (const response of call.responses) {
        try {
            const decodedJsonString = new TextDecoder().decode(response.data);
            console.log(response.type)
            actionViaType(response.type, decodedJsonString)
        } catch (e) {
            console.log(e)
        }
    }
}

const actionViaType = (type: string, jsonString: string) => {
    switch (type) {
        case ProfileStreamRequest_Type[1]:
            profile.setProfile(PagerProfile.fromJsonString(jsonString))
            break;
        case ProfileStreamRequest_Type[2]:
            profile.setChatRoles(ChatRole.fromJsonString(jsonString))
            break;
        case ChatStreamRequest_Type[1]:
            chat.setChats(Chat.fromJsonString(jsonString))
            break;
        case ChatStreamRequest_Type[2]:
            chat.changeState(ChatMessage.fromJsonString(jsonString))
            break;
    }
}

