import React from 'react';
import RegisterBox from './RegisterBox';


const Register = (props) => {
    
    
    return (
        <div>
            <article className="message is-primary is-hidden-mobile" style={{width: '75%', margin: 'auto'}}>
                <div className="message-header">
                    <p>Register</p>            
                </div>
                <div className="message-body">
                    <RegisterBox props={props}/>        
                </div>
            </article>

            <article className="message is-primary is-hidden-desktop is-hidden-tablet is-hidden-widescreen">
                <div className="message-header">
                    <p>Register</p>            
                </div>
                <div className="message-body">
                    <RegisterBox props={props} />        
                </div>
            </article>
        </div>       
        
    )
}






export default Register;