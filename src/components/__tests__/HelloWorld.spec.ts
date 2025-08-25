import { mount } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import HelloWorld from '../HelloWorld.vue'

describe('helloWorld Placeholder', () => {
  it('renders placeholder content', () => {
    const wrapper = mount(HelloWorld, { props: { title: 'Test Component' } })
    expect(wrapper.text()).toContain('Test Component')
  })

  it('renders default title when no title prop provided', () => {
    const wrapper = mount(HelloWorld)
    expect(wrapper.text()).toContain('Placeholder Component')
  })
})
