'use client';

import { useEffect } from "react";

const APPLE_APP_ID = "idYOUR_APP_ID";

export default function ClientPortalClient() {
  useEffect(() => {
    const isiOS = /iP(hone|od|ad)/.test(navigator.userAgent);
    const store = isiOS
      ? `https://apps.apple.com/app/${APPLE_APP_ID}`
      : "https://play.google.com/store/apps/details?id=com.simpletattooer.app";
    const timerId = setTimeout(() => {
      location.replace(store);
    }, 1500);
    return () => clearTimeout(timerId);
  }, []);

  return (
    <div
      style={{
        background: "#05080F",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <div>
        <p>Opening the app…</p>
        <p>If nothing happens, you'll be sent to the store.</p>
      </div>
    </div>
  );
}


