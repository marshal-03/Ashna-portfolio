import type {
  ArtPiece,
  ProcessStep,
  Profile,
  Service,
  SocialLink,
  Testimonial,
  Tool,
} from '@/types'

export const profile: Profile = {
  name: 'Ashna Mary',
  firstName: 'Ashna',
  role: '2D Designer',
  since: 'Since 2002',
  intro:
    'I design stages, LED backdrops, entry arches and event branding for corporate events and ' +
    'weddings — as print-ready 2D artwork and realistic 3D mock-ups.',
  bio:
    'Creative and detail-oriented 2D designer with a passion for transforming ideas into visually ' +
    'stunning event concepts. Skilled in 2D designing, stage layouts, backdrops, invitation graphics, ' +
    'signage, and theme décor visuals for weddings, corporate events, and special celebrations. ' +
    'Dedicated to delivering unique, elegant, and memorable design experiences that bring every ' +
    'event vision to life.',
  email: 'ashnaart24@gmail.com',
  // public/Ashna-Mary-CV.pdf
  resumeUrl: '/Ashna-Mary-CV.pdf',
  // Fill these in to show them in the contact section (left empty, they stay hidden).
  whatsapp: '',
  location: '',
  availability: '',
}

/** What clients can hire Ashna for — shown in the Services section. */
export const services: Service[] = [
  {
    icon: 'stage',
    title: 'Stage & LED Backdrops',
    text: 'Main stage designs, centre and side LED content, and backdrops sized exactly for the venue.',
  },
  {
    icon: 'arch',
    title: 'Entry Arches & Photobooths',
    text: 'Welcome gateways, tunnels and branded photo spots that guests remember and share.',
  },
  {
    icon: 'desk',
    title: 'Registration & Signage',
    text: 'Registration desks, standees, directional boards and wayfinding across the venue.',
  },
  {
    icon: 'badge',
    title: 'Event Collaterals',
    text: 'Lanyards, badges, wristbands, game stalls and every small touchpoint, on brand.',
  },
  {
    icon: 'wedding',
    title: 'Wedding Stationery & Décor',
    text: 'Invitations, welcome boards, menu cards, tags and keepsakes for each function.',
  },
  {
    icon: 'cube',
    title: '3D Event Mock-ups',
    text: 'Realistic 3D renders of the venue so clients can see the concept before production.',
  },
]

/** How a project runs, shown as four steps. */
export const processSteps: ProcessStep[] = [
  {
    title: 'Brief',
    text: 'We talk through the event, brand guidelines, venue sizes and the feel you want.',
  },
  {
    title: 'Concept',
    text: 'A visual direction and key artwork, shown as 3D mock-ups of the real space.',
  },
  {
    title: 'Design',
    text: 'Every element designed to size — stage, LED, arch, desk, signage and collaterals.',
  },
  {
    title: 'Delivery',
    text: 'Print-ready and screen-ready files for each vendor, with revisions until it’s right.',
  },
]

/** Client quotes. The section stays hidden until at least one real quote is added here. */
export const testimonials: Testimonial[] = []

export const tools: Tool[] = [
  { short: 'Ps', name: 'Adobe Photoshop' },
  { short: 'Ai', name: 'Adobe Illustrator' },
  { short: 'Id', name: 'Adobe InDesign' },
  { short: 'An', name: 'Adobe Animate' },
  { short: 'Ae', name: 'Adobe After Effects' },
  { short: 'Ma', name: 'Autodesk Maya' },
]

