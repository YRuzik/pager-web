/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";
import { TransferObject } from "./item";

export const protobufPackage = "com.pager.api";

export interface ProfileStreamRequest {
}

export enum ProfileStreamRequest_Type {
  none = 0,
  /** profile_info - информация о профиле */
  profile_info = 1,
  /** chats_role - информация о роли в чатах */
  chats_role = 2,
  UNRECOGNIZED = -1,
}

export function profileStreamRequest_TypeFromJSON(object: any): ProfileStreamRequest_Type {
  switch (object) {
    case 0:
    case "none":
      return ProfileStreamRequest_Type.none;
    case 1:
    case "profile_info":
      return ProfileStreamRequest_Type.profile_info;
    case 2:
    case "chats_role":
      return ProfileStreamRequest_Type.chats_role;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ProfileStreamRequest_Type.UNRECOGNIZED;
  }
}

export function profileStreamRequest_TypeToJSON(object: ProfileStreamRequest_Type): string {
  switch (object) {
    case ProfileStreamRequest_Type.none:
      return "none";
    case ProfileStreamRequest_Type.profile_info:
      return "profile_info";
    case ProfileStreamRequest_Type.chats_role:
      return "chats_role";
    case ProfileStreamRequest_Type.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ChatStreamRequest {
  /** идентификатор чата */
  ChatId: string;
}

export enum ChatStreamRequest_Type {
  none = 0,
  /** chat_info - информация о чате */
  chat_info = 1,
  /** messages - сообщения в чате */
  messages = 2,
  UNRECOGNIZED = -1,
}

export function chatStreamRequest_TypeFromJSON(object: any): ChatStreamRequest_Type {
  switch (object) {
    case 0:
    case "none":
      return ChatStreamRequest_Type.none;
    case 1:
    case "chat_info":
      return ChatStreamRequest_Type.chat_info;
    case 2:
    case "messages":
      return ChatStreamRequest_Type.messages;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ChatStreamRequest_Type.UNRECOGNIZED;
  }
}

export function chatStreamRequest_TypeToJSON(object: ChatStreamRequest_Type): string {
  switch (object) {
    case ChatStreamRequest_Type.none:
      return "none";
    case ChatStreamRequest_Type.chat_info:
      return "chat_info";
    case ChatStreamRequest_Type.messages:
      return "messages";
    case ChatStreamRequest_Type.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBaseProfileStreamRequest(): ProfileStreamRequest {
  return {};
}

export const ProfileStreamRequest = {
  encode(_: ProfileStreamRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProfileStreamRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProfileStreamRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): ProfileStreamRequest {
    return {};
  },

  toJSON(_: ProfileStreamRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<ProfileStreamRequest>): ProfileStreamRequest {
    return ProfileStreamRequest.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<ProfileStreamRequest>): ProfileStreamRequest {
    const message = createBaseProfileStreamRequest();
    return message;
  },
};

function createBaseChatStreamRequest(): ChatStreamRequest {
  return { ChatId: "" };
}

export const ChatStreamRequest = {
  encode(message: ChatStreamRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ChatId !== "") {
      writer.uint32(10).string(message.ChatId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChatStreamRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChatStreamRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.ChatId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChatStreamRequest {
    return { ChatId: isSet(object.ChatId) ? globalThis.String(object.ChatId) : "" };
  },

  toJSON(message: ChatStreamRequest): unknown {
    const obj: any = {};
    if (message.ChatId !== "") {
      obj.ChatId = message.ChatId;
    }
    return obj;
  },

  create(base?: DeepPartial<ChatStreamRequest>): ChatStreamRequest {
    return ChatStreamRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ChatStreamRequest>): ChatStreamRequest {
    const message = createBaseChatStreamRequest();
    message.ChatId = object.ChatId ?? "";
    return message;
  },
};

export type PagerStreamsDefinition = typeof PagerStreamsDefinition;
export const PagerStreamsDefinition = {
  name: "PagerStreams",
  fullName: "com.pager.api.PagerStreams",
  methods: {
    streamProfile: {
      name: "StreamProfile",
      requestType: ProfileStreamRequest,
      requestStream: false,
      responseType: TransferObject,
      responseStream: true,
      options: {},
    },
    streamChat: {
      name: "StreamChat",
      requestType: ChatStreamRequest,
      requestStream: false,
      responseType: TransferObject,
      responseStream: true,
      options: {},
    },
  },
} as const;

export interface PagerStreamsServiceImplementation<CallContextExt = {}> {
  streamProfile(
    request: ProfileStreamRequest,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<TransferObject>>;
  streamChat(
    request: ChatStreamRequest,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<TransferObject>>;
}

export interface PagerStreamsClient<CallOptionsExt = {}> {
  streamProfile(
    request: DeepPartial<ProfileStreamRequest>,
    options?: CallOptions & CallOptionsExt,
  ): AsyncIterable<TransferObject>;
  streamChat(
    request: DeepPartial<ChatStreamRequest>,
    options?: CallOptions & CallOptionsExt,
  ): AsyncIterable<TransferObject>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export type ServerStreamingMethodResult<Response> = { [Symbol.asyncIterator](): AsyncIterator<Response, void> };
