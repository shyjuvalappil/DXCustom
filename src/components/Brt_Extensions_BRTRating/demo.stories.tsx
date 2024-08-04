
/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';

import BrtExtensionsBrtRating from './index';

import { stateProps, fieldMetadata, configProps } from './mock';

const meta: Meta<typeof BrtExtensionsBrtRating> = {
  title: 'BrtExtensionsBrtRating',
  component: BrtExtensionsBrtRating,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof BrtExtensionsBrtRating>;

export const BaseBrtExtensionsBrtRating: Story = args => {

  const props = {
    value: configProps.value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    helperText: configProps.helperText,
    testId: configProps.testId,
    hasSuggestions: configProps.hasSuggestions,
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
      <BrtExtensionsBrtRating {...props} {...args} />
    </>
  );
};

BaseBrtExtensionsBrtRating.args = {
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
