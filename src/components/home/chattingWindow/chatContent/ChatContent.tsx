import MessageEntity from "../messageEntity/MessageEntity.tsx";
import {FC, useCallback, useContext, useEffect, useRef, useState} from "react";
import {ChatMessage} from "../../../../testproto/chat/chat_actions.ts";
import {handleDownStream} from "../../../../data/utils.ts";
import {StreamsApi} from "../../../../data/api.ts";
import {getListByType} from "../../../../data/mobx/transfers.ts";
import {ChatStreamRequest_Type} from "../../../../testproto/transfers/streams.ts";
import {ChatInfo, StreamsContext} from "../../../contexts/StreamsContext.tsx";
import ChatFooter from "../chatFooter/ChatFooter.tsx";
import './chatContent.scss'

type ChatContentProps = {
    chat?: ChatInfo
    profileId?: string
}

const ChatContent: FC<ChatContentProps> = ({chat, profileId}) => {
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

    useEffect(() => {
        if ((fetching && chat?.messages) || firstInit) {
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
                            {chat?.messages ? chat?.messages.map(({Text, StampMillis, AuthorId, Id}) =>
                                <MessageEntity
                                    key={Id} profileId={profileId} authorId={AuthorId} text={Text}
                                    stampMillis={StampMillis}/>) : null}
                        </div>
                    </div>
                </div>
                <ChatFooter selectedChatId={chat?.chatInfo?.Id} profileId={profileId}/>
            </div>
        </div>
    )
}

export default ChatContent