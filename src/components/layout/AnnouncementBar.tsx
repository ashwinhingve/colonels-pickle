import { ANNOUNCEMENTS } from "@/lib/constants";
import { ChevronDivider } from "@/components/illustrations";

export function AnnouncementBar() {
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div className="overflow-hidden bg-cp-crimson text-white">
      <div className="marquee-track py-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="mx-6 flex items-center gap-6 font-sans text-[12.5px] font-medium tracking-wide"
          >
            {item}
            <ChevronDivider
              direction="right"
              color="currentColor"
              className="h-2.5 w-4 opacity-40"
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export default AnnouncementBar;
