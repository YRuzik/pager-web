//@ts-nocheck
/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import Long = require("long");

export const protobufPackage = "com.pager.api";

export interface TransferObject {
  /** идентификатор объекта (генерируется в mongodb) */
  Id: string;
  /** идентификатор секции данных */
  SectionId: string;
  /** сериализованные данные */
  Data: Uint8Array;
  /** тип данных */
  Type: string;
  /** номер */
  SeqNumber: number;
}

function createBaseTransferObject(): TransferObject {
  return { Id: "", SectionId: "", Data: new Uint8Array(0), Type: "", SeqNumber: 0 };
}

export const TransferObject = {
  encode(message: TransferObject, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.Id !== "") {
      writer.uint32(10).string(message.Id);
    }
    if (message.SectionId !== "") {
      writer.uint32(18).string(message.SectionId);
    }
    if (message.Data.length !== 0) {
      writer.uint32(26).bytes(message.Data);
    }
    if (message.Type !== "") {
      writer.uint32(34).string(message.Type);
    }
    if (message.SeqNumber !== 0) {
      writer.uint32(40).int64(message.SeqNumber);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransferObject {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransferObject();
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

          message.SectionId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.Data = reader.bytes();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.Type = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.SeqNumber = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransferObject {
    return {
      Id: isSet(object.Id) ? globalThis.String(object.Id) : "",
      SectionId: isSet(object.SectionId) ? globalThis.String(object.SectionId) : "",
      Data: isSet(object.Data) ? bytesFromBase64(object.Data) : new Uint8Array(0),
      Type: isSet(object.Type) ? globalThis.String(object.Type) : "",
      SeqNumber: isSet(object.SeqNumber) ? globalThis.Number(object.SeqNumber) : 0,
    };
  },

  toJSON(message: TransferObject): unknown {
    const obj: any = {};
    if (message.Id !== "") {
      obj.Id = message.Id;
    }
    if (message.SectionId !== "") {
      obj.SectionId = message.SectionId;
    }
    if (message.Data.length !== 0) {
      obj.Data = base64FromBytes(message.Data);
    }
    if (message.Type !== "") {
      obj.Type = message.Type;
    }
    if (message.SeqNumber !== 0) {
      obj.SeqNumber = Math.round(message.SeqNumber);
    }
    return obj;
  },

  create(base?: DeepPartial<TransferObject>): TransferObject {
    return TransferObject.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<TransferObject>): TransferObject {
    const message = createBaseTransferObject();
    message.Id = object.Id ?? "";
    message.SectionId = object.SectionId ?? "";
    message.Data = object.Data ?? new Uint8Array(0);
    message.Type = object.Type ?? "";
    message.SeqNumber = object.SeqNumber ?? 0;
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
