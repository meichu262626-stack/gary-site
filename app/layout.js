import "./globals.css";
import { getSite, SITE_ORIGIN, pageUrl } from "../lib/content";

// 分享預覽圖用 JPG（LINE 對 WebP 支援不穩）
const OG_IMAGE = pageUrl("/og/avatar.jpg");

export async function generateMetadata() {
  const { profile } = await getSite();
  const description = profile.description.replace(/\n/g, " ");
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: profile.seoTitle,
    description,
    alternates: { canonical: pageUrl("/") },
    openGraph: {
      type: "website",
      locale: "zh_TW",
      url: pageUrl("/"),
      title: profile.seoTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: profile.seoTitle, description, images: [OG_IMAGE] },
    robots: { index: true, follow: true },
  };
}

export const viewport = { width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }) {
  const { profile } = await getSite();
  return (
    <html lang="zh-Hant-TW" style={{ "--theme": profile.theme, "--page-bg": profile.background }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800;900&family=Noto+Sans+TC:wght@400;500;600;700;800;900&display=swap"
        />
      </head>
      <body>
        <div className="page">
          <main className="container">{children}</main>
          <footer className="footer">
            <span>© {new Date().getFullYear()} {profile.name}</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
