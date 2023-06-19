import Confirm from '@/components/confirm'
import { Api } from '@/util/api'
import { getProductDetail } from '@/util/product'
import React from 'react'
import { useQuery } from 'react-query'

export default function InCart({
    productId,
    closeCart
}:{
    productId: number
    closeCart: (show:boolean) => void
}) {
    const product = useQuery(['product', productId], () => getProductDetail(productId))
    if(product.isLoading) return <div></div>
    if(product.isError) return <Confirm onClose={() => {
        closeCart(false)
    }}>
        상품을 불러올 수 없습니다.
    </Confirm>
    return (
        <div></div>
    )
}
