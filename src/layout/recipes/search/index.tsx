/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Button from '@/layout/button';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { mobileWidth } from '../../header';
import { useRouter } from 'next/router';
import SelectedFilter from './selected';
import { FilterButton, FilterListContainer, FilterOption, FilterOptionContainer, ToggleButton } from './filter';

export const filterJson = [
    {
      name: "kindCodeList",
      title: "종류",
      option: [
        { code: 2301, caption: "반찬", ord: 1 },
        { code: 2302, caption: "메인", ord: 2 },
        { code: 2303, caption: "밥/죽/떡", ord: 3 },
        { code: 2304, caption: "디저트", ord: 4 },
        { code: 2305, caption: "한식", ord: 5 },
        { code: 2306, caption: "일식", ord: 6 },
        { code: 2307, caption: "중식", ord: 7 },
        { code: 2308, caption: "양식", ord: 8 },
        { code: 2309, caption: "빵", ord: 9 },
        { code: 2310, caption: "과자", ord: 10 },
        { code: 2311, caption: "음료", ord: 11 },
        { code: 2399, caption: "기타", ord: 99 },
      ],
    },
    {
      name: "situationCodeList",
      title: "상황",
      option: [
        { code: 2401, caption: "일상", ord: 1 },
        { code: 2402, caption: "홈파티", ord: 2 },
        { code: 2403, caption: "술안주", ord: 3 },
        { code: 2404, caption: "야식", ord: 4 },
        { code: 2405, caption: "다이어트", ord: 5 },
        { code: 2406, caption: "채식", ord: 6 },
        { code: 2407, caption: "이유식", ord: 7 },
        { code: 2408, caption: "혼밥", ord: 8 },
        { code: 2409, caption: "도시락", ord: 9 },
        { code: 2410, caption: "아침", ord: 10 },
        { code: 2499, caption: "기타", ord: 99 },
      ],
    }, //상황
    {
      name: "difficultyCodeList",
      title: "난이도",
      option: [
        { code: 2201, caption: "누구나", ord: 1 },
        { code: 2202, caption: "초급", ord: 2 },
        { code: 2203, caption: "중급", ord: 3 },
        { code: 2204, caption: "고급", ord: 4 },
        { code: 2205, caption: "셰프", ord: 5 },
      ],
    }, //난이도
    {
      name: "timeCodeList",
      title: "조리시간",
      show: false,
      option: [
        { code: 2101, caption: "5분이내", ord: 1 },
        { code: 2102, caption: "10분이내", ord: 2 },
        { code: 2103, caption: "15분이내", ord: 3 },
        { code: 2104, caption: "20분이내", ord: 4 },
        { code: 2105, caption: "30분이내", ord: 5 },
        { code: 2106, caption: "60분이내", ord: 6 },
        { code: 2107, caption: "90분이내", ord: 7 },
        { code: 2108, caption: "100분이상", ord: 7 },
      ],
    }, //조리시간
  ];
