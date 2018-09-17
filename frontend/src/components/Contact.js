import React from 'react';
import ContactBox from './ContactBox';


const Contact = () => {
    return (
        <div>
            <article className="message is-primary is-hidden-mobile" style={{width: '75%', margin: 'auto'}}>
                <div class="message-header">
                    <p>Contact Us</p>            
                </div>
                <div class="message-body">
                    <ContactBox />        
                </div>
            </article>

            <article class="message is-primary is-hidden-desktop is-hidden-tablet is-hidden-widescreen">
                <div class="message-header">
                    <p>Contact Us</p>            
                </div>
                <div class="message-body">
                    <ContactBox />        
                </div>
            </article>
        </div>       
        
    )
}






export default Contact;