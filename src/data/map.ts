import type { Destination, DestinationId, Island, Vec3 } from '../types'

export const START_POSITION: Vec3 = [0, 0.42, 26]

export const DESTINATIONS: Destination[] = [
  {
    id: 'about',
    index: '01',
    nav: 'About',
    title: 'About Me',
    subtitle: 'Get to know me',
    position: [-12, 0, 14],
    plazaRadius: 5.4,
    accent: '#2b6cff',
  },
  {
    id: 'education',
    index: '02',
    nav: 'Education',
    title: 'Education',
    subtitle: 'My academic journey',
    position: [-22, 0, 2],
    plazaRadius: 5.6,
    accent: '#1aa37a',
  },
  {
    id: 'skills',
    index: '03',
    nav: 'Skills',
    title: 'Skills',
    subtitle: 'Tools & Technologies',
    position: [0, 0, -6],
    plazaRadius: 6.8,
    accent: '#2b6cff',
  },
  {
    id: 'projects',
    index: '04',
    nav: 'Projects',
    title: 'Projects',
    subtitle: "Things I've built",
    position: [-16, 0, -22],
    plazaRadius: 5.8,
    accent: '#d9892b',
  },
  {
    id: 'experience',
    index: '05',
    nav: 'Experience',
    title: 'Experience',
    subtitle: "Where I've worked",
    position: [18, 0, -20],
    plazaRadius: 5.8,
    accent: '#2b6cff',
  },
  {
    id: 'cv',
    index: '06',
    nav: 'CV',
    title: 'CV',
    subtitle: 'Download Resume',
    position: [24, 0, -4],
    plazaRadius: 5.2,
    accent: '#1aa37a',
  },
  {
    id: 'contact',
    index: '07',
    nav: 'Contact',
    title: 'Contact',
    subtitle: "Let's connect",
    position: [16, 0, 14],
    plazaRadius: 5.4,
    accent: '#2b6cff',
  },
  {
    id: 'future',
    index: '08',
    nav: 'Future',
    title: 'Future',
    subtitle: "What's next?",
    position: [2, 0, -34],
    plazaRadius: 5.4,
    accent: '#d9892b',
  },
]

export const NAV_ITEMS = DESTINATIONS.map((d) => ({
  id: d.id,
  label: d.nav,
}))

export const ISLANDS: Island[] = [
  { id: 'start', position: [0, 0, 26], radiusX: 8.2, radiusZ: 7.2, rotation: 0.12, height: 0.55 },
  { id: 'about', position: [-12, 0, 14], radiusX: 7.4, radiusZ: 6.4, rotation: -0.2, height: 0.55 },
  { id: 'education', position: [-22, 0, 2], radiusX: 8.4, radiusZ: 7.2, rotation: 0.28, height: 0.58 },
  { id: 'skills', position: [0, 0, -6], radiusX: 10.6, radiusZ: 9.4, rotation: 0.08, height: 0.62 },
  { id: 'projects', position: [-16, 0, -22], radiusX: 8.2, radiusZ: 7.4, rotation: -0.16, height: 0.58 },
  { id: 'future', position: [2, 0, -34], radiusX: 6.8, radiusZ: 6.6, rotation: 0.22, height: 0.7 },
  { id: 'experience', position: [18, 0, -20], radiusX: 8.4, radiusZ: 7.4, rotation: 0.18, height: 0.58 },
  { id: 'cv', position: [24, 0, -4], radiusX: 6.8, radiusZ: 6.2, rotation: -0.12, height: 0.58 },
  { id: 'contact', position: [16, 0, 14], radiusX: 7.4, radiusZ: 6.4, rotation: 0.3, height: 0.55 },
]

export type RoadNode = DestinationId | 'start'

export type RoadEdge = {
  from: RoadNode
  to: RoadNode
  controls: Vec3[]
}

export const ROAD_EDGES: RoadEdge[] = [
  {
    from: 'start',
    to: 'about',
    controls: [
      [0, 0, 26],
      [1.2, 0, 22.2],
      [-4.8, 0, 18.6],
      [-12, 0, 14],
    ],
  },
  {
    from: 'about',
    to: 'education',
    controls: [
      [-12, 0, 14],
      [-15.4, 0, 10.2],
      [-24.6, 0, 7.4],
      [-26.2, 0, 4.1],
      [-22, 0, 2],
    ],
  },
  {
    from: 'education',
    to: 'skills',
    controls: [
      [-22, 0, 2],
      [-16.4, 0, -0.6],
      [-9.2, 0, -2.2],
      [-3.4, 0, -3.6],
      [0, 0, -6],
    ],
  },
  {
    from: 'skills',
    to: 'projects',
    controls: [
      [0, 0, -6],
      [-5.4, 0, -10.4],
      [-13.8, 0, -14.6],
      [-18.4, 0, -18.2],
      [-16, 0, -22],
    ],
  },
  {
    from: 'projects',
    to: 'future',
    controls: [
      [-16, 0, -22],
      [-10.2, 0, -26.4],
      [-3.6, 0, -30.2],
      [2, 0, -34],
    ],
  },
  {
    from: 'skills',
    to: 'experience',
    controls: [
      [0, 0, -6],
      [5.8, 0, -10.2],
      [11.6, 0, -14.8],
      [18, 0, -20],
    ],
  },
  {
    from: 'experience',
    to: 'cv',
    controls: [
      [18, 0, -20],
      [21.6, 0, -14.2],
      [26.4, 0, -8.4],
      [24, 0, -4],
    ],
  },
  {
    from: 'cv',
    to: 'contact',
    controls: [
      [24, 0, -4],
      [26.2, 0, 3.6],
      [22.4, 0, 9.8],
      [16, 0, 14],
    ],
  },
  {
    from: 'contact',
    to: 'start',
    controls: [
      [16, 0, 14],
      [10.4, 0, 18.2],
      [5.6, 0, 22.4],
      [1.6, 0, 25.2],
      [0, 0, 26],
    ],
  },
]

export const LOOP_EDGES: Array<[RoadNode, RoadNode]> = [
  ['start', 'about'],
  ['about', 'education'],
  ['education', 'skills'],
  ['skills', 'experience'],
  ['experience', 'cv'],
  ['cv', 'contact'],
  ['contact', 'start'],
]

export const NODE_POSITIONS: Record<RoadNode, Vec3> = {
  start: START_POSITION,
  about: DESTINATIONS[0].position,
  education: DESTINATIONS[1].position,
  skills: DESTINATIONS[2].position,
  projects: DESTINATIONS[3].position,
  experience: DESTINATIONS[4].position,
  cv: DESTINATIONS[5].position,
  contact: DESTINATIONS[6].position,
  future: DESTINATIONS[7].position,
}

export const MAP_BOUNDS = {
  minX: -36,
  maxX: 36,
  minZ: -42,
  maxZ: 34,
}

export function getDestination(id: DestinationId): Destination {
  const found = DESTINATIONS.find((item) => item.id === id)
  if (!found) throw new Error(`Unknown destination: ${id}`)
  return found
}
