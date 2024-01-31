import {makeAutoObservable} from "mobx";
import {ChatMember} from "../../testproto/chat/chat_actions.ts";

class Actions {
    selectedChatId: string | undefined
    selectedMember: ChatMember | undefined
    constructor() {
        makeAutoObservable(this)
    }

    toggleChatId(id: string | undefined) {
        this.selectedChatId = id
    }

    setMember(member: ChatMember | undefined) {
        this.selectedMember = member
    }

}

export default new Actions()