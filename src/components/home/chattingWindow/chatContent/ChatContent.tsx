import MessageEntity from "../messageEntity/MessageEntity.tsx";
import {FC, useCallback, useContext, useEffect, useRef, useState} from "react";
import {ChatMember, ChatMessage, ChatMessage_MessageStatus} from "../../../../testproto/chat/chat_actions.ts";
import {ChatActionsApi, StreamsApi} from "../../../../data/api.ts";
import {getListByType} from "../../../../data/mobx/transfers.ts";
import {ChatStreamRequest_Type} from "../../../../testproto/transfers/streams.ts";
import {ChatInfo, StreamsContext} from "../../../contexts/StreamsContext.tsx";
import ChatFooter from "../chatFooter/ChatFooter.tsx";
import './chatContent.scss'
import {handleDownStream} from "../../../../data/utils/transfers.ts";
import {v4 as uuidv4} from 'uuid';

type ChatContentProps = {
    chat?: ChatInfo
    profileId: string
    member?: ChatMember
}

const ChatContent: FC<ChatContentProps> = ({chat, profileId, member}) => {
    const {handleMessagesPagination} = useContext(StreamsContext)
    const messagesRef = useRef<HTMLDivElement>(null)
    const [fetching, setFetching] = useState(false)
    const [firstInit, setFirstInit] = useState(true)

    const handleInfiniteScroll = useCallback(async () => {
        const calculatedHeight = messagesRef.current!.scrollHeight + messagesRef.current!.scrollTop - window.innerHeight;
        if (messagesRef && (calculatedHeight < 0)) {
            setFetching(true)
        }
    }, [])

    useEffect(() => {
        const currentRef = messagesRef.current;
        if (messagesRef && chat?.chatInfo) {
            currentRef?.addEventListener("scroll", handleInfiniteScroll)
        }
        return () => {
            if (messagesRef && chat?.chatInfo) {
                currentRef?.removeEventListener("scroll", handleInfiniteScroll)
                setFirstInit(true)
            }
        }
    }, [handleInfiniteScroll, chat?.chatInfo]);

    const handleUpdateMessages = useCallback(async () => {
        const unreadedMessages: ChatMessage[] = []
        if (chat) {
            for (const message of chat.messages) {
                if (message.Status === ChatMessage_MessageStatus.unread && message.AuthorId !== profileId) {
                    const nMessage: ChatMessage = {...message, Status: ChatMessage_MessageStatus.seen}
                    unreadedMessages.push(nMessage)
                }
            }
        }
        if (unreadedMessages.length > 0) {
            new ChatActionsApi().updateManyMessages({messages: unreadedMessages})
        }
    }, [chat, profileId])
    
    useEffect(() => {
        handleUpdateMessages()
    }, [handleUpdateMessages]);

    useEffect(() => {
        if ((chat) && ((fetching && chat?.messages) || firstInit)) {
            handleDownStream(false, StreamsApi.streamChat, {
                ChatId: chat?.chatInfo?.Id,
                RequestedMessages: (chat?.messages?.length ?? 0) + 50
            }).then((v) => {
                const allMessages = getListByType<ChatMessage>(ChatStreamRequest_Type[2], v)
                if (allMessages.length === chat?.messages?.length && !firstInit) {
                    messagesRef.current?.removeEventListener("scroll", handleInfiniteScroll)
                } else {
                    handleMessagesPagination(allMessages, chat?.chatInfo?.Id ?? "")
                }
                setFirstInit(false)
                setFetching(false)
            })
        }
    }, [chat, fetching, firstInit, handleInfiniteScroll, handleMessagesPagination])

    return (
        <div className={"content-wrapper"}>
            <div className={"content-container"}>
                <div ref={messagesRef} className={"messages-list"}>
                    <div className={'messages-container'}>
                        <div className={'messages-container'}>
                            {chat?.messages ? chat?.messages.map((message) =>
                                <MessageEntity
                                    key={uuidv4()} profileId={profileId} message={message}/>) : null}
                        </div>
                    </div>
                </div>
                <ChatFooter selectedChatId={chat?.chatInfo?.Id} profileId={profileId} member={member}/>
            </div>
        </div>
    )
}

export default ChatContent