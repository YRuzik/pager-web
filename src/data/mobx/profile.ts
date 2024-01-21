import {ChatRole} from "../../proto/chat/chat_actions.ts";
import {makeAutoObservable} from "mobx";
import {PagerProfile} from "../../proto/common/common.ts";

class ProfileContext {
    profile: PagerProfile | null = null
    chatRoles: ChatRole[] = []
    constructor() {
        makeAutoObservable(this)
    }

    setChatRoles(role: ChatRole) {
        this.chatRoles = [...this.chatRoles, role]
    }

    setProfile(profile: PagerProfile) {
        this.profile = profile
    }

}

export default new ProfileContext()