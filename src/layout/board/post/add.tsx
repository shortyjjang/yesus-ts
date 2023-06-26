import { bbsInfoType } from '@/atom/board'
import AddForm, { BBSFormApiType } from './form'
import Cookies from 'js-cookie'
import { ReactNode, use, useState } from 'react'
import Confirm from '@/components/confirm'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { userInfo } from '@/atom/user'
import { Api, ApiResponseType } from '@/util/api'
import { useMutation } from 'react-query'
import { bbsName } from '..'

export default function AddPost({
    thisBBSInfo,
    articleId,
    setAlert,
    opId,
    productId,
}:{
    thisBBSInfo: bbsInfoType
    articleId?: string
    setAlert: (msg: string) => void
    opId?: string
    productId?: string
}) {
  const [alert, setShowAlert] = useState<ReactNode | null>(null);
  const router = useRouter()
  const user = useRecoilValue(userInfo)
  const sendPost = useMutation('sendPost', async (data:FormData) => {
    const request:ApiResponseType = await Api.post("/api/board/v1/create", data, {
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
    return request.content
  },{
    onSuccess: (data) => {
      if (data) {
        setShowAlert(
          <Confirm
            onClose={() => {
              setShowAlert(null);
              router.push(data);
            }}
          >
            게시물이 정상적으로 등록되었습니다.
          </Confirm>
        );
      }
    },
    onError: () => {
      setShowAlert(
        <Confirm onClose={() => setShowAlert(null)}>
          게시물 등록에 실패하셨습니다.
        </Confirm>
      );
    }
  })
  const addPost = async (data: any, files:File[]) => {
    console.log(Cookies.get("accessToken"))
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
        title: opId ? contents.substring(0, 20) : title, //게시글 제목
        customerMallCd: "YESUS",
        customerUid: user.username,
      };
  
      //게시판이 상품 게시판일 경우
      if (thisBBSInfo.useProductYn === "Y") {
        if (thisBBSInfo.id === 2) {
          if (!opId) {
            setShowAlert(
              <Confirm onClose={() => setShowAlert(null)}>
                상품 선택은 필수입니다.
              </Confirm>
            );
            return;
          }
          body = {
            ...body,
            opId: opId ? opId : orderProductId, //상품 아이디
          };
        } else {
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
      }
      //답변글 등록일 경우
      if (router.query.id) {
        body = {
          ...body,
          managementParentId: thisBBSInfo.id,
          parentId: String(router.query.id),
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
      if (!title && !opId) {
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
      if (contents.length < 20 && opId) {
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
      formData.append(
        "request",
        new Blob([JSON.stringify(body)], {
          type: "application/json",
        })
      );
  
      //게시판에서 첨부파일을 허용할때
      if (
        thisBBSInfo.fileUploadUseYn === "Y" &&
        files && files.length > 0
      ) {
        files.map((file) => {
          formData.append("files", file);
        });
      }
      const request:ApiResponseType = await Api.post("/api/board/v1/create", formData, {
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
              router.push(`/${bbsName(thisBBSInfo.id)}/${request.content}`);
            }}
          >
            게시물이 정상적으로 등록되었습니다.
          </Confirm>
        );
      }
    };
  return (<>
  <AddForm thisBBSInfo={thisBBSInfo} articleId={articleId} setAlert={setAlert} opId={opId} saveData={addPost} productId={productId} />
  {alert && alert}
  </>
    )
}


