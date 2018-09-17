import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import ReportChart from './ReportChart';
import * as helpers from '../utils/api.queries';
import {ErrorMessage} from './ErrorMessage';

class ProfileHome extends Component {

    state = {        
        accountOptions: [],
        accounts: [],
        reports: [],
        activeAccount: '',
        err: false    
    }

    componentDidMount = () => {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get(`http://localhost:3000/api/accounts/user`)
        .then(res => { 
            if(res.data.length > 0) {
                this.setState({
                    accounts: helpers.filterAccountIds(this.state.accounts.concat(res.data)),
                    accountOptions: helpers.formatAccountIdsAsOptions(this.state.accounts.concat(res.data)),
                    activeAccount: this.state.accounts[0]              
                }, () => {
                    this.setInitialActiveAcc()
                })   
            }
        })
        .catch(() => {            
            this.setState({
                err: true
            })
        });
    }

    setInitialActiveAcc = () => {       
        this.setState({
            activeAccount: this.state.accounts[0]
        }, () => {
            axios.get(`http://localhost:3000/api/reports/accountid/${this.state.activeAccount}`)
            .then(res => { 
                if(res.data.length > 0) {                    
                    this.setState({
                        reports: helpers.formatInDescDate(res.data).filter(reports => reports.belongsToUser) 
                    })  
                } 
            })
            .catch(() => {            
                this.setState({
                    err: true
                })
            });
        })
    }
   
    handleInputChange = (e) => {        
        this.setState({
            activeAccount: e.target.value,
            reports: [],
        }, () => {
            axios.get(`http://localhost:3000/api/reports/accountid/${this.state.activeAccount}`)
            .then(res => {
                this.setState({
                    reports: helpers.formatInDescDate(res.data).filter(reports => reports.belongsToUser) 
                })   
            })
            .catch(() => {            
                this.setState({
                    err: true
                })
            });
        })
    }

    
    render () {

        let pending = helpers.sortPending(this.state.reports);
        let confirmed = helpers.sortConfirmed(this.state.reports);
        let paid = helpers.sortPaid(this.state.reports);
        let requested = helpers.sortRequested(this.state.reports);

        return (
            <div>
                <article className="message is-info">
                    <div className="message-header">
                        <p>Dashboard</p>
                        <button className="delete" aria-label="delete"></button>
                    </div>

                    <div className="message-body">

                        <nav className="level" style={{borderBottom: '0.1rem solid gray', padding: '1rem'}}>                        
                            <div className="level-left">
                                <div className="level-item">
                                <p className="subtitle is-5">
                                    <strong>Account Overview</strong>
                                </p>
                                </div>
                            </div>
                            <div className="level-right">                               
                                <div className="level-item">
                                    <p>
                                        <strong>Email: </strong> {this.props.email}
                                    </p>
                                </div>
                            </div>
                        </nav>

                        {
                            this.state.err === true &&
                            <ErrorMessage message={'There are no accounts to view.'} />
                        }

                        <nav className="level" style={{marginBottom: '4rem'}}>
                            <div className="level-item has-text-centered">
                                <div>
                                <p className="heading">Pending</p>
                                <p className="title">${pending}</p>                                 
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div>
                                <p className="heading">Confirmed</p>
                                <p className="title" style={confirmed > 5 ?{color: 'green'} : {color: '#363636'}}>${confirmed}</p>                                
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div>
                                <p className="heading">Paid</p>
                                <p className="title">${paid}</p>                               
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div>
                                <p className="heading">Requested</p>
                                <p className="title">${requested}</p>                               
                                </div>
                            </div>
                        </nav>

                        <nav className="level" style={{marginBottom: '2rem'}}>

                            <div className="level-item has-text-centered">
                                <div className="level-item">                               
                                    <div className="field has-addons">
                                        <div className="control">
                                            <button type="submit" className="button is-primary">Select</button>
                                        </div>
                                        <div className="control is-expanded">
                                            <div className="select is-fullwidth">
                                            <select onChange={this.handleInputChange}> 
                                            {this.state.accountOptions}
                                            </select>
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>
                            </div>

                            <div className="level-item has-text-centered">
                                <p className="level-item" style={{marginRight: '1rem', marginBottom: 'auto'}}><Link to='/profile/accounts'>Accounts</Link></p>
                                <p className="level-item" style={{marginRight: '1rem', marginBottom: 'auto'}}><Link to='/profile/applications'>Applications</Link></p>
                                <p className="level-item" style={{marginRight: '1rem', marginBottom: 'auto'}}><Link to='/profile/contact'>Contact</Link></p>    
                            </div>

                        </nav>
                    </div>
                    <div style={{margin: 'auto'}}>
                        {
                            this.state.reports.length > 0 && 
                            <ReportChart data={this.state.reports.slice(0, 4).reverse().map(report => {
                                if(report.account.cashbackRate === '0%') {
                                    report.account.rate = report.account.cashbackRate;
                                } else {
                                    report.account.rate = Number(report.account.cashbackRate.slice(0, 4))
                                }                        
                                const month = {month: report.monthId}
                                const reports = Object.assign({}, report.account, month)
                                return reports;
                            })}/>
                        }
                    </div>                    
                </article>
            </div>
        )
    }
}

export default ProfileHome;