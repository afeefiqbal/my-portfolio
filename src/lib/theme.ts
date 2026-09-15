import { useSyncExternalStore } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'afeef-theme'
const THEME_COLORS: Record<Theme, string> = {
  dark: '#08090a',
  light: '#f4f4f1',
}

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage unavailable (private mode) — theme still applies for the session.
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLORS[theme])
  window.dispatchEvent(new Event('themechange'))
}

export function toggleTheme(): void {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark')
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('themechange', callback)
  return () => window.removeEventListener('themechange', callback)
}

/** Reactive current theme. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme)
}
