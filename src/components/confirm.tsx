/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import PopupContainer from "./popup";
import Button from "./button";

export default function Confirm({
  children,
  onSuccess,
  onClose,
  sucessTxt,
  cancelTxt,
  hideCloseBtn,
  inlineCSS
}:{
  children: React.ReactNode,
  onSuccess?: () => void,
  onClose: () => void,
  sucessTxt?: string,
  cancelTxt?: string,
  hideCloseBtn?: boolean,
  inlineCSS?: string
}) {
  return (
    <PopupContainer
      onClose={onClose}
      hideClose={hideCloseBtn}      
    >
      <div className="p-10 pt-14" css={css`
        font-size:2.16rem;max-width:90vw;min-width:200px;
        ${inlineCSS}
      `}>
        <div className="w-18 aspect-square float-right"></div>
        {children}
      </div>
      
      <div className="flex border-t border-solid border-black"
        css={css`
          button{width:100%;border-width:0;}
          button+button {border-left-width:1px;}
        `}
      >
        {onSuccess && (<Button onClick={onSuccess}>{sucessTxt ? sucessTxt : "확인"}</Button>)}
        <Button onClick={onClose}>{cancelTxt ? cancelTxt : "취소"}</Button>
      </div>
      
    </PopupContainer>
  );
}
