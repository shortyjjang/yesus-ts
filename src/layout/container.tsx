/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"

export default function Container({
    children,
    className,
    inlineCSS
}:{
    children: React.ReactNode
    inlineCSS?: string
    className?: string
}) {
  return (
    <div className={`max-w-[1020px] mx-auto px-10 ${className}`} css={css`
        ${inlineCSS}
    `}>
        {children}
    </div>
  )
}
