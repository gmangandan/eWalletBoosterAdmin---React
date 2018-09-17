import React from 'react';

export const LoggedInMsg = (props) => { 
    return (
        <div style={{width: '75%', margin: 'auto'}}>       
            <div className="notification is-info" style={{textAlign: 'center'}}>
                <p>{props.message}<span><i className={props.icon} style={{margin: '0.5rem'}}></i></span></p>
                
            </div> 
        </div>   
    )  
}