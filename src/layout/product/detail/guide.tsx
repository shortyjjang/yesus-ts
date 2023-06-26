/** @jsxImportSource @emotion/react */
import Container from '@/layout/container';
import { css } from '@emotion/react';

export default function ProductGuide({
    productPaymentInfoHtml,
    productShippingInfoHtml,
    productExchangeInfoHtml
}:{
    productPaymentInfoHtml?: string
    productShippingInfoHtml?: string
    productExchangeInfoHtml?: string
}) {
  return (
    <Container>
      <dl css={guideCSS}>
        {productPaymentInfoHtml && <>
            <dt>결제방법</dt>
            <dd
            dangerouslySetInnerHTML={{
                __html: productPaymentInfoHtml,
            }}
            ></dd>
        </>}
        {productShippingInfoHtml && <>
            <dt>결제방법</dt>
            <dd
            dangerouslySetInnerHTML={{
                __html: productShippingInfoHtml,
            }}
            ></dd>
        </>}
        {productExchangeInfoHtml && <>
            <dt>환불규정</dt>
            <dd
            dangerouslySetInnerHTML={{
                __html: productExchangeInfoHtml,
            }}
            ></dd>
        </>}
      </dl>
    </Container>
  )
}
const guideCSS = css`
dt {
  font-weight: 900;
  font-size: 2.47rem;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
  line-height: 1.3;
  border-bottom: 1px solid #000;
  text-align: left;
}
dd {
  color: #5b5b5b;
  line-height: 1.3;
  > strong,
  .contents > strong {
    font-weight: 900;
    color: #555;
    display: block;
    font-size: 2.16rem;
    line-height: 1.3;
  }
  .contents > strong + dl dt {
    margin-top: 1rem;
  }
  dl {
    margin: 0 0 2.3rem;
  }
  dd {
    position: relative;
    padding: 0.9rem 0 0 2rem;
    font-size: 2rem;
  }
  dd:before {
    content: "-";
    position: absolute;
    top: 0.9rem;
    left: 0.38rem;
  }
  sub {
    background: rgba(0, 0, 0, 0.1);
    color: #555;
    font-size: 1.87rem;
    position: relative;
    left: 2.4rem;
  }
}
dd + dt {
  margin-top: var(--defaultSpace);
}
`
