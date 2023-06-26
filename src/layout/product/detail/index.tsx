/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useParams } from 'next/navigation'
import Cookies from "js-cookie";
import Container from "@/layout/container";
import TagRecipeList from "@/layout/recipes/tag_list";
import { SwiperSlide, Swiper } from "swiper/react";

import 'swiper/css'
import Image from "next/image";
import { mobileWidth } from "@/layout/header";
import Badge from '../badge';
import { price } from '@/util/price';
import InCart from '../in_cart';
import { useState } from 'react';
import Confirm from '@/components/confirm';
import { useRouter } from 'next/router';
import Board from '../../board';
import ProductDescription from './description';
import ProductGuide from './guide';
import Button from '@/components/button';

export default function ProductDetailView({
  post
}:{
  post: ProductResponseType
}) {
  const [tab, setTab] = useState('detail')
  const [alert, setAlert] = useState<string | null>(null)
  const router = useRouter()
  return (
    <main>
      {alert && <Confirm 
        onClose={() => setAlert(null)}
        onSuccess={alert === '로그인하시겠습니까?\n로그인 후 구매가 가능합니다.' ? () => router.push('/login') : undefined } 
        inlineCSS={'white-space:pre-wrap'}
      >{alert}</Confirm>}
      {post.productImageList && post.productImageList.length > 0 && (
        <Swiper className="border-solid border-black border-b" css={css`
            @media (min-width: ${mobileWidth}px) {
                border-width:1px;
            }
        `}>
            {post.productImageList.map((image, index) => <SwiperSlide key={image.productImageType+index} className="relative aspect-square">
              <Image
                  src={image.productImagePath}
                  fill={true}
                  alt={post.productName}
                  priority={true}
                  className="w-full h-full top-0 left-0 absolute object-cover"
              />

            </SwiperSlide>)}
        </Swiper>
      )}
      <Container className='pt-10'>
        {post.icons && <div className="mb-4">
          {post.icons.filter(icon => icon.useYn === 'Y').map((icon) => (
            <Badge key={icon.iconTypeDesc} type={icon.iconTypeDesc} />
          ))}
        </div>}
        <h1 className="pb-2 font-extrabold" css={css`
          font-size:3.4rem;
        `}>{post.productName}</h1>
        <p className="pb-6 font-bold">{post.productSummaryDesc}</p>
        <div className="pb-4 border-b border-solid border-gray-300">
          {post.productNetPrice !== post.productSalePrice && (
            <span className='block'>
              <small className='line-through text-gray-400'>{price(post.productNetPrice)}</small>{" "}
              {post.productDiscountRate > 0 && (
                <strong className="fcg">{post.productDiscountRate}%</strong>
              )}
            </span>
          )}
          <b>{price(post.productSalePrice)}</b>
        </div>
        <ul className="grid gap-1 py-4 mb-4" css={css`
          li {
            display:grid;
            grid-template-columns: 100px 1fr;font-size:1.86rem;
          }
          label {color:var(--grayColor);}
        `}>
          <li>
            <label>배송방법</label> {post.productShippingMethodType}
          </li>
          <li>
            <label>배송비</label>
            {post.productShippingPayType === "무료배송" ||
            post.productShippingPrice === 0 ? (
              <b>무료배송</b>
            ) : (
              <div>
                {post.productShippingChargeType === "개별배송" && (
                  <small css={css`
                    color:var(--grayColor);font-size:1.7rem;
                  `}>1개 주문시{" "}</small>
                )}
                {price(post.productShippingPrice)}
              </div>
            )}
          </li>
        </ul>
        <InCart post={post} setAlert={setAlert} />
      </Container>
      <Container className='flex mt-20 mb-10' inlineCSS={`
        button+button {border-left-width:0;}
      `}>
        <Button 
          onClick={() => setTab('detail')}
          styleType={tab === 'detail' ? 'default':'dimmend'}
          className={`w-full ${tab === 'detail' ? '':'font-normal'}`}
        >상품상세</Button>
        <Button 
          onClick={() => setTab('guide')}
          styleType={tab === 'guide' ? 'default':'dimmend'}
          className={`w-full ${tab === 'guide' ? 'relative z-10':'font-normal'}`}
          inlineCSS={tab === 'guide' ? 'box-shadow:-1px 0 0 var(--defaultColor);' :''}
        >안내</Button>
        <Button
          onClick={() => setTab('review')}
          styleType={tab === 'review' ? 'default':'dimmend'}
          className={`w-full ${tab === 'review' ? 'relative z-10':'font-normal'}`}
          inlineCSS={tab === 'review' ? 'box-shadow:-1px 0 0 var(--defaultColor);' :''}
        >후기</Button>
        <Button
          onClick={() => setTab('qa')}
          styleType={tab === 'qa' ? 'default':'dimmend'}
          className={`w-full ${tab === 'qa' ? 'relative z-10':'font-normal'}`}
          inlineCSS={tab === 'qa' ? 'box-shadow:-1px 0 0 var(--defaultColor);' :''}
        >문의</Button>
      </Container>
      {tab === 'detail' && <ProductDescription productDetailDescHtml={post.productDetailDescHtml} />}
      {tab === 'guide' && <ProductGuide 
        productPaymentInfoHtml={post.productPaymentInfoHtml} 
        productShippingInfoHtml={post.productShippingInfoHtml} 
        productExchangeInfoHtml={post.productExchangeInfoHtml} 
      />}
      {tab === 'review' && <Board bbsId={2} type="list" productId={post.productId} />}
      {tab === 'qa' && <Board bbsId={6} type="list" productId={post.productId} />}
      {post.tagList && (
        <TagRecipeList tagIds={post.tagList
            .map((tag:any) => {
              return Number(tag.ihiId);
            })
            .join(",")}
        />
      )}
    </main>
  )
}

