/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"

import { userInfo } from "@/atom/user";
import { cartList } from "@/atom/cart";
import Link from "next/link"
import { useRecoilState, useRecoilValue } from "recoil";
import { mobileWidth } from "@/layout/header";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { getaccessToken } from "@/util/get_token";


export default function UserMenu() {
    const [user, setUser] = useRecoilState(userInfo)
    const cart = useRecoilValue(cartList)
    useEffect(() => {
        const getToken = async () => {
            const request = await getaccessToken()
            setUser(request)
        }
        if (Cookies.get('access_token') && !user.username) {
            getToken()
        }
    },[setUser, user.username])
    return (
        <nav className="flex items-center" css={css`
            li {position:relative;}
            @media (min-width: ${mobileWidth}px) {
                li+li:before {
                    content: "";
                    position: absolute;
                    top: 50%;
                    left: 0;
                    width: 1px;
                    height: 1.875rem;
                    transform: translateY(-50%);
                    background: #5e5e5e;
                    margin-top:0.2rem;
                }
                li a {padding:0 2rem;}
            }
            @media (max-width: ${mobileWidth}px) {
                margin-right:-2.5rem;
            }
        `}>
            {(user.username || Cookies.get('access_token'))
            ? <ul className="flex items-center">
                <li css={css`
                    @media (max-width: ${mobileWidth}px) {
                        display:none;
                    }
                `}><Link href="/logout">로그아웃</Link></li>
                <UserButton title="마이페이지" href="/mypage" color={true} />
            </ul>
            : <ul className="flex items-center">
                <li css={css`
                    @media (max-width: ${mobileWidth}px) {
                        display:none;
                    }
                `}><Link href="/member/join" css={css`color:var(--greenColor);`}>회원가입</Link></li>
                <UserButton title="로그인" href="/login" />
            </ul>}
            <div><Link href="/cart" css={css`
                width:9rem;
                height:9rem;
                padding:1.5rem;
                display:flex;justify-content:flex-end;align-items:flex-start;
                background:url('/images/icon-cart.svg') no-repeat center;
                background-size:4.4rem auto;
            `}><span css={css`display:inline-block;text-indent:-9999px;`}>장바구니</span><span css={css`
                min-width: 2.61rem;
                min-height: 2.61rem;
                line-height: 2.4rem;
                border-radius: 1.31rem;
                font-size: 1.7rem;
                background:var(--pointColor);
                text-align:center;
            `}>{cart.length > 0 ? cart.reduce((a,b) => {
                return a + b.cartDetailOptions.reduce((c,d) => c+d.cartOrderCnt,0)
            },0): 0}</span></Link></div>
        </nav>
    )
}

function UserButton({title, href, color = false}:{title: string, href: string, color?: boolean}) {
    return (
        <li><Link href={href} className="w-full px-7" css={css`
            ${color ? 'color:var(--greenColor);':''}
            @media (max-width: ${mobileWidth}px) {
                width:9rem;margin-right:-2rem;
                height:9rem;
                text-indent:-9999px;padding:0;
                background:url('/images/icon-user.svg') no-repeat center;
                background-size:4.4rem auto;
                display:block;
            }
        `}>{title}</Link></li>
    )
}