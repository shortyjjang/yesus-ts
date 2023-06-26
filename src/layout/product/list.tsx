/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { useState } from 'react'
import { useQuery } from 'react-query'
import Confirm from '@/components/confirm'
import { useRouter } from 'next/navigation'
import Container from "../container"
import ItemCard from "./card"
import { mobileWidth } from "@/layout/header"
import SearchKeyword from "./search"
import { getProductList } from "@/util/product"


export default function ProductList({
    categoryId
} : {
    categoryId: number
}) {
    const router = useRouter()
    const [keyword, setKeyword] = useState<string>('')
    const products = useQuery(['products', {categoryId, keyword}],() => getProductList(categoryId, keyword))
    if(products.isLoading) return <div></div>
    if(products.isError || products.data?.meta?.resultMsg) return (
        <Confirm onClose={() => router.push('/')}>
            {products.data?.meta?.resultMsg 
                ? products.data?.meta?.resultMsg 
                : '네트워크에 문제가 있어 상품을 불러올 수 없습니다.'
            }
        </Confirm>
    )
    if(products.data?.content && products.data?.content?.items.length > 0) return (
        <Container>
            <SearchKeyword setKeyword={setKeyword} />
            <div className="grid grid-cols-2 gap-8" css={css`
                @media (min-width: ${mobileWidth}px) {grid-template-columns:repeat(3,1fr);}
            `}>
                {products.data?.content?.items?.map((product: any) => (
                    <ItemCard key={product.productId} {...product} />
                ))}
            </div>
        </Container>
    )
}
