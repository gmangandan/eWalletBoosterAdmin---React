import React from 'react';

export const ErrorMessage = props => {
    return (
        <div className="notification" style={{marginTop: '1rem'}}>        
           {props.message}
        </div>
    )
}

