/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";
import { Empty } from "../common/common";
import Long = require("long");

export const protobufPackage = "com.pager.api";

export enum ChatType {
  group = 0,
  personal = 1,
  UNRECOGNIZED = -1,
}

export function chatTypeFromJSON(object: any): ChatType {
  switch (object) {
    case 0:
    case "group":
      return ChatType.group;
    case 1:
    case "personal":
      return ChatType.personal;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ChatType.UNRECOGNIZED;
  }
}

export function chatTypeToJSON(object: ChatType): string {
  switch (object) {
    case ChatType.group:
      return "group";
    case ChatType.personal:
      return "personal";
    case ChatType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Chat {
  /** идентификатор чата */
  Id: string;
  /** тип чата */
  Type: ChatType;
  /** дополнительная информация */
  Metadata?:
    | ChatMetadata
    | undefined;
  /** идентификаторы участников */
  MembersId: string[];
}

export interface ChatMetadata {
  /** название группового чата */
  Title: string;
  /** обложка для группового чата */
  AvatarUrl?: string | undefined;
}

export interface ChatRole {
  /** идентификатор чата */
  Id: string;
  /** роль в чате */
  Role: ChatRole_Roles;
}

export enum ChatRole_Roles {
  none = 0,
  member = 1,
  viewer = 2,
  UNRECOGNIZED = -1,
}

export function chatRole_RolesFromJSON(object: any): ChatRole_Roles {
  switch (object) {
    case 0:
    case "none":
      return ChatRole_Roles.none;
    case 1:
    case "member":
      return ChatRole_Roles.member;
    case 2:
    case "viewer":
      return ChatRole_Roles.viewer;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ChatRole_Roles.UNRECOGNIZED;
  }
}

export function chatRole_RolesToJSON(object: ChatRole_Roles): string {
  switch (object) {
    case ChatRole_Roles.none:
      return "none";
    case ChatRole_Roles.member:
      return "member";
    case ChatRole_Roles.viewer:
      return "viewer";
    case ChatRole_Roles.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ChatMessage {
  /** идентификатор сообщения */
  Id: string;
  /** текст сообщения */
  Text?:
    | string
    | undefined;
  /** время отправки сообщения */
  StampMillis: number;
  /** статус сообщения */
  Status: ChatMessage_MessageStatus;
  /** автор сообщения */
  AuthorId: string;
  /** связанный чат */
  LinkedChatId: string;
}

/** статус сообщения */
export enum ChatMessage_MessageStatus {
  uploading = 0,
  sent = 1,
  seen = 2,
  error = 3,
  deleted = 4,
  UNRECOGNIZED = -1,
}

export function chatMessage_MessageStatusFromJSON(object: any): ChatMessage_MessageStatus {
  switch (object) {
    case 0:
    case "uploading":
      return ChatMessage_MessageStatus.uploading;
    case 1:
    case "sent":
      return ChatMessage_MessageStatus.sent;
    case 2:
    case "seen":
      return ChatMessage_MessageStatus.seen;
    case 3:
    case "error":
      return ChatMessage_MessageStatus.error;
    case 4:
    case "deleted":
      return ChatMessage_MessageStatus.deleted;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ChatMessage_MessageStatus.UNRECOGNIZED;
  }
}

export function chatMessage_MessageStatusToJSON(object: ChatMessage_MessageStatus): string {
  switch (object) {
    case ChatMessage_MessageStatus.uploading:
      return "uploading";
    case ChatMessage_MessageStatus.sent:
      return "sent";
    case ChatMessage_MessageStatus.seen:
      return "seen";
    case ChatMessage_MessageStatus.error:
      return "error";
    case ChatMessage_MessageStatus.deleted:
      return "deleted";
    case ChatMessage_MessageStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface CreateChatRequest {
  /** тип чата */
  Type: ChatType;
  /** дополнительная информация */
  Metadata?:
    | ChatMetadata
    | undefined;
  /** идентификаторы участников */
  MembersId: string[];
}

function createBaseChat(): Chat {
  return { Id: "", Type: 0, Metadata: undefined, MembersId: [] };
}

export const Chat = {
  encode(message: Chat, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.Id !== "") {
      writer.uint32(10).string(message.Id);
    }
    if (message.Type !== 0) {
      writer.uint32(16).int32(message.Type);
    }
    if (message.Metadata !== undefined) {
      ChatMetadata.encode(message.Metadata, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.MembersId) {
      writer.uint32(34).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Chat {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChat();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.Id = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.Type = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.Metadata = ChatMetadata.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.MembersId.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Chat {
    return {
      Id: isSet(object.Id) ? globalThis.String(object.Id) : "",
      Type: isSet(object.Type) ? chatTypeFromJSON(object.Type) : 0,
      Metadata: isSet(object.Metadata) ? ChatMetadata.fromJSON(object.Metadata) : undefined,
      MembersId: globalThis.Array.isArray(object?.MembersId)
        ? object.MembersId.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: Chat): unknown {
    const obj: any = {};
    if (message.Id !== "") {
      obj.Id = message.Id;
    }
    if (message.Type !== 0) {
      obj.Type = chatTypeToJSON(message.Type);
    }
    if (message.Metadata !== undefined) {
      obj.Metadata = ChatMetadata.toJSON(message.Metadata);
    }
    if (message.MembersId?.length) {
      obj.MembersId = message.MembersId;
    }
    return obj;
  },

  create(base?: DeepPartial<Chat>): Chat {
    return Chat.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Chat>): Chat {
    const message = createBaseChat();
    message.Id = object.Id ?? "";
    message.Type = object.Type ?? 0;
    message.Metadata = (object.Metadata !== undefined && object.Metadata !== null)
      ? ChatMetadata.fromPartial(object.Metadata)
      : undefined;
    message.MembersId = object.MembersId?.map((e) => e) || [];
    return message;
  },
};

function createBaseChatMetadata(): ChatMetadata {
  return { Title: "", AvatarUrl: undefined };
}

export const ChatMetadata = {
  encode(message: ChatMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.Title !== "") {
      writer.uint32(10).string(message.Title);
    }
    if (message.AvatarUrl !== undefined) {
      writer.uint32(18).string(message.AvatarUrl);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChatMetadata {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChatMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.Title = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.AvatarUrl = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChatMetadata {
    return {
      Title: isSet(object.Title) ? globalThis.String(object.Title) : "",
      AvatarUrl: isSet(object.AvatarUrl) ? globalThis.String(object.AvatarUrl) : undefined,
    };
  },

  toJSON(message: ChatMetadata): unknown {
    const obj: any = {};
    if (message.Title !== "") {
      obj.Title = message.Title;
    }
    if (message.AvatarUrl !== undefined) {
      obj.AvatarUrl = message.AvatarUrl;
    }
    return obj;
  },

  create(base?: DeepPartial<ChatMetadata>): ChatMetadata {
    return ChatMetadata.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ChatMetadata>): ChatMetadata {
    const message = createBaseChatMetadata();
    message.Title = object.Title ?? "";
    message.AvatarUrl = object.AvatarUrl ?? undefined;
    return message;
  },
};

function createBaseChatRole(): ChatRole {
  return { Id: "", Role: 0 };
}

export const ChatRole = {
  encode(message: ChatRole, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.Id !== "") {
      writer.uint32(10).string(message.Id);
    }
    if (message.Role !== 0) {
      writer.uint32(16).int32(message.Role);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChatRole {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChatRole();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.Id = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.Role = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChatRole {
    return {
      Id: isSet(object.Id) ? globalThis.String(object.Id) : "",
      Role: isSet(object.Role) ? chatRole_RolesFromJSON(object.Role) : 0,
    };
  },

  toJSON(message: ChatRole): unknown {
    const obj: any = {};
    if (message.Id !== "") {
      obj.Id = message.Id;
    }
    if (message.Role !== 0) {
      obj.Role = chatRole_RolesToJSON(message.Role);
    }
    return obj;
  },

  create(base?: DeepPartial<ChatRole>): ChatRole {
    return ChatRole.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ChatRole>): ChatRole {
    const message = createBaseChatRole();
    message.Id = object.Id ?? "";
    message.Role = object.Role ?? 0;
    return message;
  },
};

function createBaseChatMessage(): ChatMessage {
  return { Id: "", Text: undefined, StampMillis: 0, Status: 0, AuthorId: "", LinkedChatId: "" };
}

export const ChatMessage = {
  encode(message: ChatMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.Id !== "") {
      writer.uint32(10).string(message.Id);
    }
    if (message.Text !== undefined) {
      writer.uint32(18).string(message.Text);
    }
    if (message.StampMillis !== 0) {
      writer.uint32(24).int64(message.StampMillis);
    }
    if (message.Status !== 0) {
      writer.uint32(32).int32(message.Status);
    }
    if (message.AuthorId !== "") {
      writer.uint32(42).string(message.AuthorId);
    }
    if (message.LinkedChatId !== "") {
      writer.uint32(50).string(message.LinkedChatId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChatMessage {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChatMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.Id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.Text = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.StampMillis = longToNumber(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.Status = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.AuthorId = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.LinkedChatId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChatMessage {
    return {
      Id: isSet(object.Id) ? globalThis.String(object.Id) : "",
      Text: isSet(object.Text) ? globalThis.String(object.Text) : undefined,
      StampMillis: isSet(object.StampMillis) ? globalThis.Number(object.StampMillis) : 0,
      Status: isSet(object.Status) ? chatMessage_MessageStatusFromJSON(object.Status) : 0,
      AuthorId: isSet(object.AuthorId) ? globalThis.String(object.AuthorId) : "",
      LinkedChatId: isSet(object.LinkedChatId) ? globalThis.String(object.LinkedChatId) : "",
    };
  },

  toJSON(message: ChatMessage): unknown {
    const obj: any = {};
    if (message.Id !== "") {
      obj.Id = message.Id;
    }
    if (message.Text !== undefined) {
      obj.Text = message.Text;
    }
    if (message.StampMillis !== 0) {
      obj.StampMillis = Math.round(message.StampMillis);
    }
    if (message.Status !== 0) {
      obj.Status = chatMessage_MessageStatusToJSON(message.Status);
    }
    if (message.AuthorId !== "") {
      obj.AuthorId = message.AuthorId;
    }
    if (message.LinkedChatId !== "") {
      obj.LinkedChatId = message.LinkedChatId;
    }
    return obj;
  },

  create(base?: DeepPartial<ChatMessage>): ChatMessage {
    return ChatMessage.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ChatMessage>): ChatMessage {
    const message = createBaseChatMessage();
    message.Id = object.Id ?? "";
    message.Text = object.Text ?? undefined;
    message.StampMillis = object.StampMillis ?? 0;
    message.Status = object.Status ?? 0;
    message.AuthorId = object.AuthorId ?? "";
    message.LinkedChatId = object.LinkedChatId ?? "";
    return message;
  },
};

function createBaseCreateChatRequest(): CreateChatRequest {
  return { Type: 0, Metadata: undefined, MembersId: [] };
}

export const CreateChatRequest = {
  encode(message: CreateChatRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.Type !== 0) {
      writer.uint32(8).int32(message.Type);
    }
    if (message.Metadata !== undefined) {
      ChatMetadata.encode(message.Metadata, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.MembersId) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateChatRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateChatRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.Type = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.Metadata = ChatMetadata.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.MembersId.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateChatRequest {
    return {
      Type: isSet(object.Type) ? chatTypeFromJSON(object.Type) : 0,
      Metadata: isSet(object.Metadata) ? ChatMetadata.fromJSON(object.Metadata) : undefined,
      MembersId: globalThis.Array.isArray(object?.MembersId)
        ? object.MembersId.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: CreateChatRequest): unknown {
    const obj: any = {};
    if (message.Type !== 0) {
      obj.Type = chatTypeToJSON(message.Type);
    }
    if (message.Metadata !== undefined) {
      obj.Metadata = ChatMetadata.toJSON(message.Metadata);
    }
    if (message.MembersId?.length) {
      obj.MembersId = message.MembersId;
    }
    return obj;
  },

  create(base?: DeepPartial<CreateChatRequest>): CreateChatRequest {
    return CreateChatRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreateChatRequest>): CreateChatRequest {
    const message = createBaseCreateChatRequest();
    message.Type = object.Type ?? 0;
    message.Metadata = (object.Metadata !== undefined && object.Metadata !== null)
      ? ChatMetadata.fromPartial(object.Metadata)
      : undefined;
    message.MembersId = object.MembersId?.map((e) => e) || [];
    return message;
  },
};

export type ChatActionsDefinition = typeof ChatActionsDefinition;
export const ChatActionsDefinition = {
  name: "ChatActions",
  fullName: "com.pager.api.ChatActions",
  methods: {
    createChat: {
      name: "CreateChat",
      requestType: CreateChatRequest,
      requestStream: false,
      responseType: Chat,
      responseStream: false,
      options: {},
    },
    sendMessage: {
      name: "SendMessage",
      requestType: ChatMessage,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface ChatActionsServiceImplementation<CallContextExt = {}> {
  createChat(request: CreateChatRequest, context: CallContext & CallContextExt): Promise<DeepPartial<Chat>>;
  sendMessage(request: ChatMessage, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
}

export interface ChatActionsClient<CallOptionsExt = {}> {
  createChat(request: DeepPartial<CreateChatRequest>, options?: CallOptions & CallOptionsExt): Promise<Chat>;
  sendMessage(request: DeepPartial<ChatMessage>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
