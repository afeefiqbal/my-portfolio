import { useEffect } from 'react'
import { Scene } from './components/3d/Scene'
import { HUD } from './components/ui/HUD'
import { Hero } from './components/ui/Hero'
import { Joystick } from './components/ui/Joystick'
import { PortfolioPanel } from './components/ui/PortfolioPanel'
import { QuickNav } from './components/ui/QuickNav'
import { useDeviceProfile, useJourneyHotkeys } from './hooks/useJourneyLifecycle'
import { useJourney } from './store/journey'

export default function App() {
  useDeviceProfile()
  useJourneyHotkeys()
  const { started } = useJourney()

  useEffect(() => {
    document.body.classList.toggle('journey-live', started)
  }, [started])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#portfolio-nav">
        Skip to navigation
      </a>
      <Scene />
      <Hero />
      <HUD />
      <PortfolioPanel />
      <QuickNav />
      <Joystick />
    </div>
  )
}
