import { Api, ApiResponseType } from '@/util/api';
import Cookies from 'js-cookie';
import React, { use } from 'react'
import { useMutation, useQuery } from 'react-query';
import PostProductItem from './product';
import { bbsInfoType } from '@/atom/board';
import PostHeader from './header';
import Button from '@/components/button';
import { useRouter } from 'next/router';
import { bbsName } from '..';
import { userInfo } from '@/atom/user';
import { useRecoilValue } from 'recoil';
import CommentIndex from './comment';

export default function Post({
    articleId,
    setAlert,
    bbsId,
    thisBBSInfo
}:{
    articleId: string
    setAlert: (msg: string) => void
    bbsId: number,
    thisBBSInfo: bbsInfoType
}) {
  const router = useRouter()
  const user = useRecoilValue(userInfo)
  const {data:post} = useQuery(['bbsDetail', articleId], async () => {
      const request:ApiResponseType = await Api.get(
        `/api/board/v1/${bbsId}/${articleId}`,
        {
          headers: {
            Authorization: Cookies.get("accessToken")
              ? Cookies.get("accessToken")
              : null,
          },
        }
      )
      if(request?.meta?.resultMsg) {
          setAlert(request.meta.resultMsg)
          return;
      }
      const data:PostType = request.content
      return data
  })
  const deletePost = useMutation(
      'deletePost', 		// 키
      async (data:PostParamType) => {
        const request:ApiResponseType = await Api.post(
          `/api/board/v1/delete`, data ,
          {
            headers: {
              Authorization: Cookies.get("accessToken"),
            },
          }
        );
            return request.content
      },
      {			// 옵션
        onError: () => { 
          setAlert('네트워크에 문제가 있어 추천을 할 수 없습니다.')
        },
        onSuccess: () => {
          setAlert('삭제되었습니다.')
        },
      }
  );
  if(post) return (
    <div>
      {thisBBSInfo.useProductYn === 'Y' && post.productId && post.productImage && 
        <PostProductItem 
          productId={post.productId} 
          productName={post.productName} 
          productImage={post.productImage} 
          optionName={post.optionName}
        />
      }
      {thisBBSInfo.markType !== 'ACCORDION' && 
        <PostHeader 
          title={post.title} 
          voteCount={post.voteCount} score={post.score} 
          createTime={post.createTime} 
          viewCount={post.viewCount} isVoted={post.isVoted} 
          createBy={post.createBy}
          setAlert={setAlert}
          articleId={post.id}
          bbsId={bbsId}
        />
      }
      <div className="whitespace-pre-wrap">{post.contents}</div>
      <div className='whitespace-nowrap overflow-hidden'>
        {post.fileList && post.fileList.length > 0 && post.fileList.filter(file => file.answerFileYn === "N").map((file) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${process.env.NEXT_PUBLIC_IMG_SERVER}/${file.path}`}
              key={file.path}
              max-width="100%"
              alt={file.name}
            />
          )
        )}
      </div>
      {post.questionStatus === "Y" && thisBBSInfo.replyUseYn === "Y" && post.replyContents && (
        <div>
          <div>안녕하세요 예스어스입니다.</div>
          <div dangerouslySetInnerHTML={{__html: post.replyContents}}></div>
          <div className='whitespace-nowrap overflow-hidden'>
            {post.fileList && post.fileList.length > 0 && post.fileList.filter(file => file.answerFileYn === "Y").map((file) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${process.env.NEXT_PUBLIC_IMG_SERVER}/${file.path}`}
                  key={file.path}
                  max-width="100%"
                  alt={file.name}
                />
              )
            )}
          </div>
        </div>
      )}
      {post.isEditable && (
        <div>
          <Button onClick={() => router.push(`/${bbsName(thisBBSInfo.id)}/edit/${post.id}`)}>수정하기</Button>
          <Button onClick={() => deletePost.mutate({
            articleId: post.id,
            customerMallCd: "YESUS",
            customerUid: user.username,
            managementId: thisBBSInfo.id
          })}>삭제하기</Button>
        </div>
      )}
      {thisBBSInfo.commentUseYn === "Y" && post.commentList && (
        <CommentIndex commentList={post.commentList} setAlert={setAlert} loop={thisBBSInfo.replyCommentUseYn === 'Y'} articleId={post.id} bbsId={thisBBSInfo.id} />
      )}
    </div>
  )
}

export type PostType = {
    id: string,
    managementId: number,
    title: string,
    viewCount?: number,
    score?: number,
    secretYn?: string,
    voteCount?: number,
    createBy: string,
    registerName: string,
    createTime: string,
    contents: string,
    productId?: string,
    productImage?: string
    productName?: string,
    isVoted: boolean,
    isEditable: boolean,
    optionName?: string,
    questionStatus?: string,
    replyContents?: string,
    fileList: {
      id: number,
      managementId: number,
      articleId: string,
      name: string,
      path: string,
      ext: string,
      size: number,
      answerFileYn: string
  }[],
    commentList: []
}

export type PostParamType = {
  articleId: string,
  customerMallCd: string,
  customerUid: string,
  managementId: number,
}