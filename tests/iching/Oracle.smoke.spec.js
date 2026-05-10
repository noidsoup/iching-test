import { describe, it, expect } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IChingOracle from '../../src/components/IChingOracle.vue';

function mountOracle() {
  const vuetify = createVuetify({ components, directives });
  return mount(IChingOracle, {
    global: { plugins: [vuetify] },
  });
}

describe('IChingOracle.vue (smoke)', () => {
  it('casts six coin lines and shows primary hexagram', async () => {
    const wrapper = mountOracle();
    await flushPromises();
    const castBtn = wrapper.findAll('button').find((b) => b.text().includes('Finish hexagram'));
    expect(castBtn).toBeTruthy();
    await castBtn.trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('Primary hexagram');
    expect(wrapper.findAll('.hex-panel').length).toBeGreaterThan(0);
  });

  it('clears lines when Clear is used', async () => {
    const wrapper = mountOracle();
    await wrapper.findAll('button').find((b) => b.text().includes('Finish hexagram'))?.trigger('click');
    await flushPromises();
    await wrapper.findAll('button').find((b) => b.text() === 'Clear')?.trigger('click');
    await flushPromises();
    expect(wrapper.text()).not.toContain('Primary hexagram');
  });
});
