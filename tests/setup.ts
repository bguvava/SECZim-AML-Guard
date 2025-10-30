import { beforeEach, vi } from 'vitest'

// Mock localStorage and sessionStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem(key: string) {
      return store[key] || null
    },
    setItem(key: string, value: string) {
      store[key] = value.toString()
    },
    removeItem(key: string) {
      delete store[key]
    },
    clear() {
      store = {}
    }
  }
})()

const sessionStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem(key: string) {
      return store[key] || null
    },
    setItem(key: string, value: string) {
      store[key] = value.toString()
    },
    removeItem(key: string) {
      delete store[key]
    },
    clear() {
      store = {}
    }
  }
})()

// Assign mocks to global
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true
})

Object.defineProperty(globalThis, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
})

// Clear storage before each test
beforeEach(() => {
  localStorageMock.clear()
  sessionStorageMock.clear()
})
