import React from 'react';

export const StepFieldSelect = (props) => { 
    return (
        <div className="field is-horizontal">
            <div className="field-label is-normal">
                <label className="label">{props.label}</label>
            </div>
            <div className="field-body">
                <div className="field">
                    <div className="control has-icons-left has-icons-right">
                        <div className="select">
                            <select name={props.name}
                                data-validate="require" 
                                onChange={props.onChange} 
                                style={props.valid ? {border: '0.2rem solid #00D1B2'}: null}
                                >
                                <option>Select</option>
                                {props.options}
                            </select>
                            <span className="icon is-left">
                                <i className="fa fa-globe"></i>
                            </span>
                        </div>                                      
                    </div>
                </div>
            </div>
        </div> 
    )  
}