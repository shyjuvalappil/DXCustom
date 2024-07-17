
/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';

import BrtCustomControlCustomPhone from './index';
import { stateProps, configProps } from './mock';

const meta: Meta<typeof BrtCustomControlCustomPhone> = {
  title: 'BrtCustomControlCustomPhone',
  component: BrtCustomControlCustomPhone,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof BrtCustomControlCustomPhone>;

export const BaseBrtCustomControlCustomPhone: Story = args => {

  const props = {
    value: configProps.value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    testId: configProps.testId,
    hasSuggestions: configProps.hasSuggestions,
    datasource: configProps.datasource,
    validatemessage: '',
    getPConnect: () => {
      return {
        getStateProps: () => {
          return stateProps;
        },
        getActionsApi: () => {
          return {
            updateFieldValue: () => {/* nothing */},
            triggerFieldChange: () => {/* nothing */}
          };
        },
        ignoreSuggestion: () => {/* nothing */},
        acceptSuggestion: () => {/* nothing */},
        setInheritedProps: () => {/* nothing */},
        resolveConfigProps: () => {/* nothing */}
      };
    }
  };

  return (
    <>
      <BrtCustomControlCustomPhone {...props} {...args} />
    </>
  );
};

BaseBrtCustomControlCustomPhone.args = {
  label: configProps.label,
  helperText: configProps.helperText,
  placeholder: configProps.placeholder,
  testId: configProps.testId,
  readOnly: configProps.readOnly,
  disabled: configProps.disabled,
  required: configProps.required,
  status: configProps.status,
  hideLabel: configProps.hideLabel,
  displayMode: configProps.displayMode,
  validatemessage: configProps.validatemessage
};
