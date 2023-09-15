/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { mobileWidth } from '../../header';
/* 모바일에서 보이는 토글 버튼 */
export function ToggleButton({
    openFilter,
    setOpenFilter
  }:{
    openFilter: boolean,
    setOpenFilter: (openFilter: boolean) => void
  }) {
    return(
      <h3 className='relative border-b border-solid items-center justify-center' css={css`
        font-size:var(--defaultSpace);
        ${openFilter ?`
          border-color:var(--defaultColor);display:flex;
          height:7.7rem;font-weight:bold;color:var(--defaultColor);
        ` : `
          border-color:var(--greenColor);color:var(--greenColor);display:inline-block;
          &:before {content: "";
          display: inline-block;
          width: 3.078rem;aspect-ratio:1/1;vertical-align:middle;margin-right:0.5rem;
          background: url(/images/icon-filter.svg) no-repeat center/contain;}
        `}
        @media (min-width: ${mobileWidth}px) {
          display:none;
        }
      `}>
        {openFilter ?'필터로 검색':'검색 필터를 이용해보세요!'}
        <button type="button" className='absolute top-0 right-0 h-full' 
        onClick={() => setOpenFilter(!openFilter)}
        css={css`
          ${openFilter ?`
            background: transparent no-repeat 50% 50% url(/images/ic-close.svg);
            background-size: 2.5rem;aspect-ratio:1/1;
          `:`
            width:100%;
          `}
        `}></button>
      </h3>
    )
  }
  

  // 필터 버튼
  export function FilterButton({
    title,
    open,
    i,
    setOpen
  }:{
    title: string,
    open: boolean[],
    i: number,
    setOpen: (open: boolean[]) => void
  }){
    return(
      <div className='relative font-bold'
        css={css`
          @media (min-width: ${mobileWidth}px) {
            font-weight:500;color:var(--grayColor);cursor:pointer;padding:2rem;
            &:after {
              content: "";position: absolute;right: 2rem;top: 50%;border: solid #999;
              border-width: 0 1px 1px 0;width: 1rem;height: 1rem;transform: translateY(-50%) rotate(${open[i] ? 225 :45}deg);
              margin-top:${open[i] ?'0' :'-0.5rem'}
            }
          }
        `}
        onClick={() => {
          let o = open;
          o[i] = !o[i]
          setOpen([...o])
      }}
      >{title}</div>
    )
  }
  
  //옵션리스트 감싸는 박스
  export function FilterListContainer({
    open,
    children,
    header
  }:{
    open: boolean
    children: React.ReactNode
    header: React.ReactNode
  }) {
    return(
      <div className='relative w-full border border-solid p-8'
        css={css`
        border-color:var(--lightGrayColor);
        border-width:0 0 1px;
        @media (min-width: ${mobileWidth}px) {
          border-width:0 0 0 1px;
          padding:0;
        }`}
      >
        {header}
        <div css={css`
          @media (min-width: ${mobileWidth}px) {
            display:${open ?'block' :'none'};
            position:absolute;top:100%;left:0;width:100%;background:var(--backgroundColor);margin-top:1px;
            box-shadow: 0 0 0 1px var(--lightGrayColor);
          }
        `}>
          {children}
        </div>
      </div>
    )
  }
  
  // 옵션별 컴포넌트
  export function FilterOptionContainer({
    children,
    selected,
    onClick
  }:{
    children: React.ReactNode,
    selected: boolean
    onClick?: () => void
  }) {
    return (
      <div className='relative border border-solid rounded-lg inline-block px-4 py-1 mt-4 mr-4 cursor-pointer' 
      css={css`
        border-color:var(--lightGrayColor);color:var(--grayColor);z-index:1;
        ${selected 
          ? 'border-color:var(--greenColor);color:var(--greenColor);background:#fff;'
          :''
        }
        @media (min-width: ${mobileWidth}px) {
          display:flex;margin:0;border-radius:0;border:0;box-shadow: 0 1px 0 var(--lightGrayColor);
          padding:1rem 2rem;align-items:center;
          ${selected ?`
            background: #fffaca;
            color:var(--defaultColor);
            &:after {
              content: "";display: inline-block;vertical-align: middle;width: 1.5rem;height: 1.25rem;
              background: url(/images/ic_checked.png) no-repeat center/contain;
              margin: -0.25rem 0 0 1.125rem;
            }
          `:`
            background:#fff;
          `
        }
      `} onClick={() => onClick && onClick()}>
        {children}
      </div>
    )
  }

  /* 상황별 옵션 필터링 */
  export function FilterOption({
    filterName,
    option,
    register,
    timeCodeList,
    difficultyCodeList,
    situationCodeList,
    kindCodeList
  }:{
    filterName: string,
    option: {
      code: number,
      caption: string,
      ord: number
  
    },
    register: any,
    timeCodeList: string[],
    difficultyCodeList: string[],
    situationCodeList: string[],
    kindCodeList: string[]
  }) {
    const value = String(filterName === 'timeCodeList' ? timeCodeList 
                  : filterName === 'difficultyCodeList' ? difficultyCodeList 
                  : filterName === 'situationCodeList' ? situationCodeList 
                  : kindCodeList);
    return (
      <FilterOptionContainer selected={value?.includes(String(option.code))}>
        <input type="checkbox" {...register(filterName)} value={option.code} 
          className='absolute top-0 left-0 w-full h-full cursor-pointer opacity-0'
        />
        {option.caption}
      </FilterOptionContainer>
    )
  }