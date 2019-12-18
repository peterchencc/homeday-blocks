import { wrapperFactoryBuilder } from 'tests/unit/helpers';
import FIELD_CLASSES from './FIELD_CLASSES';
import HdInputPassword from '@/components/form/HdInputPassword.vue';
import HdInput from '@/components/form/HdInput.vue';

const ERROR_SELECTOR = '.field__error';
const ICON_SELECTOR = '.field__icon';
const VISIBILITY_TOGGLE_SELECTOR = '.field__visibilityToggle';

const PASSWORD_VISIBLE_CLASS = 'field__visibilityToggle--visible';

const TEST_VALUE = 'new value';
const TEST_PROPS = {
  name: 'test name',
  label: 'test label',
  placeholder: 'test placeholder',
  value: 'test password',
};

describe('HdInputPassword', () => {
  const wrapperFactory = wrapperFactoryBuilder(
    HdInputPassword,
    {
      propsData: TEST_PROPS,
    },
  );

  let wrapper;
  let inputWrapper;
  beforeEach(() => {
    wrapper = wrapperFactory();
    inputWrapper = wrapper.find(HdInput);
  });

  test('is rendered as expected', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('updates the field on change of the prop `value`', () => {
    wrapper.setProps({ value: TEST_VALUE });
    expect(wrapper.find('input').element.value).toBe(TEST_VALUE);
  });

  test('emits `input` event with the right payload', () => {
    wrapper.find('input').setValue(TEST_VALUE);
    expect(inputWrapper.emitted('input')[0][0]).toEqual(TEST_VALUE);
  });

  test('validates requiredness', () => {
    wrapper = wrapperFactory({
      propsData: {
        value: '',
        required: true,
      },
    });
    inputWrapper = wrapper.find(HdInput);

    expect(inputWrapper.vm.validate()).toBe(false);
    expect(inputWrapper.find(ERROR_SELECTOR).text()).toBeTruthy();
    expect(inputWrapper.classes()).toContain(FIELD_CLASSES.INVALID);

    wrapper.setProps({ required: false });
    expect(inputWrapper.vm.validate()).toBe(true);
  });

  test('check if the input type is "password"', () => {
    expect(wrapper
      .find('input')
      .attributes()
      .type).toBe('password');
  });

  test('shows the visibility toggle', () => {
    expect(wrapper.find(VISIBILITY_TOGGLE_SELECTOR).exists()).toBe(true);
  });

  test('toggles the password\'s visibility', () => {
    const toggle = wrapper.find(VISIBILITY_TOGGLE_SELECTOR);

    toggle.trigger('click');
    expect(wrapper.find('input').attributes().type).toBe('text');
    expect(toggle.classes()).toContain(PASSWORD_VISIBLE_CLASS);

    toggle.trigger('click');
    expect(wrapper.find('input').attributes().type).toBe('password');
    expect(toggle.classes()).not.toContain(PASSWORD_VISIBLE_CLASS);
  });

  test('doesn\'t show visibility toggle if empty', () => {
    wrapper.setProps({ value: '' });
    expect(wrapper.find(VISIBILITY_TOGGLE_SELECTOR).exists()).toBe(false);
  });

  test('Supports disabling', () => {
    wrapper.setProps({
      disabled: true,
    });
    expect(wrapper.find('input').attributes().disabled).toBe('disabled');
  });

  test('Can render an icon', () => {
    const ICON_PATH = 'fake/icon.svg';

    expect(wrapper.classes()).not.toContain(FIELD_CLASSES.HAS_ICON);
    expect(wrapper.find(ICON_SELECTOR).exists()).toBe(false);

    wrapper.setProps({
      icon: ICON_PATH,
    });

    expect(inputWrapper.classes()).toContain(FIELD_CLASSES.HAS_ICON);
    expect(wrapper.find(ICON_SELECTOR).exists()).toBe(true);
  });
});
