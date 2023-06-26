/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"

export default function AttachedFile({
    file, 
    setFile
}: {
    file: File | null | undefined,
    setFile: (file:File) => void
}) {

    const fileUploadValidHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
      const target = e.currentTarget;
      const files = (target.files as FileList)[0];
  
      if(files === undefined) {
        return ;
      }
  
    //   // 파일 확장자 체크
    //   if(!fileExtensionValid(files)) {
    //     target.value = '';
    //     alert(`업로드 가능한 확장자가 아닙니다. [가능한 확장자 : ${ALLOW_FILE_EXTENSION}]`)
    //     return;
    //   }
  
    //   // 파일 용량 체크
    //   if(files.size > FILE_SIZE_MAX_LIMIT) {
    //     target.value = '';
    //     alert('업로드 가능한 최대 용량은 5MB입니다. ')
    //     return;
    //   }
  
      // validation을 정상적으로 통과한 File
      setFile(files);
    }
  return (
    <div className='aspect-square relative bg-white border border-solid w-28' css={css`
      border-color:var(--lightGrayColor);
      &:before, &:after {content:'';width:1px;height:2rem;background:var(--lightGrayColor);position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);}
      &:after{transform:translate(-50%, -50%) rotate(90deg);}
    `}>
      <input type="file" onChange={fileUploadValidHandler} className='absolute top-0 left-0 w-full h-full opacity-0'/>
    </div>
  )
}
