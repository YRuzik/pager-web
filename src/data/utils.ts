import {Metadata, ServerStreamingClientMethod} from "nice-grpc-web";
import {TransferObject} from "../testproto/transfers/item.ts";
import {CallOptions} from "nice-grpc-common";
import transfers from "./mobx/transfers.ts";

export const handleArrayChangeValue = <T extends { Id: string }>(arr: T[], value: T) => {
    const copyOfArray = [...arr]
    const foundElement = copyOfArray.find((obj) => obj.Id === value.Id)
    if (foundElement) {
        copyOfArray[copyOfArray.indexOf(foundElement)] = value;
    } else {
        copyOfArray.push(value)
    }
    return copyOfArray
}

export const handleDownStream = async <T extends object>(
    init: boolean,
    stream: ServerStreamingClientMethod<T, TransferObject>,
    requestBody: T
) => {
    const jwt = localStorage.getItem("jwt");
    let ops = {}
    if (init) {
        ops = {watch: "watch"}
    }
    if (jwt) {
        ops = {...ops, jwt: jwt}
    }
    const test: CallOptions = {
        metadata: new Metadata(ops)
    }

    const responses = stream(requestBody, test)

    const dataPackage: TransferObject[] = [];

    for await (const response of responses) {
        if (!init) {
            dataPackage.push(response)
        } else {
            transfers.setToLastObj(response)
        }
    }

    return dataPackage;

}