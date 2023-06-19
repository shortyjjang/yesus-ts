/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import PopupContainer from "./popup";

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
      {children}
      {onSuccess && (
        <div className="pop_btns">
          <button onClick={onSuccess}>{sucessTxt ? sucessTxt : "확인"}</button>
          <button onClick={onClose}>{cancelTxt ? cancelTxt : "취소"}</button>
        </div>
      )}
    </PopupContainer>
  );
}
