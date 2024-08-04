import { useState, useEffect, useRef } from 'react';
import {
  NumberInput,
  NumberDisplay,
  Slider,
  FieldValueList,
  CurrencyDisplay,
  Text,
  withConfiguration
} from '@pega/cosmos-react-core';

import type { PConnFieldProps } from './PConnProps';

// includes in bundle
import handleEvent from './event-utils';
import { suggestionsHandler } from './suggestions-handler';

import StyledBrtExtensionsNumberWithUpDownArrowWrapper from './styles';

import styled from 'styled-components';

const DownArrowIcon = styled.span`
  position: absolute;
  top: 65%;
  right: 0px;
  transform: translateY(-20%);
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M19 21a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14zm-8-9V7h2v5h4l-5 5-5-5h4z' fill='%23888888'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  width: 22px; /* Adjust the size as needed */
  height: 22px; /* Adjust the size as needed */
`;

const UpArrowIcon = styled.span`
  position: absolute;
  bottom: 10%;
  right: 0px;
  transform: translateY(-50%);
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zm7-14 5 5h-4v5h-2v-5H7l5-5z' fill='%23888888'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  width: 22px; /* Adjust the size as needed */
  height: 22px; /* Adjust the size as needed */
`;

const InputContainer = styled.div`
  position: relative;
`;

// interface for props
interface BrtExtensionsNumberWithUpDownArrowProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  displayAs?: string;
  defaultValue: number;
  isTableFormatter?: boolean;
  hasSuggestions?: boolean;
  variant?: any;
  formatter: string;
  decimalPrecision: string;
  allowDecimals: boolean;
  currencyISOCode: string;
  alwaysShowISOCode: boolean;
  additionalProps: any;
  showGroupSeparators: boolean;
  currencyDisplay: 'symbol' | 'code' | 'name' | undefined;
  negative: 'minus-sign' | 'parentheses' | undefined;
  notation: 'standard' | 'compact' | undefined;
  currencyDecimalPrecision: string;
  showInput: boolean;
  min: number;
  max: number;
  step: number;
  showTicks: boolean;
}

