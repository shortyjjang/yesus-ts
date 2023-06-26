/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import dayjs from 'dayjs'
import AddComment from './add'
import { useState } from 'react'
import Button from "@/components/button"
import { useMutation } from "react-query"
import { Api, ApiResponseType } from "@/util/api"
import { userInfo } from "@/atom/user"
import { useRecoilValue } from "recoil"
import Cookies from "js-cookie"

export default function CommentItem({
    id,
    createBy,
    createTime,
    contents,
    isEditable,
    loop,
    articleId,
    bbsId,
    setAlert,
    refetch
}:{
    id: number
    createBy: string
    createTime: string
    contents: string
    isEditable?: boolean
    loop: boolean
    articleId: string
    bbsId: number
    setAlert: (msg: string) => void
    refetch: () => void
}) {
    const [add, setAdd] = useState(false)
    const [edit, setEdit] = useState(false)
    const user = useRecoilValue(userInfo)
    const removeComment = useMutation('removeComment',
      async (id:number) => {
          const request: ApiResponseType = await Api.post(
            `/api/board/v1/comment/delete`,
            {
              customerMallCd: "YESUS",
              customerUid: user.username,
              id: id,
            },
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
          },
      }
    )
    return (
        <div className="py-4 border-t border-solid border-gray-300">
            <b css={css`font-size:2.16rem;`}>{createBy}</b>{" "}
            <span css={css`font-size:1.7rem;color:var(--grayColor);`}>{returnTime(createTime)}</span>
            {edit ?
                <AddComment 
                    contents={contents}
                    closeComment={() => setEdit(false)}
                    articleId={articleId} bbsId={bbsId} setAlert={setAlert} id={id}
                    refetch={refetch}
                />
            :<>
                <div
                dangerouslySetInnerHTML={{
                    __html: contents.replaceAll("\n", "<br />"),
                }}
                ></div>
                <div className="flex justify-end gap-4">
                    {loop && (
                        <Button size="sm" styleType="dimmend" className="font-normal" inlineCSS="padding:0.75rem 2rem;" onClick={() => setAdd(!add)}>
                        댓글 남기기
                        </Button>
                    )}
                    {isEditable && (
                        <>
                        <Button onClick={() => removeComment.mutate(id)}
                            size="sm" styleType="dimmend" className="font-normal" inlineCSS="padding:0.75rem 2rem;">
                            삭제
                        </Button>
                        <Button onClick={() => setEdit(true)}
                            size="sm" styleType="dimmend" className="font-normal" inlineCSS="padding:0.75rem 2rem;">
                            수정
                        </Button>
                        </>
                    )}
                </div>
            </>}
            {add && (
                <AddComment refetch={refetch} articleId={articleId} bbsId={bbsId} setAlert={setAlert} id={id} />
            )}
        </div>
    )
}

const returnTime = (time:string) => {
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