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
import Badge from './badge';
import { price } from '@/util/price';
import InCart from './in_cart';
import { useState } from 'react';
import Confirm from '@/components/confirm';
import { useRouter } from 'next/router';

export default function ProductDetailView({
  post
}:{
  post: ProductResponseType
}) {
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
       <Container>
        <div
          css={productDetailCSS}
          dangerouslySetInnerHTML={{ __html: post.productDetailDescHtml }}
        ></div>
        <dl css={guideCSS}>
          <dt>결제방법</dt>
          <dd
            dangerouslySetInnerHTML={{
              __html: post.productPaymentInfoHtml,
            }}
          ></dd>
          <dt>배송안내</dt>
          <dd
            dangerouslySetInnerHTML={{
              __html: post.productShippingInfoHtml,
            }}
          ></dd>
          <dt>환불규정</dt>
          <dd
            dangerouslySetInnerHTML={{
              __html: post.productExchangeInfoHtml,
            }}
          ></dd>
        </dl>

       </Container>
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
  "productId": string,
  "productName": string,
  "productGubun": string,
  "productNetPrice": number,
  "productSalePrice": number,
  "productDiscountRate": number,
  "productSaleStatus": string,
  "productOrderLimitCount": number,
  "productCartLimitCount": number,
  "optionUseYn": string,
  "orderLimitTime": string,
  "productShippingType": string,
  "productShippingMethodType": string,
  "productShippingChargeType": string,
  "productShippingPayType": string,
  "productShippingPrice": number,
  "productWeight": number,
  "productSummaryDesc": string,
  "productDetailDescHtml": string,
  "productPaymentInfoHtml": string,
  "productShippingInfoHtml": string,
  "productExchangeInfoHtml": string,
  "icons"?: {
          "iconType": string,
          "iconTypeDesc": string,
          "useYn": string
      }[],
  "productComponents": [],
  "optionGroups"?: ProductOptionGroupType[],
  "options":  OptionItemType[],
  "productImageList": 
  {
      "productImageType": string,
      "productImagePath": string,
      "productImageFullPath": string,
      "imageDesc"?: string
  }[],
  "tagList"?: 
  {
      "ihiId": string,
      "ihiHashtagName": string
  }[],
  "enableSubscriptionOrderYn": string,
  "categories": {
      "categoryFullPath": string,
      "items": {
          "categoryId": number,
          "categoryName": string
      }[]
  }[],
  "soldOutYn": string,
  "orderableCount": number,
  "whId": number
}

