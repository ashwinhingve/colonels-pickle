import { ANNOUNCEMENTS } from "@/lib/constants";

export function AnnouncementBar() {
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div className="overflow-hidden bg-cp-crimson text-white">
      <div className="marquee-track py-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="mx-6 font-sans text-[12.5px] font-medium tracking-wide"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default AnnouncementBar;
