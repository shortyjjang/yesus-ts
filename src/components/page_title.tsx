/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"



export default function PageTitle({
    title,
    className,
    inlineCSS
}:{
    title:string
    className?: string
    inlineCSS?: string
}) {
  return (
    <h2 className={`font-extrabold text-center ${className}`}
        css={css`
            padding: 6rem 0 4.7rem;
            font-size: 3.39rem;
            ${inlineCSS}
        `}
    >
        {title}
    </h2>
  )
}
