/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useRef, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import Script from 'next/script';
import { useMutation } from 'react-query';
import { OrderType } from '@/atom/order';
import { Api, ApiResponseType } from '@/util/api';
import axios, { AxiosError } from 'axios';
import { resolve } from 'path';


export default function NaverBtn({
  id,
  buttonCount,
  setAlert,
}:{
    id: string,
    buttonCount: number,
    setAlert: (alert:string) => void
}) {
  const naverBtn = useRef<HTMLDivElement>(null);
  const [showNaver, setShowNaver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const onClickZzim = () => {
    if(!localStorage.getItem("nZzim")) return;
    const { IMP } = window;
    IMP.naver_zzim(JSON.parse(localStorage.getItem("nZzim") || "[]"));
  }
  const createOrderNum = useMutation('createOrderNum',
    async (id:number) => {
        const orderId = await axios.post(
          `${process.env.NEXT_PUBLIC_BILLING_SERVER}/order/v1/${id}`,
          "",
          {
            headers: {
              "Site-Code": "YESUS",
            },
          }
        );
        const np: NaverPayProductType[] = JSON.parse(localStorage.getItem("nPay") || "[]");

        const totalAmount = np.reduce((acc, cur) => {
            if (cur.options) {
                return (
                acc +
                cur.options.reduce((acc, cur) => {
                    return acc + cur.optionPrice * cur.optionQuantity;
                }, 0)
                );
            } else {
                return acc + cur.basePrice * cur.quantity;
            }
        },0)
        const { IMP } = window;
        IMP.request_pay(
          {
            pg: "naverco", // PG사 (필수항목)
            pay_method: "card", // 결제수단 (필수항목)
            merchant_uid: orderId.data.content, // 주문번호 (필수항목)
            name: "anonymous", // 주문명 (필수항목)
            amount: totalAmount, // 금액 (필수항목)
            buyer_tel: "07047638287", // 구매자 전화번호 (필수항목)
            naverInterface: {
              cpaInflowCode: Cookies.get("CPAValidator")
                ? Cookies.get("CPAValidator")
                : "",
              naverInflowCode: Cookies.get("NA_CO") ? Cookies.get("NA_CO") : "",
              saClickId: Cookies.get("NVADID") ? Cookies.get("NVADID") : "",
            },
            naverProducts: JSON.parse(localStorage.getItem("nPay") || "[]"),
          }
        );
        return orderId.data.content;
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
            createOrderNum.mutate(data.content)
        },
        onError: (error: AxiosError) => {
            setAlert('네트워크 문제로 상품을 장바구니에 담을 수 없습니다.')
        }
    }
  )
  const createOrder = useMutation('createOrder', 
      async () => {
        const data: NaverPayProductType[] = JSON.parse(localStorage.getItem("nPay") || "[]");
        if(data.length < 1) {
            setAlert('잘못된 요청입니다')
            return;
        }
        let params: OrderType[] = [];
        data.forEach((product) => {
            if(product.options) {
                product.options.forEach((option) => {
                    params.push({
                        productId: product.id,
                        quantity: option.optionQuantity,
                        optionId: option.selectionCode,
                    })
                })
            }else {
                params.push({
                    productId: product.id,
                    quantity: product.quantity,
                })
            }
        })
        const response:ApiResponseType = await Api.post("/api/order/v1/billing/saveParamForPay", {
            mallId: "anonymous",
            partnerCompany: "YESUS",
            payType: "ONCE", // 정기결제:recurring, 일반 결제:once
            productList: params,
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
              if(data?.content) createOrderNum.mutate(data.content)
          },
          onError: (error: AxiosError) => {
              setAlert('네트워크 문제로 상품을 장바구니에 담을 수 없습니다.')
          }
      }
  )
  const onClickPayment = useCallback(() => {
    createOrder.mutate(JSON.parse(localStorage.getItem("nPay") || "[]"))
  },[createOrder]);
  useEffect(() => {
    setIsMobile(/Mobile/.test(navigator.userAgent));
    const loadScript = (id: string, src:string, callback:() => void) => {
        return new Promise(resolve => {
            const script = document.createElement('script');
            script.id = id;
            script.src = src;
            script.onload = () => {
                resolve(true);
                callback()
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        })
    }
    const createScript = async () => {
        await loadScript('iamport-sdk', 'https://cdn.iamport.kr/js/iamport.payment-1.1.7.js', () => {
            const { IMP } = window;
            IMP.init(`${process.env.NEXT_PUBLIC_IAMPORT_MALL_KEY}`);
        })
        await loadScript('naver-sdk', `https://pay.naver.com/customer/js/${
            isMobile ? "mobile/" : ""
        }innerNaverPayButton.js?site_preference=normal&${
            Math.round(+new Date() / 3600000)
        }`, () => {
            const { naver } = window;
            if(naver) naver.NaverPayButton.apply({
                BUTTON_KEY: `${process.env.NEXT_PUBLIC_NAVER_PAY_BUTTON_KEY}`,
                TYPE: `${/Mobile/.test(navigator.userAgent) ? "M" : ""}A`, //버튼 스타일
                COLOR: 1, //버튼 색상타입
                COUNT: buttonCount, // 네이버페이버튼 + 찜하기버튼 모두 출력 여부
                ENABLE: "Y", //네이버페이 활성여부(재고부족 등에는 N으로 비활성처리)
                EMBED_ID: id, //네이버페이 버튼 UI가 부착될 HTML element의 ID
                BUY_BUTTON_HANDLER: onClickPayment,
                WISHLIST_BUTTON_HANDLER: onClickZzim,
            });
        })
    }
    createScript()

    return () => {
        const naverPay = document.getElementById("naver-sdk");
        if(naverPay) naverPay.remove();

        const iamport = document.getElementById("iamport-sdk");
        if(iamport) iamport.remove();
    }
  }, [buttonCount, id, isMobile, onClickPayment]);
  return (
    <>
        <div id={id} ref={naverBtn} css={css`
            background: #fff;
            box-shadow: inset 0 2px 0 #000;
            display: flex;
            justify-content: center;
        `}></div>
      
      <style jsx>{`
        @import url("https://img.pay.naver.net/static/css/button/${isMobile
          ? "m"
          : ""}button2.css");
      `}</style>
    </>
  );
}

export type NaverShippingParams = {
    groupId: string,
    baseFee: number,
    method: "DELIVERY" | "VISIT",
    feeType: "FREE" | "CHARGE",
    feePayType: "FREE" | "PREPAYED",
    feeRule?: {
        repeatByQty: number
    }
}
export type NaverPayOptionType = {
    optionQuantity: number,
    optionPrice: number,
    selectionCode: string
    selections: {
        code: string,
        label: string,
        value: string,
    }[]
}
export type NaverPayProductType = {
    id: string,
    name: string,
    basePrice: number,
    taxType: "TAX" | "TAX_FREE",
    quantity: number,
    infoUrl: string,
    imageUrl: string,
    shipping: NaverShippingParams,
    options?: NaverPayOptionType[]
}