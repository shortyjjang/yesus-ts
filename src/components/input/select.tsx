/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"

export default function Select({
    options,
    color = 'transparent',
    size,
    setValue,
    className,
    inlinCSS,
    placeholder = '',
    value
}:{
    options: string[][],
    color?: string,
    size?: string,
    setValue?: (e: any) => void,
    className?: string,
    inlinCSS?: string,
    placeholder?: string,
    value?: string
}) {
  return (
    <select className={`border border-solid border-gray-300 
    ${size === 'large' ? 'py-8 pl-4 pr-20':'p-4' }
    ${className}`}
        css={css`
            background:url("/images/icon-arrow-down.svg") no-repeat ${color} calc(100% - 1.5rem) center/3rem;
            ${inlinCSS}
        `}
        value={value}
        defaultValue={placeholder ? 'all': value}
        onChange={setValue}
    >
        {placeholder && <option value="all">{placeholder}</option>}
        {options.map((item:string[]) => (
            <option key={item[1]} value={item[1]}>{item[0]}</option>
        ))}
    </select>
  )
}
