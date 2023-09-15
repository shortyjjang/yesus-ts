/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import Image from "next/image"

export default function PreviewImage({
    file,
    onDelete,
    path
}:{
    file?: File
    path?:string
    onDelete: () => void
}) {
  return (
    <div className='aspect-square relative bg-white border border-solid w-28' css={css`
      border-color:var(--lightGrayColor);
    `}>
        {file && <Image src={URL.createObjectURL(file)} fill={true} className="object-cover" alt={file.name} />}
        {path && <Image src={`${process.env.NEXT_PUBLIC_IMG_SERVER}/${path}`} fill={true} className="object-cover" alt=""  />}
        <button
          onClick={onDelete}
          className="absolute top-0 right-0 w-6 h-6 bg-white" 
          title="삭제하기"
          css={css`
            &:before, &:after {content:'';width:1px;height:1rem;background:var(--defaultColor);position:absolute;left:50%;top:50%;transform:translate(-50%, -50%) rotate(-45deg);}
            &:after{transform:translate(-50%, -50%) rotate(45deg);}
          `}
        ></button>
    </div>
  )
}
