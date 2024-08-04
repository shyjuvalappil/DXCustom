import { useState } from 'react';
import {FaStar} from "react-icons/fa"



export default function StarRate() : JSX.Element
{

  const [rating,setRating] = useState<any | null>(null);
  const [rateColor] = useState(null);
  return<>
  

    
        {[...Array(5)].map((star,index) => {

          const currentRate = index+1;
          return (
            <label>
            <input type="radio" name = "rate" style={{display:  'none'}}
            value={currentRate}
            onClick={()=>setRating(currentRate)}/>
            <FaStar size={50}
            color={currentRate <= (rateColor || rating) ?"yellow" : "grey"}/>
            </label>

          )
        }

        )}
    
  </>
  
}

