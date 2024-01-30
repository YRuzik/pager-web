import {makeAutoObservable} from "mobx";

class Actions {
    selectedChatId: string | undefined
    constructor() {
        makeAutoObservable(this)
    }

    toggleChatId(id: string | undefined) {
        this.selectedChatId = id
    }
}

export default new Actions()