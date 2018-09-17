import React from 'react';

export const StepFieldRadio = (props) => { 
    return (
        <div>   
            <h1 className="title is-4">Please register at {props.brand} using the link below or select existing account.</h1>
            <article className={`message ${props.color}`} style={{width: '75%', margin: 'auto'}}>
                <div className="message-body" style={{display: 'flex', justifyContent: 'start', flexWrap: 'wrap'}} >

                    <a href={props.link} target="_blank" className={`button is-normal is-hidden-desktop is-hidden-tablet is-hidden-widescreen is-hidden-fullhd ${props.color}`} style={{marginBottom: '1rem'}} onClick={props.handleClick}>{props.buttonText}</a>

                    <a href={props.link} target="_blank" className={`button is-large is-fullwidth is-hidden-mobile ${props.color}`} style={{marginBottom: '1rem'}} onClick={props.handleClick}>{props.buttonText}</a>
                    <div className="control" style={{margin: 'auto'}} onChange={props.handleInputChange}>
                        <label className="radio">
                            <input type="radio" name="appStatus" value='new'/>
                            New account
                        </label>
                        <label className="radio">
                            <input type="radio" name="appStatus" value='existing'/>
                            Existing account
                        </label>
                    </div>
                </div>                            
            </article>  
        </div>
    )  
}


