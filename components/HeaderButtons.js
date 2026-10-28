"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Icon } from "./icons";

// 封面左上「分享」「QR Code」、右上「收藏」三顆圓鈕（行為照原 Portaly）
export default function HeaderButtons({ name, avatar, lineUrl }) {
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState(null);
  const [fav, setFav] = useState(false);

  // 按 Esc 關閉彈窗
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setQr(null);
        setFav(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 原頁的分享與 QR Code 都是個人首頁網址，不管現在在哪個分頁
  const homeUrl = () => window.location.origin + (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/";

  // 原頁：按分享 = 複製網址，按鈕旁跳出「已複製到剪貼簿」
  const share = async () => {
    try {
      await navigator.clipboard.writeText(homeUrl());
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openQr = async () => {
    const url = homeUrl();
    setQr({ url, img: await QRCode.toDataURL(url, { width: 360, margin: 1 }) });
  };

  return (
    <>
      <div className="cover-buttons">
        <button className="round-btn" onClick={share} aria-label="分享">
          <Icon name="share" size="1.4em" />
        </button>
        {copied && <div className="copied-pop">已複製到剪貼簿</div>}
        <button className="round-btn" onClick={openQr} aria-label="QR Code">
          <Icon name="qrcode" size="1.5em" />
        </button>
        <div style={{ flex: 1 }} />
        <button className="round-btn pulse" onClick={() => setFav(true)} aria-label="收藏">
          <Icon name="star" size="1.4em" />
        </button>
      </div>

      {qr && (
        <div className="modal" onClick={() => setQr(null)}>
          <div className="modal-card qr-card" role="dialog" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setQr(null)} aria-label="關閉">
              ×
            </button>
            <div className="modal-title">我的傳送門</div>
            <img src={qr.img} alt="QR Code" width={180} height={180} />
            <div className="qr-url">{qr.url}</div>
          </div>
        </div>
      )}

      {fav && (
        <div className="modal" onClick={() => setFav(false)}>
          <div className="modal-card fav-card" role="dialog" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setFav(false)} aria-label="關閉">
              ×
            </button>
            <img className="fav-avatar" src={avatar} alt={name} />
            <div className="modal-title">
              收藏 <span style={{ color: "var(--theme)" }}>{name}</span>
            </div>
            <div className="fav-sub">收藏創作者的傳送門，取得最新消息。</div>
            {/* 原頁是 Portaly 帳號的收藏功能；接上 Supabase 前，先改成加入 LINE 官方帳號 */}
            <a className="fav-btn" href={lineUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="line" size={20} />
              加入 LINE 官方帳號
            </a>
          </div>
        </div>
      )}
    </>
  );
}
