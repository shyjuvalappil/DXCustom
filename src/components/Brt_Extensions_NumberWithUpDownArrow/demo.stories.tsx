/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';

import { stateProps, configProps, fieldMetadata } from './mock';

import BrtExtensionsNumberWithUpDownArrow from './index';

const meta: Meta<typeof BrtExtensionsNumberWithUpDownArrow> = {
  title: 'BrtExtensionsNumberWithUpDownArrow',
  component: BrtExtensionsNumberWithUpDownArrow,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof BrtExtensionsNumberWithUpDownArrow>;

export const BaseBrtExtensionsNumberWithUpDownArrow: Story = args => {

  const props = {
    value: configProps.value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    helperText: configProps.helperText,
    showGroupSeparators: configProps.showGroupSeparators,
    hasSuggestions: configProps.hasSuggestions,
    testId: configProps.testId,
    fieldMetadata,
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
      <BrtExtensionsNumberWithUpDownArrow {...props} {...args} />
    </>
  );
};

BaseBrtExtensionsNumberWithUpDownArrow.args = {
  label: configProps.label,
  helperText: configProps.helperText,
  showGroupSeparators: configProps.showGroupSeparators,
  testId: configProps.testId,
  readOnly: configProps.readOnly,
  disabled: configProps.disabled,
  required: configProps.required,
  status: configProps.status,
  hideLabel: configProps.hideLabel,
  displayMode: configProps.displayMode,
  validatemessage: configProps.validatemessage
};
