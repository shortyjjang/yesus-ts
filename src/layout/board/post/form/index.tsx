/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { bbsInfoType } from '@/atom/board'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Score from './score'
import AddOrderProduct from './product/order'
import AddProduct from './product'
import Button from '@/components/button'
import { useRouter } from "next/router"
import { bbsName } from "../.."
import AttachedFile from "@/components/input/file"
import PreviewImage from "@/components/input/preview_image"

export default function AddForm({
    thisBBSInfo,
    articleId,
    setAlert,
    opId,
    saveData,
    productId,
}:{
    thisBBSInfo: bbsInfoType
    articleId?: string
    setAlert: (msg: string) => void
    opId?: string
    saveData: (data: any, files: File[]) => void
    productId?: string
}) {
    const {register, handleSubmit, watch, setValue} = useForm({
        defaultValues: {
            score: '5',
            contents: thisBBSInfo.defaultContentsUseYn === 'Y' && thisBBSInfo.defaultContents ? thisBBSInfo.defaultContents :'',
            secretYn: false,
            categoryId: 'all',
            title: thisBBSInfo.defaultTitleUseYn === 'Y' && thisBBSInfo.defaultTitle ? thisBBSInfo.defaultTitle :'',
            orderProductId: opId,
            productId: productId ? productId :'',
        }
    });
    const score = watch("score");
    const router = useRouter()
    const contents = watch("contents");
    const formClass = 'px-10 py-6 border border-solid border-gray-300 w-full'
    const [files, setFiles] = useState<File[]>([])
    return (
        <form onSubmit={handleSubmit((data) => {
            saveData(data, files)
        })}>
            {thisBBSInfo.id === 2 ?(
                !opId && <div>
                    <input className='hidden' {...register("orderProductId")} />
                    <AddOrderProduct 
                        setValue={(id) => setValue('orderProductId',id)} 
                        setAlert={setAlert}
                        productId={productId}
                    />
                </div>
            ):thisBBSInfo.useProductYn === 'Y' && (<div>
                <input className='hidden' {...register("productId")} />
                <AddProduct
                    setValue={(id) => setValue('productId',id)} 
                    setAlert={setAlert}
                    productId={productId}
                />
            </div>)}
            <div className="border-b border-solid border-gray-300">
                <Field label={!opId ? '제목' : undefined}>
                    <input {...register("title")} className={formClass} />
                </Field>
                {thisBBSInfo.categoryUseYn === 'Y' && thisBBSInfo.categoryList.length > 0 && (
                    <Field label={!opId ? '카테고리' : undefined}>
                        <select {...register("categoryId")}
                            className={`${formClass} pr-10 `}
                            css={css`
                                background: url(/images/icon-arrow-down.svg) no-repeat calc(100% - 1.5rem) 50%;
                                background-size: 2rem;
                            `}
                            defaultValue={'all'}
                        >
                            <option value="all">선택하세요</option>
                            {thisBBSInfo.categoryList.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </Field>
                )}
                {thisBBSInfo.scoreUseYn === 'Y' && <Field label={!opId ? '평점' : undefined} className={!opId ? `
                    h-[7rem]
                `:``}>
                    <Score score={score} register={register} />
                </Field>}
                <div className="relative">
                    <textarea {...register("contents")} className={`${formClass} h-[40rem] resize-none`} onKeyDown={(e) => {
                        if(contents.length > 1999) {
                            e.preventDefault()
                            setValue('contents',contents.substring(0,2000))
                        } 
                    }} />
                    <div className="absolute bottom-8 right-8" css={css`
                        font-size:1.7rem;color:var(--grayColor)
                    `}><b>{contents.length.toLocaleString()}</b>/2,000</div>
                </div>
                {thisBBSInfo.secretUseYn === 'Y' && <Field label={!opId ? '비밀글 여부' : undefined} className={!opId ? `
                    h-[7rem]
                `:``}>
                    <input type="checkbox" {...register("secretYn")} className="w-8 h-8 border border-solid border-gray-300" css={css`
                        &:checked {background:url('/images/ic-checked-border.svg') no-repeat 50% 50%; background-size:contain;border-color:var(--greenColor)}
                    `} />
                </Field>}
                {thisBBSInfo.fileUploadUseYn === 'Y' && <Field label={!opId ? '파일첨부' : undefined} className={!opId ? `
                `:``}>
                    <div className="flex gap-4">
                        {files.length > 0 && files.map((file) => (
                            <PreviewImage 
                                file={file} 
                                key={file.name} 
                                onDelete={() => setFiles(files.filter((f) => f.name !== file.name))} 
                            />
                        ))}
                        <AttachedFile file={files.at(-1) ? files.at(-1): null} setFile={(file) => setFiles([
                            ...files,
                            file
                        ])} />
                    </div>
                </Field>}

            </div>
            <div className="flex justify-center max-w-[320px] mx-auto gap-4 mt-8">
                <Button type="submit" styleType='primary' className="w-full">글쓰기</Button>
                <Button styleType='dimmend' className="w-full" 
                    onClick={() =>  (!!productId && productId !== undefined)
                        ? router.push(`/product/${productId}`) 
                        : router.push(`/${bbsName(thisBBSInfo.id)}`)
                    }>취소</Button>
            </div>
        </form>
    )
}

function Field({ 
    label, 
    children,
    className
}:{
    label?: string | undefined
    children: React.ReactNode
    className?: string
}) {
    return(
        <div className={`${label ? 'border-t border-solid border-gray-300 flex items-center py-4': ''} ${className ? className : ''}`}>
            {label && <label className='w-40'>{label}</label>}
            {children}
        </div>
    )
}

interface BbsFormType {
    title: string,
    contents: string,
    secretYn?: string,
    categoryId?: string,
    score?: string,
    productId?: string,
    opId?: string,
    files?: File[]
    managementParentId?:number
    parentId?: string
}

export interface BBSFormApiType extends BbsFormType {
    
    managementId: number, //게시판 아이디
    customerMallCd: string,
    customerUid: string
}