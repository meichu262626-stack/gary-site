"use client";

import { useEffect, useRef, useState } from "react";

// 區塊捲動到畫面內才淡入（原頁面也有這個效果）
export default function Reveal({ className, children }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} reveal${shown ? " shown" : ""}`}>
      {children}
    </div>
  );
}
