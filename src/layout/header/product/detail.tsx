/** @jsxImportSource @emotion/react */

import { useParams } from 'next/navigation'

export default function ProductDetail() {
    const { id } = useParams()
  return (
    <div>{id}</div>
  )
}
