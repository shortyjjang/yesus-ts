import { userInfo } from "@/atom/user";
import Button from "@/components/button";
import { Api, ApiResponseType } from "@/util/api";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useRecoilValue } from "recoil";

export default function AddComment({
    contents,
    id,
    setAlert,
    closeComment,
    articleId,
    bbsId,
    refetch
}:{
    contents?:string
    id?: number
    setAlert: (msg: string) => void
    closeComment?: () => void
    articleId: string
    bbsId: number
    refetch: () => void
}) {
    const { register, handleSubmit, watch, reset } = useForm({
        defaultValues: {
            comment: contents ? contents : "",
        }
    });
    const comment = watch("comment");
    const router = useRouter()
    const user = useRecoilValue(userInfo)
    const saveComment = useMutation('saveComment',
        async (data:AddCommentType) => {
            const request:ApiResponseType = await Api.post(
              contents 
                ? `/api/board/v1/comment/update` 
                : `/api/board/v1/comment/create`,
              data,
              {
                headers: { Authorization: Cookies.get("accessToken") },
              }
            );
            return request
        },
        {
            onSuccess: (data, variables) => {
                if (data?.meta?.resultMsg) {
                    setAlert(data.meta.resultMsg);
                    return;
                }
                refetch()
                closeComment && closeComment()
            },
        }
    )
    
    return (
        <form onSubmit={handleSubmit(({ comment }) => {
                if(!user.username){
                    setAlert('로그인 후 이용해주세요')
                    return;
                }
                const data = contents 
                ? {// 수정
                    contents: comment,
                    customerMallCd: 'YESUS',
                    customerUid: user.username,
                    id: id,
                }:{ // 등록
                    articleId: articleId,
                    contents: comment,
                    customerMallCd: 'YESUS',
                    customerUid: user.username,
                    managementId: bbsId,
                }
                saveComment.mutate(data)
            }
        )}>
            <div>
                <textarea className={`bg-transparent w-full resize-none h-20 border-solid
                    ${contents ? 'border border-gray-300 p-4 h-40' : ' border-b-2 border-black'}
                `}
                    {...register("comment", { required: true })}
                    placeholder="댓글을 입력해주세요"
                    onFocus={() => !user.username && setAlert('로그인 후 이용해주세요')}
                ></textarea>
            </div>
            <div className="flex justify-end">
                <div className="flex gap-4 w-[30rem]">
                    <Button styleType="dimmend" size="sm"
                        className="w-full"
                        onClick={() => {
                            reset()
                            closeComment && closeComment()
                        }}
                    >
                    취소
                    </Button>
                    <Button size="sm" className="w-full"
                        type="submit"
                        styleType={comment ? "primary": "default"}
                    >
                        {contents ? '수정하기' :'등록'}
                    </Button>
                </div>
            </div>

        </form>
    )
}

type AddCommentType = {
    articleId?: string,
    contents: string,
    customerMallCd: string,
    customerUid: string,
    managementId?: number,
    id?: number,
  }