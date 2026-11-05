export interface Profile {
  name: string
  firstName: string
  role: string
  since: string
  intro: string
  bio: string
  email: string
  resumeUrl: string
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
