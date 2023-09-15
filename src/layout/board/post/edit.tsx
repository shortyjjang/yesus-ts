import React, { ReactNode, useState } from 'react'
import AddPost from './add'
import { bbsInfoType } from '@/atom/board'
import { PostType } from '@/layout/board/post'
import { Api, ApiResponseType } from '@/util/api'
import Cookies from 'js-cookie'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import AddForm, { BBSFormApiType } from './form'
import { useRecoilValue } from 'recoil'
import { userInfo } from '@/atom/user'
import Confirm from '@/layout/confirm'
import { bbsName } from '..'

export default function EditPost({
    thisBBSInfo,
    articleId,
}:{
    thisBBSInfo: bbsInfoType
    articleId: string
}) {
  const [alert, setShowAlert] = useState<ReactNode | null>(null);
  const router = useRouter()
  const user = useRecoilValue(userInfo)
  const {data:post} = useQuery(['bbsDetail', articleId], async () => {
      const request:ApiResponseType = await Api.get(
        `/api/board/v1/${thisBBSInfo.id}/${articleId}`,
        {
          headers: {
            Authorization: Cookies.get("accessToken")
              ? Cookies.get("accessToken")
              : null,
          },
        }
      )
      if(request?.meta?.resultMsg) {
        setShowAlert(
          <Confirm
            onClose={() => {
              setShowAlert(null);
              router.back()
            }}
          >
            {request.meta.resultMsg}
          </Confirm>
        );
          return;
      }
      const data:PostType = request.content
      if(data) return data
  })
  const editPost = async (data: any, files:File[], deleteBbsFileIds:number[]) => {
    if(!post) return;
    if (
      thisBBSInfo.writeRole !== "NON" &&
      !Cookies.get("accessToken")
    ) {
      setShowAlert(
        <Confirm
          onClose={() => {
            setShowAlert(null);
            router.back()
          }}
        >
          게시물을 작성하실 권한이 없습니다.
        </Confirm>
      );
      return;
    }
    if (thisBBSInfo.id === 2) {
      setShowAlert(
        <Confirm
          onClose={() => {
            setShowAlert(null);
            router.back()
          }}
        >
          구매후기는 수정하실 수 없습니다.
        </Confirm>
      );
      return;
    }
    const {
      title,
      score,
      secretYn,
      categoryId,
      contents,
      productId,
      orderProductId,
    } = data;
    let body:BBSFormApiType = {
      contents: contents, //게시글 내용
      managementId: thisBBSInfo.id, //게시판 아이디
      title: title, //게시글 제목
      customerMallCd: "YESUS",
      customerUid: user.username,
      articleId: post.id,
    };

    //게시판이 상품 게시판일 경우
    if (thisBBSInfo.useProductYn === "Y") {
      if (!productId) {
        setShowAlert(
          <Confirm onClose={() => setShowAlert(null)}>
            상품 선택은 필수입니다.
          </Confirm>
        );
        return;
      }
      body = {
        ...body,
        productId: productId, //상품 아이디
      };
    }
    //답변글 등록일 경우
    if (post.parentId) {
      body = {
        ...body,
        managementParentId: thisBBSInfo.id,
        parentId: post.parentId
      };
    }
    //게시판에서 비밀글을 허용할때
    if (thisBBSInfo.secretUseYn === "Y") {
      body = {
        ...body,
        secretYn: secretYn ? "Y" : "N", //게시글 비밀글 여부 : Y, N
      };
    }
    //게시판에서 평점을 허용할때
    if (thisBBSInfo.scoreUseYn === "Y") {
      body = {
        ...body,
        score: !score ? 5 : score, //게시글 평점
      };
    }
    //게시판에서 카테고리를 허용할때
    if (thisBBSInfo.categoryUseYn === "Y") {
      if(categoryId === 'all') {
        setShowAlert(
          <Confirm onClose={() => setShowAlert(null)}>
            카테고리를 선택해주세요.
          </Confirm>
        );
        return;
      }
      body = {
        ...body,
        categoryId: categoryId, //게시글 카테고리 아이디
      };
    }
    if (!title) {
      setShowAlert(
        <Confirm onClose={() => setShowAlert(null)}>제목은 필수입니다.</Confirm>
      );
      return;
    }
    if (!contents) {
      setShowAlert(
        <Confirm onClose={() => setShowAlert(null)}>내용은 필수입니다.</Confirm>
      );
      return;
    }
    if (contents.length < 20) {
      setShowAlert(
        <Confirm onClose={() => setShowAlert(null)}>
          게시물 등록에 실패하셨습니다.
          <br />
          내용은 20자 이상 2000자 이내로 입력해주세요
        </Confirm>
      );
      return;
    }
    let formData = new FormData();

    //게시판에서 첨부파일을 허용할때
    if (
      thisBBSInfo.fileUploadUseYn === "Y"
    ) {
      if(deleteBbsFileIds && deleteBbsFileIds.length > 0) {
        body = {
          ...body,
          deleteBbsFileIds: deleteBbsFileIds,
        }
      }
      if(files && files.length > 0) files.map((file) => {
        formData.append("files", file);
      });
    }
    formData.append(
      "request",
      new Blob([JSON.stringify(body)], {
        type: "application/json",
      })
    );
    const request:ApiResponseType = await Api.post("/api/board/v1/update", formData, {
      headers: {
        Authorization: Cookies.get("accessToken")
          ? Cookies.get("accessToken")
          : null,
      },
    });
    if (request?.meta?.resultMsg){
      setShowAlert(
        <Confirm onClose={() => setShowAlert(null)}>
          게시물 등록에 실패하셨습니다.
          <br />
          {request.meta.resultMsg}
        </Confirm>
      );
      return;
    }
    if (request.content) {
      setShowAlert(
        <Confirm
          onClose={() => {
            router.push(productId ? `/product/${productId}`:`/${bbsName(thisBBSInfo.id)}/${post.id}`);
          }}
        >
          게시물이 정상적으로 등록되었습니다.
        </Confirm>
      );
    }
  }
  return (<>
    {post && <AddForm thisBBSInfo={thisBBSInfo} saveData={editPost} setAlert={setShowAlert} post={post} productId={post.productId}/>}
    {alert && alert}
  </>)
}
