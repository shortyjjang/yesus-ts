/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import Container from "@/layout/container"
import Link from "next/link"
import { mobileWidth } from "@/layout/header"
import { userInfo } from "@/atom/user"
import { useRecoilValue } from "recoil"
import { useRouter } from "next/router"
import { ReactNode, useState } from "react"
import Confirm from "@/components/confirm"

export default function Footer() {
    const user = useRecoilValue(userInfo)
    const router = useRouter()
    const [showAlert, setShowAlert] = useState<ReactNode | null>(null)
    return (
        <footer className="relative border-t border-solid bg-white" css={css`
            border-color:var(--lightGrayColor);
        `}>
            <Container className="py-20" css={css`
                @media (min-width: ${mobileWidth}px) {
                    display:flex;padding-bottom:12rem;
                }
            `}>
                <div css={css`
                    @media (min-width: ${mobileWidth}px) {width:40rem;}
                `}>
                    <h5 css={css`color:var(--grayColor);`}>고객센터</h5>
                    <div className="font-bold flex flex-col" css={css`font-size:3rem;`}>
                        <button 
                            onClick={() => user && user.username 
                                ? router.push('/qna')
                                : setShowAlert(<Confirm 
                                    onClose={() => setShowAlert(null)}
                                    onSuccess={() => router.push('/login?returnUrl=/qna')}
                                    >
                                    <p>로그인 후 이용 가능합니다.</p>
                                </Confirm>)
                            }
                            className="text-left"
                            css={css`font-size:3rem;`}
                        >
                            1:1 문의
                        </button>
                        <Link href="/faq">자주 묻는 질문</Link>
                        <a href="tel:07047638287">070-4763-8287</a>
                    </div>
                    <p css={css`
                        @media (min-width: ${mobileWidth}px) {font-size:1.5rem;}
                    `}>평일 10:00 - 18:00 (점심 12:00 - 13:00)<br />토요일, 일요일, 공휴일 휴무</p>
                </div>
                <div>
                    <ul className="flex mt-8 mb-4" css={css`
                        color:var(--grayColor);font-size:var(--defaultSpace);
                        a {
                            display:block;padding:0 2rem;position:relative;
                        }
                        li{
                            +li a:before {content: "";
                            width: 1px;
                            position: absolute;left:0;top:50%;transform:translateY(-50%);
                            background: var(--grayColor);
                            height: 1.5rem;}
                            &:first-of-type a {padding-left:0;}
                        }
                        @media (min-width: ${mobileWidth}px) {margin-top:0;font-size:1.86rem;}
                    `}>
                        <li><Link href="/terms/agreement">이용약관</Link></li>
                        <li><Link href="/terms/privacy">개인정보처리방침</Link></li>
                        <li><Link href="/terms/guide">이용안내</Link></li>
                    </ul>
                    <ul css={css`
                        li {display:inline-block;margin-right:0.5rem;}
                        @media (min-width: ${mobileWidth}px) {
                            li {display:block;font-size:1.5rem;}
                        }
                    `}>
                        <li>상호: 예스어스 대표자: 정한석</li>
                        <li>사업자등록번호: 273-85-01735 [<a href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=2738501735" target="_blank" rel="noreferrer">사업자정보확인</a>]</li>
                        <li>통신판매업: 2021-성남분당C-1220</li>
                        <li>주소: 05855 서울특별시 송파구 법원로8길 7 (문정동) 화엄타워 5층</li>
                        <li>개인정보보호책임자: 김진환 (<a href="mailto:redwolf@a2dcorp.co.kr">redwolf@a2dcorp.co.kr</a>)</li>
                        <li>이메일: <a href="mailto:g9intable@a2dcorp.co.kr">g9intable@a2dcorp.co.kr</a></li>
                    </ul>
                    <div css={css`
                        @media (min-width: ${mobileWidth}px) {
                            position:absolute;bottom:0;left:0;font-size:1.5rem;width:100%;border-top:1px solid var(--lightGrayColor);text-align:center;padding:3rem 0;
                        }
                    `}>Copyright ©예스어스 All rights reserved.</div>
                    <div className="flex gap-4 mt-10" css={css`
                        a {
                            display: inline-block;
                            width: 3.85rem;
                            height: 3.85rem;
                            text-indent: -1000em;
                            overflow: hidden;
                            white-space: nowrap;
                            background-repeat: no-repeat;
                            background-size: cover;
                        }
                    `}>
                        <a href="https://www.instagram.com/yes_earth/" rel="noreferrer" target="_blank" css={css`
                            background-image: url(/images/ic-instagram.svg);
                        `}>인스타그램</a>
                        <a href="https://pf.kakao.com/_jxmxkys" rel="noreferrer" target="_blank" css={css`
                            background-image: url(/images/login_kakao.png);
                        `}>카카오톡 채널</a>
                    </div>

                </div>
            </Container>
            {showAlert && showAlert}
        </footer>
    )
}
