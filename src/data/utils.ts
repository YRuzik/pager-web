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