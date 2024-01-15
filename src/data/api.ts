import {ChatActionsClient} from "../proto/chat/chat_actions.client.ts";
import {GrpcWebFetchTransport} from "@protobuf-ts/grpcweb-transport";

const host = "http://localhost:4001";

const transport = new GrpcWebFetchTransport({
    baseUrl: host
})

export const ChatActionsApi = new ChatActionsClient(transport)
