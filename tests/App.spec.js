import { describe, it, expect } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import App from '../src/App.vue';

function mountWithVuetify(component) {
  const vuetify = createVuetify({ components, directives });
  return mount(component, {
    global: { plugins: [vuetify] },
  });
}

describe('App.vue', () => {
  it('renders a hexagram block after mount', async () => {
    const wrapper = mountWithVuetify(App);
    await flushPromises();
    const browseTab = wrapper.findAll('.v-tab').find((t) => t.text().includes('Browse'));
    expect(browseTab).toBeTruthy();
    await browseTab.trigger('click');
    await flushPromises();
    const el = wrapper.find('.hexagram');
    expect(el.exists()).toBe(true);
    expect(el.text().trim().length).toBeGreaterThan(0);
  });

  it('shows toolbar title', async () => {
    const wrapper = mountWithVuetify(App);
    await flushPromises();
    expect(wrapper.text()).toContain('I Ching: The Book of Changes');
  });
});
