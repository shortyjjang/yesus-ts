
export default function Score({
   score,
   register 
}:{
    score: string
    register: any
}) {
  return (
    <div>
      <span>
        <input type="radio" value="1" {...register("score")} />
        {Number(score) > 0 ? '★': '☆'}
      </span>
      <span>
        <input type="radio" value="2" {...register("score")} />
        {Number(score) > 1 ? '★': '☆'}
      </span>
      <span>
        <input type="radio" value="3" {...register("score")} />
        {Number(score) > 2 ? '★': '☆'}
      </span>
      <span>
        <input type="radio" value="4" {...register("score")} />
        {Number(score) > 3 ? '★': '☆'}
      </span>
      <span>
        <input type="radio" value="5" {...register("score")} />
        {Number(score) > 4 ? '★': '☆'}
      </span>
      {score === "5" && <b>최고예요!</b>}
      {score === "4" && <b>좋아요!</b>}
      {score === "3" && <b>보통이에요</b>}
      {score === "2" && <b>그냥 그래요</b>}
      {score === "1" && <b>아쉬워요</b>}
    </div>
  )
}
