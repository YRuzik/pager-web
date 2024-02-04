import {FC, useCallback, useContext, useEffect, useRef} from "react";
import {ChatActionsApi} from "../../../../data/api.ts";
import './chatFooter.scss'
import {useAuth} from "../../../../hooks/useAuth.tsx";
import actions from "../../../../data/mobx/actions.ts";
import {ChatMember, ChatMessage, ChatMessage_MessageStatus, ChatType} from "../../../../testproto/chat/chat_actions.ts";
import {StreamsContext} from "../../../contexts/StreamsContext.tsx";
import CustomInput from "../../../common/customInput/CustomInput.tsx";
import Icon, {AppIcons} from "../../../common/icon/Icon.tsx";

type ChatFooterProps = {
    selectedChatId?: string
    profileId: string
    member?: ChatMember
    selectedMessage?: ChatMessage
    cancelSelectedMessage: () => void
    editMessage?: ChatMessage
    cancelEdit: () => void
}

const ChatFooter: FC<ChatFooterProps> = (
    {
        selectedChatId,
        profileId,
        member,
        selectedMessage,
        cancelSelectedMessage,
        editMessage,
        cancelEdit
    }
) => {
    const {handleSetMembers, members} = useContext(StreamsContext)
    const inputRef = useRef<HTMLInputElement>(null)
    const {logout} = useAuth();

    const handleSendMessage = useCallback(async (
        chatId: string
    ) => {
        if ((inputRef.current!.value !== "")) {
            if (editMessage && inputRef.current!.value !== editMessage.Text) {
                await new ChatActionsApi().sendMessage({
                    AuthorId: editMessage.AuthorId,
                    Id: editMessage.Id,
                    LinkedChatId: editMessage.LinkedChatId,
                    StampMillis: editMessage.StampMillis,
                    Status: editMessage.Status,
                    Text: inputRef.current!.value,
                    LinkedMessage: editMessage.LinkedMessage,
                    Updated: true
                }, logout)
            } else {
                await new ChatActionsApi().sendMessage({
                    AuthorId: profileId,
                    Id: "",
                    LinkedChatId: chatId,
                    StampMillis: new Date().getTime(),
                    Status: ChatMessage_MessageStatus.unread,
                    Text: inputRef.current!.value,
                    LinkedMessage: selectedMessage,
                    Updated: false
                }, logout)
            }
            if (selectedMessage) {
                cancelSelectedMessage()
            }
            if (editMessage) {
                cancelEdit()
            }
            inputRef.current!.value = ""
        } else {
            console.log(`userid ${profileId} not valid`)
        }
    }, [cancelEdit, cancelSelectedMessage, editMessage, logout, profileId, selectedMessage])

    useEffect(() => {
        if (editMessage) {
            inputRef.current!.value = editMessage.Text!
        } else {
            inputRef.current!.value = ""
        }
    }, [editMessage]);

    const handleCreateChat = useCallback(async () => {
        if (!selectedChatId && member) {
            const newChat = await new ChatActionsApi().updateChat({
                Id: "",
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
            {editMessage && <div className={'edit-message-wrapper'}>
                <div>
                    <div>
                        Редактирование
                    </div>
                    <Icon icon={AppIcons.xSymbol} size={10} className={'gray-filter'} onClick={() => {
                        cancelEdit()
                    }}/>
                </div>

                {editMessage.Text}
            </div>}
            {selectedMessage && <div className={'selected-message-wrapper'}>
                <div>
                    <div>
                        В ответ {members[selectedMessage.AuthorId].Login}
                    </div>
                    <Icon icon={AppIcons.xSymbol} size={10} className={'gray-filter'} onClick={() => {
                        cancelSelectedMessage()
                    }}/>
                </div>

                {selectedMessage.Text}
            </div>}
            <div className={"chatting-input-wrapper"}>
                <CustomInput innerRef={inputRef} placeholder={"Напишите сообщение..."}/>
            </div>
            <button onClick={async () => {
                if (selectedChatId) {
                    await handleSendMessage(selectedChatId)
                } else if (!selectedChatId && member) {
                    await handleCreateChat()
                }
            }} type={"submit"} className={'chatting-button'}><Icon icon={AppIcons.send} size={30}/>
            </button>
        </div>
    )
}

export default ChatFooter