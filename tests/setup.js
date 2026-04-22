/* Vuetify 3 layout uses ResizeObserver; jsdom does not provide it. */
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverStub;
