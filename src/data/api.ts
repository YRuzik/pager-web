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
import toast from "react-hot-toast";
import {useAuth} from "../hooks/useAuth.tsx";

export const host = "http://localhost:8080";
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
    const {logout} = useAuth()
    let jwt = localStorage.getItem('jwt')
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken || !jwt) {
        await logout()
        return;
    }
    try {
        await new AuthActionsApi().refresh({refreshToken: refreshToken,accessToken:jwt}).then(response => {
            localStorage.setItem("jwt", response.accessToken);
        });
    } catch (error) {
        await logout()
        toast.error("Ошибка при обновлении токена:" + error);
        return;
    }
    jwt = localStorage.getItem('jwt')
    if (jwt) {
        options.metadata?.set("jwt", jwt)
    }
    return yield * call.next(call.request, options);
}

const clientFactory = createClientFactory().use(authMiddleware)


export class AuthActionsApi{
    private api = createClient(
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