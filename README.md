# Gary營養師 個人網站

從 Portaly（portaly.cc/gary_nutri365）1:1 復刻出來的網站，Next.js 寫的。

- 內容：`data/site.json`（之後改接 Supabase，只要改 `lib/content.js`）
- 圖片：`public/images/`
- 外觀：`app/globals.css`（數值照原頁面量的）
- 區塊元件：`components/Blocks.js`
- 重新從備份匯入：`python3 -I scripts/convert_portaly.py`，再跑 `node scripts/optimize_images.mjs` 壓縮圖片

本機預覽：

```bash
npm install
npm run dev
```

打開 http://localhost:3000
