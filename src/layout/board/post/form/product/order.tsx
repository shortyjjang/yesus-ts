/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import Button from '@/layout/button'
import Image from 'next/image'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { Api, ApiResponseType } from "@/util/api"
import Cookies from "js-cookie"
import SelectProductList from "./list"
import { useRouter } from "next/router"
import { bbsName } from "@/layout/board"

export default function AddOrderProduct({
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
    const router = useRouter()
    const [showProduct, setShowProduct] = useState(false)
    const {data: productList, isError } = useQuery('orderProductList', async () => {
        if(!Cookies.get("accessToken")) {
            setAlert('로그인 후 이용해주세요.')
            return;
        }
        const request:ApiResponseType = await Api.get("/api/order/v1/read/writable-review", {
          headers: {
            Authorization: Cookies.get("accessToken")
          },
        });
        if(request?.meta?.resultMsg) {
            setAlert(request.meta.resultMsg)
            return;
        }
        if(request.content.length === 0) {
            setAlert('최근 구매하신 상품이 없습니다.')
            return;
        }
        if(productId && request.content.length > 0 ) {
            if(request.content.findIndex((item:any) => item.productId === productId) < 0) {
                setAlert('최근 구매하신 상품이 없습니다.')
                return;
            }
            const item = request.content[request.content.findIndex((item:any) => item.productId === productId)]
            setSelectProduct({
                productImage: item.listImageUrl,
                productName: item.productName,
                optionName: item.optionName
            })
            setValue(item.orderProductId)
        }
        return request.content
    })
    if(isError) {
        router.back()
        return;
    }
    return (
        <div className='flex border-t border-solid' css={css`
            border-color:var(--lightGrayColor);
        `}>
            <div className="relative aspect-square w-36">
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
                productList={productList} id="opId" 
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
