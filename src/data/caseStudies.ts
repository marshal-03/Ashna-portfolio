// Event Design case studies shown on the home page, in display order.
// Images come from public/works (see works.json); `img()` looks up each file's size so pages can
// reserve space before images load, and fails the build if a path is mistyped.
import type { StaticImageData } from 'next/image'
import raw from './works.json'
import type { BrandWork } from '@/types'

export interface CaseImage {
  src: string
  width: number
  height: number
}

export interface CaseShot {
  /** Section label above the image, e.g. "STAGE DESIGN". */
  label: string
  image: CaseImage
  /** An extra render shown underneath, with a short caption and a dashed arrow. */
  extra?: { image: CaseImage; caption: string }
}

export interface CaseStudy {
  slug: string
  brand: string
  /** Event / campaign name, when known. */
  event?: string
  /** Large image at the top (usually the stage). */
  hero: CaseShot
  /** Labelled images. With `textPlacement: 'beside'` the first one sits next to the text. */
  shots: CaseShot[]
  /** 'beside' (default): text next to the first shot. 'below': all shots first, then the text. */
  textPlacement?: 'beside' | 'below'
  /** Leave the copy out until it's ready — the text block is hidden when empty. */
  overview?: string[]
  highlights?: string[]
  deliverables?: { title: string; text: string }[]
  outcome?: string
  /** Cut-out collaterals (wristbands, lanyards…) floating beside the text on blue circles. */
  decor?: { image: StaticImageData; alt: string; side: 'left' | 'right' }[]
}

const images = new Map(
  (raw as BrandWork[]).flatMap((b) =>
    b.zones.flatMap((z) => z.items.map((i) => [i.src, i] as const)),
  ),
)

