import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import FormBuilder from '../FormBuilder.vue';

// Мокируем fetch для загрузки JSON
global.fetch = vi.fn();

describe('FormBuilder', () => {
  let wrapper;

  const mockData = {
    section1: {
      name: 'Section 1',
      items: [
        { name: 'input1', label: 'Input 1', type: 'input' },
        { name: 'pass', label: 'Password', type: 'password' },
        { name: 'repeat-pass', label: 'Repeat Password', type: 'password' },
      ],
    },
  };

  beforeEach(async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    wrapper = mount(FormBuilder);
    await wrapper.vm.loadJson();
  });

  it('renders correctly', () => {
    expect(wrapper.isVisible()).toBe(true);
    expect(wrapper.find('h2').text()).toBe('Section 1');
  });

  it('loads JSON and initializes form values', () => {
    expect(wrapper.vm.data).toEqual(mockData);
    expect(wrapper.vm.formValues).toEqual({
      section1: {
        input1: '',
        pass: '',
        'repeat-pass': '',
      },
    });
    expect(wrapper.vm.errors).toEqual({
      section1: {
        input1: null,
        pass: null,
        'repeat-pass': null,
      },
    });
  });

  it('validates empty fields and sets errors', async () => {
    await wrapper.vm.onSubmit();

    expect(wrapper.vm.errors.section1.input1).toBe('Это поле обязательно.');
    expect(wrapper.vm.errors.section1.pass).toBe('Это поле обязательно.');
    expect(wrapper.vm.errors.section1['repeat-pass']).toBe('Это поле обязательно.');
    expect(wrapper.find('.error').exists()).toBe(true);
  });

  it('validates password mismatch', async () => {
    wrapper.vm.formValues.section1.pass = 'password123';
    wrapper.vm.formValues.section1['repeat-pass'] = 'password456';

    await wrapper.vm.onSubmit();

    expect(wrapper.vm.errors.section1['repeat-pass']).toBe('Пароли не совпадают.');
  });

  it('submits form when valid', async () => {
    wrapper.vm.formValues.section1.input1 = 'Valid input';
    wrapper.vm.formValues.section1.pass = 'password123';
    wrapper.vm.formValues.section1['repeat-pass'] = 'password123';

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await wrapper.vm.onSubmit();

    expect(wrapper.vm.errors.section1.input1).toBeNull();
    expect(wrapper.vm.errors.section1.pass).toBeNull();
    expect(wrapper.vm.errors.section1['repeat-pass']).toBeNull();
  });

  it('handles fetch error during JSON load', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    const newWrapper = mount(FormBuilder);

    await newWrapper.vm.loadJson();

    expect(newWrapper.vm.data).toBeNull();
  });

  it('handles form submission error', async () => {
    wrapper.vm.formValues.section1.input1 = 'Valid input';
    wrapper.vm.formValues.section1.pass = 'password123';
    wrapper.vm.formValues.section1['repeat-pass'] = 'password123';

    fetch.mockRejectedValueOnce(new Error('Submission error'));

    await wrapper.vm.onSubmit();

    expect(wrapper.find('.error').exists()).toBe(false); // Ошибки не должны отображаться
  });
});
