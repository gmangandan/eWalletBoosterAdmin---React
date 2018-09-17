import React from 'react';

export const ConfirmMessage = (props) => {
    return (                
        <div className='notification' style={{ display: 'flex', alignItems: 'center', padding: '2rem', marginTop: '1rem'}} >
        {   
            props.submitted ? 
            (
            <div>
                <p>Thank you for {!props.signedIn ? 'registering an account and' : ''} submitting your application.</p>
                <a href="/profile/applications" style={{textDecoration: 'none'}}><button className='button is-info' style={{marginTop: '1rem'}}>Dashboard</button></a>
            </div>   
            )
            : 
            (
            <div>
                <p>Please check the details you have entered are correct and confirm you have read the <a href="/terms-conditions">terms and conditions</a> before pressing submit. You will receive email notification advising you if your application was successful and next steps</p>
                <button className='button is-primary' disabled={!props.formValid} style={{marginTop: '1rem'}} onClick={props.handleSubmit}>Submit</button>
            </div>
            )
        }           
        </div>        
    )
}
