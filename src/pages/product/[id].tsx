import { CategoryType } from "@/layout/product/category";
import { Api, ApiResponseType } from "@/util/api";
import { GetStaticPropsContext } from "next";
import { NextSeo } from "next-seo";
import ProductDetailView, { ProductResponseType } from "@/layout/product/detail";
import Confirm from "@/layout/confirm";
import { useRouter } from "next/router";
import Auth from "@/layout/auth";

export default function ProductDetail({post}: {post: ProductResponseType}) {
    const router = useRouter()
    if(!post) return (<Confirm onClose={() => router.push('/product')}>존재하지 않는 상품입니다.</Confirm>)
    return (
        <Auth role="NON">
            <NextSeo
                title={`${post.productName ? post.productName : "유기농, 못난이 농산물"} - 예스어스`}
                description={post.productSummaryDesc}
                canonical={`${process.env.NEXT_PUBLIC_URL}/product/${post.productId}`}
                openGraph={{
                    url: `${process.env.NEXT_PUBLIC_URL}/product/${post.productId}`,
                    title: `${post.productName ? post.productName : "유기농, 못난이 농산물"} - 예스어스`,
                    description: post.productSummaryDesc,
                    images: post.productImageList.map((img) => ({
                        url: img.productImageFullPath,
                        width: 600,
                        height: 600,
                        alt: `${post.productName ? post.productName : "유기농, 못난이 농산물"} - 예스어스`,
                        type: 'image/jpeg',
                    })),
                    siteName: '예스어스',
                }}
            />
            {post.productGubun === '단일상품' ?
                <ProductDetailView post={post}/>
            : <></>}
        </Auth>
    )
}

export async function getStaticProps({ params }:GetStaticPropsContext) {
    try {
        let post:any = {};
        if(!params?.id) return;
        const request:ApiResponseType = await Api.get(`/api/product/v1/${params?.id}`);
    
        if (request?.meta?.resultMsg) {
            return {
                notFound: true,
                props: {},
                revalidate: 10,
            };
        }
        post = request.content;
        return {
            props: {
                post,
            },
            revalidate: 10, // In seconds
        }
    } catch (e) {
        return {
            notFound: true,
        };
    }
  }
   
  export async function getStaticPaths() {
    const res:ApiResponseType = await Api.get("/api/category/v1/display");
    let ids: number[] = [];
    await Promise.all(res.content.flatList.map(async (category:CategoryType) => {
      const list:ApiResponseType = await Api.post(`/api/product/v1/getProductInfo`,{
        "categoryId": category.categoryId,
        "pageCount": 100,
        "pageIndex": 1,
        "searchKeyword": "",
        "sortType": "NEW_ORDER"
      })
      await Promise.all(list.content.items.map((item:any) => {
          if(ids.find(id => id === item.productId)) return;
          ids.push(item.productId);
        })
      )
    }))
  
   
    // Get the paths we want to pre-render based on posts
    const paths = ids.map((id) => ({
      params: { id: id },
    }))
   
    // We'll pre-render only these paths at build time.
    // { fallback: 'blocking' } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: 'blocking' }
  }