
/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import Button from "@/components/button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Custom404() {
  const [isLoading, endLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if(location.pathname.includes('/board/') && location.pathname.includes('/4')){
      router.replace("/review");
      return;
    }
    if(location.pathname.includes('/board/') && location.pathname.includes('/1')){
      router.replace("/notice");
      return;
    }
    if(location.pathname.includes('/shopinfo/')){
      router.replace("/yes2020");
      return;
    }
    if(location.pathname.includes('/blog/')){
      router.replace("/blog");
      return;
    }
    if(location.pathname.includes('/faq/')){
      router.replace("/faq");
      return;
    }
    if (location.pathname.includes("/product/") && location.pathname.includes('/board/product/partner.html')){
        router.replace("/esg");
        return;
      }
    if (location.pathname.includes("/recipe/")) {
      if (location.search.replace("?", "").split("&")[0].includes("rid")) {
        router.replace(
          `/recipes/${location.search
            .replace("?", "")
            .split("&")[0]
            .replace("rid=", "")}`
        );
        return;
      }
      router.replace("/recipes");
    }
    if (location.pathname.includes("/member/")) {
      router.replace("/login");
    }
    if (
      location.pathname.includes("/article/")
    ) {
      router.replace("/");
    }
    if (location.pathname.includes("/mukbti_v2/")) {
      router.replace("/mukvti");
    }
    endLoading(true);
  }, [router]);
  if(!isLoading) return (<></>)
  return (
        <div className="flex text-center items-center justify-center flex-col" css={css`
            height:calc(100svh - 15.4rem);
        `}>
          <span className="font-extrabold" css={css`font-size:15.4rem;`}>
            4<em className="inline-block align-middle w-[13.4rem] h-[12.8rem] relative" css={css`
                background: url("/images/yesus_404.gif") no-repeat 50% 50%;
                background-size: contain;
                margin: -3rem -2rem 0 -1.5rem;text-indent:-1000em;
            `}>0</em>4
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