export const socials: SocialLink[] = [
  { kind: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ashna-t-154125335' },
  { kind: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/_ashna_art_' },
  { kind: 'artstation', label: 'ArtStation', url: 'https://www.artstation.com/ashnamary24' },
]

const video = (path: string) => `https://cdn.artstation.com/p/video_sources/${path}`

/** Animations published on ArtStation (artstation.com/ashnamary24). Media streams from ArtStation's CDN. */
export const artPieces: ArtPiece[] = [
  {
    title: 'Sword Fight',
    category: '3D Animation',
    description: 'Character animation in Maya.',
    image:
      'https://cdnb.artstation.com/p/assets/video_clips/images/087/755/409/large/ashna-thumb.jpg?1746613726',
    video: video('002/600/189/sword-fighting.mp4'),
    width: 1920,
    height: 1080,
    url: 'https://www.artstation.com/artwork/1NOm0K',
  },
  {
    title: 'Mary Calling',
    category: '3D Animation',
    description: 'Acting and lip-sync study in Maya.',
    image:
      'https://cdna.artstation.com/p/assets/video_clips/images/087/755/022/large/ashna-thumb.jpg?1746612782',
    video: video('002/600/165/mery-calling.mp4'),
    width: 1920,
    height: 1080,
    url: 'https://www.artstation.com/artwork/OvRArk',
  },
  {
    title: 'Thor Breathing',
    category: '3D Animation',
    description: 'Idle breathing cycle in Maya.',
    image:
      'https://cdna.artstation.com/p/assets/video_clips/images/087/754/256/large/ashna-thumb.jpg?1746611152',
    video: video('002/600/103/untitled.mp4'),
    width: 1920,
    height: 1080,
    url: 'https://www.artstation.com/artwork/gRKAlx',
  },
  {
    title: 'Jerry Cell Act',
    category: '3D Animation',
    description: 'Animated in Maya with the Jerry rig.',
    image:
      'https://cdnb.artstation.com/p/assets/video_clips/images/087/753/557/large/ashna-thumb.jpg?1746609812',
    video: video('002/600/032/cell.mp4'),
    width: 1920,
    height: 1080,
    url: 'https://www.artstation.com/artwork/XJ2A6n',
  },
  {
    title: 'Squirrel',
    category: '2D Animation',
    description: 'Motion animation.',
    image:
      'https://cdnb.artstation.com/p/assets/video_clips/images/096/962/657/large/ashna-thumb.jpg?1772780494',
    video: video('003/141/263/tree-bg-2.mp4'),
    width: 1920,
    height: 2560,
    url: 'https://www.artstation.com/artwork/x3gmbE',
  },
  {
    title: 'Girl Sword Fight',
    category: '2D Animation',
    description: 'Painted in Photoshop, animated in Adobe Animate.',
    image:
      'https://cdna.artstation.com/p/assets/video_clips/images/087/757/158/large/ashna-thumb.jpg?1746617614',
    video: video('002/600/326/girl-sword.mp4'),
    width: 1920,
    height: 1080,
    url: 'https://www.artstation.com/artwork/eRZAOY',
  },
  {
    title: 'Petrol Pump',
    category: '2D Animation',
    description: 'Motion animation.',
    image:
      'https://cdnb.artstation.com/p/assets/video_clips/images/087/756/413/large/ashna-thumb.jpg?1746616109',
    video: video('002/600/274/petrol-pumb.mp4'),
    width: 1920,
    height: 2674,
    url: 'https://www.artstation.com/artwork/dy6A2W',
  },
  {
    title: 'Walk Cycle',
    category: '2D Animation',
    description:
      'Background in Photoshop, walk cycle in Adobe Animate, composited in After Effects.',
    image:
      'https://cdna.artstation.com/p/assets/video_clips/images/087/755/824/large/ashna-thumb.jpg?1746614800',
    video: video('002/600/230/walk-bg.mp4'),
    width: 1920,
    height: 1080,
    url: 'https://www.artstation.com/artwork/bgYAQv',
  },
  {
    title: 'Fire Control',
    category: '2D Animation',
    description: 'Painted in Photoshop, animated in Adobe Animate.',
    image:
      'https://cdnb.artstation.com/p/assets/video_clips/images/087/752/953/large/ashna-thumb.jpg?1746608808',
    video: video('002/600/004/fire-control-final.mp4'),
    width: 1920,
    height: 1080,
    url: 'https://www.artstation.com/artwork/RK6AdE',
  },
  {
    title: 'Spider-Man',
    category: '2D Animation',
    description: 'Painted in Photoshop, animated in After Effects.',
    image:
      'https://cdnb.artstation.com/p/assets/video_clips/images/087/751/915/large/ashna-thumb.jpg?1746606688',
    video: video('002/599/970/spider-man.mp4'),
    width: 1920,
    height: 2716,
    url: 'https://www.artstation.com/artwork/eRZAqZ',
  },
]
