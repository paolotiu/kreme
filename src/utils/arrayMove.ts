export function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
    const arrCopy = [...arr];
    const element = arrCopy[fromIndex];
    console.log(element);
    arrCopy.splice(fromIndex, 1);
    arrCopy.splice(toIndex, 0, element);
    return arrCopy;
}
