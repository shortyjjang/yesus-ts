import { Api, ApiResponseType } from "./api"

export const getProductDetail = async (productId: number) => {
    const response: ApiResponseType = await Api.get(`/api/product/v1/${productId}`)
    return response
}
export const getProductList = async (categoryId: number, keyword: string) => {
    const response: ApiResponseType = await Api.post("/api/product/v1/getProductInfo", {
        pageIndex: 1,
        sortType: "NEW_ORDER",
        pageCount: 100,
        categoryId: categoryId,
        searchKeyword: keyword
    });
    return response
}