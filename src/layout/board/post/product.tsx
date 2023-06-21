import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { PostType } from '.'

export default function PostProductItem({
    productId,
    optionName,
    productName,
    productImage,
}: {
    productId: string,
    optionName?: string,
    productName?: string,
    productImage: string,
}) {
    if(!productImage || !productId) return <></>
  return (
    <div>
      <span className="relative">
        <Image
          src={productImage}
          fill={true}
          alt={productName ? productName: '상품이미지'}
          priority={true}
          className='absolute top-0 left-0 w-full h-full object-cover'
        />
      </span>
      <b>{productName}</b>
      {optionName && <>옵션: {optionName}</>}
      <Link
        href={`/product/${productId}`}
        className="btn-default"
        style={{ padding: "1.16rem 1.89rem" }}
      >
        상품상세보기
      </Link>
    </div>
  )
}