const productDetailCSS = css`
> strong,
.contents > strong {
  font-weight: 900;
  color: #555;
  display: block;
  font-size: 2.16rem;
  line-height: 1.3;
}
.contents > strong + dl dt {
  margin-top: 1rem;
}
dl {
  margin: 0 0 2.3rem;
}
dd {
  position: relative;
  padding: 0.9rem 0 0 2rem;
  font-size: 2rem;
}
dd:before {
  content: "-";
  position: absolute;
  top: 0.9rem;
  left: 0.38rem;
}
sub {
  background: rgba(0, 0, 0, 0.1);
  color: #555;
  font-size: 1.87rem;
  position: relative;
  left: 2.4rem;
}
.prd_title {
  font-weight: 900;
  font-size: 2.47rem;
  padding-bottom: 1rem;
  margin: 0 auto 2rem;
  max-width: 660px;
  line-height: 1.3;
  border-bottom: 1px solid var(--defaultColor);
  text-align: left;
}
.product_info {
  text-align: left;
  border-collapse: collapse;
  border-bottom: 1px solid var(--lightGrayColor);
  margin: 0 auto;
  width: 100%;
  max-width: 660px;
  margin-bottom: 10rem;
}
.product_info td.tip {
  border-top: 0;
  padding-top: 0;
  font-size: 1.54rem;
}
.product_info td.tip:before {
  display: none;
}
.product_info td.tip div {
  border: 1px solid var(--lightGrayColor);
  padding: 0.5rem;
  background: var(--backgroundColor);
  display: inline-block;
}
.product_info td.tip strong {
  display: block;
}
.product_info img {
  max-height: 7.5rem;
}
.story {
  text-align: left;
  padding: 0 2.3rem;
  font-size: var(--defaultSpace);
  line-height: 1.5;
  max-width: calc(660px + 4.62rem);
  margin: 0 auto;
}
.story p + p {
  margin-top: 3.5rem;
}
.story .prd_ct_title {
  line-height: 1.3;
  padding-top: 9rem;
  margin-top: 9rem;
  border-top: 1px solid var(--lightGrayColor);
  font-size: 3.5rem;
  text-align: center;
}
.story .tip {
  font-size: 1.74rem;
}
.prd_title.bordernone {
  border: 0;
  margin: 0 auto;
  font-size: 2rem;
  padding-top: 6rem;
  width: calc(100% - 4.62rem);
  max-width: 660px;
}
.brand_vision {
  width: calc(100% - 4.62rem);
  margin: 9rem auto;
  padding: 3.2rem 0;
  max-width: 660px;
  text-align: center;
}
.brand_vision h3 {
  font-weight: 900;
  font-size: 3.5rem;
  padding-bottom: 3rem;
}
.brand_vision h3 small {
  display: block;
  font-size: 2.4rem;
  padding-top: 1rem;
}
.brand_vision ul {
  display: flex;
}
.brand_vision li:before {
  content: "";
  margin: 0 auto 1.5rem;
  display: block;
  height: 11rem;
  background: no-repeat 50% 50%;
  background-size: contain;
  width: 11rem;
  max-width: calc(100% - 5rem);
}
.brand_vision li:nth-child(1):before {
  background-image: url("/images/yes2020_1.webp");
}
.brand_vision li:nth-child(2):before {
  background-image: url("/images/yes2020_2.webp");
}
.brand_vision li:nth-child(3):before {
  background-image: url("/images/yes2020_3.webp");
}
.brand_vision li {
  width: 100%;
  position: relative;
  padding: 0 1rem;
}
.brand_vision .arrow {
  position: absolute;
  left: 0;
  top: 50%;
  font-weight: 900;
  font-size: 2.16rem;
  transform: translate(-50%, -50%);
  background: url("/images/arrow.jpg") no-repeat 50% 100%;
  background-size: 3.5rem;
  padding-bottom: 3.5rem;
}
.detail_div {
  max-width: 660px;
  margin: 0 auto;
  text-align: center;
}
.delivery_plan {
  text-align: center;
}
.product_info th,
.product_info td {
  border-top: 1px solid var(--lightGrayColor);
  padding: 1.2rem 1.5rem;
  font-size: 1.7rem;
  color: var(--grayColor);
  line-height: 1.5;
  vertical-align: top;
  width: 30%;
}
.product_info .organic {
  background: url("/images/product/badge-organic.jpg") no-repeat 100% 1rem;
  background-size: auto calc(100% - 1rem);
}
.product_info .eco {
  background: url("/images/product/badge-eco.jpg") no-repeat 100% 1rem;
  background-size: auto calc(100% - 1rem);
}
.product_info th {
  background: #f0f0f0;
  font-weight: bold;
  color: #444;
  width: 20%;
}
.wh_box {
  background: #fff;
  border: 1px solid var(--lightGrayColor);
}
.gr_box {
  border: 1px solid var(--lightGrayColor);
  background: var(--backgroundColor);
  color: var(--grayColor);
}
.story .photo {
  display: flex;
  justify-content: space-between;
  margin: 3.09rem 0;
}
.story .photo img {
  width: 100%;
  border: 0.08rem solid var(--lightGrayColor);
}
.story .col2.photo img {
  border: 0.08rem solid var(--lightGrayColor);
  width: calc(50% - 0.5rem) !important;
}
.intro {
  position: relative;
  color: #fff;
  margin-bottom: 3.09rem;
}
.intro img {
  width: 100%;
  display: block;
}
.intro p {
  font-size: 1.7rem;
  line-height: 1.5;
  padding-top: 1.7rem;
}
.intro .text {
  padding: 5rem 4rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
}
.intro .img:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid var(--defaultColor);
  background: rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
}
.intro h1 {
  font-size: 3.8rem;
  text-shadow: 0 0 1rem rgba(0, 0, 0, 0.11);
  color: #fff;
}
.product_spec {
  margin: 9rem auto 0;
  padding-top: 9rem;
  border-top: 1px solid var(--lightGrayColor);
  max-width: 660px;
  text-align: left;
}
.product_spec .prd_ct_title {
  margin-top: 0;
  border-top: 0;
  padding-top: 0;
}
.product_spec .spec_row {
  min-height: 16rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.product_spec .spec_row > dl {
  padding-left: 18.31rem;
}
.product_spec .spec_row .delivery,
.product_spec .spec_row .percent,
.product_spec .spec_row img {
  position: absolute;
  top: 0;
  left: 0;
  width: 16rem;
  aspect-ratio: 1/1;
  background: no-repeat 50% 50%;
  background-size: contain;
}
.product_spec .spec_row .percent {
  background-image: url("/images/product/badge-sale.jpg");
}
.product_spec .spec_row .delivery {
  background-image: url("/images/product/badge-delivery.jpg");
}
.product_spec .spec_row dl dl {
  display: none;
}
.product_spec .spec_row + .spec_row {
  margin-top: var(--defaultSpace);
}
.product_spec .gr_box {
  font-size: 1.7rem;
  padding: 1rem;
}
.product_spec .gr_box small {
  display: inline-block;
}
.product_spec .gr_box + .gr_box {
  border-top: 0;
}
.product_spec dt {
  font-weight: 900;
  font-size: 2.36rem;
  line-height: 1.6;
}
.product_spec dt + dd {
  margin-top: 1.22rem;
}
.product_spec dt .bgy {
  /* display: inline-block; */
}
.product_spec .flex {
  display: flex;
}
.product_spec .flex strong {
  white-space: nowrap;
  color: var(--grayColor);
  padding-right: 0.7rem;
}
.product_spec .ta_r {
  font-size: 1.54rem;
  text-align: right;
}
.product_spec .gr_box + .ta_r {
  padding-top: 1rem;
}
.buy_caution {
  margin: 9rem auto 0;
  border-top: 1px solid var(--lightGrayColor);
  padding: 5rem 0 9rem;
  max-width: 660px;
}
.buy_caution h3,
.prd_ct_title {
  text-align: center;
  font-weight: 900;
  font-size: 3.2rem;
  padding-bottom: 4rem;
}
.buy_caution ul {
  padding-bottom: 4.62rem;
}
.buy_caution dl {
  border-top: 1px solid var(--defaultColor);
  padding-bottom: 5rem;
}
.buy_caution h4 {
  font-weight: 900;
  font-size: 2.16rem;
  padding-bottom: 1.3rem;
}
.buy_caution dt {
  font-weight: 900;
  padding: 2rem 0 1rem;
  color: #555;
  display: block;
  font-size: 1.86rem;
  line-height: 1.3;
}
.buy_caution dd {
  text-align: left;
  font-size: 1.74rem;
  color: var(--grayColor);
}
.buy_caution li {
  position: relative;
  padding: 0 0 0.5rem 1.7rem;
  line-height: 1.3;
  text-align: left;
}
.buy_caution li:before {
  content: "-";
  position: absolute;
  top: 0;
  left: 0;
}
.buy_caution .gr_box {
  padding: 1rem;
  font-size: 1.74rem;
  text-align: left;
}
.buy_caution .gr_box li {
  font-size: 1.74rem;
  color: var(--grayColor);
  padding-bottom: 0;
}
.buy_caution .gr_box ul {
  padding: 0.5rem 0 0 0;
}
.buy_caution .tip,
.buy_caution .story .tip {
  display: block;
  padding-left: 1.3rem;
  position: relative;
}
.buy_caution .tip:before,
.buy_caution .story .tip:before {
  content: "*";
  position: absolute;
  top: 0;
  left: 0;
}
.delivery_plan .bgy {
  font-size: 2.5rem;
}
@media screen and (min-width: 720px) {
  .product_info .organic,
  .product_info .eco {
    background-size: auto calc(100% - 1rem);
  }
}

`
const guideCSS = css`
dt {
  font-weight: 900;
  font-size: 2.47rem;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
  line-height: 1.3;
  border-bottom: 1px solid #000;
  text-align: left;
}
dd {
  color: #5b5b5b;
  line-height: 1.3;
  > strong,
  .contents > strong {
    font-weight: 900;
    color: #555;
    display: block;
    font-size: 2.16rem;
    line-height: 1.3;
  }
  .contents > strong + dl dt {
    margin-top: 1rem;
  }
  dl {
    margin: 0 0 2.3rem;
  }
  dd {
    position: relative;
    padding: 0.9rem 0 0 2rem;
    font-size: 2rem;
  }
  dd:before {
    content: "-";
    position: absolute;
    top: 0.9rem;
    left: 0.38rem;
  }
  sub {
    background: rgba(0, 0, 0, 0.1);
    color: #555;
    font-size: 1.87rem;
    position: relative;
    left: 2.4rem;
  }
}
dd + dt {
  margin-top: var(--defaultSpace);
}
`