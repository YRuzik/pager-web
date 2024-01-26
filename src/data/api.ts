import {
    ClientMiddlewareCall,
    createChannel,
    createClient,
    createClientFactory,
    Metadata,
    WebsocketTransport
} from "nice-grpc-web";
import {PagerStreamsDefinition} from "../testproto/transfers/streams.ts";
import {ChatActionsDefinition, ChatMessage, CreateChatRequest} from "../testproto/chat/chat_actions.ts";
import {
    AuthServiceDefinition,
    LoginRequest,
    RefreshRequest,
    RegistrationRequest,
    SearchUsersRequest
} from "../testproto/auth/auth.ts";
import {CallOptions} from "nice-grpc-common";
import {errorDetailsClientMiddleware} from "nice-grpc-error-details";

export const host = "https://localhost:8443";
export const authHost = "http://localhost:5001";

const websocketTransport = createChannel(host, WebsocketTransport())
const authTransport = createChannel(authHost)

const authOptions: CallOptions = {
    metadata: new Metadata({

    })
}

async function* authMiddleware<Request, Response>(
    call: ClientMiddlewareCall<Request, Response>,
    options: CallOptions,
) {
    const jwt = localStorage.getItem('jwt')
    if (jwt) {
        options.metadata?.set("jwt", jwt)
    }
    return yield * call.next(call.request, options);
}

const clientFactory = createClientFactory().use(authMiddleware).use(errorDetailsClientMiddleware)
const authFactory = createClientFactory().use(errorDetailsClientMiddleware)
export class AuthActionsApi{
    private api = authFactory.create(
        AuthServiceDefinition,
        authTransport
    )

    public login(request: LoginRequest){
        return this.api.login(request)
    }
    public registration(request: RegistrationRequest){
        return this.api.registration(request)
    }
    public searchUsersByIdentifier(request: SearchUsersRequest){
        return this.api.searchUsersByIdentifier(request)
    }
    public refresh(request: RefreshRequest){
        return this.api.refresh(request)
    }
}

export class ChatActionsApi {
    private api = clientFactory.create(
        ChatActionsDefinition,
        websocketTransport
    )

    public createChat(request: CreateChatRequest) {
        return this.api.createChat(request, authOptions);
    }

    public sendMessage(request: ChatMessage) {
        return this.api.sendMessage(request, authOptions);
    }
}

export const StreamsApi = createClient(
    PagerStreamsDefinition,
    websocketTransport
)