import React, { Component } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import _ from 'lodash';
import toastr from 'toastr';
import { Link } from 'react-router-dom';
class payoutManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {
                 
                paymentType: '',
                paymentEmail: '',
                notes: ''
            },
            errors: {
                paymentType: null,
                paymentEmail: null,
                notes: null,

            },
            userDetails: '',
            reportDetails: {
                account: {
                    accountId: '',
                    deposits: '',

                }
            },

        }
        this._handleCheckBoxChange = this._handleCheckBoxChange.bind(this);
        this._onTextFieldBlur = this._onTextFieldBlur.bind(this);
        this._formValidation = this._formValidation.bind(this);
    }

    componentDidMount = () => {
        const payoutid = this.props.match.params.id;
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        axios.get('http://localhost:3000/admin/auth/check-auth')
            .then(res => {

            }).catch((error) => {
                if (error) {
                    this.props.history.push('/');
                }
            })
        if (payoutid) {
            this.getCashbackRow(payoutid);
        }
    }

    getCashbackRow(payoutid) {

        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        axios.get('http://localhost:3000/admin/payout/cashback-row?_id=' + payoutid)
            .then(res => {
                if (res.data.success) {
                    this.setState({ userDetails: res.data.userRow, reportDetails: res.data.cashbackRow, });
                } else {
                    toastr.error('Invalid URI', 'Error!');
                    this.props.history.push('/payout/skrill');
                }

            }).catch((error) => {
                if (error) {
                    this.props.history.push('/');
                }
            })
    }

    _formValidation(fieldsToValidate = [], callback = () => { }) {
        const { userData } = this.state;
        const allFields = {
            paymentType: {
                message: "Please select payment type.",
                doValidate: () => {
                    const value = _.trim(_.get(userData, 'paymentType', ""));
                    if (value.length > 0) {
                        return true;
                    }
                    return false;
                }
            },
            paymentEmail: {
                message: "Please enter valid email.",
                doValidate: () => {
                    const value = _.get(userData, 'paymentEmail', '');
                    const paymentEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
                    if (paymentEmailValid) {
                        return true;
                    }
                    return false;
                }
            },
        };
        let errors = this.state.errors;
        _.each(fieldsToValidate, (field) => {
            const fieldValidate = _.get(allFields, field);
            if (fieldValidate) {
                errors[field] = null;
                const isFieldValid = fieldValidate.doValidate();
                if (isFieldValid === false) {
                    errors[field] = _.get(fieldValidate, 'message');
                }
            }
        });
        this.setState({
            error: errors,
        }, () => {
            let isValid = true;
            _.each(errors, (err) => {
                if (err) {
                    isValid = false;
                }
            });
            callback(isValid);
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { } = this.state;

        let fieldNeedToValidate = ['paymentType', 'paymentEmail'];
        this._formValidation(fieldNeedToValidate, (isValid) => {
            if (isValid) {
                toastr.clear();
                this.updateUserAccount();
            }
        });

    }


    updateUserAccount() {
        const { reportDetails,userData } = this.state;
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        axios.post('http://localhost:3000/admin/payout/updatecashback', {
            userData: userData,
            reportDetails: reportDetails,
        }).then((result) => {
            let sucMsg = result.data.msg;
            toastr.success(sucMsg, '');
          //  this.props.history.push('/user-accounts');
        }).catch(error => {
            let errorMsg = error.response.data.msg;
            toastr.error(errorMsg, 'Error!');

        });
    }


    _handleCheckBoxChange(e) {
        var checked = e.target.checked;
        let errors = this.state.errors;
        this.setState({ changePass: checked });
        if (!checked) {
            errors['password'] = null;
            errors['cpassword'] = null;
        }
    }
    _onTextFieldBlur(e) {
        e.preventDefault();
        let errors = this.state.errors;
        const fieldName = e.target.name;
        let fieldNeedToValidate = [fieldName];
        errors[fieldName] = null;
        this._formValidation(fieldNeedToValidate);

    }
    handleInputChange = (e) => {
        const { userData } = this.state;
        const target = e.target;
        const value = target.value;
        const name = target.name;
        userData[name] = value;
        console.log('name', value);
        this.setState({
            userData: userData
        })
    }


    render() {

        const { userDetails, reportDetails, error } = this.state;




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
                                        <li className="is-active"><a >Manage User</a></li>
                                    </ul>
                                </nav>

                                <div className="columns is-mobile is-centered ">
                                    <div className="column">
                                        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                                            <thead>
                                                <tr>
                                                    <th>Payment Method</th>
                                                    <th>Payment Email   </th>
                                                    <th>Account Name </th>
                                                    <th>Sort Code</th>
                                                    <th>Account Number</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Skrill</td>
                                                    <td>{userDetails.skrillEmail ? userDetails.skrillEmail : '--'}</td>
                                                    <td>--</td>
                                                    <td>--</td>
                                                    <td>--</td>
                                                </tr>
                                                <tr>
                                                    <td>Neteller</td>
                                                    <td>{userDetails.netellerEmail ? userDetails.netellerEmail : '--'}</td>
                                                    <td>--</td>
                                                    <td>--</td>
                                                    <td>--</td>
                                                </tr>
                                                <tr>
                                                    <td>PayPal</td>
                                                    <td>{userDetails.paypalEmail ? userDetails.paypalEmail : '--'}</td>
                                                    <td>--</td>
                                                    <td>--</td>
                                                    <td>--</td>
                                                </tr>
                                                <tr>
                                                    <td>BACS</td>
                                                    <td>--</td>
                                                    <td>{userDetails.accountName ? userDetails.accountName : '--'}</td>
                                                    <td>{userDetails.sortCode ? userDetails.sortCode : '--'}</td>
                                                    <td>{userDetails.accountNo ? userDetails.accountNo : '--'}</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="columns is-mobile is-centered ">
                                    <div className="column is-half">
                                        <div className="field is-grouped">
                                            <div className="control is-expanded">
                                                <label className="label">User</label>
                                                <p>{userDetails.firstName} {userDetails.lastName}</p>

                                            </div>
                                            <div className="control is-expanded">
                                                <label className="label">Payout Amount </label>
                                                <p>{reportDetails.account.cashback ? reportDetails.account.cashback : ''}</p>
                                            </div>
                                            <div className="control is-expanded">
                                                <label className="label">Turnover Cashback Scheme </label>
                                                <p>{reportDetails.brand ? reportDetails.brand : ''}</p>
                                            </div>
                                        </div>
                                        <div className="field is-grouped">

                                            <div className="control is-expanded">
                                                <label className="label">E-Mail </label>
                                                <input className={"input " + (_.get(error, 'paymentEmail') ? ' is-danger' : '')} name="paymentEmail" type="text" placeholder="paymentEmail" value={userDetails.paymentEmail} onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                                <p className="help is-danger">{_.get(error, 'paymentEmail')}</p>
                                            </div>
                                            <div className="control   has-icons-left has-icons-right">
                                                <label className="label">Payment Method  </label>
                                                <div className= {"select  " + (_.get(error, 'paymentType') ? ' is-danger' : '')}>
                                                    <select name="paymentType"
                                                        data-validate="require"
                                                        onChange={this.handleInputChange}>
                                                        <option>Select</option>
                                                        <option value="Skrill">Skrill</option>

                                                        <option value="Neteller">Neteller</option>
                                                        <option value="PayPal">PayPal</option>
                                                        <option value="Bank Transfers">Bank Transfers</option>

                                                    </select>
                                                    <span className="icon is-left">
                                                        <i className="fa fa-globe"></i>
                                                    </span>

                                                </div>
                                                <p className="help is-danger">{_.get(error, 'paymentType')}</p>
                                                </div>

                                        </div>

                                        <div className="field is-grouped">
                                            <div className="control is-expanded">
                                                <label className="label">Notes</label>
                                                <textarea className={"textarea " + (_.get(error, 'notes') ? ' is-danger' : '')} rows="4" name="notes" placeholder="Mobile Number" value={userDetails.notes} onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                                <p className="help is-danger">{_.get(error, 'notes')}</p>
                                            </div>





                                        </div>
                                        <div className="field is-grouped">
                                            <div className="control" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <button onClick={this.handleSubmit} className="button is-info">Confirm Payout </button>
                                            </div>
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



export default payoutManager;