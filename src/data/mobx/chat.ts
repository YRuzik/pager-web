import {ChatMessage} from "../../proto/chat/chat_actions.ts";
import {makeAutoObservable} from "mobx";

class ChatContext {
    messages: ChatMessage[] = []
    constructor() {
        makeAutoObservable(this)
    }

    changeState(chatMessage: ChatMessage) {
        console.log(chatMessage)
        this.messages = [...this.messages, chatMessage]
    }
}

export default new ChatContext()