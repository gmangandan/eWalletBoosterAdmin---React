import React, {Component} from 'react';
import axios from 'axios';
import * as helpers from '../utils/api.queries';
import {ErrorMessage} from './ErrorMessage';


class Payout extends Component {
    state = {
        reports: [],
        active: false        
    }

    componentDidMount = () => {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get(`http://localhost:3000/api/reports/user`)
        .then(res => {
            this.setState({
                reports: helpers.formatInDescDate(this.state.reports.concat(res.data))                
            })
        })
    }

    toggleModal = () => {
        this.setState({
            active: !this.state.active
        })
    }

    submitPayoutRequest = (accountId, month, belongsTo, cashback) => {
        const status = 'Requested';
        axios.post('http://localhost:3000/api/payments', {accountId, month, belongsTo, status, cashback})
        .then(() => {
            this.setState({
                active: !this.state.active
            })    
        })
    }

    refreshPage = () => {
        window.location.reload()
    }

    render () {

        const {reports} = this.state

        const thStyle = {
            textAlign: 'center',
            backgroundColor: '#003249',
            color: 'white'
        }

        let countOfAvailable = 0;
        let countOfCompleted = 0;

        return (
            
            <div>
                 {/* stats table for desktop */}
                 <article className="message is-info">
                    <div className="message-header">
                        <p>Payout</p>
                        <button className="delete" aria-label="delete"></button>
                    </div> 

                    <div className="message-body">

                    <div class={this.state.active ? 'modal is-active' : 'modal'}>
                        <div class="modal-background"></div>
                        <div class="modal-card">
                            <header class="modal-card-head">
                            <p class="modal-card-title">Confirmation</p>
                            <button class="delete" aria-label="close" onClick={this.toggleModal}></button>
                            </header>
                            <section class="modal-card-body">
                            <div class="content">
                                <h2>Success</h2>
                                    <p>We are pleased to let you know that your payout request has been successful and will be sent to the email address associated with this account ID. Please see below for further information</p>
                                    <ul>
                                        <li>You will receive payment within 24-48 hours.</li>
                                        <li>The cashback will be sent in USD for the exact amount that you have requested.</li>
                                        <li>The cashback will be converted by the Skrill, Neteller or Ecopayz into your own currency.</li>
                                        <li>The status of your cashback will update to 'Requested'. Once it has been paid it will show in 'completed transactions'</li>
                                        <li>Please contact us via livechat if you need further clarification on these points.</li>
                                    </ul>
                                </div>
                            </section>
                            <footer class="modal-card-foot">
                            <button class="button is-info" onClick={this.refreshPage}>Submit</button>
                            <button class="button" onClick={this.toggleModal}>Cancel</button>
                            </footer>
                        </div>
                    </div>

                    <nav className="level" style={{borderBottom: '0.1rem solid gray', padding: '1rem'}}> 
                        <div className="level-left">
                            <div className="level-item">
                            <p className="subtitle is-5">
                                <strong>Payments &amp; Transactions</strong>
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

                    <h6 className="title is-6">Available Balances</h6>
                    <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" style={{marginTop: '1.5rem'}}>
                        <thead>
                            <tr>
                                <th className='is-hidden-mobile' style={thStyle}>Brand</th>
                                <th style={thStyle}>Account ID</th>
                                <th className='is-hidden-mobile' style={thStyle}>Month</th>
                                <th className='is-hidden-mobile' style={thStyle}>Period</th>
                                <th style={thStyle}>Cashback</th>                                
                                <th style={thStyle}>Status</th>
                            </tr>
                        </thead>
                            {                          
                                reports.map(report => {
                                    if(report.status === 'Confirmed' || report.status === 'Requested' || report.status === 'Pending') {
                                        countOfAvailable ++;
                                        return <TableBody key={report._id} id={report._id} accountId={report.account.accountId} month={report.monthId} period={report.periodId}    cashback={report.account.cashback} brand={report.brand} status={report.status} submitPayoutRequest={this.submitPayoutRequest} toggleModal={this.toggleModal}/>  
                                    }   
                                    return null;                           
                                }) 
                            }                            
                    </table> 

                    {countOfAvailable === 0 ? <ErrorMessage ErrorMessage message={'There are no available balances to view.'} /> : null}

                    <h6 className="title is-6">Completed Transactions</h6>
                    <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" style={{marginTop: '1.5rem'}}>
                        <thead>
                            <tr>
                                <th className='is-hidden-mobile' style={thStyle}>Brand</th>
                                <th style={thStyle}>Account ID</th>
                                <th className='is-hidden-mobile' style={thStyle}>Month</th>
                                <th className='is-hidden-mobile' style={thStyle}>Period</th>
                                <th style={thStyle}>Cashback</th>                                
                                <th style={thStyle}>Status</th>
                            </tr>
                        </thead>
                            {reports.map(report => {
                                if(report.status === 'Paid') {
                                    countOfCompleted ++;
                                    return <TableBody key={report._id} id={report._id} accountId={report.account.accountId} month={report.monthId} period={report.periodId} cashback={report.account.cashback} brand={report.brand} status={report.status} />  
                                } 
                                return null;                             
                            })}
                    </table>  

                    {countOfCompleted === 0 ? <ErrorMessage message={'There are no completed transactions to view.'} /> : null}

                    </div>
                </article>                
            </div>
        )
    }
}


const TableBody = props => {
    
    const tdStyle = {
        textAlign: 'center'
    }

    const brandLogo = {
        'Neteller': <img src={require('../assets/images/neteller_90_30.jpeg')} alt="Neteller Logo"/>,
        'Skrill': <img src={require('../assets/images/skrill_logo.jpeg')} alt="Skrill Logo"/>,
        'Ecopayz': '#ff3860'
    }
  
    return (
        <tbody>
            <tr>
                <td className='is-hidden-mobile' style={tdStyle}>{brandLogo[props.brand]}</td>
                <td style={tdStyle}>{props.accountId}</td>
                <td className='is-hidden-mobile' style={tdStyle}>{props.month}</td>
                <td className='is-hidden-mobile' style={tdStyle}>{props.period}</td>
                <td style={tdStyle}>${props.cashback}</td>
                <td style={tdStyle}>
                {
                   props.status === 'Confirmed' ? 
                   <button className='button is-link' style={{width: '100%', height: '100%'}} onClick={() => props.submitPayoutRequest(props.accountId, props.month, props.id, props.cashback)}>Payout</button> : (props.status === 'Requested') ?
                   <button className='button is-link' style={{width: '100%', height: '100%'}} disabled>Requested</button> 
                   : props.status 
                }
                </td>
            </tr>  
        </tbody>
    )
}

export default Payout;