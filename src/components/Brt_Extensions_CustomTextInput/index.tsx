import { useEffect, useState, useRef } from 'react';
import { Input, FieldValueList, Text, EmailDisplay, PhoneDisplay, URLDisplay, withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';

// include in bundle
import handleEvent from "./event-utils";
import StatusWorkRenderer from "./StatusWork";
import { suggestionsHandler } from './suggestions-handler';

import StyledBrtExtensionsCustomTextInputWrapper from './styles';

// interface for props
interface BrtExtensionsCustomTextInputProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  displayAsStatus?: boolean;
  isTableFormatter?: boolean;
  hasSuggestions?: boolean;
  variant?: any;
  formatter: string;
  length?: number;
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


export const textFormatter = (formatter: string, value: string) => {
  let displayComponent: any = null;
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
function BrtExtensionsCustomTextInput(props: BrtExtensionsCustomTextInputProps) {
 const {
    getPConnect,
    placeholder,
    validatemessage,
    label,
    hideLabel = false,
    helperText,
    testId,
    fieldMetadata = {},
    additionalProps = {},
    displayMode,
    displayAsStatus,
    variant = 'inline',
    hasSuggestions = false,
    isTableFormatter = false,
    length=4,
  } = props;
  const { formatter } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value;
  const maxLength = fieldMetadata?.maxLength;
  const hasValueChange = useRef(false);

  let { value, readOnly = false, required = false, disabled = false } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  const inputRef = useRef<HTMLInputElement[]>(Array(length).fill(null));

  // if you're not using Typescript, do useState()
   const [OTP, setOTP] = useState<string[]>(Array(length).fill(''));

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);

   // cast status
  let myStatus: 'success' | 'warning' | 'error' | 'pending';
  // eslint-disable-next-line prefer-const
  myStatus = status as 'success' | 'warning' | 'error' | 'pending';

  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (hasSuggestions) {
      setStatus('pending');
    } else if (!hasSuggestions && myStatus !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [validatemessage, hasSuggestions, myStatus]);

  const onResolveSuggestionHandler = (accepted: boolean) => {
    suggestionsHandler(accepted, pConn, setStatus);
  };
  // Override the value to render as status work when prop passed to display as status
  if (displayAsStatus) {
    value = StatusWorkRenderer({ value });

    // Fall into this scenario for case summary, default to stacked status
    if (!displayMode) {
      return <FieldValueList variant='stacked' data-testid={testId} fields={[{ id: 'status', name: label, value }]} />;
    }
  }

  if (displayMode === 'LABELS_LEFT' || displayMode === 'DISPLAY_ONLY') {
    let displayComp = value || <span aria-hidden='true'>&ndash;&ndash;</span>;
    if (isTableFormatter && formatExists(formatter)) {
      displayComp = textFormatter(formatter, value);
    }
    return displayMode === 'DISPLAY_ONLY' ? (
      <StyledBrtExtensionsCustomTextInputWrapper> {displayComp} </StyledBrtExtensionsCustomTextInputWrapper>
    ) : (
      <StyledBrtExtensionsCustomTextInputWrapper>
      <FieldValueList
        variant={hideLabel ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
      />
      </StyledBrtExtensionsCustomTextInputWrapper>
    );
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    const isValDefined = typeof value !== 'undefined' && value !== '';
    const val = isValDefined ? (
      <Text variant='h1' as='span'>
        {value}
      </Text>
    ) : (
      ''
    );
    return (
      <StyledBrtExtensionsCustomTextInputWrapper>
      <FieldValueList
        variant='stacked'
        data-testid={testId}
        fields={[{ id: '2', name: hideLabel ? '' : label, value: val }]}
      />
      </StyledBrtExtensionsCustomTextInputWrapper>
    );
  }

  const handleChange = (event: any) => {
    if (hasSuggestions) {
      setStatus(undefined);
    }
    setInputValue(event.target.value);
    if (value !== event.target.value) {
      handleEvent(actions, 'change', propName, event.target.value);
      hasValueChange.current = true;
    }
  };

  const handleBlur = (event: any) => {
    if ((!value || hasValueChange.current) && !readOnly) {
      handleEvent(actions, 'blur', propName, event.target.value);
      if (hasSuggestions) {
        pConn.ignoreSuggestion('');
      }
      hasValueChange.current = false;
    }
  };

  

  const handleTextChange = (input: string, index: number) => {
    const newPin = [...OTP];

    newPin[index] = input;
    setOTP(newPin);

    // check if the user has entered the first digit, if yes, automatically focus on the next input field and so on.

    if (input.length === 1 && index < length - 1) {
      inputRef.current[index + 1]?.focus();
    }

    if (input.length === 0 && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
    const newVal = newPin.join(``);

    setInputValue(newVal);    
    handleEvent(actions, 'change', propName, newVal);

  };


  return (
    <StyledBrtExtensionsCustomTextInputWrapper>
    <Input
      {...additionalProps}
      type='hidden'
      label={label}
      labelHidden={hideLabel}
      info={validatemessage || helperText}
      data-testid={testId}
      value={inputValue}
      status={myStatus}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      maxLength={maxLength}
      onChange={!readOnly ? handleChange : undefined}
      onBlur={!readOnly ? handleBlur : undefined}
      onResolveSuggestion={onResolveSuggestionHandler}
      
    />

<div className='grid grid-cols-4 gap-5'>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          type='text'
          maxLength={1}
          value={inputValue[index]}
          onChange={e => handleTextChange(e.target.value, index)}
          ref={ref => {
            inputRef.current[index] = ref as HTMLInputElement;
          }}
          className='border border-solid border-border-slate-500 focus:border-blue-600 p-5 outline-none'
          style={{
            marginRight: index === length - 1 ? '0' : '20px',
            width: '30px',
            height: '30px',
            border: '2px solid black',
            borderRadius: '5px'
          }}
        />
      ))}
    </div>
  
    
    </StyledBrtExtensionsCustomTextInputWrapper>
  );
}


export default withConfiguration(BrtExtensionsCustomTextInput);
