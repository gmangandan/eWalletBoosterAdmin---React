import React, {Component} from 'react';
import * as helpers from '../utils/api.queries';
import axios from 'axios';
import {FormErrors} from './FormErrors';


class RegisterBox extends Component {

    state = {
        firstname: '',
        lastname: '',
        email: '',        
        password: '',
        passwordConfirm: '',
        formErrors: {email: '', password: '', passwordConfirm: '', firstname: '', lastname: '', mobileNumber: '', countryCode: ''},
        numCodes: [],
        countryCode: '',
        countryCodeValid: false,
        mobileNumber: '',
        firstNameValid: false,
        lastNameValid: false,        
        emailValid: false,
        passwordValid: false,
        passwordConfirmValid: false,        
        mobileNumberValid: false,
        formValid: false,
        submitted: false,
        signedIn: false,
        accountError: ''        
    }

    componentDidMount = () => {
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
        },() => { 
            this.validateField(name, value) 
        })
    }

    validateField = (fieldName, value) => { 
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;        
        let passwordValid = this.state.passwordValid;
        let passwordConfirmValid = this.state.passwordConfirmValid;
        let firstNameValid = this.state.firstNameValid;
        let lastNameValid = this.state.lastNameValid;        
        let mobileNumberValid = this.state.mobileNumberValid;
        let countryCodeValid = this.state.countryCodeValid;

        switch (fieldName) {
            case 'firstname': 
                firstNameValid = (/^[a-z\s]+$/i).test(value)
                fieldValidationErrors.firstname = firstNameValid ? '' : 'First name is invalid';
                break; 
            case 'lastname': 
                lastNameValid = (/^[a-z\s]+$/i).test(value)
                fieldValidationErrors.lastname = lastNameValid ? '' : 'Last name is invalid';
                break;
            case 'email': 
                emailValid = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(value)                
                fieldValidationErrors.email = emailValid ? '' : 'Email address is invalid';
                break;    
            case 'password':
                passwordValid = (/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*-])[\w!@#$%^&*-]{8,}$/).test(value)
                fieldValidationErrors.password = passwordValid ? '': 
                'Password must be at least 8 characters long, and include at least 1 lowercase letter, 1 capital letter, 1 number, 1 special character such as !@#$%^&*-';                
                break; 
            case 'passwordConfirm':
                passwordConfirmValid = (value === this.state.password);
                fieldValidationErrors.passwordConfirm = passwordConfirmValid ? '': 'Should match password';
                break;
            case 'mobileNumber':
                mobileNumberValid = (/^([\d\s]){3,15}$/i).test(value);
                fieldValidationErrors.mobileNumber = mobileNumberValid ? '': 'Invalid mobile number';
                break; 
            case 'countryCode':
                countryCodeValid = this.state.countryCode !== '';
                fieldValidationErrors.countryCode = countryCodeValid ? '': 'You need to select a country code';
                break;      

            default:
            break;
        }

        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,            
            passwordValid: passwordValid,
            passwordConfirmValid: passwordConfirmValid,
            firstNameValid: firstNameValid,
            lastNameValid: lastNameValid,            
            mobileNumberValid: mobileNumberValid,
            countryCodeValid: countryCodeValid
        }, this.validateForm)
    }

    validateForm = () => {
        // setting formValid to true/false based on correct input of other fields
        this.setState({
            formValid: this.state.emailValid && this.state.passwordValid && this.state.firstNameValid && this.state.lastNameValid && this.state.passwordConfirmValid && this.state.mobileNumberValid && this.state.countryCodeValid
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const firstName = this.state.firstname;
        const lastName = this.state.lastname;
        const email = this.state.email;
        const password = this.state.password;
        const mobileNumber = (this.state.countryCode + this.state.mobileNumber);

        axios.post('http://localhost:3000/auth/register', {firstName, lastName, email, password, mobileNumber })
        .then(res => {
            if (!res.data.success) {
                throw new Error('User already exists');
            } else {
                localStorage.setItem('jwtToken', res.data.token);
                this.setState({
                    submitted: true
                }, () => {
                    setInterval(() => {
                        window.location = "/profile";
                    }, 3000) 
                })
            }
        })
        .catch((err) => {
            this.setState({
                accountError: `${err.message}. Please use the forgotton password link.`
            })  
        });
    }
    
    resetState = () => {
        window.location = "/login";
    } 

    
    render () {

        return (
            <div>
              <FormErrors formErrors={this.state.formErrors} />
              <div>
                {
                    this.state.submitted === false &&
                    <div>
                        <div className="field">
                            <label className="label">First Name</label>
                            <div className="control has-icons-left has-icons-right">
                                <input 
                                className="input" 
                                type="text" 
                                placeholder="First name"  
                                name='firstname' 
                                onChange={this.handleInputChange} 
                                style={this.state.firstNameValid ? {border: '0.2rem solid #00D1B2'}: null}
                                />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-user"></i>
                                </span>
                            </div>
                        </div>            

                        <div className="field">
                            <label className="label">Last Name</label>
                            <div className="control has-icons-left has-icons-right">
                                <input 
                                className="input" 
                                type="text" 
                                placeholder="Last name"  
                                name='lastname' 
                                onChange={this.handleInputChange} 
                                style={this.state.lastNameValid ? {border: '0.2rem solid #00D1B2'}: null}
                                />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-user"></i>
                                </span>
                            </div>
                        </div>  

                        <div className="field">
                            <label className="label">Email Address</label>
                            <div className="control has-icons-left has-icons-right">
                                <input 
                                className="input" 
                                type="email" 
                                placeholder="Email address to login to eWalletBooster"  
                                name='email' 
                                onChange={this.handleInputChange} 
                                style={this.state.emailValid ? {border: '0.2rem solid #00D1B2'}: null}
                                />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-envelope"></i>
                                </span>
                            </div>
                        </div> 

                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control has-icons-left has-icons-right">
                                <input 
                                className="input" 
                                type="password" 
                                placeholder="Password"  
                                name='password' 
                                onChange={this.handleInputChange} 
                                style={this.state.passwordValid ? {border: '0.2rem solid #00D1B2'}: null}
                                />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-lock"></i>
                                </span>
                            </div>
                        </div>  

                        <div className="field">
                            <label className="label">Confirm Password</label>
                            <div className="control has-icons-left has-icons-right">
                                <input 
                                className="input" 
                                type="password" 
                                placeholder="Confirm Password"  
                                name='passwordConfirm' 
                                onChange={this.handleInputChange} 
                                style={this.state.passwordConfirmValid ? {border: '0.2rem solid #00D1B2'}: null}
                                />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-lock"></i>
                                </span>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Country Code</label>
                            <div className="control has-icons-left has-icons-right">
                                <div className="select">
                                <select name='countryCode'
                                    data-validate="require" 
                                    onChange={this.handleInputChange} 
                                    style={this.state.countryCodeValid ? {border: '0.2rem solid #00D1B2'}: null}
                                    >
                                    <option>Select</option>
                                    {this.state.numCodes}
                                </select>
                                <span className="icon is-left">
                                    <i className="fa fa-globe"></i>
                                </span>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Mobile Number</label>
                            <div className="control has-icons-left has-icons-right">
                                <input 
                                className="input" 
                                type="text" 
                                placeholder="Mobile phone number"  
                                name='mobileNumber' 
                                onChange={this.handleInputChange} 
                                style={this.state.mobileNumberValid ? {border: '0.2rem solid #00D1B2'}: null}
                                />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-phone"></i>
                                </span>
                            </div>
                        </div>

                        <div className="field is-grouped">
                            <div className="control">
                                <button className="button is-primary" onClick={this.handleSubmit} disabled={!this.state.formValid}>Submit</button>
                            </div>
                            <div className="control">
                                <button className="button is-text" onClick={this.resetState}>Cancel</button>
                            </div>
                        </div>
                        <FormErrors formErrors={this.state.accountError} /> 
                    </div>

                }
                
                {
                    this.state.submitted === true &&
                    <div className='notification' style={{ display: 'flex', alignItems: 'center', padding: '2rem', marginTop: '1rem'}}>                
                        <div>
                            <p>Thank you for registering at eWalletBooster.</p> 
                        </div>                           
                    </div>
                }        

            </div>

            </div>
        )
    }
}

export default RegisterBox;