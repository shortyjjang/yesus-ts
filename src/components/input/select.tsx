/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"

export default function Select({
    options,
    color = 'transparent',
    size,
    setValue,
    className,
    inlinCSS,
    placeholder = false,
    value
}:{
    options: string[][],
    color?: string,
    size?: string,
    setValue?: (e: any) => void,
    className?: string,
    inlinCSS?: string,
    placeholder?: boolean,
    value?: string
}) {
  return (
    <select className={`border border-solid border-gray-300 py-8 pl-4 pr-20 ${className}`}
        css={css`
            background:url("/images/icon-arrow-down.svg") no-repeat ${color} calc(100% - 1.5rem) center/3rem;
            ${inlinCSS}
        `}
    >
        {placeholder && <option value="">선택하세요</option>}
        {options.map((item:string[]) => (
            <option key={item[1]} value={item[1]} selected={value === item[1]}>{item[0]}</option>
        ))}
    </select>
  )
}
