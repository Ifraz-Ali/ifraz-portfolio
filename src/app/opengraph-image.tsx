import { ImageResponse } from "next/og";

export const alt = "Ifraz Ali — Full Stack Engineer. Web and mobile applications.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function PreviewImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0c0e0d", color: "#eff4ed", padding: "58px 68px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #354034", paddingBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="54" height="54" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#172016"/><path d="M20 16v32M30 48l9-32h4l9 32m-18-12h14" stroke="#b6ff5c" strokeWidth="5" fill="none"/></svg>
          <span style={{ fontSize: 25, fontWeight: 700 }}>IFRAZ.ALI</span>
        </div>
        <span style={{ color: "#a9b5a6", fontSize: 20 }}>Karachi, Pakistan</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
        <span style={{ fontSize: 100, fontWeight: 700, letterSpacing: "-5px", lineHeight: 1.1 }}>Ifraz Ali<span style={{ color: "#b6ff5c" }}>.</span></span>
        <span style={{ fontSize: 47, color: "#b6ff5c", marginTop: 12 }}>Full Stack Engineer</span>
        <span style={{ fontSize: 25, color: "#b9c4b6", marginTop: 25 }}>Thoughtful interfaces. Reliable backend systems.</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #354034", paddingTop: 24, fontSize: 19, color: "#a9b5a6" }}>
        <span>Web & mobile applications</span><span>ifraz-portfolio.vercel.app</span>
      </div>
    </div>, size,
  );
}
