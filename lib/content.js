import site from "../data/site.json";

// 目前內容來自 data/site.json（從 Portaly 備份轉出來的）。
// 之後接 Supabase 時，只要改這個檔案，讓它改從資料庫讀，頁面程式不用動。
export async function getSite() {
  return site;
}

export async function getPage(slug) {
  const s = await getSite();
  return s.pages.find((p) => p.slug === slug) || null;
}
