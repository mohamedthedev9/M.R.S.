import React from "react";
// next/image stand-in: honours `fill` (absolute cover), `sizes`/`priority` ignored, src mapped to inline data URIs via window.__img
export default function Image({ priority, src, fill, sizes, className, style, ...p }) {
  const u = (window.__img || {})[src] || src;
  const st = fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style } : style;
  return React.createElement("img", { src: u, className, style: st, ...p });
}
