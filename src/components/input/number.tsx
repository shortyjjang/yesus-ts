/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRef } from 'react';
import { set } from 'react-hook-form';

export default function InputNumber({
    value,
    setValue,
    inineCSS,
    className,
    max = undefined
}:{
    value: number,
    setValue: (value:number) => void,
    inineCSS?: string,
    className?: string,
    max?: number,
}) {
    const numberContainer = useRef<HTMLDivElement>(null);
  return (
    <div
        className={`inline-flex border border-solid border-gray-300 bg-white ${className}`}
        css={css`
            input, button {text-align:center;height:100%}
            input {width:100%;max-width:calc(100% - ${(numberContainer.current?.clientHeight || 0) * 2}px);}
            ${inineCSS}
        `}
        ref={numberContainer}
    >
        <button
            className="aspect-square minus"
            onClick={() => setValue(value - 1)}
            disabled={value === 1}
        >
        -
        </button>
        <input
            type="number"
            value={value}
            onChange={(e) => {
                setValue(Number(e.target.value))
            }}
            min={1}
            max={max}
            className='border-solid border-gray-300 border-r border-l'
        />
        <button
            className="aspect-square plus"
            onClick={() => setValue(value + 1)}
            disabled={value === max}
        >
        +
        </button>
    </div>
  )
}
