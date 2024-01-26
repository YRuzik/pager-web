import {RichClientError} from "nice-grpc-error-details";
import {PagerError, PagerError_ErrorCode} from "../../testproto/common/errors.ts";
import {refreshAccessToken} from "./refresh.ts";
import toast from "react-hot-toast";

export const asyncFuncHandler = async (
    func: () =>Promise<void>,
    onError?: () =>Promise<void>
)=>{
    try {
        await func()
    }catch (e:unknown){
        if(e instanceof RichClientError){
            const error =  PagerError.decode(e.extra[0].value)
            if(error.code === PagerError_ErrorCode.UNAUTHENTICATED){
                try {
                    await refreshAccessToken()
                    await func()
                } catch (e:unknown){
                    const error = e as Error
                    if (onError) {
                        await onError()
                    }
                    toast.error(error.message)
                }
            }

        }
    }
}