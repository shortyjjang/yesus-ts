/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState } from 'react'

export default function RecipeIngredients({
    ingredients,
    defaultCount,
    recipeUnit
}:{
    ingredients: RecipeIngredientsType[]
    defaultCount: number,
    recipeUnit: string
}) {
    const [recipeUnitCount, setRecipeUnitCount] = useState<number>(defaultCount);
    return (
        <>
            <div className="flex items-center py-10 border-y border-solid border-black" css={css`
                button {
                    height: 100%;
                    width: 2.5rem;
                    position: relative;
                }
                .plus:after,
                button:before {
                    content: "";
                    width: 100%;
                    height: 0.25rem;
                    background: var(--defaultColor);
                    display: block;
                }
                .plus:after {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(90deg);
                }
            `}>
                <button
                className="minus"
                disabled={recipeUnitCount > 1 ? false : true}
                onClick={() => setRecipeUnitCount(recipeUnitCount - 1)}
                title="마이너스"
                ></button>
                <b className='font-extrabold mx-20' css={css`
                font-size:3rem;
                `}>{recipeUnitCount}{recipeUnit}</b>
                <button
                className="plus"
                onClick={() => setRecipeUnitCount(recipeUnitCount + 1)}
                title="플러스"
                ></button>
            </div>
            {ingredients.map((ig, i) => (
                <dl key={ig.ingreType} className={`grid py-8 ${i > 0 ? 'border-t border-solid':''}`} css={css`
                    border-color:var(--lightGrayColor);
                    grid-template-columns: 30% auto;
                    font-size:var(--defaultSpace);
                `}>
                    <dt className="font-extrabold" css={css`
                        font-size:2.5rem;
                    `}>{ig.ingreType}</dt>
                    {ig.items && <dd>
                        {ig.items.map((it) => (
                            <div key={it.name} className="flex justify-between">
                                <label>{it.name}</label>
                                <span>
                                    {String(
                                    (
                                        it.count *
                                        recipeUnitCount
                                    ).toFixed(1)
                                    ).replace(".0", "")}
                                    {it.unit}
                                </span>
                            </div>
                        ))}
                    </dd>}
                </dl>
            ))}
        </>
    )
}

export type RecipeIngredientsType = {
    "ingreType": string,
    "items":
    {
        "unit": string,
        "name": string,
        "count": number
    }[]
}