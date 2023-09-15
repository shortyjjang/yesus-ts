/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { userInfo } from '@/atom/user';
import Link from 'next/link';
import { useState } from 'react'
import { useRecoilValue } from 'recoil';
import { mobileWidth } from "@/layout/header";
import Container from "@/layout/container";
import SubMenu from "@/layout/header/submenu";

export const menus = [
    {
        title: 'ABOUT US',
        link: '/yes2020',
        children: [
            ['YES2020','/yes2020'],
            ['WE SAVE #농가', '/wesave/farm'],
            ['WE SAVE #지구', '/wesave/earth'],
            ['ESG 문의', '/esg']
        ]
    },
    {
        title: '어스박스',
        link: '/product',
    },
    {
        title: '단품',
        link: '/product',
    },
    {
        title: '레시피',
        link: '/recipes',
        children: [
            ['레시피 모두보기','/recipes'],
            ['나만의 레시피', '/recipes/my']
        ],
        show: 'user'
    },
    {
        title: '구매후기',
        link: '/review',
    },
    {
        title: '예스어스 소식',
        link: '/notice',
        children: [
            ['공지사항','/notice'],
            ['자주묻는질문', '/faq'],
            ['블로그', '/blog']
        ]
    },
    {
        title: '먹비티아이',
        link: '/mukvti',
    },
    {
        title: '어스박스 이용 가이드',
        link: '/usbox/guide',
    },
]

export default function Navigation({
    headerH,
    open,
    setOpen
}:{
    headerH: number,
    open: boolean,
    setOpen: (open: boolean) => void
}) {
    const user = useRecoilValue(userInfo);
    const topMenu = [
        menus[0],
        menus[1],
        menus[2],
        menus[3],
        menus[6],
    ]
    return (
        <Container className="relative">
            <nav css={css`
                padding-left:10.25rem;font-size:var(--defaultSpace);
                @media (max-width: ${mobileWidth}px) {padding-left:8rem;padding-right:0;}
            `}>
                <button onClick={() => setOpen(!open)} className='w-28 h-28 absolute top-0 left-0 border-solid border-black border-0 flex items-center justify-center' css={css`
                    border-right-width:1px;
                    @media (min-width: 1020px) {
                        border-width:0 1px;
                    }
                `}><span className="h-10 w-12 border-solid border-t border-b border-black relative" css={css`
                    text-indent:-1000em;
                    &:before {content:'';position:absolute;top:50%;left:0;height:1px;width:100%;background:#000;margin-top:-1px;}
                `}>메뉴{open ? '접기':'펼쳐보기'}</span></button>
                <ul className="flex justify-center whitespace-nowrap" css={css`
                    li {
                        width:100%;position:relative;
                        > a, > span {display:flex;height:7rem; align-items:center;justify-content:center;padding:0 3.75rem;}
                    }
                    @media (min-width: ${mobileWidth}px) {
                        li {
                            width:auto;
                            &:hover {
                                > a, > span {color:var(--greenColor);}
                                > div {
                                    display:block;
                                }
                            }
                        }
                    }
                `}>
                    {topMenu.map((menu) => (
                        <li key={menu.title} css={css`
                            @media (max-width: ${mobileWidth}px) {
                                ${ menu.title === 'ABOUT US' || menu.title === '먹비티아이' ? 'display:none;':''}
                            }
                        `}>
                            {menu.children && (!menu.show || (menu.show && user.username)) ? <SubMenu type="header"
                            setOpen={setOpen}
                            parent={[
                                menu.title,
                                menu.link
                            ]} submenus={menu.children} />
                            : <Link href={menu.link} onClick={() => setOpen(false)}>{menu.title}</Link>}
                        </li>
                    ))}
                </ul>
            </nav>
            {open && <nav className="left-0 w-full border-t border-solid border-black" css={css`
                position:fixed;top:${headerH ? `${headerH}px` :'16rem'};
                height:calc(100% - ${headerH ? `${headerH}px` :'16rem'});
                background:var(--backgroundColor);color:#525252;
      
                li {
                    > a, > span {height:6.5rem;padding:0 var(--defaultSpace);display:flex;align-items:center;}
                    + li {border-top:var(--lightGrayColor) 1px solid;}
                }
                @media (min-width: ${mobileWidth}px) {
                    position:absolute;width:auto;top:100%;height:auto;border: 1px solid var(--lightGrayColor);border-top-color:var(--defaultColor);
                    background:var(--backgroundColor);color:#525252;
                    li {
                        > a, > span {
                            height:5rem;font-size:1.85rem;
                            &:after {transform:rotate(-90deg) translate(50%, 50%)}
                        }
                        &:first-of-type > div {border-top-color:var(--defaultColor)}
                        > div {
                            display:none;padding:1.54rem 0;border:1px solid var(--lightGrayColor);
                            a {
                                font-size: 1.85rem;
                                height: 4.375rem;
                                &:hover {color:var(--defaultColor);text-decoration:underline;}
                            }
                        }
                        &:hover {
                            > a, > span {color:var(--greenColor);}
                            > span {
                                position:relative;z-index:1;
                                &:before {position:absolute;left:100%;top:0;height:100%;width:1px;background:#fff;content:'';}
                            }
                            > div {display:block;}
                        }
                    }
                }
            `}>
                <ul>
                    {menus.map((menu) => <li key={menu.title} css={css``} className="relative">
                        {menu.children && (!menu.show || (menu.show && user.username)) 
                        ? <SubMenu type="sidebar"
                        parent={[
                            menu.title,
                            menu.link
                        ]} submenus={menu.children} setOpen={setOpen} />
                        : <Link href={menu.link} onClick={() => setOpen(!open)}>{menu.title}</Link>}
                    </li>)}
                </ul>
            </nav>}
        </Container>
    )
}