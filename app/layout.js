import "./globals.css";
import { getSite } from "../lib/content";

export async function generateMetadata() {
  const { profile } = await getSite();
  const description = profile.description.replace(/\n/g, " ");
  return {
    title: profile.seoTitle,
    description,
    openGraph: {
      type: "website",
      locale: "zh_TW",
      title: profile.seoTitle,
      description,
      images: [profile.avatar],
    },
    twitter: { card: "summary_large_image", title: profile.seoTitle, description, images: [profile.avatar] },
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
