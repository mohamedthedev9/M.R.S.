import { CHEV_D, EAGLE_D } from "@/lib/brand-paths";

/**
 * The traced brand paths, defined ONCE per page and referenced everywhere via <use>.
 * Rendered by SiteShell. (width/height 0 + absolute keeps it out of layout without display:none.)
 */
export function BrandSprite() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="pointer-events-none absolute h-0 w-0 overflow-hidden">
      <defs>
        <path id="mrs-p-chev" d={CHEV_D} fillRule="evenodd" />
        <path id="mrs-p-eagle" d={EAGLE_D} fillRule="evenodd" />
      </defs>
    </svg>
  );
}
