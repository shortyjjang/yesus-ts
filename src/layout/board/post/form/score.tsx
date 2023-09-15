/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"

export default function Score({
   score,
   register,
   withText = true,
   inlineCSS
}:{
    score: string
    register: any
    withText?: boolean
    inlineCSS?: string
}) {
  return (
    <div css={css`
      ${inlineCSS ? inlineCSS : ''}
    `}>
      <span className="relative">
        <input type="radio" value="1" {...register("score")} className="absolute top-0 left-0 w-full h-full" />
        {Number(score) > 0 ? '★': '☆'}
      </span>
      <span className="relative">
        <input type="radio" value="2" {...register("score")} className="absolute top-0 left-0 w-full h-full" />
        {Number(score) > 1 ? '★': '☆'}
      </span>
      <span className="relative">
        <input type="radio" value="3" {...register("score")} className="absolute top-0 left-0 w-full h-full" />
        {Number(score) > 2 ? '★': '☆'}
      </span>
      <span className="relative">
        <input type="radio" value="4" {...register("score")} className="absolute top-0 left-0 w-full h-full" />
        {Number(score) > 3 ? '★': '☆'}
      </span>
      <span className="relative">
        <input type="radio" value="5" {...register("score")} className="absolute top-0 left-0 w-full h-full" />
        {Number(score) > 4 ? '★': '☆'}
      </span>
      {withText && <>
        {score === "5" && <b>최고예요!</b>}
        {score === "4" && <b>좋아요!</b>}
        {score === "3" && <b>보통이에요</b>}
        {score === "2" && <b>그냥 그래요</b>}
        {score === "1" && <b>아쉬워요</b>}
      </>}
    </div>
  )
}
