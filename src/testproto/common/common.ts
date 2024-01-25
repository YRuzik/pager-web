/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "com.pager.api";

export interface Empty {
}

export interface PagerProfile {
  /** Индетификатор пользователя */
  UserId: string;
  /** Почта пользователя */
  Email: string;
  /** Картинка профиля пользователя */
  Avatar: Uint8Array;
  /** Логин пользователя */
  Login: string;
  /** Пользователь в сети или нет */
  Online: boolean;
}

function createBaseEmpty(): Empty {
  return {};
}

export const Empty = {
  encode(_: Empty, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Empty {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmpty();
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

  fromJSON(_: any): Empty {
    return {};
  },

  toJSON(_: Empty): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<Empty>): Empty {
    return Empty.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<Empty>): Empty {
    const message = createBaseEmpty();
    return message;
  },
};

function createBasePagerProfile(): PagerProfile {
  return { UserId: "", Email: "", Avatar: new Uint8Array(0), Login: "", Online: false };
}

export const PagerProfile = {
  encode(message: PagerProfile, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.UserId !== "") {
      writer.uint32(10).string(message.UserId);
    }
    if (message.Email !== "") {
      writer.uint32(18).string(message.Email);
    }
    if (message.Avatar.length !== 0) {
      writer.uint32(26).bytes(message.Avatar);
    }
    if (message.Login !== "") {
      writer.uint32(34).string(message.Login);
    }
    if (message.Online === true) {
      writer.uint32(40).bool(message.Online);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PagerProfile {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePagerProfile();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.UserId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.Email = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.Avatar = reader.bytes();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.Login = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
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

  fromJSON(object: any): PagerProfile {
    return {
      UserId: isSet(object.UserId) ? globalThis.String(object.UserId) : "",
      Email: isSet(object.Email) ? globalThis.String(object.Email) : "",
      Avatar: isSet(object.Avatar) ? bytesFromBase64(object.Avatar) : new Uint8Array(0),
      Login: isSet(object.Login) ? globalThis.String(object.Login) : "",
      Online: isSet(object.Online) ? globalThis.Boolean(object.Online) : false,
    };
  },

  toJSON(message: PagerProfile): unknown {
    const obj: any = {};
    if (message.UserId !== "") {
      obj.UserId = message.UserId;
    }
    if (message.Email !== "") {
      obj.Email = message.Email;
    }
    if (message.Avatar.length !== 0) {
      obj.Avatar = base64FromBytes(message.Avatar);
    }
    if (message.Login !== "") {
      obj.Login = message.Login;
    }
    if (message.Online === true) {
      obj.Online = message.Online;
    }
    return obj;
  },

  create(base?: DeepPartial<PagerProfile>): PagerProfile {
    return PagerProfile.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<PagerProfile>): PagerProfile {
    const message = createBasePagerProfile();
    message.UserId = object.UserId ?? "";
    message.Email = object.Email ?? "";
    message.Avatar = object.Avatar ?? new Uint8Array(0);
    message.Login = object.Login ?? "";
    message.Online = object.Online ?? false;
    return message;
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
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
