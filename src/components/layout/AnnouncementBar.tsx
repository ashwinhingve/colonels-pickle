import { ANNOUNCEMENTS } from "@/lib/constants";
import { ChevronDivider } from "@/components/illustrations";

export function AnnouncementBar() {
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div className="overflow-hidden bg-gradient-to-r from-cp-crimson-dark via-cp-crimson to-cp-crimson-dark text-white">
      <div className="[mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]">
        <div className="marquee-track py-2 hover:[animation-play-state:paused]">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="mx-6 flex items-center gap-6 font-sans text-[12.5px] font-medium tracking-wide"
            >
              {item}
              <ChevronDivider
                direction="right"
                color="currentColor"
                className="h-2.5 w-4 opacity-60"
                aria-hidden="true"
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementBar;
