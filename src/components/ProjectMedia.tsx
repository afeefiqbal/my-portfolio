import { useState } from 'react'

type ProjectMediaProps = {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
}

/**
 * Project screenshot with an honest fallback: if the image file does not
 * exist yet, a clearly labeled "PROJECT PREVIEW" state renders instead of
 * a fake screenshot. Drop the real file at the path referenced in
 * src/data/projects.ts and it appears automatically.
 */
export function ProjectMedia({ src, alt, width = 1600, height = 1000, priority = false }: ProjectMediaProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = failedSrc === src

  if (failed) {
    return (
      <div className="media-placeholder" role="img" aria-label={`${alt} — screenshot coming soon`}>
        <span className="media-placeholder-title">Project preview</span>
        <span className="media-placeholder-sub">Screenshot coming soon</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailedSrc(src)}
    />
  )
}
