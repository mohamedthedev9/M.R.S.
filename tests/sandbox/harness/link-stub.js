import React from "react";
// Hash-router stand-in for next/link: "/work" -> "#/work"; in-page anchors and external/mailto links pass through.
export default function Link({ href, children, prefetch, ...p }) {
  const h = /^(#|https?:|mailto:|tel:)/.test(href) ? href : "#" + href;
  return React.createElement("a", { href: h, ...p }, children);
}
