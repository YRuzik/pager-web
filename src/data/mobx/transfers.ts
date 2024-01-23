import {makeAutoObservable} from "mobx";
import {TransferObject} from "../../proto/transfers/item.ts";
import {MessageType} from "@protobuf-ts/runtime";

class Transfers {
    tObjectsMap: Map<string, TransferObject> = new Map()
    constructor() {
        makeAutoObservable(this)
    }

    setToMap (obj: TransferObject) {
        this.tObjectsMap.set(obj.id, obj)
    }
}

export const streamListValue = <T extends object>(type: string, prepareItem: MessageType<T>, objs: Map<string, TransferObject>) => {
    const dataList: T[] = []
    objs.forEach((value) => {
        if (value.type === type) {
            dataList.push(prepareItem.fromJsonString(new TextDecoder().decode(value.data)))
        }
    })
    return dataList;
}

export const streamValue = <T extends object>(type: string, prepareItem: MessageType<T>, objs: Map<string, TransferObject>) => {
    let dataObject: T | null = null
    objs.forEach((value) => {
        if (value.type === type) {
            dataObject = prepareItem.fromJsonString(new TextDecoder().decode(value.data))
        }
    })
    return dataObject
}

export default new Transfers()