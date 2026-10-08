import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
if (process.env.MOBILE_THROTTLE === '1') {
  const session = await page.context().newCDPSession(page)
  await session.send('Network.enable')
  await session.send('Network.emulateNetworkConditions', { offline: false, latency: 100, downloadThroughput: 200000, uploadThroughput: 100000 })
  await session.send('Emulation.setCPUThrottlingRate', { rate: 4 })
}
const requests = []
page.on('requestfailed', request => requests.push({ failed: request.url(), error: request.failure() }))
page.on('response', async response => {
  const request = response.request()
  requests.push({ url: response.url(), status: response.status(), type: request.resourceType() })
})
const start = Date.now()
await page.goto(process.env.PROFILE_URL || 'http://192.168.1.184:5173/p/noureddine')
await page.locator('.digital-profile h1').waitFor({ timeout: 20000 })
const profileVisibleMs = Date.now() - start
await page.waitForLoadState('networkidle')
const resources = await page.evaluate(() => performance.getEntriesByType('resource').map(r => ({ url: r.name, ms: Math.round(r.duration), bytes: r.transferSize })))
console.log(JSON.stringify({ profileVisibleMs, settledMs: Date.now() - start, requestCount: requests.length, bytes: resources.reduce((sum,r) => sum + r.bytes,0), failures: requests.filter(r => r.failed || r.status >= 400), slowest: resources.sort((a,b) => b.ms - a.ms).slice(0,8), editorLoaded: requests.some(r => /PageEditorView|AiDesignAssistant|qrcode.js/.test(r.url)) }, null, 2))
await browser.close()
