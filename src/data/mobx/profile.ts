// import {ChatRole} from "../../proto/chat/chat_actions.ts";
// import {makeAutoObservable} from "mobx";
// import {PagerProfile} from "../../proto/common/common.ts";
//
// class ProfileContext {
//     profile: PagerProfile | null = null
//     chatRoles: ChatRole[] = []
//     selectedChatId: string | null = null
//     constructor() {
//         makeAutoObservable(this)
//     }
//
//     setChatRoles(role: ChatRole) {
//         this.chatRoles = [...this.chatRoles, role]
//     }
//
//     setProfile(profile: PagerProfile) {
//         this.profile = profile
//     }
//
//     setSelectedChatId(chatId: string) {
//         this.selectedChatId = chatId
//     }
//
// }
//
// export default new ProfileContext()