export interface ProductOptionGroupType {
  "optionGroupId": string,
  "optionGroupType": string,
  "optionGroupName": string,
  "optionTemplateId": number,
  "children": ProductOptionGroupType[]
}
export interface OptionItemType {
  "ponId": string,
  "itemId": string,
  "optionName": string,
  "addPrice": number,
  "salePrice": number,
  "soldOutYn": string,
  "optionQty": number,
  "optionSupplyUnit": string,
  "optionSupplyQty": number,
  "optionProvideCnt": number,
  "optionGroupTemplatePath": string,
  "optionGroupCaptionPath": string,
  "orderableCount": number
}
export type ProductResponseType = {
  productId: string,
  productName: string,
  productGubun: string,
  productNetPrice: number,
  productSalePrice: number,
  productDiscountRate: number,
  productSaleStatus: string,
  productOrderLimitCount: number,
  productCartLimitCount: number,
  optionUseYn: string,
  orderLimitTime: string,
  productShippingType: string,
  productShippingMethodType: string,
  productShippingChargeType: string,
  productShippingPayType: string,
  productShippingPrice: number,
  productWeight: number,
  productSummaryDesc: string,
  productDetailDescHtml: string,
  productPaymentInfoHtml: string,
  productShippingInfoHtml: string,
  productExchangeInfoHtml: string,
  icons?: {
          iconType: string,
          iconTypeDesc: string,
          useYn: string
      }[],
  productComponents: [],
  optionGroups?: ProductOptionGroupType[],
  options:  OptionItemType[],
  productImageList: 
  {
      productImageType: string,
      productImagePath: string,
      productImageFullPath: string,
      imageDesc?: string
  }[],
  tagList?: 
  {
      ihiId: string,
      ihiHashtagName: string
  }[],
  enableSubscriptionOrderYn: string,
  categories: {
      categoryFullPath: string,
      items: {
          categoryId: number,
          categoryName: string
      }[]
  }[],
  soldOutYn: string,
  orderableCount: number,
  whId: number
}
