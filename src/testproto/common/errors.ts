/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "com.pager.api";

export interface PagerError {
  code: PagerError_ErrorCode;
  details: string;
}

export enum PagerError_ErrorCode {
  OK = 0,
  CANCELLED = 1,
  UNKNOWN = 2,
  INVALID_ARGUMENT = 3,
  DEADLINE_EXCEEDED = 4,
  NOT_FOUND = 5,
  ALREADY_EXISTS = 6,
  PERMISSION_DENIED = 7,
  RESOURCE_EXHAUSTED = 8,
  FAILED_PRECONDITION = 9,
  ABORTED = 10,
  OUT_OF_RANGE = 11,
  UNIMPLEMENTED = 12,
  INTERNAL = 13,
  UNAVAILABLE = 14,
  DATA_LOSS = 15,
  UNAUTHENTICATED = 16,
  UNRECOGNIZED = -1,
}

export function pagerError_ErrorCodeFromJSON(object: any): PagerError_ErrorCode {
  switch (object) {
    case 0:
    case "OK":
      return PagerError_ErrorCode.OK;
    case 1:
    case "CANCELLED":
      return PagerError_ErrorCode.CANCELLED;
    case 2:
    case "UNKNOWN":
      return PagerError_ErrorCode.UNKNOWN;
    case 3:
    case "INVALID_ARGUMENT":
      return PagerError_ErrorCode.INVALID_ARGUMENT;
    case 4:
    case "DEADLINE_EXCEEDED":
      return PagerError_ErrorCode.DEADLINE_EXCEEDED;
    case 5:
    case "NOT_FOUND":
      return PagerError_ErrorCode.NOT_FOUND;
    case 6:
    case "ALREADY_EXISTS":
      return PagerError_ErrorCode.ALREADY_EXISTS;
    case 7:
    case "PERMISSION_DENIED":
      return PagerError_ErrorCode.PERMISSION_DENIED;
    case 8:
    case "RESOURCE_EXHAUSTED":
      return PagerError_ErrorCode.RESOURCE_EXHAUSTED;
    case 9:
    case "FAILED_PRECONDITION":
      return PagerError_ErrorCode.FAILED_PRECONDITION;
    case 10:
    case "ABORTED":
      return PagerError_ErrorCode.ABORTED;
    case 11:
    case "OUT_OF_RANGE":
      return PagerError_ErrorCode.OUT_OF_RANGE;
    case 12:
    case "UNIMPLEMENTED":
      return PagerError_ErrorCode.UNIMPLEMENTED;
    case 13:
    case "INTERNAL":
      return PagerError_ErrorCode.INTERNAL;
    case 14:
    case "UNAVAILABLE":
      return PagerError_ErrorCode.UNAVAILABLE;
    case 15:
    case "DATA_LOSS":
      return PagerError_ErrorCode.DATA_LOSS;
    case 16:
    case "UNAUTHENTICATED":
      return PagerError_ErrorCode.UNAUTHENTICATED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PagerError_ErrorCode.UNRECOGNIZED;
  }
}

export function pagerError_ErrorCodeToJSON(object: PagerError_ErrorCode): string {
  switch (object) {
    case PagerError_ErrorCode.OK:
      return "OK";
    case PagerError_ErrorCode.CANCELLED:
      return "CANCELLED";
    case PagerError_ErrorCode.UNKNOWN:
      return "UNKNOWN";
    case PagerError_ErrorCode.INVALID_ARGUMENT:
      return "INVALID_ARGUMENT";
    case PagerError_ErrorCode.DEADLINE_EXCEEDED:
      return "DEADLINE_EXCEEDED";
    case PagerError_ErrorCode.NOT_FOUND:
      return "NOT_FOUND";
    case PagerError_ErrorCode.ALREADY_EXISTS:
      return "ALREADY_EXISTS";
    case PagerError_ErrorCode.PERMISSION_DENIED:
      return "PERMISSION_DENIED";
    case PagerError_ErrorCode.RESOURCE_EXHAUSTED:
      return "RESOURCE_EXHAUSTED";
    case PagerError_ErrorCode.FAILED_PRECONDITION:
      return "FAILED_PRECONDITION";
    case PagerError_ErrorCode.ABORTED:
      return "ABORTED";
    case PagerError_ErrorCode.OUT_OF_RANGE:
      return "OUT_OF_RANGE";
    case PagerError_ErrorCode.UNIMPLEMENTED:
      return "UNIMPLEMENTED";
    case PagerError_ErrorCode.INTERNAL:
      return "INTERNAL";
    case PagerError_ErrorCode.UNAVAILABLE:
      return "UNAVAILABLE";
    case PagerError_ErrorCode.DATA_LOSS:
      return "DATA_LOSS";
    case PagerError_ErrorCode.UNAUTHENTICATED:
      return "UNAUTHENTICATED";
    case PagerError_ErrorCode.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBasePagerError(): PagerError {
  return { code: 0, details: "" };
}

export const PagerError = {
  encode(message: PagerError, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.details !== "") {
      writer.uint32(18).string(message.details);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PagerError {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePagerError();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.details = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PagerError {
    return {
      code: isSet(object.code) ? pagerError_ErrorCodeFromJSON(object.code) : 0,
      details: isSet(object.details) ? globalThis.String(object.details) : "",
    };
  },

  toJSON(message: PagerError): unknown {
    const obj: any = {};
    if (message.code !== 0) {
      obj.code = pagerError_ErrorCodeToJSON(message.code);
    }
    if (message.details !== "") {
      obj.details = message.details;
    }
    return obj;
  },

  create(base?: DeepPartial<PagerError>): PagerError {
    return PagerError.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<PagerError>): PagerError {
    const message = createBasePagerError();
    message.code = object.code ?? 0;
    message.details = object.details ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
