import chat from "./mobx/chat.ts";
import {ChatMessage} from "../proto/chat/chat_actions.ts";
import {MethodInfo, NextServerStreamingFn, RpcOptions, ServerStreamingCall} from "@protobuf-ts/runtime-rpc";
import {TransferObject} from "../proto/transfers/item.ts";
import {ChatStreamRequest_Type} from "../proto/transfers/streams.ts";

export const streamHandler = async <T extends object>(
    init: boolean,
    initToggle: () => void,
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

    if (init) {
        initToggle()
    }
}

const actionViaType = (type: string, jsonString: string) => {
    switch (type) {
        case ChatStreamRequest_Type[1]:
            chat.changeState(ChatMessage.fromJsonString(jsonString))
            break;
    }
}

