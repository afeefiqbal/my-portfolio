import { useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import { robotConfig, type RobotMode } from './config'
import { RobotModel, usePartRefs } from './RobotModel'
import type { RobotPointer } from './useRobotPointer'

type Physics = {
  x: number
  y: number
  noticeX: number
  noticeY: number
  desiredX: number
  desiredY: number
  vx: number
  vy: number
  walkPhase: number
  noticeWait: number
  ready: boolean
}

function homePoint(width: number, height: number) {
  return {
    x: width * 0.56,
    y: height * 0.58,
  }
}

function clampToSafe(x: number, y: number, width: number, height: number, stageW: number, stageH: number) {
  const padX = stageW / 2
  const padY = stageH / 2
  return {
    x: MathUtils.clamp(x, Math.max(width * 0.42, padX + 8), width - padX - 24),
    y: MathUtils.clamp(y, Math.max(height * 0.38, padY + 88), height - padY - 88),
  }
}

function limitFromHome(x: number, y: number, homeX: number, homeY: number, max: number) {
  const dx = x - homeX
  const dy = y - homeY
  const dist = Math.hypot(dx, dy)
  if (dist <= max || dist === 0) return { x, y }
  const scale = max / dist
  return { x: homeX + dx * scale, y: homeY + dy * scale }
}

type RobotSceneProps = {
  mode: RobotMode
  reduced: boolean
  heroRef: RefObject<HTMLElement | null>
  stageRef: RefObject<HTMLDivElement | null>
  pointer: RefObject<RobotPointer>
}

export function RobotScene({ mode, reduced, heroRef, stageRef, pointer }: RobotSceneProps) {
  const parts = usePartRefs()
  const physics = useRef<Physics>({
    x: 0,
    y: 0,
    noticeX: 0,
    noticeY: 0,
    desiredX: 0,
    desiredY: 0,
    vx: 0,
    vy: 0,
    walkPhase: 0,
    noticeWait: 0,
    ready: false,
  })

  useFrame(({ clock }, delta) => {
    const hero = heroRef.current
    const stage = stageRef.current
    const body = parts.current
    if (!hero || !stage) return

    const dt = Math.min(delta, 0.04)
    const width = hero.clientWidth
    const height = hero.clientHeight
    const stageW = stage.offsetWidth
    const stageH = stage.offsetHeight
    const home = homePoint(width, height)
    const p = physics.current
    const cursor = pointer.current

    if (!p.ready) {
      p.x = home.x
      p.y = home.y
      p.noticeX = home.x
      p.noticeY = home.y
      p.desiredX = home.x
      p.desiredY = home.y
      p.ready = true
    }

    const interactive = mode === 'full' && !reduced
    const still = performance.now() - cursor.lastMove > robotConfig.stillMs

    if (interactive && cursor.inside && !still) {
      const clamped = clampToSafe(cursor.x, cursor.y, width, height, stageW, stageH)
      const limited = limitFromHome(clamped.x, clamped.y, home.x, home.y, robotConfig.maxDistance)
      const jump = Math.hypot(limited.x - p.desiredX, limited.y - p.desiredY)
      if (jump > robotConfig.deadzone) p.noticeWait = robotConfig.noticeDelay
      p.desiredX = limited.x
      p.desiredY = limited.y
    } else if (!interactive || !cursor.inside) {
      p.desiredX = home.x
      p.desiredY = home.y
    }

    p.noticeX = MathUtils.damp(p.noticeX, p.desiredX, robotConfig.notice, dt)
    p.noticeY = MathUtils.damp(p.noticeY, p.desiredY, robotConfig.notice, dt)
    p.noticeWait = Math.max(0, p.noticeWait - dt)

    const canWalk = interactive && p.noticeWait === 0
    const targetX = canWalk ? p.noticeX : p.x
    const targetY = canWalk ? p.noticeY : p.y

    const prevX = p.x
    const prevY = p.y
    p.x = MathUtils.damp(p.x, targetX, robotConfig.follow, dt)
    p.y = MathUtils.damp(p.y, targetY, robotConfig.follow, dt)
    p.vx = (p.x - prevX) / Math.max(dt, 1 / 120)
    p.vy = (p.y - prevY) / Math.max(dt, 1 / 120)

    const speed = Math.hypot(p.vx, p.vy)
    const walk = MathUtils.smoothstep(robotConfig.walkStart, robotConfig.walkFull, speed)

    stage.style.transform = `translate3d(${p.x - stageW / 2}px, ${p.y - stageH / 2}px, 0)`

    const t = clock.elapsedTime
    if (body.body) {
      const breathe = reduced ? 0.008 : 0.016
      body.body.position.y = Math.sin(t * 1.6) * breathe + Math.abs(Math.sin(p.walkPhase * 2)) * walk * 0.028
      body.body.rotation.z = MathUtils.damp(body.body.rotation.z, MathUtils.clamp(-p.vx * 0.0012, -0.12, 0.12), 6, dt)
    }

    if (body.root) {
      const yaw = 0.32 + MathUtils.clamp(p.vx * 0.0045, -robotConfig.bodyTurn, robotConfig.bodyTurn)
      body.root.rotation.y = MathUtils.damp(body.root.rotation.y, yaw, 5, dt)
    }

    if (body.head) {
      const lookX = cursor.hoverKind ? cursor.hoverX : cursor.x
      const lookY = cursor.hoverKind ? cursor.hoverY : cursor.y
      const hx = MathUtils.clamp((lookX - p.x) / 280, -0.45, 0.45) * robotConfig.headLook * 2.2
      const hy = MathUtils.clamp((lookY - p.y) / 240, -0.28, 0.28) * robotConfig.headLook * 1.6
      body.head.rotation.y = MathUtils.damp(body.head.rotation.y, interactive && cursor.inside ? hx : 0, 7, dt)
      body.head.rotation.x = MathUtils.damp(body.head.rotation.x, interactive && cursor.inside ? -hy : 0, 7, dt)
    }

    p.walkPhase += dt * (6 + walk * 10)
    const swing = walk * 0.55
    if (body.leftLeg) body.leftLeg.rotation.x = Math.sin(p.walkPhase) * swing
    if (body.rightLeg) body.rightLeg.rotation.x = Math.sin(p.walkPhase + Math.PI) * swing
    if (body.leftArm) {
      body.leftArm.rotation.x = Math.sin(p.walkPhase + Math.PI) * swing * 0.7
    }
    if (body.rightArm) {
      const point = cursor.hoverKind === 'cta' ? -0.55 : 0
      body.rightArm.rotation.x = MathUtils.damp(
        body.rightArm.rotation.x,
        point + Math.sin(p.walkPhase) * swing * 0.7,
        6,
        dt,
      )
    }
  })

  return (
    <>
      <hemisphereLight args={['#ffffff', '#9a958c', 0.85]} />
      <directionalLight position={[2.4, 4.2, 3.2]} intensity={1.45} />
      <directionalLight position={[-2.2, 1.4, 1.8]} intensity={0.35} color="#4d7cff" />
      <pointLight position={[0.1, 0.95, 0.4]} intensity={0.55} distance={2.4} color="#7ec8ff" />
      <ambientLight intensity={0.22} />
      <RobotModel parts={parts} />
    </>
  )
}
