import { useLayoutEffect, useState, useRef } from "react";

export default function PopupContainer({
  onClose,
  children,
  hideClose = false,
}:{
  onClose: () => void,
  children: React.ReactNode,
  hideClose?: boolean
}) {
  const [top, setTop] = useState(0);
  const [show, setShow] = useState(0);
  const guide = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    if (!children) return;
    if(!guide.current) return;
      setTimeout(() => {
        setTop(
          guide.current && typeof window && window.innerHeight > guide.current.clientHeight
            ? (window.innerHeight - guide.current.clientHeight) / 2
            : 0
        );
        setShow(1);
      }, 300);
      if (!hideClose && close.current) {
        close.current.focus();
        return;
      }
  }, [children, guide, hideClose]);
  return (
    <div className="popup-wrapper">
      <div className="popup-back" onClick={onClose}></div>
      <div
        className="popup"
        ref={guide}
        style={{
          marginTop: `${top}px`,
          opacity: show,
        }}
      >
        {children}
        {!hideClose && (
          <button className="popup-close" onClick={onClose} ref={close}>
            닫기
          </button>
        )}
      </div>
      <style jsx>{`
      .popup-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        overflow: auto;
        text-align: center;
        animation: fadeIn 0.3s
      }
      @keyframes fadeIn {
        0% {opacity:0}
        50% {opacity:0}
        100% {opacity:1}
      }
      .popup-back {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
      }
      .popup {background: #fff;
        border: 1px solid var(--defaultColor);
        position: relative;
        text-align:left;
        margin:0 auto;
        display:inline-block;
      }
      .popup-close {
        position:absolute;top:0;right:0;width:7rem;height:7rem;background:url('/images/ic-close.svg') no-repeat 50% 50%;background-size:50%;border:0;text-indent:-1000em;}
      }
      `}</style>
    </div>
  );
}
