import React, { Component } from 'react';
import 'bulma-steps/dist/css/bulma-steps.min.css';
import { FormErrors } from './FormErrors';
import { StepMarker } from './StepMarker';
import { StepContent } from './StepContent';
import { StepField } from './StepField';
import { StepFieldSelect } from './StepFieldSelect';
import { StepFieldRadio } from './StepFieldRadio';
import StepSlider from './StepSlider';
import { LoggedInMsg } from './LoggedInMsg';
import Login from './Login';
import * as helpers from '../utils/api.queries';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { isLoggedIn } from '../utils/AuthService';
const bulmaSteps = require('bulma-steps/dist/js/bulma-steps.min.js');


class Steps extends Component {

    state = {
        firstname: '',
        lastname: '',
        id: '',
        skrill_account_id: '',
        neteller_account_id: '',
        ecopayz_account_id: '',
        email: '',
        accountEmailAddress: '',
        password: '',
        passwordConfirm: '',
        appStatus: '',
        appStatusValid: false,
        buttonText: `Click to register at ${this.props.brand}`,
        formErrors: { email: '', password: '', passwordConfirm: '', firstname: '', lastname: '', skrill_account_id: '', neteller_account_id: '', ecopayz_account_id: '', accountEmailAddress: '', mobileNumber: '', countryCode: '', appStatus: '' },
        currency: '',
        activeModal: false,
        numCodes: [],
        countryCode: '',
        countryCodeValid: false,
        mobileNumber: '',
        firstNameValid: false,
        lastNameValid: false,
        accountEmailAddressValid: false,
        emailValid: false,
        passwordValid: false,
        passwordConfirmValid: false,
        skrill_account_idValid: false,
        neteller_account_idValid: false,
        ecopayz_account_idValid: false,
        mobileNumberValid: false,
        formValid: false,
        submitted: false,
        signedIn: false,
        accountError: '',
        applicationError: ''
    }

    componentDidUpdate = (prevProps) => {
        // use this to refresh the entered data if switching between cashback schemes
        if (prevProps !== this.props) {
            window.location.reload();
        }
    }

    componentDidMount = () => {
        if (isLoggedIn()) {
            // if user is logged in we use authorization from jwtToken and set initial personal user details in state by retrieving the details from database. We also need to set the inline validation to true for these properties
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
            axios.get('http://localhost:3000/api/users')
                .then(res => {
                    this.setState({
                        signedIn: true,
                        firstname: res.data.user.firstName,
                        lastname: res.data.user.lastName,
                        email: res.data.user.email,
                        id: res.data.user._id,
                        mobileNumber: res.data.user.mobileNumber,
                        mobileNumberValid: true,
                        countryCodeValid: true,
                        firstNameValid: true,
                        lastNameValid: true,
                        passwordValid: true,
                        passwordConfirmValid: true,
                        emailValid: true
                    })
                })
                .catch(() => {
                    this.setState({
                        hasError: true
                    })
                })
        }
        bulmaSteps.attach();
        // this.nameInput.focus();
        this.setState({
            numCodes: helpers.sortCountryCodes()
        })
    }

    handleInputChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, () => {
            this.validateField(name, value)
        })
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let accountEmailAddressValid = this.state.accountEmailAddress;
        let passwordValid = this.state.passwordValid;
        let passwordConfirmValid = this.state.passwordConfirmValid;
        let firstNameValid = this.state.firstNameValid;
        let lastNameValid = this.state.lastNameValid;
        let skrill_account_idValid = this.state.skrill_account_idValid;
        let neteller_account_idValid = this.state.neteller_account_idValid;
        let ecopayz_account_idValid = this.state.ecopayz_account_idValid;
        let mobileNumberValid = this.state.mobileNumberValid;
        let countryCodeValid = this.state.countryCodeValid;
        let appStatusValid = this.state.appStatusValid;


        switch (fieldName) {
            case 'firstname':
                firstNameValid = (/^[a-z\s]+$/i).test(value)
                fieldValidationErrors.firstname = firstNameValid ? '' : 'First name is invalid';
                break;
            case 'lastname':
                lastNameValid = (/^[a-z\s]+$/i).test(value)
                fieldValidationErrors.lastname = lastNameValid ? '' : 'Last name is invalid';
                break;
            case 'accountEmailAddress':
                accountEmailAddressValid = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(value)
                fieldValidationErrors.accountEmailAddress = accountEmailAddressValid ? '' : 'Account email address is invalid';
                break;
            case 'email':
                emailValid = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(value)
                fieldValidationErrors.email = emailValid ? '' : 'Email address is invalid';
                break;
            case 'password':
                passwordValid = (/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*-])[\w!@#$%^&*-]{8,}$/).test(value)
                fieldValidationErrors.password = passwordValid ? '' :
                    'Password must be at least 8 characters long, and include at least 1 lowercase letter, 1 capital letter, 1 number, 1 special character such as !@#$%^&*-';
                break;
            case 'passwordConfirm':
                passwordConfirmValid = (value === this.state.password);
                fieldValidationErrors.passwordConfirm = passwordConfirmValid ? '' : 'Should match password';
                break;
            case 'skrill_account_id':
                skrill_account_idValid = (/^(\d){8,9}$/i).test(value);
                fieldValidationErrors.skrill_account_id = skrill_account_idValid ? '' : 'Skrill account ID should be between 8-9 digits long such as 85301429 or 136244315';
                break;
            case 'neteller_account_id':
                neteller_account_idValid = (/^(\d){12}$/i).test(value);
                fieldValidationErrors.neteller_account_id = neteller_account_idValid ? '' : 'Neteller account ID should be 12 digits long such as 451289003876';
                break;
            case 'ecopayz_account_id':
                ecopayz_account_idValid = (/^(\d){10}$/i).test(value);
                fieldValidationErrors.ecopayz_account_id = ecopayz_account_idValid ? '' : 'Ecopayz account ID should be 10 digits long such as 1100005893';
                break;
            case 'mobileNumber':
                mobileNumberValid = (/^([\d\s]){3,15}$/i).test(value);
                fieldValidationErrors.mobileNumber = mobileNumberValid ? '' : 'Invalid mobile number';
                break;
            case 'countryCode':
                countryCodeValid = this.state.countryCode !== '';
                fieldValidationErrors.countryCode = countryCodeValid ? '' : 'You need to select a country code';
                break;
            case 'appStatus':
                appStatusValid = this.state.appStatus !== '';
                fieldValidationErrors.appStatus = appStatusValid ? '' : 'You need to select new or existing';
                break;
            default:
                break;
        }

        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
            accountEmailAddressValid: accountEmailAddressValid,
            passwordValid: passwordValid,
            passwordConfirmValid: passwordConfirmValid,
            firstNameValid: firstNameValid,
            lastNameValid: lastNameValid,
            skrill_account_idValid: skrill_account_idValid,
            neteller_account_idValid: neteller_account_idValid,
            ecopayz_account_idValid: ecopayz_account_idValid,
            mobileNumberValid: mobileNumberValid,
            countryCodeValid: countryCodeValid,
            appStatusValid: appStatusValid
        }, this.validateForm)
    }

    validateForm = () => {
        // setting formValid to true/false based on correct input of other fields
        this.setState({
            formValid: this.state.emailValid && this.state.accountEmailAddress && this.state.passwordValid && this.state.firstNameValid && this.state.lastNameValid && this.state.passwordConfirmValid && (this.state.neteller_account_idValid || this.state.skrill_account_idValid || this.state.ecopayz_account_idValid) && this.state.mobileNumberValid && this.state.countryCodeValid && this.state.appStatusValid
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const firstName = this.state.firstname;
        const lastName = this.state.lastname;
        const email = this.state.email;
        const password = this.state.password;
        const brand = this.props.brand.toLowerCase();
        const accountId = this.state[`${this.props.brand.toLowerCase()}_account_id`];
        const accountEmailAddress = this.state.accountEmailAddress;
        const accountCurrency = this.state.currency;
        const mobileNumber = (this.state.countryCode + this.state.mobileNumber);
        const status = 'Pending';

        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');

        if (!isLoggedIn()) {
            // if user is not logged in we allow them to register an account along with applying to their first scheme. 
            axios.post('http://localhost:3000/auth/register', { firstName, lastName, email, password, mobileNumber })
                .then((res) => {
                    if (!res.data.success) {
                        throw new Error('User already exists');
                    }
                    // use the ID to set belongsTo for application
                    const belongsTo = res.data.data._id;
                    // once registered we send back token from back end which allows us to redirect to profile              
                    localStorage.setItem('jwtToken', res.data.token);
                    // we then post the application
                    axios.post(`http://localhost:3000/api/applications/${this.props.brand.toLowerCase()}`, { firstName, lastName, brand, accountId, accountEmailAddress, accountCurrency, belongsTo, status })
                        .then((res) => {
                            if (!res.data.success) {
                                throw new Error('An application for this account ID already exists')
                            }
                            this.setState({
                                submitted: true
                            })
                        })
                        .catch((err) => {
                            this.setState({
                                applicationError: err.message
                            })
                        });
                })
                .catch((err) => {
                    this.setState({
                        accountError: `${err.message}. Please use the forgotton password link.`
                    })
                });
        } else {
            // if user is logged in we already have the required personal details in state so we only need to submit new application and not new user
            const belongsTo = this.state.id;
            axios.post(`http://localhost:3000/api/applications/${this.props.brand.toLowerCase()}`, { firstName, lastName, brand, accountId, accountEmailAddress, accountCurrency, belongsTo, status })
                .then((res) => {
                    if (!res.data.success) {
                        throw new Error('An application for this account ID already exists')
                    }
                    this.setState({
                        submitted: true
                    })
                })
                .catch((err) => {
                    this.setState({
                        applicationError: err.message
                    })
                });
        }
    }

    toggleClass = () => {
        this.setState({
            activeModal: !this.state.activeModal
        })
    }

    resetState = () => {
        this.setState({
            accountError: '',
            applicationError: ''
        })
    }

    handleClick = () => {
        this.setState({
            buttonText: `Thanks for registering at ${this.props.brand}`,
            appStatus: 'new',
            appStatusValid: true
        })
    }

    render() {
        return (
            <div className='container' style={{ maxWidth: '100%' }}>

                <StepSlider brand={this.props.brand}></StepSlider>

                <div className='steps' style={{ padding: '3rem 1rem 1rem 1rem' }} >
                    <StepMarker number={'1'} title={'Login'} />
                    <StepMarker number={'2'} title={'Register at eWalletBooster'} />
                    <StepMarker number={'3'} title={'SMS'} />
                    <StepMarker number={'4'} title={'Register at ' + this.props.brand} />
                    <StepMarker number={'5'} title={this.props.brand + ' Account Details'} />
                    <StepMarker number={'6'} title={'Finish'} />

                    <div className='steps-content'>

                        {/* showing any errors in box at top */}
                        <FormErrors formErrors={this.state.formErrors} />

                        <div className="step-content has-text-centered" style={{ marginTop: '1rem' }}>
                            {
                                this.state.signedIn
                                    ?
                                    <LoggedInMsg message={'You are logged in. Please click next to continue'} icon={'fa fa-check-circle'} />
                                    :
                                    <div>
                                        <h1 className="title is-4">Already signed up to eWalletBooster? Please login or click next to register.</h1>
                                        <Login />
                                    </div>
                            }
                        </div>

                        {
                            this.state.signedIn ?

                                <div className="step-content has-text-centered" style={{ marginTop: '1rem' }}>

                                    <article className={`message ${this.props.brandProps.color}`}>
                                        <div className="message-header" >
                                            <p>Check information (can be different from {this.props.brand} account details)</p>
                                        </div>
                                        <div className="message-body" style={{ display: 'flex', justifyContent: 'start', flexWrap: 'wrap' }} >

                                            <table className='table is-bordered table is-striped is-narrow is-hoverable is-fullwidth' style={{ tableLayout: 'fixed', width: '100%' }}>
                                                <tbody>
                                                    <tr>
                                                        <th>First Name: </th>
                                                        <td><strong>{this.state.firstname}</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <th>Last Name: </th>
                                                        <td><strong>{this.state.lastname}</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <th>Email: </th>
                                                        <td><strong>{this.state.email}</strong></td>
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
                                        </div>
                                    </article>
                                </div>
                                :

                                <div className='step-content has-text-centered is-active' style={{ marginTop: '1rem' }}>

                                    <StepField label={'First Name'} name={'firstname'} placeholder={'First name'} type={'text'} disabled={this.state.signedIn} onChange={this.handleInputChange} valid={this.state.firstNameValid} icon={'fa fa-user'} />

                                    <StepField label={'Last Name'} name={'lastname'} placeholder={'Last name'} type={'text'} disabled={this.state.signedIn} onChange={this.handleInputChange} valid={this.state.lastNameValid} icon={'fa fa-user'} />

                                    <StepField label={'Email Address'} name={'email'} placeholder={'Email address to login to eWalletBooster'} type={'email'} disabled={this.state.signedIn} onChange={this.handleInputChange} valid={this.state.emailValid} icon={'fa fa-envelope'} />

                                    <StepField label={'Password'} name={'password'} placeholder={'Password'} type={'password'} disabled={this.state.signedIn} onChange={this.handleInputChange} valid={this.state.passwordValid} icon={'fa fa-lock'} />

                                    <StepField label={'Confirm password'} name={'passwordConfirm'} placeholder={'Confirm password'} type={'password'} disabled={this.state.signedIn} onChange={this.handleInputChange} valid={this.state.passwordConfirmValid} icon={'fa fa-lock'} />

                                </div>

                        }
                        {
                            this.state.signedIn ?

                                <div className="step-content has-text-centered" style={{ marginTop: '1rem' }}>
                                    <article className={`message ${this.props.brandProps.color}`}>
                                        <div className="message-header" >
                                            <p>Check the mobile number you wish to receive SMS updates on</p>
                                        </div>
                                        <div className="message-body" style={{ display: 'flex', justifyContent: 'start', flexWrap: 'wrap' }} >

                                            <table className='table is-bordered table is-striped is-narrow is-hoverable is-fullwidth' style={{ tableLayout: 'fixed', width: '100%' }}>
                                                <tbody>
                                                    <tr>
                                                        <th>Mobile Number: </th>
                                                        <td><strong>{this.state.mobileNumber}</strong></td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                    </article>
                                </div>

                                :

                                <div className="step-content has-text-centered" style={{ marginTop: '1rem' }}>

                                    <h1 className="title is-4">Please enter the mobile number you wish to receive SMS updates on</h1>


                                    <StepFieldSelect label={'Country Code'} name={'countryCode'} onChange={this.handleInputChange} options={this.state.numCodes} valid={this.state.countryCode !== ''} />

                                    <StepField label={'Mobile Number'} name={'mobileNumber'} placeholder={'Mobile phone number'} type={'text'} disabled={this.state.signedIn} onChange={this.handleInputChange} valid={this.state.mobileNumberValid} icon={'fa fa-phone'} />

                                </div>

                        }

                        <div className="step-content has-text-centered" style={{ marginTop: '1rem' }}>

                            <StepFieldRadio brand={this.props.brand} color={this.props.brandProps.color} link={this.props.brandProps.link} handleClick={this.handleClick} buttonText={this.state.buttonText} handleInputChange={this.handleInputChange} />

                        </div>

                        <div className="step-content has-text-centered" style={{ marginTop: '1rem' }}>

                            <StepField label={`${this.props.brand} Account ID`} name={`${this.props.brand.toLowerCase()}_account_id`} placeholder={`Your ${this.props.brandProps.accLength} digit ${this.props.brand} account ID`} type={'text'} disabled={false} onChange={this.handleInputChange} valid={this.state[this.props.brand.toLowerCase() + '_account_idValid']} icon={'fa fa-lock'} />

                            <StepField label={`${this.props.brand} Account Email Address`} name={'accountEmailAddress'} placeholder={`Email address registered on your ${this.props.brand} account`} type={'email'} disabled={false} onChange={this.handleInputChange} valid={this.state.accountEmailAddressValid} icon={'fa fa-envelope'} />

                            <StepFieldSelect label={`${this.props.brand} Currency`} name={'currency'} onChange={this.handleInputChange} options={['EUR', 'USD', 'GBP', 'AUD', 'NZD', 'SGD'].map(cur => {
                                return <option key={cur} value={cur}>{cur}</option>
                            })} valid={this.state.currency !== ''} />

                        </div>

                        <StepContent
                            color={`message ${this.props.brandProps.color}`}
                            brand={this.props.brand}
                            firstName={this.state.firstname}
                            lastName={this.state.lastname}
                            email={this.state.email}
                            accountEmailAddress={this.state.accountEmailAddress}
                            accountId={this.state[this.props.brand.toLowerCase() + '_account_id']}
                            currency={this.state.currency}
                            mobileNum={this.state.countryCode + this.state.mobileNumber}
                            appStatus={this.state.appStatus}
                            handleSubmit={this.handleSubmit}
                            formValid={this.state.formValid}
                            submitted={this.state.submitted}
                            signedIn={this.state.signedIn}
                        />
                        <FormErrors formErrors={this.state.accountError} />
                        <FormErrors formErrors={this.state.applicationError} />
                    </div>

                    <div className="steps-actions">
                        <div className="steps-action">
                            <a data-nav="previous" className={`button ${this.props.brandProps.color}`} onClick={this.resetState}>Previous</a>
                        </div>
                        <div className="steps-action">
                            <a data-nav="next" className={'button is-primary'}>Next</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default withRouter(Steps);