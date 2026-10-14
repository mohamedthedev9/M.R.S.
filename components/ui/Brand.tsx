import { Fragment } from "react";

/** Wraps every "M.R.S." in the brand gradient (large text only: the indigo stop is 3.1:1 on black). */
export function BrandText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(M\.R\.S\.)/).map((p, i) => p === "M.R.S." ? <span key={i} className="text-brand">{p}</span> : <Fragment key={i}>{p}</Fragment>)}
    </>
  );
}
