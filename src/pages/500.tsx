
/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import Button from "@/components/button";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();
  return (
        <div className="flex text-center items-center justify-center flex-col" css={css`
            height:calc(100svh - 15.4rem);
        `}>
          <span className="font-extrabold" css={css`font-size:15.4rem;`}>
            5<em className="inline-block align-middle w-[13.4rem] h-[12.8rem] relative" css={css`
                background: url("/images/yesus_404.gif") no-repeat 50% 50%;
                background-size: contain;
                margin: -3rem -2rem 0 -1.5rem;text-indent:-1000em;
            `}>0</em>0
          </span>
          <strong css={css`font-size:var(--defaultSpace);`}>Oops, Page not found!</strong>
          <div className="mt-14">
            <Button onClick={() => router.back()}>
                이전페이지로 가기
            </Button>
          </div>
        </div>
  );
}
