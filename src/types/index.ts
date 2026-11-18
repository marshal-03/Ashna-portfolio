export interface Profile {
  name: string
  firstName: string
  role: string
  since: string
  intro: string
  bio: string
  email: string
  resumeUrl: string
  /** WhatsApp number with country code, digits only (e.g. "919876543210"). Empty hides the button. */
  whatsapp?: string
  /** City / region, e.g. "Kochi, Kerala". Empty hides it. */
  location?: string
  /** Short availability note, e.g. "Taking projects from January". Empty hides it. */
  availability?: string
}

export interface Service {
  title: string
  text: string
  /** Key into the icon set in components/sections/Services.tsx. */
  icon: 'stage' | 'arch' | 'desk' | 'badge' | 'wedding' | 'cube'
}

export interface ProcessStep {
  title: string
  text: string
}

export interface Testimonial {
  quote: string
  name: string
  /** Role and company, e.g. "Producer, XYZ Events". */
  role: string
}

export type SocialKind = 'linkedin' | 'instagram' | 'artstation'

export interface SocialLink {
  kind: SocialKind
  label: string
  url: string
}

export interface WorkItem {
  title: string
  /** 3D render/visualisation vs. flat print graphic */
  kind: 'render' | 'graphic'
  src: string
  thumb: string
  width: number
  height: number
}

export interface WorkZone {
  name: string
  slug: string
  items: WorkItem[]
}

export interface BrandWork {
  slug: string
  name: string
  subtitle: string
  cover: string
  coverThumb: string
  zones: WorkZone[]
}

export interface ArtPiece {
  title: string
  category: '3D Animation' | '2D Animation'
  description: string
  /** Poster frame shown before the video loads. */
  image: string
  /** Direct MP4 on ArtStation's CDN. */
  video: string
  width: number
  height: number
  /** The piece's ArtStation page. */
  url: string
}

export interface Tool {
  /** Two-letter app mark shown on the tile, e.g. "Ps". */
  short: string
  name: string
}
