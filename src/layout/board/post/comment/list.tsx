/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import dayjs from 'dayjs'
import AddComment, { returnTime } from './add'
import { useState } from 'react'
import Button from "@/layout/button"
import { useMutation } from "react-query"
import { Api, ApiResponseType } from "@/util/api"
import { userInfo } from "@/atom/user"
import { useRecoilValue } from "recoil"
import Cookies from "js-cookie"
import { set } from "react-hook-form"

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
    refetch,
    save
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
    save: (data: any, parentId?:any) => void
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
                    setAlert={setAlert}
                    refetch={refetch}
                    save={({comment}) => {
                        save(comment)
                    }}
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
                <AddComment save={({comment}) => {
                    setAdd(false)
                    save(comment, id)}
                } 
                closeComment={() => setAdd(false)}
                refetch={refetch} setAlert={setAlert} />
            )}
        </div>
    )
}
