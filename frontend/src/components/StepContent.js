import React from 'react';
import {ConfirmMessage} from './ConfirmMessage';

export const StepContent = (props) => { 
    return (
        <div className="step-content has-text-centered" style={{marginTop: '1rem'}}>
            <h1 className="title is-4">Please confirm your details below..</h1>
            <article className={props.color}>
                <div className="message-header">
                    <p>Confirm {props.brand} Application</p>                                
                </div>
                <div className="message-body" style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}} >
                    <div>
                        <table className='table is-bordered table is-striped is-narrow is-hoverable is-fullwidth' style={{tableLayout: 'fixed', width: '100%'}}>
                            <tbody>
                                <tr>
                                    <th>First Name: </th>
                                    <td><strong>{props.firstName}</strong></td>
                                </tr>
                                <tr>
                                    <th>Last Name: </th>
                                    <td><strong>{props.lastName}</strong></td>
                                </tr>
                                <tr>
                                    <th>Email Address: </th>
                                    <td><strong>{props.email}</strong></td>
                                </tr>
                                <tr>
                                    <th>Password: </th>
                                    <td><strong>********</strong></td>
                                </tr>
                                <tr>
                                    <th>Confirm Password: </th>
                                    <td><strong>********</strong></td>
                                </tr>
                                <tr>
                                    <th>{props.brand} Account Email Address: </th>
                                    <td><strong>{props.accountEmailAddress}</strong></td>
                                </tr>
                                <tr>
                                    <th>{props.brand} Account ID: </th>
                                    <td><strong>{props.accountId}</strong></td>
                                </tr>
                                <tr>
                                    <th>{props.brand} Currency: </th>
                                    <td><strong>{props.currency}</strong></td>
                                </tr>
                                <tr>
                                    <th>{props.brand} Account: </th>
                                    <td><strong>{props.appStatus}</strong></td>
                                </tr>
                                <tr>
                                    <th>Mobile Number: </th>
                                    <td><strong>{props.mobileNum}</strong></td>                                            
                                </tr>                                       
                            </tbody>                                    
                        </table>  
                    </div> 
                    <ConfirmMessage handleSubmit={props.handleSubmit} formValid={props.formValid} submitted={props.submitted} signedIn={props.signedIn} />
                </div>                            
            </article>
        </div>
    )  
}