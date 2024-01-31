import {FC, useCallback, useEffect, useRef} from "react";
import {ChatActionsApi} from "../../../../data/api.ts";
import './chatFooter.scss'

type ChatFooterProps = {
    selectedChatId?: string
    profileId?: string
}

const ChatFooter: FC<ChatFooterProps> = ({selectedChatId,profileId}) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const handleSendMessage = useCallback(async (
        chatId: string
    ) => {
        if ((profileId !== undefined) && (inputRef.current!.value !== "")) {
            await new ChatActionsApi().sendMessage({
                AuthorId: profileId,
                Id: "",
                LinkedChatId: chatId,
                StampMillis: new Date().getTime(),
                Status: 4,
                Text: inputRef.current!.value
            })
            inputRef.current!.value = ""
        } else {
            console.log(`userid ${profileId} not valid`)
        }
    }, [profileId])

    const handleEventListener = useCallback(async (
        e: KeyboardEvent,
    ) => {
        if (e.code === "Enter") {
            if (selectedChatId) await handleSendMessage(selectedChatId)
        }
    }, [handleSendMessage, selectedChatId])


    useEffect(() => {
        const currentRef = inputRef.current;
        if (currentRef !== null && selectedChatId !== null) {
            currentRef.addEventListener("keydown", handleEventListener)
        }
        return () => {
            if (currentRef !== null && selectedChatId !== null) {
                currentRef.removeEventListener("keydown", handleEventListener)
            }
        }
    }, [handleEventListener, handleSendMessage, selectedChatId]);
    return (
        <div className={'middle-footer'}>
            <input ref={inputRef} placeholder={"some text..."} className={"chatting-input"}/>
            <button onClick={() => {
                if (selectedChatId) {
                    handleSendMessage(selectedChatId)
                }
            }} type={"submit"} className={'chatting-button'}> send
            </button>
        </div>
    )
}

export default ChatFooter