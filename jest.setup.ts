import '@testing-library/jest-dom'

// jsdom doesn't implement layout APIs used by the carousel
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub
Element.prototype.scrollIntoView ??= () => {}
Element.prototype.scrollBy ??= () => {}
