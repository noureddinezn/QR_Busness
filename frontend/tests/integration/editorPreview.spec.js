import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PhonePreview from '../../src/components/profile/PhonePreview.vue'

describe('editor live preview integration', () => {
  it('updates the mobile preview when profile data changes', async () => {
    const wrapper = mount(PhonePreview, {
      props: {
        page: {
          title: 'TechZone',
          slug: 'techzone',
          bio: 'Repairs and accessories',
          theme: 'black-gold',
          links: [{ id: 1, title: 'WhatsApp', type: 'whatsapp' }],
        },
      },
    })

    expect(wrapper.text()).toContain('TechZone')
    expect(wrapper.text()).toContain('WhatsApp')

    await wrapper.setProps({
      page: {
        title: 'Barber Pro',
        slug: 'barber-pro',
        bio: 'Bookings and location',
        theme: 'business',
        links: [{ id: 2, title: 'Book Now', type: 'booking' }],
      },
    })

    expect(wrapper.text()).toContain('Barber Pro')
    expect(wrapper.text()).toContain('Book Now')
    expect(wrapper.text()).not.toContain('TechZone')
  })
})
