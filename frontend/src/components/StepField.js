import React from 'react';

export const StepField = (props) => { 
    return (
        <div className="field is-horizontal">
            <div className="field-label is-normal">
                <label className="label">{props.label}</label>
            </div>
            <div className="field-body">
                <div className="field">
                    <div className="control has-icons-left has-icons-right">
                        <input 
                            className="input" 
                            name={props.name} 
                            id={props.name} 
                            type={props.type} 
                            placeholder={props.placeholder}
                            autoFocus 
                            data-validate="require"
                            disabled={props.disabled}
                            onChange={props.onChange} 
                            style={props.valid ? {border: '0.2rem solid #00D1B2'}: null}  />
                            <span className="icon is-small is-left">
                                <i className={props.icon}></i>
                            </span>
                    </div>
                </div>
            </div>
        </div>
    )  
}


