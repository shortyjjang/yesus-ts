/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import PopupContainer from "@/components/popup";
import Image from "next/image";

export default function SelectProductList({ 
    productList, 
    setValue,
    showProduct,
    closePopup,
    id
}:{
    productList:{
        productId: string
        opId?: string
        listImageUrl: string
        productName: string
        optionName?: string
    }[]
    id: 'opId' | 'productId'
    setValue: (id:string) => void
    showProduct: (image:string, productName:string, optionName?:string) => void
    closePopup: () => void
}) {
    return (
      <PopupContainer onClose={closePopup}>
        <div className="bg-white">
            <h3 className="text-center p-9" css={css`
                font-size: 3.08rem;
            `}>상품선택하기</h3>
            <ul className="overflow-auto max-h-[80svh] border border-solid" css={css`
                border-color: var(--lightGrayColor);
                li+li {border-top:1px solid var(--lightGrayColor)}
            `}>
            {productList.map((item) => (
                <li
                key={item.productId}
                className="flex p-9 cursor-pointer"
                onClick={() => {
                    setValue(
                        (id === 'opId' && item.opId) ? item.opId : item.productId
                    );
                    showProduct(item.listImageUrl, item.productName, item.optionName);
                    closePopup();
                }}
                >
                <span className="relative aspect-square w-40 mr-5">
                    <Image
                    fill={true}
                    className="object-cover"
                    alt={item.productName}
                    src={item.listImageUrl ? item.listImageUrl : "/images/blank.gif"}
                    priority={true}
                    />
                </span>
                {item.productName}
                {item.optionName && (
                    <span className="block text-gray-500">
                    [옵션] {item.optionName}
                    </span>
                )}
                </li>
            ))}
            </ul>
        </div>
      </PopupContainer>
    );
  }