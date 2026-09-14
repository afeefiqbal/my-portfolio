import { DESTINATIONS, MAP_BOUNDS } from '../../data/map'
import { loopPoints, spurPoints } from '../../lib/road'
import { navigateToDestination } from '../../hooks/useInteraction'
import { sim, useJourney } from '../../store/journey'
import { useEffect, useRef } from 'react'

const SIZE = 168

export function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { nearbyId, navigatingTo, started, visited } = useJourney()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE)
      // Map plate
      ctx.fillStyle = '#b7d5c4'
      roundRect(ctx, 0, 0, SIZE, SIZE, 18)
      ctx.fill()
      ctx.fillStyle = '#cfe8ef'
      roundRect(ctx, 8, 8, SIZE - 16, SIZE - 16, 14)
      ctx.fill()

      // Roads
      ctx.strokeStyle = '#4a5563'
      ctx.lineWidth = 3.2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      drawPath(ctx, loopPoints)
      ctx.stroke()
      ctx.beginPath()
      drawPath(ctx, spurPoints)
      ctx.stroke()
      ctx.strokeStyle = 'rgba(255,255,255,0.55)'
      ctx.lineWidth = 1.1
      ctx.beginPath()
      drawPath(ctx, loopPoints)
      ctx.stroke()

      for (const dest of DESTINATIONS) {
        const [x, y] = project(dest.position[0], dest.position[2])
        const active = dest.id === nearbyId || dest.id === navigatingTo
        const done = visited.includes(dest.id)
        ctx.beginPath()
        ctx.arc(x, y, active ? 5 : 3.4, 0, Math.PI * 2)
        ctx.fillStyle = active ? dest.accent : done ? '#1aa37a' : '#16324f'
        ctx.fill()
        if (done && !active) {
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }

      const [px, py] = project(sim.position.x, sim.position.z)
      ctx.fillStyle = '#2b6cff'
      ctx.beginPath()
      ctx.arc(px, py, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [nearbyId, navigatingTo, visited])

  return (
    <div className="minimap">
      <span>Map</span>
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        aria-label="Campus minimap"
        onClick={(event) => {
          if (!started) return
          const bounds = event.currentTarget.getBoundingClientRect()
          const x = ((event.clientX - bounds.left) / bounds.width) * SIZE
          const y = ((event.clientY - bounds.top) / bounds.height) * SIZE
          const world = unproject(x, y)
          let best = DESTINATIONS[0]
          let bestD = Infinity
          for (const dest of DESTINATIONS) {
            const d = (dest.position[0] - world.x) ** 2 + (dest.position[2] - world.z) ** 2
            if (d < bestD) {
              bestD = d
              best = dest
            }
          }
          navigateToDestination(best.id)
        }}
      />
    </div>
  )
}

function project(x: number, z: number): [number, number] {
  const { minX, maxX, minZ, maxZ } = MAP_BOUNDS
  const px = ((x - minX) / (maxX - minX)) * SIZE
  const py = ((z - minZ) / (maxZ - minZ)) * SIZE
  return [px, py]
}

function unproject(px: number, py: number): { x: number; z: number } {
  const { minX, maxX, minZ, maxZ } = MAP_BOUNDS
  return {
    x: minX + (px / SIZE) * (maxX - minX),
    z: minZ + (py / SIZE) * (maxZ - minZ),
  }
}

function drawPath(ctx: CanvasRenderingContext2D, points: Array<{ x: number; z: number }>): void {
  if (!points.length) return
  const [sx, sy] = project(points[0].x, points[0].z)
  ctx.moveTo(sx, sy)
  for (let i = 1; i < points.length; i += 1) {
    const [x, y] = project(points[i].x, points[i].z)
    ctx.lineTo(x, y)
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
