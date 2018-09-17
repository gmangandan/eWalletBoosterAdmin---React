import React, { Component } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import toastr from 'toastr';
import * as helpers from '../utils/api.queries';
import { Link } from 'react-router-dom';
class userView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {
                _id: '',
                firstName: '',
                lastName: '',
                username: "",
                email: "",
                password: "",
                cpassword: "",
                mobileNumber: "",
                countryCode: "",
                skrillEmail: "",
                netellerEmail: "",
                paypalEmail: "",
                accountName: "",
                sortCode: "",
                accountNo: "",
            },

            errors: {
                firstName: null,
                lastName: null,
                username: null,
                email: null,
                password: null,
                cpassword: null,
                skrillEmail: null,
                netellerEmail: null,
                paypalEmail: null,
            },
            changePass: null,
            editAction: false,
            numCodes: helpers.sortCountryCodes()
        }

    }

    componentDidMount = () => {
        const accountid = this.props.match.params.id;
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        axios.get('http://localhost:3000/admin/auth/check-auth')
            .then(res => {

            })
            .catch((error) => {
                if (error) {
                    this.props.history.push('/');
                }
            })

        if (accountid) {
            this.getUserRow(accountid);
        }
    }

    getUserRow(accountid) {

        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        axios.get('http://localhost:3000/admin/users/user-row?_id=' + accountid)
            .then(res => {
                if (res.data.success) {
                    this.setState({ userData: res.data.results, editAction: true });
                } else {
                    toastr.error('Invalid URI', 'Error!');
                    this.props.history.push('/user-accounts');
                }
            })
            .catch((error) => {
                if (error) {
                    this.props.history.push('/');
                }
            })
    }







    render() {

        const { userData } = this.state;




        return (
            <div className='container'>
                <NavBar />
                <div className="container">
                    <section className="hero">
                        <div className="hero-body"  style={{ 'backgroundColor': 'white' }}>
                            <div>
                                <nav className="breadcrumb is-small" aria-label="breadcrumbs">
                                    <ul>
                                        <li><a>Dashboard</a></li>
                                        <li>
                                            <Link to='/user-accounts' className='navbar-item' >User Accounts</Link>
                                        </li>
                                        <li className="is-active"><a >View User</a></li>
                                    </ul>
                                </nav>
                                <div>
                                
                                <div className="columns">
                                    <div className="column">                                       
                                                <label className="label">First Name</label>
                                                <p>{userData.firstName ? userData.firstName : '--'}</p>
                                            </div>
                                            <div className="column">   
                                                <label className="label">Last Name </label>
                                                <p>{userData.lastName ? userData.lastName : '--'}</p>
                                            </div>
                                        </div>
                                        <div className="columns">
                                            <div className="column">
                                                <label className="label">Username </label>
                                                <p>{userData.username ? userData.username : '--'}</p>
                                            </div>
                                            <div className="column">
                                                <label className="label">E-Mail </label>
                                                <p>{userData.email ? userData.email : '--'}</p>
                                            </div>
                                        </div>

                                        <div className="columns">
                                            <div className="column">
                                                <label className="label">Mobile Number </label>
                                                <p>{userData.mobileNumber ? userData.mobileNumber : '--'}</p>
                                            </div>

                                            <div className="column">
                                                <label className="label">Country Code  </label>
                                                <p>{userData.countryCode ? userData.countryCode : '--'}</p>
                                            </div>


                                        </div>
                                        <hr></hr>
                                        <h2 className="title is-4">Payment Details (Payout)</h2>
                                        
                                        <div className="columns">
                                            <div className="column">
                                                <label className="label">Skrill email address </label>
                                                <p>{userData.skrillEmail ? userData.skrillEmail : '--'}</p>
                                            </div>
                                            <div className="column">
                                                <label className="label">Netller email address </label>
                                                <p>{userData.netellerEmail ? userData.netellerEmail : '--'}</p>
                                            </div>
                                            
                                        </div>
                                        <div className="columns">
                                        <div className="column">
                                                <label className="label">PayPal email address </label>
                                                <p>{userData.paypalEmail ? userData.paypalEmail : '--'}</p>
                                            </div>
                                        </div>

                                        <hr></hr>
                                        <h2 className="title is-4">Payout by bank transfer - BACS </h2>
                                        
                                        <div className="columns">
                                            <div className="column">
                                                <label className="label">Account Holder Name </label>
                                                <p>{userData.accountName ? userData.accountName : '--'}</p>
                                            </div>
                                            <div className="column">
                                                <label className="label">Sort code </label>
                                                <p>{userData.sortCode ? userData.sortCode : '--'}</p>
                                            </div>
                                            
                                        </div>
                                        <div className="columns">
                                        <div className="column">
                                                <label className="label">Account Number </label>

                                                <p>{userData.accountNo ? userData.accountNo : '--'}</p>
                                            </div>
                                        </div>
                                        </div>

                                    </div>
                                </div>
                           
                    </section>
                </div>

            </div>
        )
    }
}



export default userView;