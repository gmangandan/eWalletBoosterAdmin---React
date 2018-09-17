import React from 'react';
import ContactBox from './ContactBox';


const ProfileContact = ({props}) => {
    return (
        <article className="message is-info">
        <div className="message-header" >
            <p>Contact</p>
        </div>
        <div className="message-body" >
            <nav className="level" style={{borderBottom: '0.1rem solid gray', padding: '1rem'}}>                        
                <div className="level-left">
                    <div className="level-item">
                    <p className="subtitle is-5">
                        <strong>Contact Us</strong>
                    </p>
                    </div>
                </div>
                <div className="level-right">                               
                    <div className="level-item">
                        <p>
                            <strong>Email: </strong> {props.email}
                        </p>
                    </div>
                </div>
            </nav>   
            <ContactBox name={props.firstName} email={props.email}/>  
        </div>                   
    </article>
    )
}






export default ProfileContact;