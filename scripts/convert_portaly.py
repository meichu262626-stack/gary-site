"""把 Portaly 備份（../備份）轉成網站用的 data/site.json，並把圖片複製到 public/images。

用法：python3 -I scripts/convert_portaly.py
之後內容改由 Supabase 管理時，這個檔案只在第一次匯入用得到。
"""
import json
import shutil
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
BACKUP = SITE.parent / "備份"
IMG_OUT = SITE / "public" / "images"


def load(name):
    return json.loads((BACKUP / name).read_text())


image_map = load("image_map.json")  # 原始網址 -> 備份/images/xxx
IMG_OUT.mkdir(parents=True, exist_ok=True)


def local_image(url):
    if not url:
        return ""
    src = image_map.get(url) or image_map.get(url.replace("\\u0026", "&"))
    if not src:
        # r2 網址有時帶不同的 ?t= 參數
        base = url.split("?")[0]
        src = next((v for k, v in image_map.items() if k.split("?")[0] == base), None)
    if not src:
        raise SystemExit(f"找不到圖片備份：{url}")
    name = Path(src).name.replace("UKQLAfliPkrIVhIKs3wu_", "")
    shutil.copy(BACKUP / src, IMG_OUT / name)
    return f"/images/{name}"


data = load("next_data.json")["props"]["pageProps"]["data"]
links = {k: v["url"] for k, v in data["links"].items()}


def link_url(link_id):
    url = links.get(link_id, "") if link_id else ""
    if url.startswith("page/"):
        return "/pages/" + url.split("/", 1)[1]
    return url


def clean_item(item):
    out = {}
    for key in ("text", "description", "icon", "animation", "cta"):
        if item.get(key):
            out[key] = item[key]
    if item.get("image"):
        out["image"] = local_image(item["image"])
    if item.get("linkId"):
        out["url"] = link_url(item["linkId"])
    return out


def clean_block(b):
    t = b["type"]
    out = {"id": b["id"], "type": t}
    if t == "title":
        use_rich = b.get("textOptions") == "richText"
        out["html" if use_rich else "text"] = b.get("richText", "") if use_rich else b.get("text", "")
        for key in ("align", "size", "color", "headerFill"):
            if b.get(key):
                out[key] = b[key]
        out["bold"] = "bold" in (b.get("styles") or [])
    elif t == "divider":
        out["variant"] = b.get("variant", "solid")
        out["borderWidth"] = b.get("borderWidth", "1px")
        if b.get("color"):
            out["color"] = b["color"]
    elif t == "integrations":
        out["platform"] = b["platform"]
        out["url"] = b.get(f"url-{b['platform']}", "")
    elif t in ("banner", "square", "double"):
        out["items"] = [clean_item(i) for i in b["items"]]
    elif t == "list":
        out["size"] = b.get("size", "md")
        out["withDescription"] = b.get("withDescription") == "true"
        out["items"] = [clean_item(i) for i in b["items"]]
    elif t == "collection":
        out["items"] = [clean_item(i) for i in b["items"]]
    else:
        raise SystemExit(f"還沒支援的區塊類型：{t}")
    return out


blocks_by_id = {b["id"]: b for b in data["blocks"]}
home_blocks = [clean_block(blocks_by_id[i]) for i in data["blockOrders"] if not blocks_by_id[i].get("hidden")]

pages = []
for p in data["pages"].values():
    pages.append({
        "slug": p["slug"],
        "title": p["title"],
        "blocks": [clean_block(p["blocks"][i]) for i in p["blockOrders"] if not p["blocks"][i].get("hidden")],
    })

threads = load("int_threads.json")
ig = load("int_instagram.json")["content"]
integrations = {
    "threads": {
        "title": threads["title"],
        "description": threads["description"],
        "avatar": local_image(threads["ogImage"]),
        "followers": int(threads.get("followers") or 0),
    },
    "instagram": {
        "title": threads["title"],
        "avatar": local_image(load("int_og_instagram.json")["ogImage"]["url"]),
        "posts": [{"href": p["href"], "image": local_image(p["image"]) if p["image"] else ""} for p in ig["posts"]],
    },
}

social = data["social"]
tab_page = links.get(data["tab"]["tabs"][0]["id"], "") if data["tab"]["tabs"] else ""

site = {
    "profile": {
        "name": data["name"],
        "description": data["description"],
        "avatar": local_image(data["avatar"]),
        "theme": data["theme"],
        "background": data["background"]["color"],
        "seoTitle": data["ogTitle"] + " " + data["ogPostfix"],
    },
    "social": [{"platform": k, "url": social["links"][k]} for k in social["orders"] if social["links"].get(k)],
    "tabs": {
        "home": data["tab"]["homeText"],
        "others": [{"text": t["tabText"], "url": link_url(t["id"])} for t in data["tab"]["tabs"]],
    },
    "integrations": integrations,
    "blocks": home_blocks,
    "pages": pages,
}

(SITE / "data").mkdir(exist_ok=True)
(SITE / "data" / "site.json").write_text(json.dumps(site, ensure_ascii=False, indent=2))
print(f"首頁 {len(home_blocks)} 個區塊、分頁 {len(pages)} 個、圖片 {len(list(IMG_OUT.iterdir()))} 張")
