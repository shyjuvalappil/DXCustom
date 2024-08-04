import { useEffect, useState, useRef } from 'react';
import { Input, FieldValueList, Text, EmailDisplay, PhoneDisplay, URLDisplay, withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import {FaStar} from "react-icons/fa"


// include in bundle
import handleEvent from "./event-utils";
import StatusWorkRenderer from "./StatusWork";
import { suggestionsHandler } from './suggestions-handler';

import StyledBrtExtensionsBrtStarRateWrapper from './styles';

// interface for props
interface BrtExtensionsBrtStarRateProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  displayAsStatus?: boolean;
  isTableFormatter?: boolean;
  hasSuggestions?: boolean;
  variant?: any;
  formatter: string;
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
function BrtExtensionsBrtStarRate(props: BrtExtensionsBrtStarRateProps) {
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
    isTableFormatter = false
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

  const [rating,setRating] = useState<any | null>(null);
  const [rateColor] = useState(null);

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);

   // cast status
  let myStatus: 'success' | 'warning' | 'error' | 'pending';
  // eslint-disable-next-line prefer-const
  myStatus = status as 'success' | 'warning' | 'error' | 'pending';

  useEffect(() => setInputValue(value), [value]);

  const ratingChange = (RatingValue: number) => {
    setRating(RatingValue);
    setInputValue(RatingValue);
    setInputValue(RatingValue);    
    handleEvent(actions, 'change', propName, RatingValue.toString());

  };

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
      <StyledBrtExtensionsBrtStarRateWrapper> {displayComp} </StyledBrtExtensionsBrtStarRateWrapper>
    ) : (
      <StyledBrtExtensionsBrtStarRateWrapper>
      <FieldValueList
        variant={hideLabel ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
      />
      </StyledBrtExtensionsBrtStarRateWrapper>
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
      <StyledBrtExtensionsBrtStarRateWrapper>
      <FieldValueList
        variant='stacked'
        data-testid={testId}
        fields={[{ id: '2', name: hideLabel ? '' : label, value: val }]}
      />
      </StyledBrtExtensionsBrtStarRateWrapper>
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

  return (
    <StyledBrtExtensionsBrtStarRateWrapper>
    <Input style={{width:  '2em'} }  
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
    <>
  
      
    
  {[...Array(5)].map((star,index) => {

    const currentRate = index+1;    
    return (
      <label>
      <input type="radio" name = "rate" style={{display:  'none'}}
      value={inputValue}
      onClick={()=>ratingChange(currentRate)}
      />
      <FaStar size={50}
      color={currentRate <= (rateColor || rating || value) ?"yellow" : "grey"}/>
      </label>
    )
  }
  )}


    
  

</>
    </StyledBrtExtensionsBrtStarRateWrapper>
  );
}


export default withConfiguration(BrtExtensionsBrtStarRate);
