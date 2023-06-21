import React from 'react'
import AddPost from './add'
import { bbsInfoType } from '@/atom/board'

export default function EditPost({
    thisBBSInfo,
    articleId,
    setAlert
}:{
    thisBBSInfo: bbsInfoType
    articleId: string
    setAlert: (msg: string) => void
}) {
  return (
    <AddPost thisBBSInfo={thisBBSInfo} setAlert={setAlert} />
  )
}
