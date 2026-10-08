import { describe, expect, it } from 'vitest'
import { apiBaseUrl, resolveAssetUrl } from '../../src/config/network'

describe('LAN URLs', () => {
  it('resolves the proxy API on the device-facing origin', () => {
    expect(apiBaseUrl('/api', 'http://192.168.1.184:5173')).toBe('http://192.168.1.184:5173/api')
  })
  it('repairs a loopback API hostname when opened through LAN', () => {
    expect(apiBaseUrl('http://localhost:8000/api', 'http://192.168.1.184:5173')).toBe('http://192.168.1.184:8000/api')
  })
  it('preserves explicitly configured remote APIs', () => {
    expect(apiBaseUrl('https://api.example.com/api', 'http://192.168.1.184:5173')).toBe('https://api.example.com/api')
  })
  it('resolves storage through the same reachable origin and repairs old loopback URLs', () => {
    const base = 'http://192.168.1.184:5173/api'
    expect(resolveAssetUrl('/storage/logos/test.webp', base)).toBe('http://192.168.1.184:5173/storage/logos/test.webp')
    expect(resolveAssetUrl('http://localhost:8000/storage/a.png', base)).toBe('http://192.168.1.184:5173/storage/a.png')
  })
})
