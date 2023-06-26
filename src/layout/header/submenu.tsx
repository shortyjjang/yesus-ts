/** @jsxImportSource @emotion/react */

import { mobileWidth } from "@/layout/header";
import { css } from "@emotion/react"
import Link from "next/link";
import { useState } from "react";

export default function SubMenu({
    submenus,
    parent,
    type
}:{
    type: string,
    submenus?: string[][],
    parent: string[]
})  {
    const [toggle, setToggle] = useState(type === 'header' ? false : true);
    return(
        <>
            {type === 'header' && <Link href={parent[1]} css={css`@media (max-width: ${mobileWidth}px) {display:none !important;}`}>{parent[0]}</Link>}
            <span className="w-full cursor-pointer" onClick={() => setToggle(!toggle)} css={css`
                ${type === 'header' ? `@media (min-width: ${mobileWidth}px) {display:none !important;}`:`
                    position:relative;
                    &:after {
                        content: "";
                        position: absolute;
                        top: 50%;
                        right: var(--defaultSpace);
                        transform: translateY(-50%) rotate(${toggle ? '180deg' : '0deg'});
                        background: url(/images/icon-arrow-down.svg) no-repeat;
                        width: 2rem;
                        height: 2rem;
                        background-size: contain;
                        transition: transform 0.3s ease-in-out;
                    }
                `}
            `}>{parent[0]}</span>
            <div className={`
                ${toggle ? 'block': 'hidden'}
                ${type === 'header'?`
                    absolute top-full left-1/2 min-w-full bg-white border border-solid py-6 -translate-x-1/2 
                `:`
                    bg-white border-t border-solid
                `}
            `} css={css`
                ${type === 'header' ? `
                border-color:var(--defaultColor) var(--lightGrayColor) var(--lightGrayColor);
                @media (max-width: ${mobileWidth}px) {
                    left:auto;right:0;transform:none;
                }`:`
                border-color:var(--lightGrayColor);
                padding:1.54rem 0;
                @media (min-width: ${mobileWidth}px) {
                    position:absolute;left:100%;white-space:nowrap;top:-1px;
                }
            `}
            `}>
                {submenus && submenus.map((menu) => (
                    <Link className={`flex items-center ${type === 'header' ? "justify-center h-20":"w-full"}`} href={menu[1]} key={menu[0]} css={css`
                        padding:0 var(--defaultSpace);
                        ${type === 'header' ? `
                        color:var(--grayColor);
                        @media (min-width: ${mobileWidth}px) {
                            font-size:1.85rem;height:4.25rem;
                            &:hover {color:var(--greenColor)}
                        }`
                        :`
                        font-size:2.31rem;height:5.5rem;
                        `}
                    `}>{menu[0]}</Link>
                ))}
            </div>
        </>
    )
}