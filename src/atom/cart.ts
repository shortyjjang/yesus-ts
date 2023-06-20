import { atom } from "recoil";

export type CartType = {

    "cartDetailOptions": CartOptionType[],
    "productId": string,
    "customerMallId": string
    
}
export type CartOptionType ={
    cartOrderCnt: number,
    ponId?: number,
    promotionNo: number
}

export const cartList = atom<CartType[]>({
    key: 'cart_list',
    default: [],
})