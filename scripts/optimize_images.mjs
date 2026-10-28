// 把 public/images 裡的 PNG/JPG 轉成 WebP（最寬 1200px、品質 82），並更新 data/site.json 的路徑。
// 原始大圖保留在 ../備份/images。用法：node scripts/optimize_images.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "public", "images");
const dataPath = path.join(root, "data", "site.json");
let json = fs.readFileSync(dataPath, "utf8");
let before = 0;
let after = 0;

for (const name of fs.readdirSync(dir)) {
  if (!/\.(png|jpe?g)$/i.test(name)) continue;
  const src = path.join(dir, name);
  const outName = name.replace(/\.(png|jpe?g)$/i, ".webp");
  const out = path.join(dir, outName);
  before += fs.statSync(src).size;
  await sharp(src).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 82 }).toFile(out);
  after += fs.statSync(out).size;
  fs.unlinkSync(src);
  json = json.replaceAll(`/images/${name}`, `/images/${outName}`);
}

fs.writeFileSync(dataPath, json);
console.log(`圖片 ${(before / 1e6).toFixed(1)} MB → ${(after / 1e6).toFixed(1)} MB`);
