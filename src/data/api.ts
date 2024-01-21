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
import {AuthServiceClient} from "../proto/auth/auth.client.ts";
import {LoginRequest, RefreshRequest, RegistrationRequest, SearchUsersRequest} from "../proto/auth/auth.ts";

export const host = "http://localhost:4001";
export const authHost = "http://localhost:5001";
const transport = new GrpcWebFetchTransport({
    baseUrl: host
})
const authTransport = new GrpcWebFetchTransport({
    baseUrl: authHost,
})

const authOptions: RpcOptions = {
    interceptors: [
        {
            interceptUnary(next: NextUnaryFn, method: MethodInfo, input: object, options: RpcOptions): UnaryCall {
                if (!options.meta) {
                    options.meta = {}
                }
                options.meta['jwt'] = `${localStorage.getItem("jwt")}`;
                return next(method, input, options)
            }
        }
    ]
}

export class AuthActionsApi{
    private api = new AuthServiceClient(authTransport)

    public Login(request: LoginRequest){
        return this.api.login(request)
    }
    public Registration(request: RegistrationRequest){
        return this.api.registration(request)
    }
    public searchUsersByIdentifier(request: SearchUsersRequest){
        return this.api.searchUsersByIdentifier(request)
    }
    public Refresh(request: RefreshRequest){
        return this.api.refresh(request)
    }
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