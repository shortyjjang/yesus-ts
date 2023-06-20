/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Confirm from '@/components/confirm'
import { Api, ApiResponseType } from '@/util/api'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { OptionItemType, ProductResponseType } from './detail'
import { price } from '@/util/price';
import Button from '@/components/button';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { CartOptionType, CartType, cartList } from '@/atom/cart';
import { userInfo } from '@/atom/user';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { OrderType, orderList } from '@/atom/order';
import { useRouter } from 'next/router';
import NaverBtn, { NaverPayProductType, NaverShippingParams } from '@/components/npay';
import InputNumber from '@/components/input/number';



export default function InCart({
    post,
    setAlert
}:{
    post: ProductResponseType
    setAlert: (alert: string | null) => void
}) {
    const user = useRecoilValue(userInfo)
    const [cart, setCart] = useRecoilState(cartList);
    const setOrder = useSetRecoilState(orderList);
    const router = useRouter();
    const [optionStatus, setOptionStatus] = useState<string[]>(() => post.optionGroups ? post.optionGroups.map(intial => ''):[])
    const [selectedOptions, setSelectedOptions] = useState<OptionsType[]>([])
    const [totalQuantity, setTotalQuantity] = useState<number>(() => post.optionUseYn === 'Y' ? 0 : 1)

    const updateCart = useMutation('updateCart', 
        async (params: CartType) => {
            const response:ApiResponseType = await Api.post("/api/cart/v1", params, {
                headers: { Authorization: Cookies.get("accessToken") },
            });
            return response;
        },
        {
            onMutate: (variables) => {
                // A mutation is about to happen!
                console.log(variables)
            },
            onSuccess: (data, variables) => {
                if (data?.meta?.resultMsg) {
                  setAlert(data.meta.resultMsg);
                  return;
                }
                setCart([...cart, variables])
                setSelectedOptions([])
                setOptionStatus(post.optionGroups ? post.optionGroups.map(intial => ''): [])
            },
            onError: (error: AxiosError) => {
                setAlert('네트워크 문제로 상품을 장바구니에 담을 수 없습니다.')
            }
        }
    )
    const orderItems = () => {
        if(!user.username) {
            setAlert('로그인하시겠습니까?\n로그인 후 구매가 가능합니다.')
            return;
        }
        const params: OrderType[] = selectedOptions.map(option => ({
            productId: post.productId,
            quantity: option.quantity,
            optionId: option.ponId,
            payType: "once",
        }))
        setSelectedOptions([])
        setOptionStatus(post.optionGroups ? post.optionGroups.map(intial => ''): [])
        setOrder(params)
        router.push('/order/billing')
        return;
    }
    const addCart = () => {
        const options:CartOptionType[] = post.optionUseYn === 'Y' ? selectedOptions.map(option => ({
            cartOrderCnt: option.quantity,
            ponId: Number(option.ponId),
            promotionNo: 0
        })):[{
            cartOrderCnt: totalQuantity,
            promotionNo: 0
        }]
        if(cart.find(item => 
            item.productId === post.productId 
            && (
                post.optionUseYn === 'N' || 
                (post.optionUseYn === 'Y' && options.find(option => option.ponId === item.cartDetailOptions.find(cartOption => cartOption.ponId === option.ponId)?.ponId))
            )
        )) {
            setAlert('이미 장바구니에 담긴 상품이 있습니다.')
        }
        const params:CartType = {
            "cartDetailOptions": options,
            "productId": post.productId,
            "customerMallId": user.username
        }
        if(user.username) {
            updateCart.mutate(params);
            return;
        }
        setCart([...cart, params])
        setSelectedOptions([])
        setOptionStatus(post.optionGroups ? post.optionGroups.map(intial => ''): [])
    }
    useEffect(() => {
        if(user.username) return;
        localStorage.setItem('nZzim', JSON.stringify([{
            id: post.productId,
            name: post.productName,
            desc: post.productSummaryDesc
              ? post.productSummaryDesc
              : "",
            uprice: post.productSalePrice, //상품가격
            url: `${process.env.NEXT_PUBLIC_URL}/product/${post.productId}`,
            thumb: post.productImageList[0].productImageFullPath,
            image: post.productImageList[0].productImageFullPath,
        }]))
        let shipping:NaverShippingParams = {
          groupId: `whId-${post.whId}`,
          baseFee: post.productShippingPrice,
          method: "DELIVERY",
          feeType: "FREE",
          feePayType: "PREPAYED",
        };
        if (post.productShippingPrice > 0) {
          shipping = {
            ...shipping,
            feeType: "CHARGE",
            feePayType: "PREPAYED",
          };
        }
        if (post.productShippingChargeType === "개별배송") {
          shipping = {
            ...shipping,
            feeRule: {
              repeatByQty: 1,
            },
          };
        }
        let np: NaverPayProductType = {
          id: post.productId, //선택된 옵션이 없는 상품
          name: post.productName,
          basePrice: post.productSalePrice,
          taxType: "TAX", //TAX or TAX_FREE
          quantity: totalQuantity,
          infoUrl: `${origin}/product/${post.productId}`,
          imageUrl: post.productImageList[0].productImageFullPath,
          shipping: shipping,
        };
        if (post.optionUseYn === "Y")
          np = {
            ...np,
            options: [],
          };
        localStorage.setItem("nPay", JSON.stringify([np]));
    })
    return (
        <div>
            {post.optionUseYn === 'Y' && post.optionGroups && post.optionGroups.length > 0 && post.options && post.options.length > 0 && (
            // 옵션이 있는 상품
                <>
                {/* 옵션 선택 */}
                {post.optionGroups.map((optionGroup, index) => (
                    <div key={optionGroup.optionGroupId}>
                        {optionGroup.children && <select 
                        className={`block border w-full border-solid border-gray-300 py-8 pl-4 pr-20 mb-10`}
                        css={css`
                            background:url("/images/icon-arrow-down.svg") no-repeat calc(100% - 1.5rem) center/3rem;
                        `}
                        value={optionStatus[index]}
                        onChange={(e) => {
                            const option = post.options.find(opt => opt.ponId === e.target.value)
                            if(!option) return;
                            if(selectedOptions.find(opt => opt.ponId === option.ponId)) {
                                setAlert('이미 선택된 옵션입니다.')
                                return;
                            }
                            let newOptionStatus = [...optionStatus]
                            newOptionStatus[index] = option.ponId
                            setOptionStatus(newOptionStatus)
                            if(index < newOptionStatus.length - 1) return;
                            const newSelectedOptions = [
                                ...selectedOptions,
                                {
                                    ...option,
                                    quantity: 1
                                }
                            ]
                            setSelectedOptions(newSelectedOptions)
                            if(user.username) return;
                            const np = JSON.parse(localStorage.getItem('nPay') || '[]')
                            np[0].quantity = newSelectedOptions.reduce((acc, cur) => acc + cur.quantity, 0)
                            np[0].options = newSelectedOptions.map((opt) => ({
                                  optionQuantity: opt.quantity,
                                  optionPrice: opt.addPrice,
                                  selectionCode: opt.ponId,
                                  selections: [
                                    {
                                      code: opt.ponId,
                                      label: "사이즈",
                                      value: opt.optionName,
                                    },
                                  ],
                            }))
                            localStorage.setItem('nPay', JSON.stringify(np))
                        }}>
                            <option>{post.optionGroups && post.optionGroups.length > 1 ? optionGroup.optionGroupName: '옵션'}</option>
                            {optionGroup.children.map((group) => {
                                const option = post.options.find(opt => opt.optionGroupTemplatePath === String(group.optionTemplateId))
                                if(!option) return <></>;
                                return <option key={option.ponId} value={option.ponId}>{option.optionName}</option>
                            })}
                        </select>}
                    </div>
                ))}
                
                {/* 선택한 상품 리스트 */}
                {selectedOptions.map((option, index) => (
                    <div key={option.ponId} className='flex justify-between'>
                        <span>{option.optionName}</span>
                        <div className='flex gap-4'>
                            <InputNumber value={option.quantity} setValue={(value) => {
                                    const newOptions = [...selectedOptions]
                                    newOptions[index].quantity = value
                                    setSelectedOptions(newOptions)
                                    const np = JSON.parse(localStorage.getItem('nPay') || '[]')
                                    np[0].options[index].optionQuantity = value
                                }}
                            />
                            <span>{price(option.salePrice * option.quantity)}</span>
                            <button 
                                onClick={() => setSelectedOptions(selectedOptions.filter(opt => opt.ponId !== option.ponId))}
                            >삭제</button>
                        </div>
                    </div>
                ))}
                {selectedOptions.length > 0 && <div className='text-right'>
                    <b>{price(selectedOptions.reduce((acc, cur) => acc + (cur.salePrice * cur.quantity), 0))}</b>
                    ({selectedOptions.reduce((acc, cur) => acc + cur.quantity, 0)}개)
                </div>}
                </>
            )}
            {post.optionUseYn === 'N' && (
            // 옵션이 없는 상품
                <InputNumber value={totalQuantity} 
                    className='w-full h-20 mb-10'
                    setValue={(value) => {
                        setTotalQuantity(value)
                        if(user.username) return;
                        const np = JSON.parse(localStorage.getItem('nPay') || '[]')
                        np[0].quantity = value
                        localStorage.setItem('nPay', JSON.stringify(np))
                    }} 
                />
            )}
            {/* 비회원일 경우 네이버 버튼 노출 */}
            {!user.username && <NaverBtn id="naver-pay-button" buttonCount={2} setAlert={setAlert} />}

            <div className='flex gap-4'>
                <Button onClick={addCart} className='w-full'>장바구니</Button>
                <Button styleType='primary' onClick={orderItems} className='w-full'>구매하기</Button>
            </div>
        </div>
    )
}

interface OptionsType extends OptionItemType {
    quantity: number
}