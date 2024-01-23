import {makeAutoObservable} from "mobx";
import {TransferObject} from "../../proto/transfers/item.ts";
import {MessageType} from "@protobuf-ts/runtime";

class Transfers {
    tObjectsMap: Map<string, TransferObject> = new Map()
    lastObject: TransferObject | null = null

    constructor() {
        makeAutoObservable(this)
    }

    setToMap(obj: TransferObject) {
        this.tObjectsMap.set(obj.id, obj)
        this.lastObject = obj
    }

    streamListValue<T extends object>(type: string, prepareItem: MessageType<T>) {
        const dataList: T[] = []
        this.tObjectsMap.forEach((value) => {
            if (value.type === type) {
                dataList.push(prepareItem.fromJsonString(new TextDecoder().decode(value.data)))
            }
        })
        return dataList;
    }

    streamValue<T extends object>(type: string, prepareItem: MessageType<T>) {
        let dataObject: T | null = null
        this.tObjectsMap.forEach((value) => {
            if (value.type === type) {
                dataObject = prepareItem.fromJsonString(new TextDecoder().decode(value.data))
            }
        })
        return dataObject
    }

}

// export const streamListValue = <T extends object>(type: string, prepareItem: MessageType<T>) => {
//     const dataList: T[] = []
//     new Transfers().tObjectsMap.forEach((value) => {
//         if (value.type === type) {
//             dataList.push(prepareItem.fromJsonString(new TextDecoder().decode(value.data)))
//         }
//     })
//     return dataList;
// }
//
// export const streamValue = <T extends object>(type: string, prepareItem: MessageType<T>) => {
//     let dataObject: T | null = null
//     new Transfers().tObjectsMap.forEach((value) => {
//         if (value.type === type) {
//             dataObject = prepareItem.fromJsonString(new TextDecoder().decode(value.data))
//         }
//     })
//     return dataObject
// }

export default new Transfers()