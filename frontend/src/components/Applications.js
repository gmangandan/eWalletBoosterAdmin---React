import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {ErrorMessage} from './ErrorMessage';
import * as helpers from '../utils/api.queries';


class Applications extends Component {
    state = {
        applications: [],
        err: true       
    }

    componentDidMount = () => {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        // fetching user details based on jwtToken and then referencing applications        
        axios.get(`http://localhost:3000/api/applications/user`)
        .then(res => { 
            this.setState({
                applications: helpers.formatTimestampInDesc(this.state.applications.concat(res.data))
            })   
        })
        .catch(() => {            
            this.setState({
                err: true
            })
        });
    }

    render () {   
        const {applications} = this.state;     
        return (
            <div>
                <article className="message is-info">
                    <div className="message-header">
                        <p>Applications</p>
                    </div>                     
                    <div className="message-body">
                    <div className="tabs">
                        <ul>
                            <Link to='/skrill/cashback' style={{textDecoration: 'none'}}>New Skrill Application</Link>
                            <Link to='/neteller/cashback' style={{textDecoration: 'none'}}>New Neteller Application</Link>
                            <Link to='/ecopayz/cashback' style={{textDecoration: 'none'}}>New Ecopayz Application</Link> 
                        </ul>
                    </div>
                    {   applications.length > 0 ?
                        applications.map(app => {                            
                            return <Application key={app._id} brand={app.brand} currency={app.accountCurrency} accountId={app.accountId} email={app.accountEmailAddress} status={app.linked ? 'Approved' : 'Pending'} date={app.timestamp} />
                        })
                        :
                        <ErrorMessage message={'There are no applications to view.'} />
                    }
                    </div>
                </article>                
            </div>
        )
    }
}

const Application = (props) => {

    const brand = helpers.formatBrandName(props.brand)

    const borderStyle = {
        'Pending': '#ffdd57',
        'Approved': '#23d160',
        'Declined': '#ff3860'
    }

    return ( 
        <div className="tile is-ancestor" style={{backgroundColor: '#f6fbfe'}} >  
            <div className="tile is-parent is-8" style={{border: `0.25rem ${borderStyle[props.status]} solid`, marginBottom: '1rem', padding: 0}} >
                <article className="tile is-child notification is-light">
                <p className="title" >{brand} Application ({props.accountId})</p>
                <p className="subtitle" style={{marginBottom: '1.2rem'}}>{brand} Email Address: {props.email}</p> 
                <div className="content">
                <p style={{marginBottom: '0.4rem'}}>Application date: {props.date.slice(0, 10)}</p>
                <p style={{marginBottom: '0.4rem'}}>Currency: {props.currency}</p>
                <p style={{marginBottom: '0.4rem'}}>Status: <strong>{props.status}</strong></p>
                </div>
                </article>
            </div>
        </div>        
    )
}

export default Applications;
