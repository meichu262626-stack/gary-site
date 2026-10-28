"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { Icon } from "./icons";

// 封面左上「分享」「QR Code」、右上「收藏」三顆圓鈕
export default function HeaderButtons({ name }) {
  const [qr, setQr] = useState("");
  const [toast, setToast] = useState("");

  const openQr = async () => {
    setQr(await QRCode.toDataURL(window.location.href, { width: 240, margin: 1 }));
  };

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url });
      } catch {}
      return;
    }
    await navigator.clipboard?.writeText(url);
    flash("已複製連結");
  };

  const favorite = () => flash("按 ⌘D（手機：分享 → 加入主畫面）收藏這個頁面");

  return (
    <>
      <div className="cover-buttons">
        <button className="round-btn" onClick={share} aria-label="分享">
          <Icon name="share" size="1.4em" />
        </button>
        <button className="round-btn" onClick={openQr} aria-label="QR Code">
          <Icon name="qrcode" size="1.5em" />
        </button>
        <div style={{ flex: 1 }} />
        <button className="round-btn pulse" onClick={favorite} aria-label="收藏">
          <Icon name="star" size="1.4em" />
        </button>
      </div>
      {qr && (
        <div className="modal" onClick={() => setQr("")}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <img src={qr} alt="QR Code" width={240} height={240} />
            <button className="modal-close" onClick={() => setQr("")}>
              關閉
            </button>
          </div>
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
