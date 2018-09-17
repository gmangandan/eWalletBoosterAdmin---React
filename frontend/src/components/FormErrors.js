import React from 'react';
import {Link} from 'react-router-dom';

export const FormErrors = ({formErrors}) => {
    
    return (

        <div >
        {   
           formErrors.length > 0 && typeof formErrors === 'string' ?
            (
                <div className="notification" style={{textAlign: 'center', border: '0.1rem #ff3860 solid'}}>                    
                    <p>{formErrors}</p>
                    <Link to='/login'>Forgotten password?</Link>
                </div>   
            ) 
            :
            (
                Object.keys(formErrors).map((fieldName, i) => {
                    if(formErrors[fieldName].length > 0) {            
                        return (
                            <div key={i} className="notification" style={{textAlign: 'center', border: '0.1rem #ff3860 solid'}}>                    
                                <p>{formErrors[fieldName]}</p>
                            </div>   
                        )
                    } else {
                        return (
                            null
                        )
                    }
                })
            )

        }
        </div>   
    )  
}