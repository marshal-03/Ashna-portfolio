import type { ArtPiece, Profile, SocialLink, Tool } from '@/types'

export const profile: Profile = {
  name: 'Ashna Mary',
  firstName: 'Ashna',
  role: '2D Designer',
  since: 'Since 2002',
  intro: 'Explore my creative journey. Download my CV to learn more.',
  bio:
    'Creative and detail-oriented 2D designer with a passion for transforming ideas into visually ' +
    'stunning event concepts. Skilled in 2D designing, stage layouts, backdrops, invitation graphics, ' +
    'signage, and theme décor visuals for weddings, corporate events, and special celebrations. ' +
    'Dedicated to delivering unique, elegant, and memorable design experiences that bring every ' +
    'event vision to life.',
  email: 'ashnaart24@gmail.com',
  // public/Ashna-Mary-CV.pdf
  resumeUrl: '/Ashna-Mary-CV.pdf',
}

export const tools: Tool[] = [
  { short: 'Ps', name: 'Adobe Photoshop' },
  { short: 'Ai', name: 'Adobe Illustrator' },
  { short: 'Id', name: 'Adobe InDesign' },
  { short: 'An', name: 'Adobe Animate' },
  { short: 'Ae', name: 'Adobe After Effects' },
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
