//@ts-nocheck
/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";
import { PagerProfile } from "../common/common";
import Long = require("long");

export const protobufPackage = "com.pager.api";

export interface ConnectionRequest {
  LastStampMillis: number;
  Online: boolean;
}

export interface SearchUsersRequest {
  /** Логин для поиска */
  identifier: string;
}

export interface SearchUsersResponse {
  /** Список ID найденных пользователей */
  userIds: string[];
}

function createBaseConnectionRequest(): ConnectionRequest {
  return { LastStampMillis: 0, Online: false };
}

export const ConnectionRequest = {
  encode(message: ConnectionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.LastStampMillis !== 0) {
      writer.uint32(8).int64(message.LastStampMillis);
    }
    if (message.Online === true) {
      writer.uint32(16).bool(message.Online);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConnectionRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConnectionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.LastStampMillis = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.Online = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConnectionRequest {
    return {
      LastStampMillis: isSet(object.LastStampMillis) ? globalThis.Number(object.LastStampMillis) : 0,
      Online: isSet(object.Online) ? globalThis.Boolean(object.Online) : false,
    };
  },

  toJSON(message: ConnectionRequest): unknown {
    const obj: any = {};
    if (message.LastStampMillis !== 0) {
      obj.LastStampMillis = Math.round(message.LastStampMillis);
    }
    if (message.Online === true) {
      obj.Online = message.Online;
    }
    return obj;
  },

  create(base?: DeepPartial<ConnectionRequest>): ConnectionRequest {
    return ConnectionRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ConnectionRequest>): ConnectionRequest {
    const message = createBaseConnectionRequest();
    message.LastStampMillis = object.LastStampMillis ?? 0;
    message.Online = object.Online ?? false;
    return message;
  },
};

function createBaseSearchUsersRequest(): SearchUsersRequest {
  return { identifier: "" };
}

export const SearchUsersRequest = {
  encode(message: SearchUsersRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SearchUsersRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchUsersRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identifier = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SearchUsersRequest {
    return { identifier: isSet(object.identifier) ? globalThis.String(object.identifier) : "" };
  },

  toJSON(message: SearchUsersRequest): unknown {
    const obj: any = {};
    if (message.identifier !== "") {
      obj.identifier = message.identifier;
    }
    return obj;
  },

  create(base?: DeepPartial<SearchUsersRequest>): SearchUsersRequest {
    return SearchUsersRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<SearchUsersRequest>): SearchUsersRequest {
    const message = createBaseSearchUsersRequest();
    message.identifier = object.identifier ?? "";
    return message;
  },
};

function createBaseSearchUsersResponse(): SearchUsersResponse {
  return { userIds: [] };
}

export const SearchUsersResponse = {
  encode(message: SearchUsersResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.userIds) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SearchUsersResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchUsersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userIds.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SearchUsersResponse {
    return {
      userIds: globalThis.Array.isArray(object?.userIds) ? object.userIds.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: SearchUsersResponse): unknown {
    const obj: any = {};
    if (message.userIds?.length) {
      obj.userIds = message.userIds;
    }
    return obj;
  },

  create(base?: DeepPartial<SearchUsersResponse>): SearchUsersResponse {
    return SearchUsersResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<SearchUsersResponse>): SearchUsersResponse {
    const message = createBaseSearchUsersResponse();
    message.userIds = object.userIds?.map((e) => e) || [];
    return message;
  },
};

export type ClientServiceDefinition = typeof ClientServiceDefinition;
export const ClientServiceDefinition = {
  name: "ClientService",
  fullName: "com.pager.api.ClientService",
  methods: {
    searchUsersByIdentifier: {
      name: "SearchUsersByIdentifier",
      requestType: SearchUsersRequest,
      requestStream: false,
      responseType: SearchUsersResponse,
      responseStream: false,
      options: {},
    },
    changeDataProfile: {
      name: "ChangeDataProfile",
      requestType: PagerProfile,
      requestStream: false,
      responseType: PagerProfile,
      responseStream: false,
      options: {},
    },
    changeConnectionState: {
      name: "ChangeConnectionState",
      requestType: ConnectionRequest,
      requestStream: false,
      responseType: ConnectionRequest,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface ClientServiceImplementation<CallContextExt = {}> {
  searchUsersByIdentifier(
    request: SearchUsersRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<SearchUsersResponse>>;
  changeDataProfile(request: PagerProfile, context: CallContext & CallContextExt): Promise<DeepPartial<PagerProfile>>;
  changeConnectionState(
    request: ConnectionRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<ConnectionRequest>>;
}

export interface ClientServiceClient<CallOptionsExt = {}> {
  searchUsersByIdentifier(
    request: DeepPartial<SearchUsersRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<SearchUsersResponse>;
  changeDataProfile(request: DeepPartial<PagerProfile>, options?: CallOptions & CallOptionsExt): Promise<PagerProfile>;
  changeConnectionState(
    request: DeepPartial<ConnectionRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ConnectionRequest>;
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