function img(path: string): CaseImage {
  const src = `/works/${path}.webp`
  const found = images.get(src)
  if (!found) throw new Error(`caseStudies: no image at ${src}`)
  return { src, width: found.width, height: found.height }
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'coca-cola',
    brand: 'Coca-Cola',
    event: 'Spring Board 2025',
    hero: { label: 'Stage Design', image: img('coca-cola/stage/5') },
    shots: [
      { label: 'Stage Design', image: img('coca-cola/stage/c') },
      { label: 'Photobooth', image: img('coca-cola/photobooth/photobooth') },
      {
        label: 'Photobooth',
        image: img(
          'coca-cola/photobooth/whatsapp-image-2026-03-07-at-3-23-59-pm-2-this-one-also-one-indoor-bg',
        ),
      },
      { label: 'Lounge', image: img('coca-cola/sitting-area/sitting-area') },
      { label: 'Registration Design', image: img('coca-cola/registration-desk/registration-desk') },
    ],
    overview: [
      'The event design concept focuses on Coca-Cola’s signature red identity, bold branding, refreshing visual elements, and contemporary event structures to create a cohesive experience across the venue.',
      'The overall design approach combines impactful stage graphics, branded installations, interactive photo opportunities, and welcoming registration areas to deliver a premium corporate event experience.',
    ],
    highlights: [
      'Strong Coca-Cola brand visibility throughout the venue.',
      'Consistent red-and-white visual identity across all event touchpoints.',
      'LED-integrated stage design with dynamic graphic elements.',
      'Interactive branded photo opportunities for guests.',
      'Premium registration and welcome experience.',
      'Comfortable lounge and networking environment.',
    ],
    outcome:
      'A unified event environment that reflects the Coca-Cola brand while creating an engaging platform for leadership conversations, networking, celebration, and memorable guest experiences.',
  },
  {
    slug: 'dark-fantasy',
    brand: 'Sunfeast Dark Fantasy',
    event: 'Party with SRK',
    hero: { label: 'Stage Design', image: img('dark-fantasy/stage/dark-fantacy-stage-camera-2') },
    shots: [
      { label: 'Entry Arch', image: img('dark-fantasy/entry-arch/dark-fantacy-entry-arch') },
      {
        label: 'Registration Design',
        image: img('dark-fantasy/registration-desk/dark-fantacy-registration-desk'),
      },
    ],
  },
  {
    slug: 'tata-tea',
    brand: 'Tata Tea Premium',
    event: 'Make the Move',
    hero: { label: 'Stage Design — Make the Move', image: img('tata-tea/stage/tata-tea-stage-2') },
    shots: [{ label: 'Launch Stage — Royal Elaichi', image: img('tata-tea/stage/tata-tea-stage') }],
    // Drafted from the stage designs — review and edit as needed.
    overview: [
      'A fresh, vibrant stage experience created for the Tata Tea Premium “Make the Move” campaign and the launch of Tata Tea Premium Royal Elaichi. The design draws on the brand’s signature green and gold palette, sunlit tea-garden imagery, and warm chai moments to celebrate India’s favourite cup of tea.',
    ],
    deliverables: [
      {
        title: 'Main Stage Design',
        text: 'A layered green-and-gold stage with a rounded central LED screen, branded side panels, and sunrise tea-estate visuals.',
      },
      {
        title: 'Product Launch Stage',
        text: 'A dedicated reveal setup for Royal Elaichi, featuring oversized pack displays, cardamom-rich graphics, and the “Poori Elaichi, Poori Khushboo, Poora Swaad” message.',
      },
      {
        title: 'Brand Graphics',
        text: 'Coordinated pack, key-visual, and LED artwork that keeps the Tata Tea Premium identity consistent across every screen.',
      },
    ],
  },
  {
    slug: 'borderless-access',
    brand: 'Borderless Access',
    event: 'Unwind 2025',
    hero: { label: 'Stage Design', image: img('borderless-access/stage/bordeless-access-stage') },
    shots: [
      {
        label: 'Registration Design',
        image: img('borderless-access/registration-desk/borderless-access-registration-booth'),
      },
      {
        label: 'Photobooth',
        image: img('borderless-access/photobooth/borderless-access-photobooth'),
        extra: {
          image: img('borderless-access/entry-arch/entry-arch-1'),
          caption:
            'A bold welcome gateway featuring illuminated geometric panels, branded graphics, and vibrant colour combinations.',
        },
      },
      {
        label: 'Entry Arch',
        image: img('borderless-access/entry-arch/borderless-access-entrance'),
        extra: {
          image: img('borderless-access/photobooth/photobooth-2'),
          caption:
            'A contemporary photo opportunity featuring layered structures, arch-shaped frames, and branded graphic panels.',
        },
      },
    ],
    overview: [
      'A vibrant and immersive event design concept created for Borderless Access Unwind 2025. The visual identity blends bold colours, playful geometric elements, and social media-inspired graphics to create an energetic and engaging event atmosphere.',
    ],
    deliverables: [
      {
        title: 'Main Stage Graphics',
        text: 'A dynamic LED backdrop with bold branding, vibrant colours, and interactive digital-inspired elements.',
      },
      {
        title: 'Registration Booth Design',
        text: 'A welcoming registration setup featuring coordinated 2D graphics and illuminated borders.',
      },
      {
        title: '3D Event Mockups',
        text: 'Visual presentations showcasing the designs in realistic event environments.',
      },
    ],
  },
  {
    slug: 'henkel',
    brand: 'Henkel',
    event: '150 Years',
    hero: { label: 'Entry Arch', image: img('henkel/entry-arch/entry-arch') },
    shots: [
      { label: 'Registration Design', image: img('henkel/registration-desk/registration') },
      { label: 'Game Stalls', image: img('henkel/game-stalls/stalls') },
      { label: 'History Wall', image: img('henkel/history-wall/history-wall-india-mockup') },
      { label: 'Kids Zone', image: img('henkel/kids-zone/kids-zone') },
    ],
    // Drafted from the event designs — review and edit as needed.
    overview: [
      'A joyful, colourful event design created to celebrate 150 years of Henkel. Built around the theme “A Brighter Tomorrow Together”, the visual identity combines bold geometric patterns, playful circles, and Henkel’s signature red to create a welcoming, family-friendly celebration.',
    ],
    deliverables: [
      {
        title: 'Entry Arch Design',
        text: 'A vibrant 150-years gateway with patterned panels and the “Past · Connect · Present · Create · Tomorrow” message.',
      },
      {
        title: 'Registration Desk Design',
        text: 'A bright, pastel welcome counter featuring bold 150-years branding.',
      },
      {
        title: 'Game Stalls & Kids Zone',
        text: 'Themed activity stalls such as Angry Birds, Archery, and Beat the Buzzer, plus a creative kids zone for families.',
      },
      {
        title: 'History Wall',
        text: 'A large-format timeline celebrating Henkel’s journey in India and around the world.',
      },
    ],
  },
]
