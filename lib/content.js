import site from "../data/site.json";

// 放在 GitHub Pages 子路徑（/gary-site）時，圖片路徑要加上前綴；Railway 上則是空字串
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

function withBase(value) {
  if (typeof value === "string") return value.startsWith("/images/") ? BASE + value : value;
  if (Array.isArray(value)) return value.map(withBase);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withBase(v)]));
  }
  return value;
}

const resolved = withBase(site);

// 目前內容來自 data/site.json（從 Portaly 備份轉出來的）。
// 之後接 Supabase 時，只要改這個檔案，讓它改從資料庫讀，頁面程式不用動。
export async function getSite() {
  return resolved;
}

export async function getPage(slug) {
  const s = await getSite();
  return s.pages.find((p) => p.slug === slug) || null;
}
