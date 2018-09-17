import React from 'react';

export const ProfileSettings = ({props}) => { 
    
    return (       
        <article className="message is-info">
            <div className="message-header" >
                <p>Profile Settings</p>
            </div>
            <div className="message-body" >
                <nav className="level" style={{borderBottom: '0.1rem solid gray', padding: '1rem'}}>                        
                    <div className="level-left">
                        <div className="level-item">
                        <p className="subtitle is-5">
                            <strong>Personal Details</strong>
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
                <div>
                    <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth' >
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
                                <th>Email: </th>
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
                        </tbody>                  
                    </table> 
                    <div style={{display: 'flex', justifyContent:'flex-start'}} >
                        <button className='button is-info' style={{display: 'block', marginRight:'1rem'}}>Edit</button><span><button className='button is-link' style={{display: 'block'}}>Update</button></span>
                    </div>     
                </div>
            </div>                   
        </article>
    )
}

export default ProfileSettings;