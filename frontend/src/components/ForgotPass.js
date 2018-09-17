import React, {Component} from 'react';
import axios from 'axios';
import {ErrorMessage} from './ErrorMessage';

class ForgotPass extends Component {

    state = {
        email: '',
        emailValid: false,
        err: false,
        success: false
    }

    handleInputChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        }, this.validateField(value))
    }

    validateField = (email) => {
        if((/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(email)) {
            this.setState({
                emailValid: true
            })
        }
    }

    
    handleSubmit = (e) => {
        e.preventDefault();
        const {email} = this.state;
        axios.post('http://localhost:3000/email/forgot-password', {email})
        .then((res) => {
            if (res.data.success) {
                this.setState({
                    success: true,
                    err: false
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
                    <p>Forgotten password request</p>            
                </div>
                <div className="message-body">               

                {
                    this.state.success === false ?
                    <div>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                            <input className="input" type="email" placeholder="Please enter your email address" name='email' onChange={this.handleInputChange}/>
                            </div>
                        </div>

                        <div className="field is-grouped">
                            <div className="control">
                                <button className="button is-primary" onClick={this.handleSubmit} disabled={!this.state.emailValid}>Submit</button>
                            </div>
                            <div className="control">
                                <button className="button is-text" onClick={this.resetState}>Cancel</button>
                            </div>
                        </div>
                    </div>
                    :
                    
                    <div className='notification' style={{ display: 'flex', alignItems: 'center', padding: '2rem', marginTop: '1rem'}}>                
                        <div>
                            <p>Your request was successful. Please check your email for further instructions.</p> 
                        </div>                           
                    </div>
                }   
                {
                    this.state.err === true && 
                    <ErrorMessage message={'No account exists for this email address.'} />
                }
                </div>
            </article>

            <article className="message is-primary is-hidden-desktop is-hidden-tablet is-hidden-widescreen">
                <div className="message-header">
                    <p>Forgotten password request</p>            
                </div>
                <div className="message-body">               

                {
                    this.state.success === false ?
                    <div>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                            <input className="input" type="email" placeholder="Please enter your email address" name='email' onChange={this.handleInputChange}/>
                            </div>
                        </div>

                        <div className="field is-grouped">
                            <div className="control">
                                <button className="button is-primary" onClick={this.handleSubmit} disabled={!this.state.emailValid}>Submit</button>
                            </div>
                            <div className="control">
                                <button className="button is-text" onClick={this.resetState}>Cancel</button>
                            </div>
                        </div>
                    </div>
                    :
                    
                    <div className='notification' style={{ display: 'flex', alignItems: 'center', padding: '2rem', marginTop: '1rem'}}>                
                        <div>
                            <p>Your request was successful. Please check your email for further instructions.</p> 
                        </div>                           
                    </div>
                }   
                {
                    this.state.err === true && 
                    <ErrorMessage message={'No account exists for this email address.'} />
                }
                </div>
            </article>

           
        </div>       
       )
   }
}

export default ForgotPass;