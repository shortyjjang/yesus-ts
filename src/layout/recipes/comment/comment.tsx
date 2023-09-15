/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { userInfo } from '@/atom/user'
import AddComment, { returnTime } from '@/layout/board/post/comment/add'
import { Api, ApiResponseType } from '@/util/api'
import Cookies from 'js-cookie'
import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'
import Button from "@/layout/button"
import Image from "next/image"

export default function RecipecommentItem({
    rcsId,
    customerName,
    customerMallId,
    mukTypeMobileThumbnailImagePath,
    badCount,
    goodCount,
    rcsScore,
    description,
    createTime,
    loginUserPreferType,
    setAlert,
    refetch,
    setEdit
}:{
    rcsId: number,
    customerName: string,
    customerMallId: string,
    mukTypeMobileThumbnailImagePath:string,
    badCount: string,
    goodCount: string,
    rcsScore: string,
    description: string,
    createTime: string,
    loginUserPreferType: string
    setAlert: (msg: string) => void
    refetch: () => void
    setEdit: (edit: boolean) => void
}) {
    const user = useRecoilValue(userInfo)
    return (
        <div className="py-8 border-t border-solid border-gray-300 grid gap-8" css={css`
        grid-template-columns: 7.25rem auto;
        `}>
            <div className="aspect-square relative rounded-full border border-solid w-full overflow-hidden" css={css`
                border-radius:100%;
            `}><Image 
                src={`${process.env.NEXT_PUBLIC_IMG_SERVER}/${mukTypeMobileThumbnailImagePath}`} 
                alt={customerName}
                fill={true}
                priority={true}
                className="object-cover"
            /></div>
            <div>
                <b css={css`font-size:var(--defaultSpace);`}>
                    {String(rcsScore) === '5' && <span>★★★★★</span>}
                    {String(rcsScore) === '4' && <span>★★★★☆</span>}
                    {String(rcsScore) === '3' && <span>★★★☆☆</span>}
                    {String(rcsScore) === '2' && <span>★★☆☆☆</span>}
                    {String(rcsScore) === '1' && <span>★☆☆☆☆</span>}
                    {" "}
                    {customerName}
                </b>{" "}
                <span css={css`font-size:1.7rem;color:var(--grayColor);`}>{returnTime(createTime)}</span>
                <div css={css`font-size:2.16rem;`}
                dangerouslySetInnerHTML={{
                    __html: description.replaceAll("\n", "<br />"),
                }}
                ></div>
                <div className="flex items-center gap-10 mt-4">
                    <button className={`inline-flex items-center gap-2 
                        ${loginUserPreferType ==='GOOD' ?'fcg opacity-100':'opacity-40' }
                    `}><span className="-mt-2 h-10" css={css`
                        width: 3.125rem;
                        background: url(/images/btn_thumb.png) no-repeat ${loginUserPreferType ==='GOOD' ?'0 -2.5rem':'0 0' }/6.25rem;
                    `}
                    ></span>{goodCount}</button>
                    {user.username === customerMallId && (
                        <button className={`inline-flex items-center gap-2 opacity-40`} title='수정'
                        onClick={() => setEdit(true)}><span className="-mt-2 h-10" css={css`
                            tex-indent: -9999px;
                            width: 2.5rem;
                            background: url(/images/icon-edit.svg) no-repeat center/contain;
                        `}
                        ></span></button>
                    )}
                </div>
            </div>
        </div>
    )
}
