//@ts-nocheck
import {RichClientError} from "nice-grpc-error-details";
import {PagerError, PagerError_ErrorCode} from "../../testproto/common/errors.ts";
import {refreshAccessToken} from "./refresh.ts";
import toast from "react-hot-toast";

export const asyncFuncHandler = async <T>(
    func: () => Promise<T>,
    onError?: () => void
) => {
    try {
        return await func();
    } catch (e: unknown) {
        if (e instanceof RichClientError) {
            const error = PagerError.decode(e.extra[0].value);
            switch (error.code) {
                case PagerError_ErrorCode.UNAUTHENTICATED:
                    try {
                        await refreshAccessToken();
                        return await func();
                    } catch (e: unknown) {
                        if (e instanceof RichClientError) {
                            await handleSpecificError(e, onError);
                            throw error;
                        }
                    }
                    break;
                case PagerError_ErrorCode.OK:
                    throw error;
                default:
                    await handleSpecificError(e, onError);
                    throw error;
            }
        }
    }
};

const handleSpecificError = async (
    error: RichClientError,
    onError?: () => void
) => {
    if (onError) {
        onError();
    }
    toast.error(error.details);
};
