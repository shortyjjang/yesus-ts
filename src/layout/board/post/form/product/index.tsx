/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import Button from '@/components/button'
import Image from 'next/image'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { Api, ApiResponseType } from "@/util/api"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import SelectProductList from "./list"

export default function AddProduct({
    productImage,
    productName,
    optionName,
    setAlert,
    setValue,
    productId
}:{
    productImage?: string
    productName?: string
    optionName?: string
    setAlert: (msg: string) => void
    setValue: (id:string) => void
    productId?: string
}) {
    const [selectProduct, setSelectProduct] = useState<{
        productName: string
        optionName?: string
        productImage: string
    } | null>(
        productImage && productName ? {
            productName: productName,
            productImage: productImage,
            optionName: optionName? optionName : '',
        }: null
    )
    const [showProduct, setShowProduct] = useState(false)
    const {data: productList} = useQuery('allProductList', async () => {
        const request:ApiResponseType = await Api.post("/api/product/v1/getProductInfo", {
          pageIndex: 1,
          pageCount: 100,
        });
        if(request?.meta?.resultMsg) {
            setAlert(request.meta.resultMsg)
            return;
        }
        if(productId && request.content.items.length > 0 && request.content.items.findIndex((item:any) => item.productId === productId) > -1) {
            let item = request.content.items[request.content.items.findIndex((item:any) => item.productId === productId)]
            setSelectProduct({
                productImage: item.listImageUrl,
                productName: item.productName,
                optionName: item.optionName
            })
        }
        return request.content.items
    })
    return (
        <div className='flex border-t border-solid gap-8 py-8' css={css`
            border-color:var(--lightGrayColor);
        `}>
            <div className="relative aspect-square w-[16rem] border border-solid" css={css`
                border-color:var(--lightGrayColor);
            `}>
                {selectProduct  && <Image
                src={selectProduct.productImage}
                fill={true}
                alt={selectProduct.productName}
                priority={true}
                className='object-cover'
                />}
            </div>
            <div>
                {selectProduct && (
                    <div className="mb-6" css={css`
                        font-size:2.16rem;
                    `}>
                    {selectProduct.productName}
                    {selectProduct.optionName && (
                        <div className="mt-2" css={css`font-size:2rem`}>
                            옵션: {selectProduct.optionName}
                        </div>
                    )}
                    </div>
                )}
                {productList && !productId && <Button onClick={() => setShowProduct(true)}>
                    상품선택하기
                </Button>}
            </div> 
            {showProduct && productList && <SelectProductList 
                productList={productList} id="productId" 
                closePopup={() => setShowProduct(false)}
                setValue={setValue}
                showProduct={(image, productName, optionName) => {
                    setSelectProduct({
                        productName: productName,
                        productImage: image,
                        optionName: optionName
                    })
                }}
            />}
        </div>
    )
}
