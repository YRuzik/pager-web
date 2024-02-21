import {
    ClientMiddlewareCall,
    createChannel,
    createClient,
    createClientFactory,
    Metadata,
    WebsocketTransport,
} from 'nice-grpc-web';
import { PagerStreamsDefinition } from '../testproto/transfers/streams.ts';
import { Chat, ChatActionsDefinition, ChatMessage, ManyMessagesRequest } from '../testproto/chat/chat_actions.ts';
import { AuthServiceDefinition, LoginRequest, RefreshRequest, RegistrationRequest } from '../testproto/auth/auth.ts';
import { CallOptions } from 'nice-grpc-common';
import { errorDetailsClientMiddleware } from 'nice-grpc-error-details';
import { asyncFuncHandler } from './utils/error.ts';
import { ClientServiceDefinition, ConnectionRequest, SearchUsersRequest } from '../testproto/client/client.ts';
import { PagerProfile } from '../testproto/common/common.ts';

export const host = import.meta.env.REACT_APP_WSHOST ?? "";
export const authHost = import.meta.env.REACT_APP_ATHOST ?? "";

const websocketTransport = createChannel(host, WebsocketTransport());
const authTransport = createChannel(authHost);

const authOptions: CallOptions = {
    metadata: new Metadata({}),
};

async function* authMiddleware<Request, Response>(call: ClientMiddlewareCall<Request, Response>, options: CallOptions) {
    const jwt = localStorage.getItem('jwt');
    options.metadata?.set('jwt', jwt ?? '');
    return yield* call.next(call.request, options);
}

const clientFactory = createClientFactory().use(authMiddleware).use(errorDetailsClientMiddleware);
const authFactory = createClientFactory().use(errorDetailsClientMiddleware);

export class AuthActionsApi {
    private api = authFactory.create(AuthServiceDefinition, authTransport);

    public login(request: LoginRequest) {
        return asyncFuncHandler(async () => this.api.login(request));
    }

    public registration(request: RegistrationRequest) {
        return asyncFuncHandler(async () => this.api.registration(request));
    }

    public refresh(request: RefreshRequest) {
        return this.api.refresh(request);
    }
}

export class ChatActionsApi {
    private api = clientFactory.create(ChatActionsDefinition, websocketTransport);

    public updateChat(request: Chat) {
        return asyncFuncHandler(async () => this.api.updateChat(request, authOptions));
    }

    public updateManyMessages(request: ManyMessagesRequest) {
        return asyncFuncHandler(async () => this.api.updateManyMessages(request, authOptions));
    }

    public async sendMessage(request: ChatMessage, onLogout: () => void) {
        return asyncFuncHandler(async () => await this.api.sendMessage(request, authOptions), onLogout);
    }
}

export class ClientActionsApi {
    private api = clientFactory.create(ClientServiceDefinition, websocketTransport);

    public searchUsersByIdentifier(request: SearchUsersRequest) {
        return asyncFuncHandler(async () => await this.api.searchUsersByIdentifier(request, authOptions));
    }

    public UpdateData(request: PagerProfile, onLogout: () => void) {
        return asyncFuncHandler(async () => await this.api.changeDataProfile(request, authOptions), onLogout);
    }

    public UpdateConnectionState(request: ConnectionRequest) {
        return asyncFuncHandler(async () => await this.api.changeConnectionState(request, authOptions));
    }
}

export const StreamsApi = createClient(PagerStreamsDefinition, websocketTransport);
