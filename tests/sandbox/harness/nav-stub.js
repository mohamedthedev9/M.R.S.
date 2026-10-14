const q = () => (location.hash.split("?")[1] || "");
export function usePathname() { return window.__path || "/"; }
export function useSearchParams() { return new URLSearchParams(q()); }
export function notFound() { throw new Error("NEXT_NOT_FOUND"); }
