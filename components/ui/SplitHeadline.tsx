/**
 * Puts each sentence of a short headline on its own line ("Build it." / "Secure it." / "Automate the rest.")
 * so the break is deliberate instead of wherever the width happens to fall. Reads as one heading to screen readers.
 */
export function SplitHeadline({ text, className }: { text: string; className?: string }) {
  const parts = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  return (
    <>
      {parts.map((s, i) => (
        <span key={i} className={className ?? "block"}>{s.trim()}{i < parts.length - 1 ? " " : ""}</span>
      ))}
    </>
  );
}
