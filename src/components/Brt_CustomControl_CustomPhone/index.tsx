import { useState, useEffect, useRef } from 'react';
import {
  PhoneInput as CosmosPhone,
  getPhoneNumberParts,
  PhoneDisplay,
  FieldValueList,
  Text,
  EmailDisplay,
  URLDisplay,
  withConfiguration
} from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';

// includes in bundle
import handleEvent from "./event-utils";
import { suggestionsHandler } from './suggestions-handler';

import StyledBrtCustomControlCustomPhoneWrapper from './styles';

// interface for props
interface BrtCustomControlCustomPhoneProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  displayAsStatus?: boolean;
  isTableFormatter?: boolean;
  hasSuggestions?: boolean;
  variant?: any;
  formatter: string;
  datasource: Array<any>;
  showCountryCode: boolean;
}

// interface for StateProps object
interface StateProps {
  value: string;
  hasSuggestions: boolean;
}

export const formatExists = (formatterVal: string) => {
    const formatterValues = [
      "TextInput",
      "WorkStatus",
      "RichText",
      "Email",
      "Phone",
      "URL",
      "Operator"
    ];
    let isformatter = false;
    if (formatterValues.includes(formatterVal)) {
      isformatter = true;
    }
    return isformatter;
  };


export const textFormatter = (formatter: string, value: any) => {
  let displayComponent:any = null;
  switch(formatter){
    case "TextInput" : {
      displayComponent = value;
      break;
    }
    case "Email" : {
      displayComponent = (<EmailDisplay value={value} displayText={value} variant="link" />);
      break;
    }
    case "Phone" : {
      displayComponent = (<PhoneDisplay value={value} variant="link" />);
      break;
    }
    case "URL" : {
      displayComponent = (<URLDisplay target="_blank" value={value} displayText={value} variant="link" />);
      break;
    }
    // no default
  }
  return displayComponent;
};



// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function BrtCustomControlCustomPhone(props: BrtCustomControlCustomPhoneProps) {
  const {
    getPConnect,
    value,
    showCountryCode = true,
    placeholder,
    validatemessage,
    label,
    hideLabel = false,
    helperText,
    datasource = [],
    testId,
    displayMode,
    additionalProps = {},
    variant = 'inline',
    isTableFormatter = false,
    hasSuggestions = false
  } = props;
  const { formatter } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value;
  const hasValueChange = useRef(false);

  let callingCodesList: Array<any>  = [];
  // @ts-ignore
  if (datasource?.source?.length > 0) {
    // @ts-ignore
    datasource.source.forEach((element) => {
      callingCodesList.push(element.value);
    });
  } else {
    callingCodesList = ['+1']; // if no datasource is present we default to show only US country code
  }

  // BUG-547602: Temporary type coercion for 8.5 until DXAPIs are enhanced to pass original pxViewMetadata JSON, respecting boolean primitives
  let { readOnly = false, required = false, disabled = false } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  const [inputValue, setInputValue] = useState(value);
  useEffect(() => setInputValue(value), [value]);

  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);
  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (hasSuggestions) {
      setStatus('pending');
    } else if (!hasSuggestions && status !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [validatemessage, hasSuggestions, status]);

  // function to exclude country code from phone number
  function getPhoneNumberAlone(phoneNumber: string) {
    const phoneNumberParts = getPhoneNumberParts(phoneNumber, callingCodesList);
    return phoneNumberParts && phoneNumberParts[1];
  }

  function handleChangeBlur(enteredValue: string, eventType: any) {
    if (!getPhoneNumberAlone(enteredValue)) {
      enteredValue = '';
    }
    handleEvent(actions, eventType, propName, enteredValue);
  }

  let displayComp: any = null;
  if (displayMode) {
    displayComp = <PhoneDisplay value={value} variant='link' />;
  }

  if (displayMode === 'LABELS_LEFT' || displayMode === 'DISPLAY_ONLY') {
    if (isTableFormatter && formatExists(formatter)) {
      displayComp = textFormatter(formatter, value);
    }
    return displayMode === 'DISPLAY_ONLY' ? (
      <StyledBrtCustomControlCustomPhoneWrapper>
      {displayComp}
      </StyledBrtCustomControlCustomPhoneWrapper>
    ) : (
      <StyledBrtCustomControlCustomPhoneWrapper>
      <FieldValueList
        variant={hideLabel ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
      />
      </StyledBrtCustomControlCustomPhoneWrapper>
    );
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return (
      <StyledBrtCustomControlCustomPhoneWrapper>
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
      </StyledBrtCustomControlCustomPhoneWrapper>
    );
  }

  const onResolveSuggestionHandler = (accepted: boolean) => {
    suggestionsHandler(accepted, pConn, setStatus);
  };

  return (
    <StyledBrtCustomControlCustomPhoneWrapper>
    <CosmosPhone
      {...additionalProps}
      label={label}
      info={validatemessage || helperText}
      value={inputValue}
      labelHidden={hideLabel}
      status={status}
      showCountryCode={showCountryCode}
      callingCodesList={callingCodesList}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      data-testid={testId}
      onChange={(enteredValue: any) => {
        if (hasSuggestions) {
          setStatus('');
        }
        setInputValue(enteredValue);
        if (value !== enteredValue) {
          // @ts-ignore
          handleEvent(actions, 'change', propName, enteredValue);
        }
        hasValueChange.current = true;
      }}
      onBlur={(enteredValue: any) => {
        if (!value || hasValueChange.current) {
          // @ts-ignore
          handleChangeBlur(enteredValue, 'blur');
          if (hasSuggestions) {
            pConn.ignoreSuggestion('');
          }
          hasValueChange.current = false;
        }
      }}
      onResolveSuggestion={onResolveSuggestionHandler}
    />
    </StyledBrtCustomControlCustomPhoneWrapper>
  );
}

export default withConfiguration(BrtCustomControlCustomPhone);
