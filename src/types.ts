export type DestinationId =
  | 'about'
  | 'education'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'cv'
  | 'contact'
  | 'future'

export type Vec3 = [number, number, number]

export type Destination = {
  id: DestinationId
  index: string
  nav: string
  title: string
  subtitle: string
  position: Vec3
  plazaRadius: number
  accent: string
}

export type Island = {
  id: string
  position: Vec3
  radiusX: number
  radiusZ: number
  rotation: number
  height: number
}

export type CameraMode = 'overview' | 'follow' | 'focus'

export type JourneyUI = {
  started: boolean
  activePanel: DestinationId | null
  nearbyId: DestinationId | null
  navigatingTo: DestinationId | null
  cameraMode: CameraMode
  dimmed: boolean
  isTouch: boolean
  reducedMotion: boolean
  lowQuality: boolean
  hasMoved: boolean
  systemHealth: number
  visited: DestinationId[]
}

export type Project = {
  id: string
  name: string
  tagline: string
  description: string
  image: string
  tech: string[]
  liveUrl: string
  githubUrl: string
  year: string
  role: string
  accent: string
}

export type Experience = {
  id: string
  company: string
  role: string
  period: string
  location: string
  summary: string
  highlights: string[]
  tech: string[]
}

export type SkillGroup = {
  id: string
  title: string
  items: { name: string; level: number }[]
}

export type Education = {
  id: string
  school: string
  program: string
  period: string
  details: string
}
