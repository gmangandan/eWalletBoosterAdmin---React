import React, {Component} from 'react';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import ReportChart from './ReportChart';
import * as helpers from '../utils/api.queries';

class Report extends Component {
    state = {
        reports: []
    }

    componentDidMount = () => {
        // fetching user details based on account _id (report belongsTo) which is passed as a prop
        axios.get(`http://localhost:3000/api/reports/id/${this.props.belongsTo}`)
        .then(res => {   
            this.setState({
                reports: helpers.formatInDescDate(this.state.reports.concat(res.data)).filter(reports => reports.belongsToUser)  
            })   
        })
    }

    render () {   
        const {reports} = this.state;     
        return (
            <div>
                {/* stats table for desktop */}
                <article className="message is-light is-hidden-mobile">
                    <div className="message-header">
                        <p>Reports <FontAwesome name='line-chart' /></p>
                    </div> 
                    <div className="message-body">
                    {this.state.reports.length > 0 && 
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
                    <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" style={{marginTop: '1.5rem'}}>
                        <thead>
                            <tr>
                                <th>Account ID</th>
                                <th>Month</th>
                                <th>Period</th>
                                <th>Transfers</th>
                                <th>Cashback</th>
                                <th>+/-</th>
                                <th>Cashback %</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                            {reports.slice(0, 12).map((report, index) => {
                                let current;
                                let previous;                                
                                let arrow;

                                if(reports[index] && reports[index+1]) {
                                    current = reports[index].account.cashback;
                                    previous = reports[index + 1].account.cashback;
                                } else {
                                    current = reports[index].account.cashback;
                                    previous = 0;
                                }
                               
                                current > previous ?
                                arrow = <i className="fa fa-arrow-up" style={{color: 'green'}}></i>
                                :
                                arrow = <i className="fa fa-arrow-down" style={{color: 'red'}}></i>

                                return <TableBody key={report._id} accountId={report.account.accountId} month={report.monthId} period={report.periodId} transfers={report.account.transValue} cashback={report.account.cashback} rate={report.account.cashbackRate} status={report.status} arrow={arrow}/>                                    
                            })}
                    </table>  
                    </div>
                </article>
                {/* stats table for mobile */}                          
                    <table className="table is-bordered is-striped is-narrow is-hoverable is-hidden-desktop is-hidden-tablet is-hidden-widescreen">                    
                        <thead>
                            <tr>                                
                                <th>Month</th>
                                <th>Cashback</th>
                                <th>Cashback %</th>                                                                 
                            </tr>
                        </thead>
                            {reports.slice(0, 12).map((report) => {                               
                                return <TableBody key={report._id} month={report.monthId} cashback={report.account.cashback} rate={report.account.cashbackRate} status={report.status} />                                    
                            })}
                    </table>
            </div>
        )
    }
}

const TableBody = props => {

    const reportStatus = {
        'Pending': '#CCDBDC',
        'Confirmed': '#007EA7',
        'Requested': '#80CED7',
        'Paid': '#003249'              
    }

    return (        
        <tbody>
            <tr>
            <td className='is-hidden-mobile'>{props.accountId}</td>
            <td>{props.month}</td>
            <td className='is-hidden-mobile'>{props.period}</td>
            <td className='is-hidden-mobile'>${props.transfers}</td>            
            <td>${props.cashback}</td>
            {props.arrow !== undefined  && 
                <td className='is-hidden-mobile'>{props.arrow}</td>
            }            
            <td>{props.rate}</td> 
            <td className='is-hidden-mobile' style={{color: reportStatus[props.status]}}><strong>{props.status}</strong></td> 
            </tr>  
        </tbody>
    )
}






export default Report;
