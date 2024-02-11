import {makeAutoObservable} from "mobx";
import {TransferObject} from "../../testproto/transfers/item.ts";

class Transfers {
    lastObject: TransferObject | null = null

    constructor() {
        makeAutoObservable(this)
    }

    setToLastObj(obj: TransferObject) {
        this.lastObject = obj
    }

}

export const getValueByType = <T>(type: string, arr: TransferObject[]) => {
    const foundedElement = arr.find((val) => val.Type === type);
    const object: T = JSON.parse(new TextDecoder().decode(foundedElement!.Data))
    return object
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