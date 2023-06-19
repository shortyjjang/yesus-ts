import { atom } from "recoil";

export type CartType = {
    id: number,
    productId: string,
    quantity: number,
    ponId: string,
}

export const cartList = atom({
    key: 'cartList',
    default: [],
})