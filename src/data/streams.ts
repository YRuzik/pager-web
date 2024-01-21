import {MethodInfo, NextServerStreamingFn, RpcOptions, ServerStreamingCall} from "@protobuf-ts/runtime-rpc";
import {TransferObject} from "../proto/transfers/item.ts";

// export const initializeStreams = async (init: boolean) => {
//     if (init) {
//         await streamHandler<ProfileStreamRequest>(init, StreamsApi.streamProfile.bind(StreamsApi), {})
//         for (const obj of profile.chatRoles) {
//             await streamHandler<ChatStreamRequest>(init, StreamsApi.streamChat.bind(StreamsApi), {chatId: obj.id})
//         }
//         return true
//     } else {
//         streamHandler<ProfileStreamRequest>(init, StreamsApi.streamProfile.bind(StreamsApi), {})
//         for (const obj of profile.chatRoles) {
//             streamHandler<ChatStreamRequest>(init, StreamsApi.streamChat.bind(StreamsApi), {chatId: obj.id})
//         }
//     }
// }

// export const streamHandler = async <T extends object>(
//     init: boolean,
//     stream: (input: T, options?: RpcOptions) => ServerStreamingCall<T, TransferObject>,
//     toObjectFunc: (type: string, jsonString: string) => void,
//     requestBody: T,
// ) => {
//     const watchHeaderOps: RpcOptions = {
//         interceptors: [
//             {
//                 interceptServerStreaming(next: NextServerStreamingFn, method: MethodInfo, input: object, options: RpcOptions): ServerStreamingCall {
//                     if (!options.meta) {
//                         options.meta = {}
//                     }
//                     if (!init) {
//                         options.meta['watch'] = 'watch';
//                     }
//                     options.meta['user_id'] = "65a9930fc94f6e3800fa6c29";
//                     return next(method, input, options)
//                 }
//             }
//         ]
//     }
//
//     init ? console.log("init") : console.log("watching")
//
//     const call = stream(requestBody, watchHeaderOps)
//
//     for await (const response of call.responses) {
//         try {
//             const decodedJsonString = new TextDecoder().decode(response.data);
//             console.log(response.type)
//             toObjectFunc(response.type, decodedJsonString)
//         } catch (e) {
//             console.log(e)
//         }
//     }
// }

// const actionViaType = (type: string, jsonString: string) => {
//     switch (type) {
//         case ProfileStreamRequest_Type[1]:
//             profile.setProfile(PagerProfile.fromJsonString(jsonString))
//             break;
//         case ProfileStreamRequest_Type[2]:
//             profile.setChatRoles(ChatRole.fromJsonString(jsonString))
//             break;
//         case ChatStreamRequest_Type[1]:
//             chat.setChats(Chat.fromJsonString(jsonString))
//             break;
//         case ChatStreamRequest_Type[2]:
//             chat.changeState(ChatMessage.fromJsonString(jsonString))
//             break;
//     }
// }