export default function RecipeSearch({
  refetch
}:{
  refetch: () => void
}) {
    const {register, handleSubmit, watch, setValue, reset} = useForm({
    });
    const [openFilter, setOpenFilter] = useState<boolean>(false)
    const router = useRouter();
    const sortType = [['title','이름'],['difficulty','난이도'],['cooking_time','시간']]
    const kindCodeList:string[] = watch("kindCodeList")
    const situationCodeList:string[] = watch("situationCodeList")
    const difficultyCodeList:string[] = watch("difficultyCodeList")
    const timeCodeList:string[] = watch("timeCodeList")
    const [open, setOpen] = useState<boolean[]>([...filterJson.map(() => false), false])
    const search = (data:any) => {
      const {searchValue} = data;
      let query = {}
      if(searchValue) query = {...query, keyword: searchValue}
      if(kindCodeList && kindCodeList.length > 0) query = {...query, kind: kindCodeList.join(',')}
      if(situationCodeList && situationCodeList.length > 0) query = {...query, situation: situationCodeList.join(',')}
      if(difficultyCodeList && difficultyCodeList.length > 0) query = {...query, difficulty: difficultyCodeList.join(',')}
      if(timeCodeList && timeCodeList.length > 0) query = {...query, time: timeCodeList.join(',')}
      router.push({
        pathname: router.pathname,
        query: {...query}
      },undefined, {scroll:false})
      setOpenFilter(false)
    }
  return (
    <form onSubmit={handleSubmit(search)}>
        {/* 검색어 & 검색버튼 & 재설정버튼 */}
        <div className='flex justify-between gap-5 w-full mb-20' css={css`
          ${openFilter ?`
            position:fixed;bottom:0;left:0;z-index:11;padding:var(--defaultSpace);
            border-top:1px solid #000;background:var(--backgroundColor);
            margin-bottom:0;
          `:`display:block;`}
          @media (min-width: ${mobileWidth}px) {
            display:flex;
          }
        `}>
          <div className='flex border-b border-solid border-black w-full'>
            <input {...register("searchValue")} className='w-full px-8' css={css`
              font-size:var(--defaultSpace);
              ${openFilter ?`display:none;`:`display:block;`}
              @media (min-width: ${mobileWidth}px) {
                display:block;
              }
            `}/>
            <Button styleType='primary' className='whitespace-nowrap py-0' type='submit' inlineCSS={`
              border-bottom-width:0;font-size:2.4rem;height:6.5rem;
              ${openFilter ? 'width:100%;':`
                width:6.5rem;text-indent:-1000em;background: var(--pointColor) url(/images/icon-search.svg) no-repeat center/70%;
              `}
              @media (min-width: ${mobileWidth}px) {
                width:auto;text-indent:0;background:var(--pointColor);padding:0 6rem;
              }
            `}>검색</Button>
          </div>
          <Button styleType='dimmend' type="button" onClick={reset} className="aspect-square" inlineCSS={`
            text-indent:-1000em;height:6.5rem;background: url(/images/icon-reset.svg)no-repeat center/60%;
            ${openFilter ?`display:block;`:`display:none;`}
            @media (min-width: ${mobileWidth}px) {
              display:block;
            }
          `}>재설정</Button>
        </div>
        {/* 필터 선택 영역 */}
        <div className='' css={css`
          ${openFilter ?`
          position:fixed;top:0;left:0;width:100%;height:100%;z-index:10;background:var(--backgroundColor);
          ` : `text-align:center;`}
          @media (min-width: ${mobileWidth}px) {
            position:static;width:100%;height:auto;z-index:0;border:0;text-align:left;
            border:1px solid var(--lightGrayColor);
          }
        `}>
          <ToggleButton openFilter={openFilter} setOpenFilter={setOpenFilter}/>
          {/* 필터 버튼들 */}
          <div css={css`
            font-size:var(--defaultSpace);
            display:${openFilter ?'block': 'none'};
            @media (min-width: ${mobileWidth}px) {
              display:flex;
            }
          `}>
            {/* 상황별 => 검색 버튼을 눌렀을때만 반영 */}
            {filterJson.map((filter, i) => (
              <FilterListContainer open={open[i]}  key={filter.name}
                header={<FilterButton title={filter.title} open={open} i={i} setOpen={setOpen}/>}
              >
                {filter.option.map((option) => <FilterOption 
                key={option.code} filterName={filter.name} option={option} 
                timeCodeList={timeCodeList} difficultyCodeList={difficultyCodeList} 
                situationCodeList={situationCodeList} kindCodeList={kindCodeList}
                register={register} />)}
              </FilterListContainer>
            ))}

            {/* 정렬 선택시 바로 변경 */}
              
            <FilterListContainer open={open[open.length - 1]} header={<FilterButton title={`${
              sortType.findIndex(sort => sort[0] === router.query.sort) > 0 ? 
                sortType[sortType.findIndex(sort => sort[0] === router.query.sort)][1] :
                sortType[0][1]
              }순`} open={open} i={open.length - 1} setOpen={setOpen}
            />}>
              {sortType.map((option, i) => (
                <FilterOptionContainer 
                  selected={(router.query.sort === option[0] || (!router.query.sort && i === 0))} 
                  key={option[0]}
                  onClick={() => {
                    let o = open;
                    o[open.length - 1] = !o[open.length - 1]
                    setOpen([...o])
                    router.push({
                      pathname: router.pathname,
                      query: {...router.query, sort: option[0]}
                    },undefined, {scroll:false})
                    refetch()
                  }}
                >
                  {option[1]}순
                </FilterOptionContainer>
              ))}
            </FilterListContainer>
          </div>
        </div>
        {/* 선택된 필터 영역 */}
        {filterJson.filter((filter) => router.query[filter.name.replace('CodeList','')]).length > 0 && 
          <div className='py-20 text-center border-b border-solid' css={css`
              border-color:var(--lightGrayColor);
          `}>
            {filterJson.map((filter, i) => <SelectedFilter key={i} 
              query={filter.name.replace('CodeList','')}
              setValue={setValue}
            />)}
          </div>
        }
    </form>
  )
}
