import React, {Component} from 'react';
import axios from 'axios';
import AccountBox from './AccountBox'
import FontAwesome from 'react-fontawesome';
import {ErrorMessage} from './ErrorMessage';

class Accounts extends Component {
    state = {
        accounts: [],
        err: false 
    }

    componentDidMount = () => {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        // fetching user details based on jwtToken and then referencing applications        
        axios.get(`http://localhost:3000/api/accounts/user`)
        .then(res => { 
            this.setState({
                accounts: this.state.accounts.concat(res.data)
            })   
        })
        .catch(error => {
            if(error.response.data.success === false) {
                this.setState({
                    err: true
                })
            }
        });

    }

    render () {  
        const {accounts} = this.state; 
            
        return (
            <div>
                <article className="message is-info">
                    <div className="message-header">
                        <p>Accounts <FontAwesome name='google-wallet' /></p>
                    </div> 
                    <div className="message-body">
                    <nav className="level" style={{borderBottom: '0.1rem solid gray', padding: '1rem'}}>                        
                        <div className="level-left">
                            <div className="level-item">
                            <p className="subtitle is-5">
                                <strong>Account Reports</strong>
                            </p>
                            </div>
                        </div>
                        <div className="level-right">                               
                            <div className="level-item">
                                <p>
                                    <strong>Email: </strong> {this.props.props.email}
                                </p>
                            </div>
                        </div>
                    </nav>  
                                      
                    {
                       this.state.err === false ? 
                        accounts.map(account => {
                            return <AccountBox key={account._id} id={account._id} regDate={account.account.regDate} accountId={account.account.accountId} country={account.account.country} brand={account.brand} />
                        })
                        :
                        <ErrorMessage message={'There are no accounts to view.'} />
                    }
                    </div>
                </article>
            </div>
        )
    }
}


export default Accounts;