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
} from "../testproto/auth/auth.ts";
import {CallOptions} from "nice-grpc-common";
import {errorDetailsClientMiddleware} from "nice-grpc-error-details";
import {asyncFuncHandler} from "./utils/error.ts";
import {useAuth} from "../hooks/useAuth.tsx";
import {ClientServiceDefinition, SearchUsersRequest} from "../testproto/client/client.ts";

export const host = "http://localhost:4561";
export const authHost = "http://localhost:5001";

const websocketTransport = createChannel(host, WebsocketTransport())
const authTransport = createChannel(authHost)

const authOptions: CallOptions = {
    metadata: new Metadata({})
}

async function* authMiddleware<Request, Response>(
    call: ClientMiddlewareCall<Request, Response>,
    options: CallOptions,
) {
    const jwt = localStorage.getItem('jwt');
    options.metadata?.set("jwt", jwt ?? "")
    return yield* call.next(call.request, options);
}

const clientFactory = createClientFactory().use(authMiddleware).use(errorDetailsClientMiddleware)
const authFactory = createClientFactory().use(errorDetailsClientMiddleware)

export class AuthActionsApi {
    private api = authFactory.create(
        AuthServiceDefinition,
        authTransport
    )

    public login(request: LoginRequest) {
        return asyncFuncHandler(
            async () => this.api.login(request)
        )
    }

    public registration(request: RegistrationRequest) {
        return asyncFuncHandler(
            async () => this.api.registration(request)
        )
    }

    public refresh(request: RefreshRequest) {
        return this.api.refresh(request)
    }
}

export class ClientApi {
    private api = clientFactory.create(
        ClientServiceDefinition,
        websocketTransport
    )

    public searchUsersByIdentifier(request: SearchUsersRequest) {
        return asyncFuncHandler(
            async () => this.api.searchUsersByIdentifier(request, authOptions),
        )
    }
}

export class ChatActionsApi {
    private api = clientFactory.create(
        ChatActionsDefinition,
        websocketTransport
    )

    public createChat(request: CreateChatRequest) {
        return asyncFuncHandler(
            async () => this.api.createChat(request, authOptions),
            () => useAuth().logout()
        )
    }

    public async sendMessage(request: ChatMessage, onLogout: () => Promise<void>) {
        return asyncFuncHandler(
            async () => await this.api.sendMessage(request, authOptions),
            onLogout
        )
    }
}

export const StreamsApi = createClient(
    PagerStreamsDefinition,
    websocketTransport
)