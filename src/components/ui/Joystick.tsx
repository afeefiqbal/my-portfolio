import { useRef } from 'react'
import { sim, useJourney } from '../../store/journey'

export function Joystick() {
  const { isTouch, started, activePanel } = useJourney()
  const origin = useRef({ x: 0, y: 0 })
  const knob = useRef<HTMLDivElement>(null)
  if (!isTouch || !started || activePanel) return null

  const setFromPointer = (clientX: number, clientY: number) => {
    const dx = clientX - origin.current.x
    const dy = clientY - origin.current.y
    const max = 38
    const len = Math.hypot(dx, dy)
    const scale = len > max ? max / len : 1
    const x = dx * scale
    const y = dy * scale
    sim.input.x = x / max
    sim.input.z = -y / max
    if (knob.current) knob.current.style.transform = `translate(${x}px, ${y}px)`
  }

  const reset = () => {
    sim.input.x = 0
    sim.input.z = 0
    if (knob.current) knob.current.style.transform = 'translate(0px, 0px)'
  }

  return (
    <div
      className="joystick"
      onPointerDown={(event) => {
        origin.current = { x: event.clientX, y: event.clientY }
        event.currentTarget.setPointerCapture(event.pointerId)
        setFromPointer(event.clientX, event.clientY)
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
        setFromPointer(event.clientX, event.clientY)
      }}
      onPointerUp={reset}
      onPointerCancel={reset}
    >
      <div ref={knob} className="joystick-knob" />
      <span>Move</span>
    </div>
  )
}
