/** @jsxImportSource @emotion/react */
import Button from "@/components/button"
import { css } from "@emotion/react"
import Image from 'next/image'
import { useRouter } from "next/router"

export default function PostProductItem({
    productId,
    optionName,
    productName,
    productImage,
    className
}: {
    productId: string,
    optionName?: string,
    productName?: string,
    productImage: string,
    className?: string
}) {
  const router = useRouter()
    if(!productImage || !productId) return <></>
  return (
    <div className={`border-t border-solid border-gray-300 py-9 gap-4 flex ${className}`}>
      <span className="relative w-36 aspect-square">
        <Image
          src={productImage}
          fill={true}
          alt={productName ? productName: '상품이미지'}
          priority={true}
          className='absolute top-0 left-0 w-full h-full object-cover'
        />
      </span>
      <div>
        <b>{productName}</b>
        {optionName && <div css={css`color:var(--grayColor);font-size:1.86rem;`}>옵션: {optionName}</div>}
        <Button
          size="sm"
          className="block mt-4"
          onClick={() => router.push(`/product/${productId}`)}
        >
          상품상세보기
        </Button>
      </div>
    </div>
  )
}
