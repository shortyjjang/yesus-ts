/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import Header, { mobileWidth } from '@/layout/header';
import Footer from '@/layout/footer';

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
        <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          {/* devtools */}
          <ReactQueryDevtools initialIsOpen={process.env.NODE_ENV !== 'production'} />
          <div className="flex flex-col justify-between min-h-screen">
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
          </div>
          </QueryClientProvider>
        </RecoilRoot>
  )
}
