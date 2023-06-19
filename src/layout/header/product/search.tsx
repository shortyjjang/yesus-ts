/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { useForm } from 'react-hook-form'

export default function SearchKeyword({
    setKeyword
} : {
    setKeyword: (keyword: string) => void
}) {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            keyword: ''
        }
    })
    return(
        <form onSubmit={handleSubmit((data) => setKeyword(data.keyword))} className="relative mb-14">
            <input type="text" {...register('keyword')} 
            placeholder="검색어를 입력해주세요."
            className="bg-white px-6 py-8 w-full border-b border-solid border-black" css={css`
                font-size:var(--defaultSpace);
            `} />
            <button type="submit" className="absolute top-0 right-0 h-full aspect-square" css={css`
                background: url(/images/icon-search.svg) no-repeat center/4rem;
                text-indent:-9999px;
            `}>검색</button>
        </form>
    )
}