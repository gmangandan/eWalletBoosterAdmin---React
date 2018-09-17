import React from 'react';

export const StepMarker = (props) => { 
    return (
        <div className='step-item is-active is-success'>
            <div className="step-marker">{props.number}</div>
            <div className='step-details'>
                <p className='step-title'>{props.title}</p>
            </div>
        </div>
    )  
}