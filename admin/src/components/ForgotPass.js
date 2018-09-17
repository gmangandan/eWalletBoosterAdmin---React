import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import toastr from 'toastr'
class ForgotPass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            usernameValid: false,
            err: false,
            success: false,
            errors: {
                username: null,

            },
            diableBtn: false
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
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        }, this.validateField(value))
    }

    validateField = (username) => {
        if ((/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(username)) {
            this.setState({
                usernameValid: true
            })
        }
    }

    _formValidation(fieldsToValidate = [], callback = () => { }) {
        const { username } = this.state;

        const allFields = {
            username: {
                message: "Please enter the user name.",
                doValidate: () => {
                    const value = _.trim(username);
                    if (value.length > 0) {
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
            this.setState({ diableBtn: true });
            _.each(errors, (err) => {
                if (err) {
                    isValid = false;
                    this.setState({ diableBtn: false });
                }
            });
            callback(isValid);
        })

    }


    handleSubmit = (e) => {
        e.preventDefault();
        toastr.clear();
        let fieldNeedToValidate = ['username'];
        const { username } = this.state;
        this._formValidation(fieldNeedToValidate, (isValid) => {
            if (isValid) {
                this.setState({ diableBtn: false });
                axios.post('http://localhost:3000/admin/auth/forgot-password', { username })
                    .then((res) => {
                        if (res.data.success) {
                            let successMsg = res.data.msg;
                            toastr.success(successMsg, '');

                            document.getElementById('username').value = '';

                        }
                    })
                    .catch(error => {
                        this.setState({ diableBtn: true });
                        if (error.response.data.success === false) {
                            let errorMsg = error.response.data.msg;
                            toastr.error(errorMsg, 'Error!');
                        }
                    });
            }
        });

    }

    resetState = () => {
        this.props.history.push('/')
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

    render() {
        const { error, diableBtn } = this.state;
        return (
            <div className="container">
            <div className="columns is-centered" style={{ marginTop: '8%' }}>
                <div className="column is-4 is-desktop ">
                    <article className="message is-primary is-hidden-mobile" >
                        <div className="message-header">
                            <p>Forgotten password</p>
                        </div>
                        <div className="message-body">
                            <div>
                                <div className="field">
                                    <p className="control has-icons-left has-icons-right">
                                        <input className={"input " + (_.get(error, 'username') ? ' is-danger' : '')} type="username" placeholder="username" name="username" id="username" onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                        <span className="icon is-small is-left">
                                            <i className="fa fa-user"></i>
                                        </span>
                                    </p>
                                    <p className="help is-danger">{_.get(error, 'username')}</p>
                                </div>
                                <div className="field">
                                    <div className="control" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <button className="button is-primary" onClick={this.handleSubmit} disabled={!diableBtn}>Submit</button>
                                        <Link to='/' style={{ marginLeft: '0.5rem' }}>Login?</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div >
            </div >
        )
    }
}

export default ForgotPass;