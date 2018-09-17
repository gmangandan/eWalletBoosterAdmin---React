import React, {Component} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {FormErrors} from './FormErrors';
import {Link} from 'react-router-dom';

class Login extends Component {
    state = {         
        email: '',
        password: '',
        message: '',
        signedIn: false
    }  
    
    handleInputChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        })
    }
    
    handleSubmit = (e) => {
        e.preventDefault();

        const {email, password} = this.state;

        axios.post('http://localhost:3000/auth/login', {email, password})
        .then((result) => {
            localStorage.setItem('jwtToken', result.data.token);            
            this.setState({
                message: '',
                signedIn: true
            });            
            
            if(this.props.history.location.pathname === '/login') {
                this.props.history.push('/profile')
            } else {
                this.props.history.push(this.props.history.location.pathname)
            } 
        })
        .catch(error => {
            if(error.response.status === 401) {
            this.setState({
                message: <FormErrors formErrors={{message: 'Login failed: Email or password not match'}} />
                })
            }
        });        
    }
    

    render () {
        const {message} = this.state;
        return (
            <div>
                <article className="message is-primary is-hidden-mobile" style={{width: '75%', margin: 'auto'}}>
                    <div className="message-header">
                        <p>Login</p>            
                    </div>
                    <div className="message-body">
                        <div className="field">
                            <p className="control has-icons-left has-icons-right">
                                <input className="input" type="email" placeholder="Email" name="email" onChange={this.handleInputChange}/>
                                <span className="icon is-small is-left">
                                    <i className="fa fa-envelope"></i>
                                </span>                        
                            </p>
                        </div>
                        <div className="field">
                            <p className="control has-icons-left">
                                <input className="input" type="password" placeholder="Password" name="password" onChange={this.handleInputChange}/>
                                <span className="icon is-small is-left">
                                    <i className="fa fa-lock"></i>
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <div className="control" style={{display: 'flex', justifyContent: 'space-between'}}>
                                <button className="button is-info" onClick={this.handleSubmit}>
                                Login
                                </button>
                                <Link to='/forgot-password' style={{marginLeft: '0.5rem'}}>Forgotten password?</Link>
                            </div>
                        </div>
                        <h1>{message}</h1>        
                    </div> 
                </article>

                <article className="message is-primary is-hidden-desktop is-hidden-tablet is-hidden-widescreen" >
                <div className="message-header">
                    <p>Login</p>            
                </div>
                <div className="message-body">
                    <div className="field">
                        <p className="control has-icons-left has-icons-right">
                            <input className="input" type="email" placeholder="Email" name="email" onChange={this.handleInputChange}/>
                            <span className="icon is-small is-left">
                                <i className="fa fa-envelope"></i>
                            </span>                        
                        </p>
                    </div>
                    <div className="field">
                        <p className="control has-icons-left">
                            <input className="input" type="password" placeholder="Password" name="password" onChange={this.handleInputChange}/>
                            <span className="icon is-small is-left">
                                <i className="fa fa-lock"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <div className="control" style={{display: 'flex', justifyContent: 'space-between'}}>
                            <button className="button is-info" onClick={this.handleSubmit}>
                            Login
                            </button>
                            <Link to='/forgot-password' style={{marginLeft: '0.5rem'}}>Forgotten password?</Link>
                        </div>
                    </div>
                    <h1>{message}</h1>        
                </div> 
            </article>
        </div>
        )
    }
}


export default withRouter (Login);