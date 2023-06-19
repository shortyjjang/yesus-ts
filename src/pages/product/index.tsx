/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import Container from "@/layout/container";
import { mobileWidth } from "@/layout/header";
import SlideBanner from "@/layout/header/product/banner";
import ItemCard from "@/layout/header/product/card";
import CategoryList, { CategoryType } from "@/layout/header/product/category";
import SearchKeyword from "@/layout/header/product/search";
import { Api, ApiResponseType } from "@/util/api";
import { useState } from "react";
import { useQuery } from "react-query";
import Select from "@/components/input/select";

export default function ProductList() {
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [sort, setSort] = useState<string>('NEW_ORDER')
  const [keyword, setKeyword] = useState<string>('')
  const banner = useQuery(['banner', categoryId], async () => {
    if(!categoryId) return;
    return await getBanner(categoryId)
  })
  const product = useQuery(['categories', categoryId], async () => {
    if(!categoryId) return;
    return await getProductList(categoryId, keyword, sort)
  })
  const category = useQuery('categories', async () => {
    const data = await getCategories()
    if(data && data[0]) setCategoryId(data[0]?.categoryId)
    return data
  })
  if(category.isLoading) return <></>
  if(category.isError) return <></>
  if(categoryId) return (
    <main>
      {category.data && <>
        {banner.data && banner.data.content && banner.data.content.length > 0 && <Container className='mb-20'
         inlineCSS={`
            @media (max-width:${mobileWidth}px) {padding-left:0;padding-right:0;}
        `}>
            <SlideBanner 
            banners={banner.data?.content[0].popBannerBannerSlideList} 
            pagination={true} 
            autoplay={true}
            inlineCSS={bannerCSS}
        />
        </Container>}
        {category.data && <CategoryList category={categoryId} setCategory={setCategoryId} categories={category.data} />}
        {product.data && (
        <Container>
            <SearchKeyword setKeyword={setKeyword} />
            <div className="flex justify-between items-center mb-8">
                <div>총 <b className="fcg">{product.data?.content?.totalCount}</b>개</div>
                <Select value={sort} setValue={(e) => setSort(e.target.value)} size="big" options={[
                    ['신상품순', 'NEW_ORDER'],
                    ['인기순', 'POPULAR_ORDER'],
                    ['낮은가격순', 'LOW_PRICE_ORDER'],
                    ['높은가격순', 'HIGH_PRICE_ORDER']
                ]} />
            </div>
            <div className="grid grid-cols-2 gap-8" css={css`
                @media (min-width: ${mobileWidth}px) {grid-template-columns:repeat(3,1fr);}
            `}>
                {product.data?.content?.items?.map((item: any) => (
                    <ItemCard key={item.productId} {...item} />
                ))}
            </div>
        </Container>
        )}
      </>}
    </main>
  )
}

const getBanner = async (categoryId:number) => {
    const response: ApiResponseType = await Api.get('/api/pop_banner/v1', {
        params: {
            pbMode: 'ALL',
            pbSite: 'PS02',
            pbepPath: `https://m2.yes-us.co.kr/product?category=${categoryId}`
        }
    })
    return response
}
const getProductList = async (categoryId:number, keyword:string, sort:string) => {
  const response:ApiResponseType = await Api.post(`/api/product/v1/getProductInfo`,{
    "categoryId": categoryId,
    "pageCount": 100,
    "pageIndex": 1,
    "searchKeyword": keyword,
    "sortType": sort
  })
  return response
}

const getCategories = async () => {
  const response:ApiResponseType = await Api.get(`/api/category/v1/display`);
  if(response.content && response.content.flatList && response.content.flatList.find((category:CategoryType) => category.categoryName === '단품')) {
    let all = response.content.hierarchyList.find((category:CategoryType) => category.categoryName === '단품')
    console.log(all)
    if(all && all.children) return [
      all,
      ...all.children
    ]
    return[
      all
    ]
  }
}

const bannerCSS = `
background:#fff;
.swiper-pagination-bullets {display:flex;position:absolute;bottom:var(--defaultSpace);left:var(--defaultSpace);right:var(--defaultSpace);z-index:1;}
.swiper-pagination-bullets > span {width:100%;height:0.32rem;background:#fff;opacity:0.2;}
.swiper-pagination-bullets .swiper-pagination-bullet-active {opacity:1;}
.swiper-slide {
    .relative {aspect-ratio:1/1;width:100%;}
    color:#fff;
    h3 {
        font-size: 4.14rem;
        font-weight: 900
    }

    .fs20 {
        font-size: 2rem;
        padding-top: 1rem;
        display: none
    }
    a {position:absolute;top:0;left:0;width:100%;height:100%;}
    .text {
        position:flex;width:100%;height:100%;position:absolute;top:0;left:0;
        padding: 4.61rem 2.31rem;
        font-size: 4.14rem;
        font-weight: 900
    }
}
@media screen and (min-width: ${mobileWidth}px) {
    .swiper-pagination-bullets {left:calc(50% + var(--defaultSpace));}
    .swiper-slide {
        display:flex;flex-direction:row-reverse;
        .text {position:relative;color:#000;display:flex;justify-content:center;align-items:center;text-align:center;aspect-ratio:1/1;}
    }
}
`