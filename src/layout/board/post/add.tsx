import { bbsInfoType } from '@/atom/board'
import React from 'react'

export default function AddPost({
    thisBBSInfo,
    articleId,
    setAlert
}:{
    thisBBSInfo: bbsInfoType
    articleId?: string
    setAlert: (msg: string) => void
}) {
  return (
    <div>add</div>
  )
}
