/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { filterJson } from '.'
import { useRouter } from 'next/router'

export default function SelectedFilter({
    query,
    setValue
}:{
    query: string,
    setValue: (key:string, value: string[]) => void
}) {
    const router = useRouter()
    const idx = filterJson.findIndex(filter => filter.name === `${query}CodeList`)
    const itemList = router.query[query] ? String(router.query[query]).split(',') : []
    if(!router.query[query] || filterJson.findIndex(filter => filter.name === `${query}CodeList`) < 0) return <></>
    return (
        <>
        {itemList.map((item, i) => (
            <span key={i} className="bg-white inline-flex items-center pl-5 pr-3 pt-2 rounded-lg border border-solid"
                css={css`
                    font-size:2.16rem;
                    border-color:var(--greenColor);
                    color:var(--greenColor);
                `}
                onClick={() => {
                    const queryList = String(router.query[query]).split(',')
                    queryList.splice(i, 1)
                    setValue(`${query}CodeList`, queryList)
                    let newQuery = router.query
                    queryList.length === 0 ? delete newQuery[query] : newQuery[query] = queryList.join(',')
                    router.push({
                        pathname: router.pathname,
                        query: newQuery
                    })
                }}
            >
                {filterJson[idx].option.find((filterItem) => String(filterItem.code) === item)?.caption}
                <span className='relative aspect-square w-8 ml-2 -mt-2' css={css`
                    &:before, &:after {
                        content:'';width:1px;height:100%;background-color:var(--greenColor);position:absolute;left:50%;top:50%;
                        transform:translate(-50%, -50%) rotate(45deg);
                    }
                    &:before {
                        transform:translate(-50%, -50%) rotate(-45deg);
                    }
                `}></span>
            </span>
        ))}
        </>
    )
}
