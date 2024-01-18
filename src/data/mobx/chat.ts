import {Chat, ChatMessage} from "../../proto/chat/chat_actions.ts";
import {makeAutoObservable} from "mobx";

class ChatContext {
    messages: ChatMessage[] = []
    chats: Chat[] = []
    constructor() {
        makeAutoObservable(this)
    }

    changeState(chatMessage: ChatMessage) {
        console.log(`new chat message: ${chatMessage}`)
        this.messages = [...this.messages, chatMessage]
    }

    setChats(chat: Chat) {
        this.chats = [...this.chats, chat]
        console.log(chat)
    }


}

export default new ChatContext()