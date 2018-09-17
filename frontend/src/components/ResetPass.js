import React, {Component} from 'react';
import axios from 'axios';
import {ErrorMessage} from './ErrorMessage';
import {FormErrors} from './FormErrors';

const qs = require('query-string');

class ResetPass extends Component {

    state = {
        password: '',
        passwordConfirm: '',
        token: '',
        success: false,
        formErrors: {password: '', passwordConfirm: ''},
        passwordValid: false,
        passwordConfirmValid: false,
        formValid: false,
        err: false        
    }

    componentDidMount = () => {
       this.setState({
           token: qs.parse(this.props.location.search).token
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
        let passwordValid = this.state.passwordValid;
        let passwordConfirmValid = this.state.passwordConfirmValid;
        switch (fieldName) {
            case 'password':
                passwordValid = (/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*-])[\w!@#$%^&*-]{8,}$/).test(value)
                fieldValidationErrors.password = passwordValid ? '': 
                'Password must be at least 8 characters long, and include at least 1 lowercase letter, 1 capital letter, 1 number, 1 special character such as !@#$%^&*-';                
                break; 
            case 'passwordConfirm':
                passwordConfirmValid = (value === this.state.password);
                fieldValidationErrors.passwordConfirm = passwordConfirmValid ? '': 'Should match password';
                break; 
            default:
            break; 
        }
        this.setState({
            passwordValid: passwordValid,
            passwordConfirmValid: passwordConfirmValid
        }, this.validateForm)
    }

    validateForm = () => {
        this.setState({
            formValid: this.state.passwordValid && this.state.passwordConfirmValid
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {password, token} = this.state;
        axios.post('http://localhost:3000/email/reset-password', {password, token})
        .then((res) => {
            if (res.data.success) {
                this.setState({
                    success: true
                }, () => {
                    setTimeout(() => {
                        this.props.history.push('/login')
                    }, 3000)
                })
            }            
        })
        .catch(error => {
            if(error.response.data.success === false) {
                this.setState({
                    err: true
                })
            }
        });
    }

    resetState = () => {
        this.props.history.push('/login')
    }

   render () {
       return (
           <div>
            <article className="message is-primary is-hidden-mobile" style={{width: '50%', margin: 'auto'}}>
                <div className="message-header">
                    <p>Reset your password</p>            
                </div>
                <div className="message-body">
                <FormErrors formErrors={this.state.formErrors} />

                {
                    this.state.success === false ?
                    <div>
                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control">
                            <input className="input" type="password" placeholder="Password" name='password' onChange={this.handleInputChange} style={this.state.passwordValid ? {border: '0.2rem solid #00D1B2'}: null}/>
                            </div>
                        </div>
                        
                        <div className="field">
                            <label className="label">Confirm Password</label>
                            <div className="control">
                            <input className="input" type="password" placeholder="Confirm password" name='passwordConfirm' onChange={this.handleInputChange} style={this.state.passwordConfirmValid ? {border: '0.2rem solid #00D1B2'}: null}/>
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
                    </div>
                    :
                    
                    <div className='notification' style={{ display: 'flex', alignItems: 'center', padding: '2rem', marginTop: '1rem'}}>                
                        <div>
                            <p to='/login'>Your password was reset successfully. Redirecting to login page in 3 seconds.</p> 
                        </div>                           
                    </div>
                }   
                {
                    this.state.err === true && 
                        <ErrorMessage message={'Password reset token is invalid or has expired'} />
                    
                }     

                </div>
            </article>

            <article className="message is-primary is-hidden-desktop is-hidden-tablet is-hidden-widescreen" >
                <div className="message-header">
                    <p>Primary</p>            
                </div>
                <div className="message-body">
                <FormErrors formErrors={this.state.formErrors} />
                {
                    this.state.success === false ?
                    <div>
                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control">
                            <input className="input" type="password" placeholder="Password" name='password' onChange={this.handleInputChange}/>
                            </div>
                        </div>
                        
                        <div className="field">
                            <label className="label">Confirm Password</label>
                            <div className="control">
                            <input className="input" type="password" placeholder="Confirm password" name='passwordConfirm' onChange={this.handleInputChange}/>
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
                    </div>
                    :
                    
                    <div className='notification' style={{ display: 'flex', alignItems: 'center', padding: '2rem', marginTop: '1rem'}}>                
                        <div>
                            <p to='/login'>Your password was reset successfully. Redirecting to login page in 3 seconds</p>
                        </div>                           
                    </div>
                }   
                {
                    this.state.err === true && 
                        <ErrorMessage message={'Password reset token is invalid or has expired'} />
                    
                }    

                </div>
            </article>
        </div>       
       )
   }
}

export default ResetPass;