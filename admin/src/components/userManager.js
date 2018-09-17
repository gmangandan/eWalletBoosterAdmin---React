import React, { Component } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import _ from 'lodash';
import toastr from 'toastr';
import * as helpers from '../utils/api.queries';
import { Link } from 'react-router-dom';
class userManager extends Component {
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
        this._handleCheckBoxChange = this._handleCheckBoxChange.bind(this);
        this._onTextFieldBlur = this._onTextFieldBlur.bind(this);
        this._formValidation = this._formValidation.bind(this);
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
                if(res.data.success){
                    this.setState({ userData: res.data.results, editAction: true });
                }else{
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

    _formValidation(fieldsToValidate = [], callback = () => { }) {
        const { userData } = this.state;
        const allFields = {
            firstName: {
                message: "Please enter the  name.",
                doValidate: () => {
                    const value = _.trim(_.get(userData, 'firstName', ""));
                    if (value.length > 0) {
                        return true;
                    }
                    return false;
                }
            },
            username: {
                message: "Please enter the user name.",
                doValidate: () => {
                    const value = _.trim(_.get(userData, 'username', ""));
                    if (value.length > 0) {
                        return true;
                    }
                    return false;
                }
            },
            password: {
                message: "Please enter the password.",
                doValidate: () => {
                    const value = _.get(userData, 'password', '');
                    if (value && value.length > 0) {
                        return true;
                    }
                    return false;
                }
            }, cpassword: {
                message: "Confirm password does't match with password.",
                doValidate: () => {
                    const vpassword = _.trim(_.get(userData, 'password', ""));
                    const vcpassword = _.trim(_.get(userData, 'cpassword', ""));
                    if (vpassword.length > 0 && vpassword === vcpassword) {
                        return true;
                    }
                    return false;
                }
            }, email: {
                message: "Please enter valid email.",
                doValidate: () => {
                    const value = _.get(userData, 'email', '');
                    const emailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
                    if (emailValid) {
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
        const { changePass, editAction } = this.state;
        const validatePassword = (editAction ? changePass ? true : false : true);
        let fieldNeedToValidate = ['firstName', 'username', 'email'];
        if (validatePassword) {
            fieldNeedToValidate.push('password');
            fieldNeedToValidate.push('cpassword');
        }

        this._formValidation(fieldNeedToValidate, (isValid) => {
            if (isValid) {
                toastr.clear();
                !editAction ? this.createUseraccount() : this.updateUserAccount();
            }
        });

    }

    createUseraccount() {
        const { userData } = this.state;
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        axios.post('http://localhost:3000/admin/users/create', {
            userData: userData,

        }).then((result) => {
            let sucMsg = result.data.msg;
            toastr.success(sucMsg, '');
            this.props.history.push('/user-accounts');
        }).catch(error => {
            let errorMsg = error.response.data.msg;
            toastr.error(errorMsg, 'Error!');
        });
    }
    updateUserAccount() {
        const { userData, changePass } = this.state;
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        axios.post('http://localhost:3000/admin/users/updateuser', {
            userData: userData,
            changePass: changePass
        }).then((result) => {
            let sucMsg = result.data.msg;
            toastr.success(sucMsg, '');
            this.props.history.push('/user-accounts');
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

        const { userData, changePass, error, editAction, numCodes } = this.state;
        const passwordHtml = <div className="field is-grouped">
            <div className="control is-expanded">
                <label className="label">Password</label>
                <input className={"input " + (_.get(error, 'password') ? ' is-danger' : '')} name="password" type="password" placeholder="Password" onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                <p className="help is-danger">{_.get(error, 'password')}</p>
            </div>
            <div className="control is-expanded">
                <label className="label">Confirm password </label>
                <input className={"input " + (_.get(error, 'cpassword') ? ' is-danger' : '')} type="password" name="cpassword" placeholder="Confirm password" onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                <p className="help is-danger">{_.get(error, 'cpassword')}</p>
            </div>
        </div>
        const changePassChekbox = editAction ? <div className="field ">
            <div className="control is-expanded">
                <label className="checkbox">
                    <input type="checkbox" value="1" onChange={this._handleCheckBoxChange} /> Change Password?</label>
            </div>
        </div> : null;
        const passContent = (editAction ? changePass ? passwordHtml : null : passwordHtml);



        return (
            <div className='container'>
                <NavBar />
                <div className="container">
                    <section className="hero">
                        <div className="hero-body" style={{ 'backgroundColor': 'white' }}>
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
                                <div className="columns is-desktop is-centered ">
                                    <div className="column">
                                        <div className="field is-grouped">
                                            <div className="control is-expanded">
                                                <label className="label">First Name</label>
                                                <input className={"input " + (_.get(error, 'firstName') ? ' is-danger' : '')} name="firstName" type="text" placeholder="Name" value={userData.firstName} onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                                <p className="help is-danger">{_.get(error, 'firstName')}</p>
                                            </div>
                                            <div className="control is-expanded">
                                                <label className="label">Last Name </label>
                                                <input className="input" type="text" name="lastName" placeholder="Username" value={userData.lastName} onChange={this.handleInputChange} />
                                                <p className="help is-danger">{_.get(error, 'lastName')}</p>
                                            </div>
                                        </div>
                                        <div className="field is-grouped">
                                            <div className="control is-expanded">
                                                <label className="label">Username </label>
                                                <input className={"input " + (_.get(error, 'username') ? ' is-danger' : '')} type="text" name="username" placeholder="Username" value={userData.username} onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                                <p className="help is-danger">{_.get(error, 'username')}</p>
                                            </div>
                                            <div className="control is-expanded">
                                                <label className="label">E-Mail </label>
                                                <input className={"input " + (_.get(error, 'email') ? ' is-danger' : '')} name="email" type="text" placeholder="Email" value={userData.email} onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                                <p className="help is-danger">{_.get(error, 'email')}</p>
                                            </div>
                                        </div>
                                        {changePassChekbox}
                                        {passContent}
                                        <div className="field is-grouped">
                                            <div className="control is-expanded">
                                                <label className="label">Mobile Number </label>
                                                <input className={"input " + (_.get(error, 'mobileNumber') ? ' is-danger' : '')} type="text" name="mobileNumber" placeholder="Mobile Number" value={userData.mobileNumber} onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                                <p className="help is-danger">{_.get(error, 'mobileNumber')}</p>
                                            </div>
                                            <div className="control   has-icons-left has-icons-right">
                                                <label className="label">Country Code </label>
                                                <div className="select">
                                                    <select name="countryCode"
                                                        data-validate="require"
                                                        onChange={this.handleInputChange}>
                                                        <option>Select</option>
                                                        {numCodes}
                                                    </select>
                                                    <span className="icon is-left">
                                                        <i className="fa fa-globe"></i>
                                                    </span>
                                                </div>
                                            </div>



                                        </div>
                                        <p className="subtitle is-5">Payment Details (Payout)</p>
                                        <div className="field is-grouped">
                                            <div className="control is-expanded">
                                                <label className="label">Skrill email address </label>
                                                <input className={"input " + (_.get(error, 'skrillEmail') ? ' is-danger' : '')} type="text" name="skrillEmail" placeholder="Email address" value={userData.skrillEmail} onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                                <p className="help is-danger">{_.get(error, 'skrillEmail')}</p>
                                            </div>
                                            <div className="control is-expanded">
                                                <label className="label">Netller email address </label>
                                                <input className={"input " + (_.get(error, 'netellerEmail') ? ' is-danger' : '')} type="text" name="netellerEmail" placeholder="Email address" value={userData.netellerEmail} onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                                <p className="help is-danger">{_.get(error, 'netellerEmail')}</p>
                                            </div>
                                            <div className="control is-expanded">
                                                <label className="label">PayPal email address </label>
                                                <input className={"input " + (_.get(error, 'paypalEmail') ? ' is-danger' : '')} type="text" name="paypalEmail" placeholder="Email address" value={userData.paypalEmail} onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                                <p className="help is-danger">{_.get(error, 'paypalEmail')}</p>
                                            </div>
                                        </div>
                                        <p className="subtitle is-5">Payout by bank transfer - BACS </p>
                                        <div className="field is-grouped">
                                            <div className="control is-expanded">
                                                <label className="label">Account Holder Name </label>
                                                <input className={"input " + (_.get(error, 'accountName') ? ' is-danger' : '')} type="text" name="accountName" placeholder="Holder Name " value={userData.accountName} onChange={this.handleInputChange} />
                                                <p className="help is-danger">{_.get(error, 'accountName')}</p>
                                            </div>
                                            <div className="control is-expanded">
                                                <label className="label">Sort code </label>
                                                <input className={"input " + (_.get(error, 'sortCode') ? ' is-danger' : '')} type="text" name="sortCode" placeholder="Sort code" value={userData.sortCode} onChange={this.handleInputChange} />
                                                <p className="help is-danger">{_.get(error, 'sortCode')}</p>
                                            </div>
                                            <div className="control is-expanded">
                                                <label className="label">Account Number </label>
                                                <input className={"input " + (_.get(error, 'accountNo') ? ' is-danger' : '')} type="text" name="accountNo" placeholder="Account Number" value={userData.accountNo} onChange={this.handleInputChange} />
                                                <p className="help is-danger">{_.get(error, 'accountNo')}</p>
                                            </div>
                                        </div>
                                        <div className="field is-grouped">
                                            <div className="control" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <button onClick={this.handleSubmit} className="button is-primary">Submit </button>
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



export default userManager;