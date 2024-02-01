import {FC, useCallback, useContext, useEffect, useRef} from "react";
import {ChatActionsApi} from "../../../../data/api.ts";
import './chatFooter.scss'
import {useAuth} from "../../../../hooks/useAuth.tsx";
import actions from "../../../../data/mobx/actions.ts";
import {ChatMember, ChatType} from "../../../../testproto/chat/chat_actions.ts";
import {StreamsContext} from "../../../contexts/StreamsContext.tsx";
import CustomInput from "../../../common/customInput/CustomInput.tsx";

type ChatFooterProps = {
    selectedChatId?: string
    profileId: string
    member?: ChatMember
}

const ChatFooter: FC<ChatFooterProps> = ({selectedChatId, profileId, member}) => {
    const {handleSetMembers} = useContext(StreamsContext)
    const {logout} = useAuth()
    const inputRef = useRef<HTMLInputElement>(null)

    const handleSendMessage = useCallback(async (
        chatId: string
    ) => {
        if ((inputRef.current!.value !== "")) {
            await new ChatActionsApi().sendMessage({
                AuthorId: profileId,
                Id: "",
                LinkedChatId: chatId,
                StampMillis: new Date().getTime(),
                Status: 4,
                Text: inputRef.current!.value
            }, logout)
            inputRef.current!.value = ""
        } else {
            console.log(`userid ${profileId} not valid`)
        }
    }, [logout, profileId])

    const handleCreateChat = useCallback(async () => {
        if (!selectedChatId && member) {
            const newChat = await new ChatActionsApi().createChat({
                MembersId: [profileId, member.Id],
                Metadata: undefined,
                Type: ChatType.personal,
            })
            if (newChat) {
                await handleSetMembers([member.Id])
                await handleSendMessage(newChat.Id)
                actions.toggleChatId(newChat.Id)
            }
        }
    }, [handleSendMessage, handleSetMembers, member, profileId, selectedChatId])

    const handleEventListener = useCallback(async (
        e: KeyboardEvent,
    ) => {
        if (e.code === "Enter") {
            if (selectedChatId) {
                await handleSendMessage(selectedChatId)
            } else if (!selectedChatId && member) {
                await handleCreateChat()
            }
        }
    }, [handleCreateChat, handleSendMessage, member, selectedChatId])


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
            <div className={"chatting-input-wrapper"}>
                <CustomInput innerRef={inputRef} placeholder={"Напишите сообщение..."}/>
            </div>
            <button onClick={async () => {
                if (selectedChatId) {
                    await handleSendMessage(selectedChatId)
                } else if (!selectedChatId && member) {
                    await handleCreateChat()
                }
            }} type={"submit"} className={'chatting-button'}> send
            </button>
        </div>
    )
}

export default ChatFooter