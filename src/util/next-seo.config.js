// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "예스어스",
  titleTemplate:
    "친환경 못난이 농산물로 나와 지구를 위한 가치소비를 실현해보세요. | %s",
  canonical: process.env.NEXT_PUBLIC_URL,
  description:
    "친환경 못난이 농산물로 나와 지구를 위한 가치소비를 실현해보세요.",
  themeColor: "#111",

  additionalLinkTags: [
    {
      rel: "icon",
      href : `${process.env.NEXT_PUBLIC_URL}/favicon.ico`,
    },
    {
      rel: "apple-touch-icon",
      href : `${process.env.NEXT_PUBLIC_URL}/images/yesus_app_pn96.png`,
      sizes: "95x95",
    },
    {
      rel: "mask-icon",
      href : `${process.env.NEXT_PUBLIC_URL}/images/yesus_app_icon.png`,
      color: "#193860",
    },
    {
      rel: "apple-touch-startup-image",
      href : `${process.env.NEXT_PUBLIC_URL}/images/splash_1440_3120_01.png`,
    },
  ],
  openGraph: {
    type: "website",
    locale: "en_KR",
    url: process.env.NEXT_PUBLIC_URL,
    siteName: "예스어스",
    title: "For Earth, By Us. 예스어스",
    description:
      "친환경 못난이 농산물로 나와 지구를 위한 가치소비를 실현해보세요.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL}/images/ogimg.jpg`,
        width: 800,
        height: 600,
        alt: "YES US",
        type: "image/jpeg",
        secureurl: `${process.env.NEXT_PUBLIC_URL}/images/ogimg.jpg`,
      },
    ],
  },
  robotsProps: {
    // nosnippet: true,
    // notranslate: true,
    // noimageindex: true,
    // noarchive: true,
    // maxSnippet: -1,
    // maxImagePreview: 'none',
    // maxVideoPreview: -1,
  },
  twitter: {
    url: `${process.env.NEXT_PUBLIC_URL}`,
    title: "For Earth, By Us. 예스어스",
    description:
      "친환경 못난이 농산물로 나와 지구를 위한 가치소비를 실현해보세요.",
      image: `${process.env.NEXT_PUBLIC_URL}/images/ogimg.jpg`,
      card: "photo",
      site: '예스어스'
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/member", "/order"],
      },
    ],
    additionalSitemaps: ["/sitemap.xml"],
  },
};
