import {makeAutoObservable} from "mobx";
import {TransferObject} from "../../testproto/transfers/item.ts";

class Transfers {
    tObjectsMap: Map<string, TransferObject> = new Map()
    lastObject: TransferObject | null = null

    constructor() {
        makeAutoObservable(this)
    }

    setToMap(obj: TransferObject) {
        this.tObjectsMap.set(obj.Id, obj)
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

export default new Transfers()