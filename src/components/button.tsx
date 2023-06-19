
/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"

export default function Button({
    children,
    className,
    inlineCSS,
    size = 'md',
    type = 'button',
    styleType = 'default',
    onClick,
}:{
    children: React.ReactNode
    className?: string
    inlineCSS?: string
    styleType?: 'default' | 'primary' | 'secondary' | 'danger' | 'dimmend'
    type?: 'button' | 'submit' | 'reset'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    onClick?: () => void
}) {
    const sizeStyle = (size:string) => {
        switch(size) {
            case 'sm': return `
                font-size:1.5rem;
                padding:1.24rem 1.54rem;
            `
            case 'lg': return `
                font-size:1.875rem;
                padding:1.875rem 2.5rem;
            `
            case 'xl': return `
                font-size:1.875rem;
                padding:2rem 2.5rem;
            `
            default: return `
                font-size:1.75rem;
                padding:1.54rem 2.03rem;
            `
        }
    }
    const btnStyle = (style:string) => {
        switch(style) {
            case 'dimmend': return `
                background:var(--backgroundColor);
                color:var(--defaultColor);
                border-color:var(--lightGrayColor);
            `
            case 'secondary': return `
                background:var(--defaultColor);
                color:#fff;
                border-color:var(--defaultColor);
            `
            case 'primary': return `
                background:var(--pointColor);
                color:var(--defaultColor);
                border-color:var(--defaultColor);
            `
            default: return `
                background:#fff;
                color:var(--defaultColor);
                border-color:var(--defaultColor);
            `
        }
    }
  return (
    <button className={`
        border border-solid font-bold
        ${className}
    `} onClick={onClick} css={css`
        ${sizeStyle(size)}
        ${btnStyle(styleType)}
        ${inlineCSS}
    `}>
        {children}
    </button>
  )
}
