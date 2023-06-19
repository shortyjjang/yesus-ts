
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import Container from "../../container"

export type CategoryType = {
    categoryId: number,
    categoryName: string,
    parentId: number,
    categoryOrder: number,
    categoryFullPath: string,
    children: CategoryType[]
}

export default function CategoryList({
    category, 
    setCategory,
    categories
} : {
    category: number,
    setCategory: (categoryId: number) => void
    categories: CategoryType[]
}) {
    const CategoryButton = ({
        categoryId, 
        categoryName
    }:{
        categoryId: number,
        categoryName: string
    }) => (
        <div className='inline-flex justify-center items-center cursor-pointer min-w-[18.75rem] '
            css={css`
                color:${category === categoryId ? 'var(--defaultColor)' : 'var(--grayColor)'};
                height:6.7rem;font-size:2.15rem;
                ${category === categoryId ? `
                    box-shadow: inset 0 -2px 0 var(--defaultColor);
                    font-weight:900;
                ` : ''};
            `}
            onClick={() => category !== categoryId && setCategory(categoryId)}
        >
            {categoryName}
        </div>
    )
    return (
        <Container>
            <div className='whitespace-nowrap overflow-auto border-t border-b border-solid border-black mb-7'>
            {categories.map((item:CategoryType) => (
                    <CategoryButton key={item.categoryId} {...item}/>
                ))
            }</div>
        </Container>
    )
}