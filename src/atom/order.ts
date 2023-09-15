import { atom } from "recoil";

export type OrderType = {

    productId: string,
    quantity: number,
    optionId?: string,
    payType?: string,
}
export const orderList = atom<OrderType[]>({
    key: 'order_list',
    default: [],
})