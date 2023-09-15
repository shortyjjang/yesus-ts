/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { userInfo } from "@/atom/user";
import Button from "@/layout/button";
import { Api, ApiResponseType } from "@/util/api";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useRecoilValue } from "recoil";
import Score from "../form/score";

export default function AddComment({
    contents,
    setAlert,
    closeComment,
    refetch,
    save,
    placeholder,
    removeComment,
    mukTypeMobileThumbnailImagePath
}:{
    contents?:string
    setAlert: (msg: string) => void
    closeComment?: () => void
    refetch: () => void
    save: (data: any) => void
    placeholder?: string
    removeComment?: () => void
    mukTypeMobileThumbnailImagePath?: string
}) {
    const { register, handleSubmit, watch, reset } = useForm({
        defaultValues: {
            comment: contents ? contents : "",
            score:'5'
        }
    });
    const comment = watch("comment");
    const score = watch("score");
    const user = useRecoilValue(userInfo)
    
    return (
        <form onSubmit={handleSubmit(save)} css={css`
            ${mukTypeMobileThumbnailImagePath && contents ?`
                padding:0 var(--defaultSpace) 3.75rem;width:550px;max-width:calc(100vw - 4rem);
            `:``}
        `}>
            {mukTypeMobileThumbnailImagePath && contents && <h3 className="font-bold py-14 text-center" css={css`
                font-size:3.75rem;
            `}>댓글 수정하기</h3>}
            <div className={mukTypeMobileThumbnailImagePath ?(!contents ? 'grid gap-8 mb-8': 'border border-solid p-8 mb-8') :''}
                css={css`
                ${mukTypeMobileThumbnailImagePath ?`
                    grid-template-columns: 7.25rem auto;
                `:``}
                border-color:var(--lightGrayColor);
            `}>
                {mukTypeMobileThumbnailImagePath && (
                    !contents ? (<div className="aspect-square relative rounded-full border border-solid overflow-hidden">
                        <Image src={mukTypeMobileThumbnailImagePath} alt="" fill={true} className="object-cover" />
                    </div>) : (<b>입력내용</b>)
                )}
                <textarea className={`bg-transparent w-full resize-none h-20 border-solid
                    ${contents 
                        ? (mukTypeMobileThumbnailImagePath ? 'h-full' :'border border-gray-300 p-4 h-40') 
                        : `border-b-2 border-black`
                    }
                `}
                    {...register("comment", { required: true })}
                    placeholder={placeholder ? placeholder : "댓글을 입력해주세요"}
                    onFocus={() => !user.username && setAlert('로그인 후 이용해주세요')}
                ></textarea>
            </div>
            <div className="flex justify-between flex-row-reverse items-center">
                <div className="flex gap-4 w-[30rem]">
                    <Button styleType="dimmend" size="sm"
                        className="w-full"
                        onClick={() => {
                            reset()
                            closeComment && closeComment()
                            removeComment && removeComment()
                        }}
                    >
                    {removeComment ? '삭제하기':'취소'}
                    </Button>
                    <Button size="sm" className="w-full"
                        type="submit"
                        styleType={comment ? "primary": "default"}
                    >
                        {contents ? '수정하기' :'등록'}
                    </Button>
                </div>
                {mukTypeMobileThumbnailImagePath && <Score withText={false} register={register} score={score} inlineCSS={`
                    font-size:3rem;
                    font-weight:bold;padding-top:0.5rem;
                `}/>}
            </div>

        </form>
    )
}

export const returnTime = (time:string) => {
    const now = dayjs();
    const updated = dayjs(time);
    if (now.diff(updated, "years") > 0)
        return `${dayjs(time).format("YYYY-MM-DD")}`;
    else if (now.diff(updated, "months") > 0)
        return `${now.diff(updated, "months")}달전`;
    else if (now.diff(updated, "days") > 0)
        return `${now.diff(updated, "days")}일전`;
    else if (now.diff(updated, "hours") > 0)
        return `${now.diff(updated, "hours")}시간전`;
    else if (now.diff(updated, "minutes") < 10) return `방금전`;
    else return `${String(now.diff(updated, "minutes")).substring(0, 1)}0분전`;
};