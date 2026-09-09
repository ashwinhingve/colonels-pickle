import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Colonel's Pickle — Homemade Indian Pickles",
    short_name: "Colonel's Pickle",
    description:
      "Authentic homemade Indian pickles (achaar), gulkand & cold-press mustard oil. No preservatives, no vinegar. FSSAI licensed, Jaipur.",
    start_url: '/',
    display: 'standalone',
    background_color: '#F5EBDA',
    theme_color: '#4B5D2A',
    icons: [
      {
        src: '/images/brand/ridhwika-crest.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
