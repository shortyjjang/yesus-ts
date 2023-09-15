/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useRouter } from "next/router"

export default function RecipeTag({
    tags,
    name,
    title,
    option
}:{
    tags: string[]
    name: string
    title: string
    option:{
        code: number
        caption: string
        ord: number
    }[]
}) {
    const router = useRouter()
    if(tags.length < 1) return;
  return (
    tags.map((item) => {
        const codeIndex = option.findIndex((f) => f.caption === item)
        return (
            <span key={item} className="bg-white inline-flex items-center pl-5 pr-3 pt-2 rounded-lg border border-solid mb-4 mr-4"
                css={css`
                    font-size:2.16rem;
                    border-color:var(--greenColor);
                    color:var(--greenColor);
                `}
                onClick={() => {
                    router.push(`/recipes?${
                        name.replace('CodeList','')}=${
                        option[codeIndex].code
                    }`)
                }}
            >
                #{option[codeIndex].caption}
            </span>
        )

    })
  )
}