// interface for StateProps object
interface StateProps {
  value: string;
  hasSuggestions: boolean;
}

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function BrtExtensionsNumberWithUpDownArrow(props: BrtExtensionsNumberWithUpDownArrowProps) {
  const {
    getPConnect,
    value,
    defaultValue,
    placeholder,
    validatemessage,
    label,
    hideLabel = false,
    helperText,
    testId,
    displayMode,
    displayAs,
    showInput = true,
    min = 0,
    max = 100,
    step = 1,
    showTicks = true,
    additionalProps = {},
    variant = 'inline',
    formatter = 'defaultInteger',
    negative = 'minus-sign',
    notation = 'standard',
    isTableFormatter = false,
    hasSuggestions = false
  } = props;
  let { showGroupSeparators = false } = props;
  let { currencyDisplay = 'symbol' } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value;
  const [integerValue, setIntegerValue] = useState(value?.toString());
  const sliderDefaultValue = !defaultValue && defaultValue !== 0 ? max : defaultValue;

  const hasValueChange = useRef(false);

  let { readOnly = false, required = false, disabled = false } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    prop => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  const [status, setStatus] = useState(hasSuggestions ? 'pending' : '');
  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (hasSuggestions) {
      setStatus('pending');
    } else if (!hasSuggestions && status !== 'success') {
      // @ts-ignore
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [validatemessage, hasSuggestions, status]);

  useEffect(() => {
    setIntegerValue(value?.toString());
  }, [value]);

  useEffect(() => {
    if (displayAs === 'slider' && value === '') {
      // @ts-ignore
      handleEvent(actions, 'change', propName, sliderDefaultValue);
    }
  }, [actions, displayAs, propName, sliderDefaultValue, value]);

  const { decimalPrecision, currencyDecimalPrecision = 'auto', currencyISOCode = 'USD' } = props;
  let noOfDecimals = parseInt(decimalPrecision, 10);
  // @ts-ignore
  if (Number.isNaN(noOfDecimals)) noOfDecimals = undefined;
  let noOfFractionDigits =
    currencyDecimalPrecision === 'auto' ? undefined : parseInt(currencyDecimalPrecision, 10);
  let unit;
  let unitPlacement;

  // @ts-ignore
  if (['LABELS_LEFT', 'STACKED_LARGE_VAL', 'DISPLAY_ONLY'].includes(displayMode)) {
    switch (formatter) {
      case 'Decimal': {
        break;
      }
      case 'Percentage': {
        showGroupSeparators = false;
        unit = '%';
        unitPlacement = 'after';
        break;
      }
      case 'Decimal-Auto': {
        noOfDecimals = Number.isInteger(integerValue) ? 0 : 2;
        break;
      }
      default: {
        noOfDecimals = 0;
        break;
      }
    }

    if (isTableFormatter && displayMode === 'LABELS_LEFT') {
      showGroupSeparators = true;
      noOfFractionDigits = undefined;
      if (formatter === 'Currency-Code') {
        currencyDisplay = 'code';
      }
    }

    const displayComp =
      formatter === 'Currency' || formatter === 'Currency-Code' ? (
        <CurrencyDisplay
          value={integerValue}
          currencyISOCode={currencyISOCode}
          formattingOptions={{
            groupSeparators: showGroupSeparators,
            fractionDigits: noOfFractionDigits,
            currency: currencyDisplay,
            negative,
            notation: negative === 'parentheses' ? 'standard' : notation
          }}
        />
      ) : (
        <NumberDisplay
          value={integerValue}
          formattingOptions={{
            fractionDigits: noOfDecimals,
            groupSeparators: showGroupSeparators,
            notation
          }}
          unit={unit}
          unitPlacement={unitPlacement}
        />
      );

    switch (displayMode) {
      case 'DISPLAY_ONLY': {
        return (
          <StyledBrtExtensionsNumberWithUpDownArrowWrapper>
            {' '}
            {displayComp}{' '}
          </StyledBrtExtensionsNumberWithUpDownArrowWrapper>
        );
      }
      case 'LABELS_LEFT': {
        return (
          <StyledBrtExtensionsNumberWithUpDownArrowWrapper>
            <FieldValueList
              variant={hideLabel ? 'stacked' : variant}
              data-testid={testId}
              fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
            />
          </StyledBrtExtensionsNumberWithUpDownArrowWrapper>
        );
      }
      case 'STACKED_LARGE_VAL': {
        return (
          <StyledBrtExtensionsNumberWithUpDownArrowWrapper>
            <FieldValueList
              variant='stacked'
              data-testid={testId}
              fields={[
                {
                  id: '2',
                  name: hideLabel ? '' : label,
                  value: (
                    <Text variant='h1' as='span'>
                      {displayComp}
                    </Text>
                  )
                }
              ]}
            />
          </StyledBrtExtensionsNumberWithUpDownArrowWrapper>
        );
      }
      // no default
    }
  }

  function onChangeHandler(enteredValue: any) {
    if (hasSuggestions) {
      setStatus('');
    }
    setIntegerValue(enteredValue);
    // const parsedValue = integerValue !== '' ? Number(integerValue) : '';
    if (value !== (enteredValue !== '' ? Number(enteredValue) : '')) {
      // @ts-ignore
      handleEvent(actions, 'change', propName, enteredValue !== '' ? Number(enteredValue) : '');
      hasValueChange.current = true;
    }
    // In case of stepper variation there is no blur event as component is never focussed unless forced. Need to update redux on change.
    if (displayAs === 'stepper') {
      // @ts-ignore
      handleEvent(
        actions,
        'changeNblur',
        propName,
        enteredValue !== '' ? Number(enteredValue).toString() : ''
      );
    }
  }

  const incrementValue = () => {
    let val = 0;
    if (integerValue === '') {
      val = 1;
    } else {
      val = parseInt(integerValue, 10) + 1;
    }

    setIntegerValue(val.toString());
    onChangeHandler(val.toString());
  };

  const decrementValue = () => {
    let val = 0;
    if (integerValue === '') {
      val = -1;
    } else {
      val = parseInt(integerValue, 10) - 1;
    }
    setIntegerValue(val.toString());
    onChangeHandler(val.toString());
  };

  const onResolveSuggestionHandler = (accepted: boolean) => {
    suggestionsHandler(accepted, pConn, setStatus);
  };

  return displayAs === 'slider' ? (
    <StyledBrtExtensionsNumberWithUpDownArrowWrapper>
      <Slider
        {...additionalProps}
        label={label}
        labelHidden={hideLabel}
        info={validatemessage || helperText}
        value={!integerValue ? sliderDefaultValue : Number(integerValue)}
        status={status}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        data-testid={testId}
        showProgress
        preview={!showInput}
        showInput={showInput}
        min={min}
        max={max}
        step={step}
        ticks={showTicks && { [min]: `${min}`, [max]: `${max}` }}
        onChange={selectedValue => {
          onChangeHandler(selectedValue.toString());
          // @ts-ignore
          handleEvent(actions, 'changeNblur', propName, selectedValue);
        }}
      />
    </StyledBrtExtensionsNumberWithUpDownArrowWrapper>
  ) : (
    <StyledBrtExtensionsNumberWithUpDownArrowWrapper>
      <InputContainer style={{width:  '15em'} } >
        <NumberInput  
          {...additionalProps}
          label={label}
          labelHidden={hideLabel}
          info={validatemessage || helperText}
          value={integerValue}
          status={status}
          placeholder={displayAs === 'input' ? placeholder : ''}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          data-testid={testId}
          numberOfDecimals={0}
          showGroupSeparators={showGroupSeparators}
          variant={displayAs === 'stepper' ? displayAs : ''}
          onChange={enteredValue => {
            onChangeHandler(enteredValue);
          }}
          onBlur={() => {
            if (!readOnly && (hasValueChange.current || !value)) {
              // @ts-ignore
              handleEvent(
                actions,
                'blur',
                propName,
                integerValue !== '' ? Number(integerValue).toString() : ''
              );
              if (hasSuggestions) {
                pConn.ignoreSuggestion('');
              }
              hasValueChange.current = false;
            }
          }}
          onResolveSuggestion={onResolveSuggestionHandler}
        />
        <DownArrowIcon onClick={decrementValue} />
        <UpArrowIcon onClick={incrementValue} />
      </InputContainer>
    </StyledBrtExtensionsNumberWithUpDownArrowWrapper>
  );
}

export default withConfiguration(BrtExtensionsNumberWithUpDownArrow);
