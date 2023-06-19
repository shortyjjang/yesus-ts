
/** @jsxImportSource @emotion/react */

import { useState } from 'react'
import ProductList from "./list"
import CategoryList, { CategoryType } from "./category"
import { Api, ApiResponseType } from '@/util/api'
import { useQuery } from 'react-query'
import SlideBanner from './banner'
import { mobileWidth } from '@/layout/header'
import Container from '../../container'

export default function ProductIndex() {
    const [category, setCategory] = useState<number | null>(null)
    const [all, setAll] = useState<CategoryType | null>(null)
    const get_category = async () => {
      const response: ApiResponseType = await Api.get('/api/category/v1/display')
      if(response && response.content && response.content.flatList) {
        if(response.content.hierarchyList.find((categoryItem: CategoryType) => categoryItem.categoryName === '단품')
        ) setAll(response.content.hierarchyList.find((categoryItem: CategoryType) => categoryItem.categoryName === '단품'))
        setCategory(
            response.content.hierarchyList.find((categoryItem: CategoryType) => categoryItem.categoryName === '단품') 
                ? response.content.hierarchyList.find((categoryItem: CategoryType) => categoryItem.categoryName === '단품').categoryId 
                : response.content.flatList[0].categoryId
        )
      }
      return response
    }
    const get_banner = async () => {
        const response: ApiResponseType = await Api.get('/api/pop_banner/v1', {
            params: {
                pbMode: 'ALL',
                pbSite: 'PS02',
                pbepPath: `https://m2.yes-us.co.kr/product?category=${category}`
            }
        })
        return response
    }
    const categories = useQuery('category', get_category)
    const banner = useQuery(['banner', category], get_banner)
    if(categories.isFetched && category && all) return(<>
        {banner.isFetched && banner.data?.content?.length > 0 && <Container className='mb-20'
         inlineCSS={`
            @media (max-width:${mobileWidth}px) {padding-left:0;padding-right:0;}
        `}>
            <SlideBanner 
            banners={banner.data?.content[0].popBannerBannerSlideList} 
            pagination={true} 
            autoplay={true}
            inlineCSS={`
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
            `}
        />
        </Container>}
        {categories.isFetched && <CategoryList category={category} setCategory={setCategory} categories={[
            {
                ...all,
                categoryName: 'all',
            },
            ...all.children,
        ]} />}
        {category && <ProductList categoryId={category} />}
    </>
    )
}