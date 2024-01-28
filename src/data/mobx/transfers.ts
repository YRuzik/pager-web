import {makeAutoObservable} from "mobx";
import {TransferObject} from "../../testproto/transfers/item.ts";
import {ChatMessage} from "../../testproto/chat/chat_actions.ts";

class Transfers {
    tObjectsMap: Map<string, TransferObject> = new Map()
    lastObject: TransferObject | null = null

    constructor() {
        makeAutoObservable(this)
    }

    setToMap(obj: TransferObject) {
        this.tObjectsMap.set(obj.Id, obj)
    }

    setToLastObj(obj: TransferObject) {
        this.lastObject = obj
    }

    streamListValue<T extends object>(type: string) {
        const dataList: T[] = []
        this.tObjectsMap.forEach((value) => {
            if (value.Type === type) {
                dataList.push(JSON.parse(new TextDecoder().decode(value.Data)))
            }
        })
        return dataList;
    }

    streamValue<T extends object>(type: string) {
        let dataObject: T | undefined = undefined
        this.tObjectsMap.forEach((value) => {
            if (value.Type === type) {
                dataObject = JSON.parse(new TextDecoder().decode(value.Data))
            }
        })
        return dataObject
    }
}

export const getValueByType = <T>(type: string, arr: TransferObject[]) => {
    const foundedElement = arr.find((val) => val.Type === type);
    if (foundedElement) {
        const object: T = JSON.parse(new TextDecoder().decode(foundedElement.Data))
        return object
    }
    return undefined
}

export const getListByType = <T>(type: string, arr: TransferObject[]) => {
    const dataList: T[] = [];
    arr.forEach((v) => {
        if (v.Type === type) {
            dataList.push(JSON.parse(new TextDecoder().decode(v.Data)))
        }
    })
    return dataList
}

export default new Transfers()