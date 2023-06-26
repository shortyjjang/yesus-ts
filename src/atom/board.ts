import { atom } from "recoil";

type bbsListType = {
    categoryId: number,
    contents: string,
    endDate: string,
    managementId: number,
    page: number,
    productId: number,
    registerId: string,
    registerName: string,
    registerNickname: string,
    rows: number,
    startDate: string,
    title: string
}
export interface bbsInfoType {
    categoryList: {
        id: number,
        name: string
    }[],
    categoryUseYn: string,
    commentUseYn: string,
    defaultContents: string,
    defaultContentsUseYn: string,
    defaultTitle: string,
    defaultTitleUseYn: string,
    fileUploadUseYn: string,
    guide: string,
    id: number,
    listContentsMarkUseYn: string,
    markType: string,
    name: string,
    nameMarkType: string,
    readRole: string,
    registerTimeUseYn: string,
    replyCommentUseYn: string,
    replyUseYn: string,
    scoreUseYn: string,
    secretUseYn: string,
    sortType: string,
    useProductYn: string,
    viewCountUseYn: string,
    voteUseYn: string,
    writeRole: string
  }

export const bbsInfo = atom<bbsInfoType[]>({
    key: 'bbs_Info',
    default: []
})