/**
 * Tune the companion here. Values are intentionally conservative so the
 * robot feels like a signature, not a chase.
 */
export const robotConfig = {
  /** Stage size as a fraction of viewport height. */
  sizeVh: 0.2,
  /**
   * How quickly the *noticed* target catches the cursor.
   * Lower = more delay before the robot commits to a new point.
   */
  notice: 2.2,
  /**
   * How quickly the robot closes on the noticed target.
   * Lower = softer acceleration / more glide.
   */
  follow: 5.4,
  /** Extra velocity damping. Higher = stops sooner. */
  damping: 3.6,
  /** Furthest the robot may wander from its home point, in px. */
  maxDistance: 210,
  /** Ignore cursor jitter below this many pixels. */
  deadzone: 10,
  /** Pause after last mousemove before the robot is treated as idle (ms). */
  stillMs: 380,
  /** Brief look-before-walk delay (seconds). */
  noticeDelay: 0.16,
  /** Walk-cycle blend starts above this speed (px / s). */
  walkStart: 18,
  /** Full walk-cycle blend at this speed (px / s). */
  walkFull: 90,
  /** Head look toward cursor (0–1). */
  headLook: 0.42,
  /** Body yaw toward travel direction (radians, max). */
  bodyTurn: 0.5,
} as const

export type RobotMode = 'full' | 'idle' | 'off'
