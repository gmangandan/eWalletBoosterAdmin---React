import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toastr from 'toastr'

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            signedIn: false,
            loginData: {
                username: '',
                password: '',
            },
            errors: {
                username: null,
                password: null
            },
            disableBtn: false
        }
        this._onTextFieldBlur = this._onTextFieldBlur.bind(this);
        this._formValidation = this._formValidation.bind(this);
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        // fetching user details based on jwtAdminToken
        axios.get('http://localhost:3000/admin/auth/check-auth')
            .then(res => {
                this.props.history.push('/dashboard');
            })
            .catch((error) => {

            })
    }

    handleInputChange = (e) => {
        const { loginData } = this.state;
        const target = e.target;
        const value = target.value;
        const name = target.name;
        loginData[name] = value;
        this.setState({
            loginData: loginData
        })
    }

    _formValidation(fieldsToValidate = [], callback = () => { }) {
        const { loginData } = this.state;
        const allFields = {
            username: {
                message: "Please enter the user name.",
                doValidate: () => {
                    const value = _.trim(_.get(loginData, 'username', ""));
                    if (value.length > 0) {
                        return true;
                    }
                    return false;
                }
            },
            password: {
                message: "Please enter the password.",
                doValidate: () => {
                    const value = _.get(loginData, 'password', '');
                    if (value && value.length > 0) {
                        return true;
                    }
                    return false;
                }
            }
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
            this.setState({ disableBtn: true });
            _.each(errors, (err) => {
                if (err) {
                    isValid = false;
                    this.setState({ disableBtn: false });
                }
            });
            callback(isValid);
        })

    }

    _onTextFieldBlur(e) {
        e.preventDefault();

        let errors = this.state.errors;
        const fieldName = e.target.name;
        let fieldNeedToValidate = [fieldName];
        errors[fieldName] = null;
        this._formValidation(fieldNeedToValidate, (isValid) => {

        });

    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { loginData } = this.state;
        let fieldNeedToValidate = ['username', 'password'];
        this._formValidation(fieldNeedToValidate, (isValid) => {
            if (isValid) {
                this.setState({ disableBtn: true });
                toastr.clear();
                axios.post('http://localhost:3000/admin/auth/login', {
                    username: loginData.username,
                    password: loginData.password,
                }).then((result) => {
                    localStorage.setItem('jwtAdminToken', result.data.token);
                    this.props.history.push('/dashboard');
                }).catch(error => {
                    this.setState({ disableBtn: false });
                    if (error.response.status === 401) {
                        let errorMsg = error.response.data.msg;
                        toastr.error(errorMsg, 'Error!');
                    }
                });
            }
        });

    }



    render() {
        const { error, disableBtn } = this.state;
        return (
            <div className="container">
            <div className="columns  is-centered  " style={{ marginTop: '8%' }}>
                <div className="column is-4 is-desktop">
                    <article className="message is-primary is-hidden-mobile">

                        <div className="message-header">
                            <p>Administrator Login</p>
                        </div>
                        <div className="message-body">
                            <div className="field">
                                <p className="control has-icons-left has-icons-right">
                                    <input className={"input " + (_.get(error, 'username') ? ' is-danger' : '')} type="username" placeholder="username" name="username" onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-user"></i>
                                    </span>
                                </p>
                                <p className="help is-danger">{_.get(error, 'username')}</p>
                            </div>
                            <div className="field">
                                <p className="control has-icons-left">
                                    <input className={"input " + (_.get(error, 'password') ? ' is-danger' : '')} type="password" placeholder="Password" name="password" onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-lock"></i>
                                    </span>
                                </p>
                                <p className="help is-danger">{_.get(error, 'password')}</p>
                            </div>
                            <div className="field">
                                <div className="control" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button className="button is-primary" onClick={this.handleSubmit} disabled={!disableBtn}>
                                        Login
                                </button>
                                    <Link to='/forgot-password' style={{ marginLeft: '0.5rem' }}>Forgotten password?</Link>
                                </div>
                            </div>

                        </div>
                    </article>

                </div>
            </div>
            </div>
        )
    }
}


export default withRouter(Login);