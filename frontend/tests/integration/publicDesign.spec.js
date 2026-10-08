import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PublicProfile from '../../src/components/profile/PublicProfile.vue'
import PhonePreview from '../../src/components/profile/PhonePreview.vue'

describe('shared profile design', () => {
  const page = {
    title: 'Developer', slug: 'developer', theme: 'black-gold',
    background_color: '#112233', primary_color: '#D4AF37', button_style: 'square',
    links: [
      { id: 1, title: 'My site', type: 'website', is_active: true },
      { id: 2, title: 'Private draft', type: 'instagram', is_active: false },
    ],
  }
  it('uses the same content and design in the phone frame and public page', () => {
    const publicView = mount(PublicProfile, { props: { page } })
    const preview = mount(PhonePreview, { props: { page } })
    expect(publicView.text()).toBe(preview.text())
    expect(publicView.text()).not.toContain('Private draft')
    expect(publicView.find('.digital-profile').attributes('style')).toContain('background-color: rgb(17, 34, 51)')
    expect(publicView.find('.digital-profile').attributes('style')).toContain('--button-radius: 0px')
  })
  it('emits only the selected link and updates active links reactively', async () => {
    const view = mount(PublicProfile, { props: { page } })
    await view.find('.public-link').trigger('click')
    expect(view.emitted('open')[0][0].id).toBe(1)
    await view.setProps({ page: { ...page, links: page.links.map(link => ({ ...link, is_active: true })) } })
    expect(view.findAll('.public-link')).toHaveLength(2)
  })
})
