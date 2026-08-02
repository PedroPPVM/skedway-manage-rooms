import '@testing-library/jest-dom/vitest'
import { beforeEach, vi } from 'vitest'

// jsdom 29 does not implement HTMLDialogElement methods yet
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false
  }
}

// jsdom does not implement matchMedia, required by ThemeProvider
export function createMatchMedia(matches: boolean) {
  return (query: string): MediaQueryList =>
    ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList
}

beforeEach(() => {
  window.matchMedia = createMatchMedia(false)
})
