/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import Container from "@/layout/container";
import { mobileWidth } from "@/layout/header";
import SlideBanner from "@/layout/product/banner";
import ItemCard from "@/layout/product/card";
import CategoryList, { CategoryType } from "@/layout/product/category";
import SearchKeyword from "@/layout/product/search";
import { Api, ApiResponseType } from "@/util/api";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Select from "@/components/input/select";
import { useRouter } from "next/router";
import Head from "next/head";

export default function ProductList({
    category
}:{
    category: CategoryType[]
}) {
    const router = useRouter()
    const [categoryId, setCategoryId] = useState<number | null>(category[0]?.categoryId)
    const [sort, setSort] = useState<string>('NEW_ORDER')
    const [keyword, setKeyword] = useState<string>('')
    const banner = useQuery(['banner', categoryId], async () => {
        if(!categoryId) return;
        return await getBanner(categoryId)
    })
    const product = useQuery(['products', {categoryId, keyword, sort}], async () => {
        if(!categoryId) return;
        return await getProductList(categoryId, keyword, sort)
  })
  const replace = (queryType:string, value:string | number) => {
    let query = router.query
    if((
        queryType === 'keyword' && !value) 
        || (queryType === 'sort' && value === 'NEW_ORDER') 
        || (queryType === 'category' && value === category[0]?.categoryId)
    ){
        delete query[queryType]
    }
    else query = {...query, [queryType]: String(value)}
    router.replace({pathname : `/product`, query})

  }
  useEffect(() => {
    if(!router.isReady) return;
    if(router.query.category) setCategoryId(Number(router.query.category))
    if(router.query.sort) setSort(String(router.query.sort))
    if(router.query.keyword) setKeyword(String(router.query.keyword))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[router.isReady])
  if(categoryId) return (
    <main>
        <Head>
            <title>{category ? `${category.find(cate => cate.categoryId === categoryId)?.categoryName === 'all' ? '단품' : category.find(cate => cate.categoryId === categoryId)?.categoryName} - `:''}예스어스</title>
        </Head>
      {category && <>
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
        {category && <CategoryList category={categoryId} setCategory={(categoryId) => {
            setCategoryId(categoryId)
            replace('category', categoryId)
        }} categories={category} />}
        {product.data && (
        <Container>
            <SearchKeyword setKeyword={(keyword) => {
                setKeyword(keyword)
                replace('keyword', keyword)
            }} keyword={keyword} />
            <div className="flex justify-between items-center mb-8">
                <div>총 <b className="fcg">{product.data?.content?.totalCount}</b>개</div>
                <Select value={sort} setValue={(e) => {
                    setSort(e.target.value)
                    replace('sort', e.target.value)
                }} size="big" options={[
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
    if(all && all.children) return [
        {
            ...all,
            categoryName: 'all'
        },
        ...all.children
    ]
    return[{
        ...all,
        categoryName: 'all'
    }]
  }
}

export async function getStaticProps() {
    // const queryClient = new QueryClient()
    try {
        const data = await getCategories()
    //     await Promise.all([
    //       queryClient.prefetchQuery(['categories'], async () => {
    //         const data = await getCategories()
    //         return data
    //       }),
    //     ]);
        
        return {
          props: {
            // dehydratedState: dehydrate(queryClient),
            category: data
          },
          revalidate: 10,
        };
    } catch (e) {
        return {
            notFound: true,
        };
    } finally {
        // queryClient.clear();
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