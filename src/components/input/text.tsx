/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"

export default function InputText({
    register,
    placeholder,
    className,
    inlineCSS,
    size = 'default',
    type = 'text'
}:{
    register: any
    placeholder?: string
    className?: string
    inlineCSS?: string
    size?: 'default' | 'small' | 'large'
    type?: string
}) {
  return (
    <input
        className={`w-full max-full border border-solid bg-white ${className}`}
        css={css`
            border-color:var(--lightGrayColor);
            padding: ${size === 'large' ? '0.75rem 1.5rem' : '2rem 2.5rem'};
            ${inlineCSS}
        `}
        type={type}
        {...register}
        placeholder={placeholder || undefined}
        autoComplete={`new-_${register.name}`}
    />
  )
}
