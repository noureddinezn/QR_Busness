export async function mockApi(page) {
  const state = {
    token: 'token-123',
    user: { id: 1, name: 'Demo Owner', email: 'demo@example.com', role: 'admin', is_active: true },
    pages: [
      {
        id: 1,
        title: 'TechZone',
        slug: 'techzone',
        bio: 'Phone repairs and accessories',
        theme: 'black-gold',
        primary_color: '#d4af37',
        secondary_color: '#111827',
        is_active: true,
        links_count: 2,
        scans_count: 4,
        links: [
          { id: 1, title: 'WhatsApp', type: 'whatsapp', url: '+212600000000', position: 0, is_active: true },
          { id: 2, title: 'Instagram', type: 'instagram', url: 'https://instagram.com/techzone', position: 1, is_active: true },
          { id: 3, title: 'Our Location', type: 'maps', url: 'Avenue Hassan II Safi', position: 2, is_active: true },
        ],
        public_url: 'http://127.0.0.1:5173/p/techzone',
      },
    ],
  }

  await page.route('**/api/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const path = url.pathname.replace('/api', '')
    const method = request.method()

    if (path === '/login' && method === 'POST') {
      return route.fulfill({ json: { user: state.user, token: state.token } })
    }

    if (path === '/register' && method === 'POST') {
      return route.fulfill({ json: { user: state.user, token: state.token }, status: 201 })
    }

    if (path === '/user') {
      return route.fulfill({ json: { user: state.user } })
    }

    if (path === '/pages' && method === 'GET') {
      return route.fulfill({ json: { data: state.pages } })
    }

    if (path === '/pages' && method === 'POST') {
      const pageData = { ...state.pages[0], id: 2, title: 'Barber Pro', slug: 'barber-pro', links: [] }
      state.pages.push(pageData)
      return route.fulfill({ json: { data: pageData }, status: 201 })
    }

    const pageMatch = path.match(/^\/pages\/(\d+)$/)
    if (pageMatch && method === 'GET') {
      return route.fulfill({ json: { data: state.pages.find((item) => item.id === Number(pageMatch[1])) } })
    }

    if (pageMatch && method === 'POST') {
      return route.fulfill({ json: { data: state.pages.find((item) => item.id === Number(pageMatch[1])) } })
    }

    const linksMatch = path.match(/^\/pages\/(\d+)\/links$/)
    if (linksMatch && method === 'POST') {
      const payload = request.postDataJSON()
      const pageRecord = state.pages.find((item) => item.id === Number(linksMatch[1]))
      const link = { id: Date.now(), position: pageRecord.links.length, is_active: true, ...payload }
      pageRecord.links.push(link)
      return route.fulfill({ json: { data: link }, status: 201 })
    }

    const qrMatch = path.match(/^\/pages\/(\d+)\/qr/)
    if (qrMatch) {
      const pageRecord = state.pages.find((item) => item.id === Number(qrMatch[1]))
      return route.fulfill({
        json: {
          data: [
            { id: 1, type: 'main', target_url: pageRecord.public_url },
            { id: 2, type: 'whatsapp', target_url: 'https://wa.me/212600000000' },
            { id: 3, type: 'maps', target_url: 'https://www.google.com/maps/search/?api=1&query=Avenue%20Hassan%20II%20Safi' },
          ],
        },
      })
    }

    if (path === '/public/pages/techzone') {
      return route.fulfill({ json: { data: state.pages[0] } })
    }

    if (path === '/ai/design' && method === 'POST') {
      return route.fulfill({
        json: {
          data: {
            title: 'TechZone Premium',
            bio: 'Votre destination premium pour smartphones, accessoires et réparation rapide.',
            business_description: 'Smartphones, accessories and repair',
            theme: 'black-gold',
            primary_color: '#D4AF37',
            secondary_color: '#0B0F19',
            background_color: '#05070D',
            button_style: 'rounded',
            recommended_links: [
              { type: 'whatsapp', title: 'Commander sur WhatsApp' },
              { type: 'instagram', title: 'Voir Instagram' },
            ],
            cover_prompt: 'Premium black and gold phone store interior with cinematic lighting',
            profile_image_style: 'Clean centered logo with gold accent.',
            menu_or_catalogue_ideas: ['Smartphones', 'Accessories', 'Repair Services'],
          },
        },
      })
    }

    const clickMatch = path.match(/^\/links\/(\d+)\/click$/)
    if (clickMatch) {
      const id = Number(clickMatch[1])
      const link = state.pages.flatMap((item) => item.links).find((item) => item.id === id)
      const target = link.type === 'whatsapp' ? 'https://wa.me/212600000000' : link.url
      return route.fulfill({ json: { target_url: target } })
    }

    if (path.includes('/analytics')) {
      return route.fulfill({
        json: {
          data: {
            total_page_views: 4,
            total_qr_scans: 4,
            total_link_clicks: 3,
            total_links: 3,
            most_clicked_links: state.pages[0].links.map((link) => ({ ...link, clicks_count: 1 })),
            recent_scans: [],
            recent_clicks: [],
          },
        },
      })
    }

    return route.fulfill({ json: { data: {} } })
  })
}

export async function login(page) {
  await page.goto('/login')
  await page.getByLabel('Email').fill('demo@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Login' }).click()
  await page.waitForURL('**/dashboard')
}
