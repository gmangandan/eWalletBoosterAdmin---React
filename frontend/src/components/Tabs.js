import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

class Tabs extends Component {

    state = {
        active: false
    }

    toggleClass = () => {
        this.setState({
            active: !this.state.active
        })
    }

    render () {

        const linkStyle = {             
            backgroundColor: '#80CED7'
        }

        return (                           
            <div className="tabs" style={{marginTop: '0.5rem', backgroundColor: '#007EA7'}}>
                <ul>
                    <li><NavLink to='/profile' style={{color: 'white'}}>Dashboard</NavLink></li>
                    <li><NavLink to='/profile/settings' style={{color: 'white'}} activeStyle={linkStyle}>Profile Settings</NavLink></li>
                    <li><NavLink to='/profile/payout' style={{color: 'white'}} activeStyle={linkStyle}>Payout</NavLink></li>
                    <li><NavLink to='/profile/accounts' style={{color: 'white'}} activeStyle={linkStyle}>Accounts</NavLink></li>
                    <li><NavLink to='/profile/applications' style={{color: 'white'}} activeStyle={linkStyle}>Applications</NavLink></li>
                    <li><NavLink to='/profile/raf' style={{color: 'white'}} activeStyle={linkStyle}>Refer-A-Friend</NavLink></li>
                    <li><NavLink to='/profile/contact' style={{color: 'white'}} activeStyle={linkStyle}>Contact</NavLink></li>
                </ul>
            </div>
        )  
    }    
}

export default Tabs;