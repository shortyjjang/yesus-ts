/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import Image from "next/image"
import Link from "next/link"
import Container from "@/layout/container"
import UserMenu from "@/layout/header/usermenu"
import Navigation from "@/layout/header/navigation"
import { useEffect, useRef, useState } from "react"
export const mobileWidth = 750

export default function Header() {
    const header = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    return (
        <header ref={header} className="fixed top-0 left-0 w-full z-10 border-b border-solid border-black" css={css`
            background:var(--backgroundColor);
        `}>
            <Container className="flex items-center justify-between relative" inlineCSS={`
                height:9rem;
                @media (min-width: ${mobileWidth}px) {
                    height:10rem;
                    justify-content:flex-end;
                }
            `}>
                <h1 css={css`
                    width: 13.39rem;
                    height: 3.616rem;
                `}>
                    <Link href="/" scroll={true} className="relative flex w-full h-full" css={css`
                        @media (min-width: ${mobileWidth}px) {
                            position:absolute;top:50%;left:50%;
                            transform:translate(-50%,-50%);
                            width: 13.39rem;
                            height: 3.616rem;
                        }
                    `}>
                        <Image
                        src="/images/logo.png"
                        alt="YES-US"
                        fill={true}
                        className="absolute w-full h-full top-0 left-0 object-contain"
                        priority={true}
                        />
                    </Link>
                </h1>
                <UserMenu />
            </Container>
            <hr className="border-t border-black" />
            <Navigation headerH={header?.current?.clientHeight || 0} open={open} setOpen={setOpen}/>
        </header>
    )
}
