/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper";
import Image from "next/image";
import Link from "next/link";

// Import Swiper styles
import 'swiper/css';

type BannerType = {
    pbbsId: number,
    pbbsTitle: string,
    pbbsContents: string,
    pbbsPcImagePath?: string,
    pbbsMobileImagePath?: string,
    pbbsLinkUrl: string,
    pbbsNewTabUsedYn: string,
    pbbsOrder: number
}

export default function SlideBanner({
    banners,
    pagination,
    autoplay,
    inlineCSS
}:{
    banners: BannerType[]
    pagination?: boolean
    autoplay?: boolean
    inlineCSS?: string
}) {
  return (
    <Swiper
        pagination={pagination}
        modules={[Pagination, Autoplay]}
        // autoplay={autoplay ? {
        //     delay: 4500,
        //     disableOnInteraction: false,
        // }: false}
        css={css`
            ${inlineCSS ? inlineCSS : ''}
        `}
        loop={true}
    >
        {/* {${process.env.NEXT_PUBLIC_IMG_SERVER}} */}
      {banners.map((banner) => (
        <SwiperSlide key={banner.pbbsId} className="relative">
            <div className="relative">{banner.pbbsPcImagePath && (
                <Image
                src={`https://all-to-delicious.s3.ap-northeast-2.amazonaws.com/${banner.pbbsPcImagePath}`}
                alt={banner.pbbsTitle}
                className="pc"
                fill={true}
                priority={true}
                />
            )} 
            {banner.pbbsMobileImagePath && (
                <Image
                src={`https://all-to-delicious.s3.ap-northeast-2.amazonaws.com/${banner.pbbsMobileImagePath}`}
                alt={banner.pbbsTitle}
                className="mobile"
                fill={true}
                priority={true}
                />
            )}</div>
          <div className="text"
            dangerouslySetInnerHTML={{ __html: banner.pbbsContents }}
          ></div>
          {/* <Link href={banner.pbbsLinkUrl} title={banner.pbbsTitle}></Link> */}
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
