import {FC, useCallback, useContext, useEffect, useRef} from "react";
import {ChatActionsApi} from "../../../../data/api.ts";
import './chatFooter.scss'
import {useAuth} from "../../../../hooks/useAuth.tsx";
import actions from "../../../../data/mobx/actions.ts";
import {ChatMember, ChatMessage, ChatMessage_MessageStatus, ChatType} from "../../../../testproto/chat/chat_actions.ts";
import {StreamsContext} from "../../../contexts/StreamsContext.tsx";
import CustomInput from "../../../common/customInput/CustomInput.tsx";
import Icon, {AppIcons} from "../../../common/icon/Icon.tsx";
import {MessageActions} from "../chatContent/ChatContent.tsx";

type ChatFooterProps = {
    selectedChatId?: string
    profileId: string
    member?: ChatMember
    selectedMessage?: ChatMessage
    cancelSelectedMessage: () => void
    messageAction: MessageActions
    cancelMessageAction: () => void
}

const ChatFooter: FC<ChatFooterProps> = (
    {
        selectedChatId,
        profileId,
        member,
        selectedMessage,
        cancelSelectedMessage,
        messageAction,
        cancelMessageAction
    }
) => {
    const {handleSetMembers, members} = useContext(StreamsContext)
    const inputRef = useRef<HTMLInputElement>(null)
    const {logout} = useAuth();

    const handleSendMessage = useCallback(async (
        chatId: string
    ) => {
        if ((inputRef.current!.value !== "")) {
            if (selectedMessage && (messageAction === MessageActions.edit) && (inputRef.current!.value !== selectedMessage.Text)) {
                await new ChatActionsApi().sendMessage({
                    AuthorId: selectedMessage.AuthorId,
                    Id: selectedMessage.Id,
                    LinkedChatId: selectedMessage.LinkedChatId,
                    StampMillis: selectedMessage.StampMillis,
                    Status: selectedMessage.Status,
                    Text: inputRef.current!.value,
                    LinkedMessage: selectedMessage.LinkedMessage,
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
                cancelMessageAction()
            }
            inputRef.current!.value = ""
        } else {
            console.log(`userid ${profileId} not valid`)
        }
    }, [cancelMessageAction, cancelSelectedMessage, logout, messageAction, profileId, selectedMessage])

    useEffect(() => {
        if (messageAction === MessageActions.edit && selectedMessage) {
            inputRef.current!.value = selectedMessage.Text!
        } else {
            inputRef.current!.value = ""
        }
    }, [messageAction, selectedMessage]);

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
        <div className={'middle-footer-wrapper'}>
            {selectedMessage &&
                <MessageActionTab cancelSelectedMessage={cancelSelectedMessage} messageText={selectedMessage.Text!}
                                  action={messageAction} cancelMessageAction={cancelMessageAction}
                                  title={members[selectedMessage.AuthorId].Login}/>}
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
            }} type={"submit"} className={'chatting-button'}><Icon icon={AppIcons.send} size={30}/>
            </button>
        </div>
        </div>
    )
}

export default ChatFooter

type MessageActionTabProps = {
    cancelSelectedMessage: () => void
    cancelMessageAction: () => void
    messageText: string
    title?: string
    action: MessageActions
}
const MessageActionTab: FC<MessageActionTabProps> = ({
                                                         cancelSelectedMessage,
                                                         action,
                                                         messageText,
                                                         title,
                                                         cancelMessageAction
                                                     }) => {
    let headTitle = "";
    switch (action) {
        case MessageActions.edit:
            headTitle = "Редактировать";
            break;
        case MessageActions.reply:
            headTitle = `В ответ ${title}`;
            break;
    }
    return (
        <div className={'action-message-wrapper'}>
            <div className={'action-message-title'}>
                <div>
                    {headTitle}
                </div>
                <Icon icon={AppIcons.xSymbol} size={10} className={'gray-filter'} onClick={() => {
                    cancelSelectedMessage()
                    cancelMessageAction()
                }}/>
            </div>

            <div className={'action-message-subtitle'}>
                {messageText}
            </div>
        </div>
    )
}