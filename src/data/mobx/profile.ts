import {Chat, ChatRole} from "../../proto/chat/chat_actions.ts";
import {makeAutoObservable} from "mobx";
import {PagerProfile} from "../../proto/common/common.ts";

class ProfileContext {
    profile: PagerProfile | null = null
    chatRoles: ChatRole[] = []
    chats: Chat[] = []
    selectedChatId: string | null = null
    //test-field
    userId: string = "65ab97d05fc06e64113dab4a"
    constructor() {
        makeAutoObservable(this)
    }

    setChatRoles(role: ChatRole) {
        this.chatRoles = [...this.chatRoles, role]
        console.log(role)
    }

    setProfile(profile: PagerProfile) {
        this.profile = profile
    }

    setUserId(id: string) {
        this.userId = id
    }

    setSelectedChat(chatId: string) {
        this.selectedChatId = chatId
    }

}

export default new ProfileContext()