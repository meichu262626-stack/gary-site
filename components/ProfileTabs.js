import Link from "next/link";
import Profile from "./Profile";
import Blocks from "./Blocks";

// 個人資料 + 分頁標籤；首頁顯示主內容，/tab/<slug> 顯示該分頁內容（原頁也是同一頁切換）
export default function ProfileTabs({ site, activeSlug }) {
  const page = activeSlug ? site.pages.find((p) => p.slug === activeSlug) : null;
  return (
    <div className="home">
      <Profile profile={site.profile} social={site.social} />
      <div className="tabs-wrap">
        <div className="tabs" role="tablist">
          <Link href="/" className={`tab${page ? "" : " active"}`} role="tab" aria-selected={!page}>
            {site.tabs.home}
          </Link>
          {site.tabs.others.map((t) => {
            const slug = t.url.split("/").pop();
            const active = page?.slug === slug;
            return (
              <Link key={slug} href={`/tab/${slug}`} className={`tab${active ? " active" : ""}`} role="tab" aria-selected={active}>
                {t.text}
              </Link>
            );
          })}
        </div>
        <div className="tab-content">
          {page ? (
            <div className="tab-embed">
              <Blocks blocks={page.blocks} integrations={site.integrations} />
            </div>
          ) : (
            <Blocks blocks={site.blocks} integrations={site.integrations} />
          )}
        </div>
      </div>
    </div>
  );
}
