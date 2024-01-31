/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";
import { Empty } from "../common/common";

export const protobufPackage = "com.pager.api";

export interface LoginRequest {
  /** Логин или почта для авторизации */
  identity: string;
  /** Пароль пользователя */
  password: string;
}

export interface Token {
  /** JWT-токен из БД для создания access token */
  refreshToken: string;
  /** JWT-токен информация о пользователе */
  accessToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface RegistrationRequest {
  /** Логин пользователя */
  login: string;
  /** Почта пользователя */
  email: string;
  /** Пароль пользователя */
  password: string;
}

function createBaseLoginRequest(): LoginRequest {
  return { identity: "", password: "" };
}

export const LoginRequest = {
  encode(message: LoginRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoginRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoginRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identity = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.password = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LoginRequest {
    return {
      identity: isSet(object.identity) ? globalThis.String(object.identity) : "",
      password: isSet(object.password) ? globalThis.String(object.password) : "",
    };
  },

  toJSON(message: LoginRequest): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    return obj;
  },

  create(base?: DeepPartial<LoginRequest>): LoginRequest {
    return LoginRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<LoginRequest>): LoginRequest {
    const message = createBaseLoginRequest();
    message.identity = object.identity ?? "";
    message.password = object.password ?? "";
    return message;
  },
};

function createBaseToken(): Token {
  return { refreshToken: "", accessToken: "" };
}

export const Token = {
  encode(message: Token, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.refreshToken !== "") {
      writer.uint32(10).string(message.refreshToken);
    }
    if (message.accessToken !== "") {
      writer.uint32(18).string(message.accessToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Token {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseToken();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.refreshToken = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.accessToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Token {
    return {
      refreshToken: isSet(object.refreshToken) ? globalThis.String(object.refreshToken) : "",
      accessToken: isSet(object.accessToken) ? globalThis.String(object.accessToken) : "",
    };
  },

  toJSON(message: Token): unknown {
    const obj: any = {};
    if (message.refreshToken !== "") {
      obj.refreshToken = message.refreshToken;
    }
    if (message.accessToken !== "") {
      obj.accessToken = message.accessToken;
    }
    return obj;
  },

  create(base?: DeepPartial<Token>): Token {
    return Token.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Token>): Token {
    const message = createBaseToken();
    message.refreshToken = object.refreshToken ?? "";
    message.accessToken = object.accessToken ?? "";
    return message;
  },
};

function createBaseRefreshRequest(): RefreshRequest {
  return { refreshToken: "", accessToken: "" };
}

export const RefreshRequest = {
  encode(message: RefreshRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.refreshToken !== "") {
      writer.uint32(10).string(message.refreshToken);
    }
    if (message.accessToken !== "") {
      writer.uint32(18).string(message.accessToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RefreshRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRefreshRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.refreshToken = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.accessToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RefreshRequest {
    return {
      refreshToken: isSet(object.refreshToken) ? globalThis.String(object.refreshToken) : "",
      accessToken: isSet(object.accessToken) ? globalThis.String(object.accessToken) : "",
    };
  },

  toJSON(message: RefreshRequest): unknown {
    const obj: any = {};
    if (message.refreshToken !== "") {
      obj.refreshToken = message.refreshToken;
    }
    if (message.accessToken !== "") {
      obj.accessToken = message.accessToken;
    }
    return obj;
  },

  create(base?: DeepPartial<RefreshRequest>): RefreshRequest {
    return RefreshRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<RefreshRequest>): RefreshRequest {
    const message = createBaseRefreshRequest();
    message.refreshToken = object.refreshToken ?? "";
    message.accessToken = object.accessToken ?? "";
    return message;
  },
};

function createBaseRefreshResponse(): RefreshResponse {
  return { accessToken: "" };
}

export const RefreshResponse = {
  encode(message: RefreshResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accessToken !== "") {
      writer.uint32(10).string(message.accessToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RefreshResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRefreshResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.accessToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RefreshResponse {
    return { accessToken: isSet(object.accessToken) ? globalThis.String(object.accessToken) : "" };
  },

  toJSON(message: RefreshResponse): unknown {
    const obj: any = {};
    if (message.accessToken !== "") {
      obj.accessToken = message.accessToken;
    }
    return obj;
  },

  create(base?: DeepPartial<RefreshResponse>): RefreshResponse {
    return RefreshResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<RefreshResponse>): RefreshResponse {
    const message = createBaseRefreshResponse();
    message.accessToken = object.accessToken ?? "";
    return message;
  },
};

function createBaseRegistrationRequest(): RegistrationRequest {
  return { login: "", email: "", password: "" };
}

export const RegistrationRequest = {
  encode(message: RegistrationRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.login !== "") {
      writer.uint32(10).string(message.login);
    }
    if (message.email !== "") {
      writer.uint32(18).string(message.email);
    }
    if (message.password !== "") {
      writer.uint32(26).string(message.password);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RegistrationRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegistrationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.login = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.email = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.password = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RegistrationRequest {
    return {
      login: isSet(object.login) ? globalThis.String(object.login) : "",
      email: isSet(object.email) ? globalThis.String(object.email) : "",
      password: isSet(object.password) ? globalThis.String(object.password) : "",
    };
  },

  toJSON(message: RegistrationRequest): unknown {
    const obj: any = {};
    if (message.login !== "") {
      obj.login = message.login;
    }
    if (message.email !== "") {
      obj.email = message.email;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    return obj;
  },

  create(base?: DeepPartial<RegistrationRequest>): RegistrationRequest {
    return RegistrationRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<RegistrationRequest>): RegistrationRequest {
    const message = createBaseRegistrationRequest();
    message.login = object.login ?? "";
    message.email = object.email ?? "";
    message.password = object.password ?? "";
    return message;
  },
};

export type AuthServiceDefinition = typeof AuthServiceDefinition;
export const AuthServiceDefinition = {
  name: "AuthService",
  fullName: "com.pager.api.AuthService",
  methods: {
    login: {
      name: "Login",
      requestType: LoginRequest,
      requestStream: false,
      responseType: Token,
      responseStream: false,
      options: {},
    },
    registration: {
      name: "Registration",
      requestType: RegistrationRequest,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
    refresh: {
      name: "Refresh",
      requestType: RefreshRequest,
      requestStream: false,
      responseType: RefreshResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface AuthServiceImplementation<CallContextExt = {}> {
  login(request: LoginRequest, context: CallContext & CallContextExt): Promise<DeepPartial<Token>>;
  registration(request: RegistrationRequest, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
  refresh(request: RefreshRequest, context: CallContext & CallContextExt): Promise<DeepPartial<RefreshResponse>>;
}

export interface AuthServiceClient<CallOptionsExt = {}> {
  login(request: DeepPartial<LoginRequest>, options?: CallOptions & CallOptionsExt): Promise<Token>;
  registration(request: DeepPartial<RegistrationRequest>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
  refresh(request: DeepPartial<RefreshRequest>, options?: CallOptions & CallOptionsExt): Promise<RefreshResponse>;
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
