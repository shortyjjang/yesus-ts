import Auth from "@/layout/auth";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";

export default function Home() {
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const category = useQuery('categories', async () => {
    const data = await getCategories()
    if(data && data[0]) setCategoryId(data[0]?.categoryId)
    return data
  })
  if(category.isLoading) return <></>
  if(category.isError) return <></>
  if(categoryId) return (
    <Auth role="NON">
      {category.data && <>
        {category.data.map(category => <div key={category?.categoryId} onClick={() => setCategoryId(category?.categoryId)}>
          {category?.categoryName}
        </div>)}{categoryId}
        {category.data[0]?.categoryId > 0 && <ProductList category={categoryId} />}
      </>}
    </Auth>
  )
}

function ProductList({category}:{category:number}) {
  const [sort, setSort] = useState<string>('NEW_ORDER')
  const [keyword, setKeyword] = useState<string>('')
  const product = useQuery(['categories', category], async () => await getProductList(category, keyword, sort),{
    refetchInterval: false
  })
  if(product.isLoading) return <></>
  if(product.isError) return <></>
  if(product.data) return (
    <div>
      리스트{
      product.data.content.items.map((item:ProductType) => <div key={item.productId}>{item.productName}</div>)
    }</div>
  )
}

type ProductType = {
  productId: number
  productName: string
}

type CategoryType = {
  categoryId: number,
  categoryName: string,
  parentId: number,
  categoryOrder: number,
  categoryFullPath: string,
  children: CategoryType[]
}

type ResonseType = {
  content?: any,
  meta?: {
    result?: string,
    code?: number,
    resultMsg?: string
  }
}

const getProductList = async (categoryId:number, keyword:string, sort:string) => {
  const response:ResonseType = await axios.post(`${process.env.NEXT_PUBLIC_ATD_API_BASIC_PATH}/api/product/v1/getProductInfo`,{
    "categoryId": categoryId,
    "pageCount": 100,
    "pageIndex": 1,
    "searchKeyword": keyword,
    "sortType": sort
  }).then(res => res.data)
  return response
}

const getCategories = async () => {
  const response:ResonseType = await axios.get(`${process.env.NEXT_PUBLIC_ATD_API_BASIC_PATH}/api/category/v1/display`).then(res => res.data);
  if(response.content && response.content.flatList && response.content.flatList.find((category:CategoryType) => category.categoryName === '단품')) {
    let all = response.content.hierarchyList.find((category:CategoryType) => category.categoryName === '단품')
    if(all && all.children) return [
      all,
      ...all.children
    ]
    return[
      all
    ]
  }
}
