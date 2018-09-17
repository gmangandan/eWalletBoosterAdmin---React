import React from 'react';

export const AccountModal = (props) => {   
    return (
        <div className={props.showImg}>
            <div className="modal-background"></div>
            <div className="modal-content" style={{width:'80%', height: '80%', margin:'auto'}}>
                <figure >               
                    {props.accountImg}                 
                </figure>
            </div>
            <button className="modal-close is-large" style={{border: '0.1rem white solid'}} aria-label="close"></button>
        </div>
    )
}