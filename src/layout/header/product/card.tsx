/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import Link from "next/link"
import Image from "next/image"
import { price } from "@/util/price"
import { useState } from "react"
import InCart from "./in_cart"

export type ItemCardType = {
    productId: number,
    productName: string,
    netPrice: number,
    salePrice: number,
    discountRate: number,
    listImageUrl: string,
    saleStatus: string,
    productGubun: string,
    icons?: {
        iconType: string,
        iconTypeDesc: string,
        useYn: string
    }[]
}

export default function ItemCard({
    productId,
    productName,
    netPrice,
    salePrice,
    discountRate,
    listImageUrl,
    saleStatus,
    icons
}:ItemCardType) {
    const [showCart, setShowCart] = useState<boolean>(false)
    return (
        <div css={css`
            font-size:2.15rem;
        `}>
            <span className="relative block aspect-square" css={css`
                ${saleStatus !== '판매중' ? 'filter:grayScale(100%);': ''}
            `}>
                <Link href={`/product/${productId}`}>
                    <Image src={listImageUrl} alt={productName} fill={true} css={css`
                        object-fit:cover;
                    `} priority={true} />
                    <span className="absolute left-4 top-4">{icons && icons.filter(icon => icon.useYn === 'Y').map((icon) => (
                        <small key={icon.iconTypeDesc} className="inline-block px-2 border border-solid uppercase" css={css`
                            border-radius:0.3rem;margin:0 0.4rem 0.4rem 0;
                            ${icon.iconTypeDesc === 'hot' && `background:#000;color:var(--pointColor);`}
                            ${icon.iconTypeDesc === '베스트상품' && `background:var(--pointColor);border-color:var(--pointColor);`}
                            ${icon.iconTypeDesc === '친환경' && `border-color:var(--greenColor);color:var(--greenColor);background:#fff;`}
                        `}>{icon.iconTypeDesc}</small>
                    ))}</span>
                </Link>
                <button className="absolute bottom-6 right-6 rounded-full border-solid border-white" css={css`
                    width:5.5rem;height:5.5rem;text-indent:-9999px;border-width:0.077rem;
                    background: url('/images/icon-cart-wh.svg') rgba(0,0,0,.4) no-repeat center/3rem;
                `} onClick={() => setShowCart(!showCart)}>장바구니담기</button>
            </span>
            <Link href={`/product/${productId}`}>
                <span className="block line-clamp-2 overflow-hidden mt-4 mb-2" css={css`
                    line-height:1.3;
                `}>{productName}</span>
                <span className="block font-bold">
                    {discountRate > 0 && <span className="fcg mr-2">{discountRate}%</span>}
                    {price(salePrice)}
                </span>
                {discountRate > 0 && <span className="line-through" css={css`
                    color:var(--grayColor);font-size:1.9rem;
                `}>{price(netPrice)}</span>}
            </Link>
            {showCart && <InCart productId={productId} closeCart={setShowCart} />}
        </div>
    )
}
