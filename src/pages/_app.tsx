/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import Header, { mobileWidth } from '@/layout/header';
import Footer from '@/layout/footer';
import { DefaultSeo } from 'next-seo'
import SEO from '@/util/next-seo.config'
import Head from "next/head";
import { useEffect, useState } from "react";

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  useEffect(() => {
    setIsLoading(true)
  },[])
  return (
    <RecoilRoot>
      <DefaultSeo {...SEO} />
      <Head>
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name='keywords' content="예스어스, 못난이, 농산물, 지구, 친환경, 가치소비, 어스박스" />
        <meta charSet="utf-8" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          {/* devtools */}
          <ReactQueryDevtools initialIsOpen={process.env.NODE_ENV !== 'production'} />
          {isLoading && <div className="flex flex-col justify-between min-h-screen">
            <div css={css`
              padding-top: calc(16rem + 2px);
              @media (min-width: ${mobileWidth}px) {
                padding-top: calc(17rem + 2px);
              }
            `}>
            <Header />
            <Component {...pageProps} mobileWidth={mobileWidth} />
            </div>
            <Footer />
          </div>}
        </Hydrate>
      </QueryClientProvider>
    </RecoilRoot>
  )
}
