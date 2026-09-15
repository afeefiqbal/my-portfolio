import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { prefersReducedMotion } from '../../hooks/useReveal'
import { robotConfig, type RobotMode } from './config'
import { RobotScene } from './RobotScene'
import { createPointer, useRobotPointer } from './useRobotPointer'

type RobotCompanionProps = {
  heroRef: RefObject<HTMLElement | null>
}

function detectMode(): RobotMode {
  if (typeof window === 'undefined') return 'off'
  const fine = window.matchMedia('(pointer: fine)').matches
  const wide = window.matchMedia('(min-width: 861px)').matches
  if (!fine || !wide) return 'off'
  if (prefersReducedMotion()) return 'idle'
  return 'full'
}

function RobotCompanionInner({ heroRef }: RobotCompanionProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const pointer = useRef(createPointer())
  const [mode, setMode] = useState<RobotMode>(() => detectMode())
  const [visible, setVisible] = useState(true)
  const reduced = mode === 'idle'

  useRobotPointer(heroRef, pointer, mode === 'full')

  useEffect(() => {
    const update = () => setMode(detectMode())
    const fine = window.matchMedia('(pointer: fine)')
    const wide = window.matchMedia('(min-width: 861px)')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    fine.addEventListener('change', update)
    wide.addEventListener('change', update)
    motion.addEventListener('change', update)
    return () => {
      fine.removeEventListener('change', update)
      wide.removeEventListener('change', update)
      motion.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const io = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && !document.hidden)
    }, { threshold: 0.08 })
    io.observe(hero)
    const onVisibility = () => setVisible((v) => (document.hidden ? false : v))
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [heroRef])

  useLayoutEffect(() => {
    const hero = heroRef.current
    const stage = stageRef.current
    if (!hero || !stage) return
    const x = hero.clientWidth * 0.56 - stage.offsetWidth / 2
    const y = hero.clientHeight * 0.58 - stage.offsetHeight / 2
    stage.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }, [heroRef, mode])

  if (mode === 'off') return null

  const loop = visible ? (reduced ? 'demand' : 'always') : 'never'

  return (
    <div className="robot-companion" aria-hidden="true">
      <div ref={stageRef} className="robot-companion-stage">
        <Canvas
          camera={{ position: [1.05, 0.68, 2.15], fov: 30 }}
          dpr={reduced ? [1, 1] : [1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power', stencil: false }}
          frameloop={loop}
          style={{ pointerEvents: 'none' }}
          onCreated={({ camera, invalidate }) => {
            camera.lookAt(0, 0.24, 0)
            if (reduced) invalidate()
          }}
        >
          <RobotScene
            mode={mode}
            reduced={reduced}
            heroRef={heroRef}
            stageRef={stageRef}
            pointer={pointer}
          />
        </Canvas>
        <p className="robot-bubble">
          <span>👋 Hey!</span>
          I&apos;m following your cursor!
        </p>
      </div>
    </div>
  )
}

export function RobotCompanion(props: RobotCompanionProps) {
  return <RobotCompanionInner {...props} />
}

export { robotConfig }
