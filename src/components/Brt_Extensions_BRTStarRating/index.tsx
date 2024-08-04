import { Input, withConfiguration } from '@pega/cosmos-react-core';
import { useEffect,useState } from 'react';
import {FaStar} from "react-icons/fa"

import handleEvent from "./event-utils";

import type { PConnFieldProps } from './PConnProps';

import StyledBrtExtensionsBrtStarRatingWrapper from './styles';


// interface for props
interface BrtExtensionsBrtStarRatingProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here

}

// interface for StateProps object
interface StateProps {
  value: string;
  hasSuggestions: boolean;
}

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function BrtExtensionsBrtStarRating(props: BrtExtensionsBrtStarRatingProps) {
  const { getPConnect, value, placeholder, disabled = false, readOnly = false, required = false, label, hideLabel = false, testId } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value;


  const [rating,setRating] = useState<any | null>(null);
  const [rateColor] = useState(null);

  const [inputValue, setInputValue] = useState(value);


  

  const ratingChange = (RatingValue: number) => {
    setRating(RatingValue);
    setInputValue(RatingValue);
    actions.updateFieldValue(propName, RatingValue);
    handleEvent(actions, 'change', propName, RatingValue.toString());

  };

  useEffect(() => {
    const ratingLabelValue = (document.getElementById('Ratinglabel') as HTMLInputElement).value;
    if(ratingLabelValue!=='')
      ratingChange(parseInt(ratingLabelValue,10));
  });

  

  const handleOnChange = (event: any) => {
    const { value: updatedValue } = event.target;
    actions.updateFieldValue(propName, updatedValue);
    ratingChange(updatedValue);
  };

  

  return (
    <StyledBrtExtensionsBrtStarRatingWrapper>
      <Input
        type='text'
        value={inputValue}
        label={label}
        labelHidden={hideLabel}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        onChange={handleOnChange}
        testId={testId}
        id='Ratinglabel'
        
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
    
    </StyledBrtExtensionsBrtStarRatingWrapper>
  );
};


export default withConfiguration(BrtExtensionsBrtStarRating);
