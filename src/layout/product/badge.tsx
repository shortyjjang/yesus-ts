/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"

export default function Badge({
    type,
    size = 'default'
}:{
    type: string,
    size?: string
}) {
  return (
    <small className="inline-block px-2 border border-solid uppercase" css={css`
        border-radius:0.3rem;margin:0 0.4rem 0.4rem 0;
        ${type === 'hot' && `background:#000;color:var(--pointColor);`}
        ${type === '베스트상품' && `background:var(--pointColor);border-color:var(--pointColor);`}
        ${type === '친환경' && `border-color:var(--greenColor);color:var(--greenColor);background:#fff;`}
    `}>{type}</small>
  )
}
