import {ChatActionsClient} from "../proto/chat/chat_actions.client.ts";
import {GrpcWebFetchTransport} from "@protobuf-ts/grpcweb-transport";
import {PagerStreamsClient} from "../proto/transfers/streams.client.ts";
import {ChatMessage, CreateChatRequest} from "../proto/chat/chat_actions.ts";
import {
    MethodInfo,
    NextUnaryFn,
    RpcOptions,
    UnaryCall
} from "@protobuf-ts/runtime-rpc";

export const host = "http://localhost:4001";

const transport = new GrpcWebFetchTransport({
    baseUrl: host
})

const authOptions: RpcOptions = {
    interceptors: [
        {
            interceptUnary(next: NextUnaryFn, method: MethodInfo, input: object, options: RpcOptions): UnaryCall {
                if (!options.meta) {
                    options.meta = {}
                }
                options.meta['user_id'] = "65a9930fc94f6e3800fa6c29";
                return next(method, input, options)
            }
        }
    ]
}

export class ChatActionsApi {
    private api = new ChatActionsClient(transport)

    public createChat(request: CreateChatRequest) {
        return this.api.createChat(request, authOptions);
    }

    public sendMessage(request: ChatMessage) {
        return this.api.sendMessage(request, authOptions);
    }
}

export const StreamsApi = new PagerStreamsClient(transport)

// export class StreamsApi {
//     private api = new PagerStreamsClient(transport)
//
//     public streamChat(request: ChatStreamRequest) {
//         return this.api.streamChat(request, authOptions);
//     }
// }