import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import toastr from 'toastr';
const qs = require('query-string');

class ResetPass extends Component {



    constructor(props) {
        super(props);
        this.state = {
            password: '',
            passwordConfirm: '',
            token: '',
            success: false,
            formErrors: { password: '', passwordConfirm: '' },
            passwordValid: false,
            passwordConfirmValid: false,
            formValid: false,
            err: false,
            diableBtn: false,
            errors: {
                password: null,
                passwordConfirm: null
            },
        }
        this._onTextFieldBlur = this._onTextFieldBlur.bind(this);
        this._formValidation = this._formValidation.bind(this);
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');

        axios.get('http://localhost:3000/admin/auth/check-auth')
            .then(res => {
                this.props.history.push('/dashboard');
            })
            .catch((error) => {

            })
        this.setState({
            token: qs.parse(this.props.location.search).token
        })
    }

    _formValidation(fieldsToValidate = [], callback = () => { }) {
        const { password, passwordConfirm } = this.state;

        const allFields = {
            password: {
                message: "Please enter the password.",
                doValidate: () => {
                    const value = _.trim(password);
                    if (value.length > 0) {
                        return true;
                    }
                    return false;
                }
            }, passwordConfirm: {
                message: "Confirm password does't match with password.",
                doValidate: () => {
                    const vpassword = _.trim(password);
                    const vcpassword = _.trim(passwordConfirm);
                    if (vpassword.length > 0 && vpassword === vcpassword) {
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

    handleInputChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
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
        toastr.clear();
        let fieldNeedToValidate = ['password', 'passwordConfirm'];
        const { password, token } = this.state;
        this._formValidation(fieldNeedToValidate, (isValid) => {
            if (isValid) {
                axios.post('http://localhost:3000/admin/auth/reset-password', { password, token })
                    .then((res) => {
                        if (res.data.success) {
                            let successMsg = res.data.msg;
                            toastr.success(successMsg, '');
                            this.props.history.push('/');
                        }
                    })
                    .catch(error => {
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

    render() {
        const { error, diableBtn } = this.state;
        return (
            <div className="container">
            <div className="columns is-centered" style={{ marginTop: '8%' }}>
                <div className="column is-4 is-desktop ">
                    <article className="message is-primary is-hidden-mobile" >
                        <div className="message-header">
                            <p>Reset your password</p>
                        </div>
                        <div className="message-body">



                            <div>

                                <div className="field">
                                    <label className="label">Password</label>
                                    <p className="control has-icons-left">
                                        <input className={"input " + (_.get(error, 'password') ? ' is-danger' : '')} type="password" placeholder="Password" name="password" onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                        <span className="icon is-small is-left">
                                            <i className="fa fa-lock"></i>
                                        </span>
                                    </p>
                                    <p className="help is-danger">{_.get(error, 'password')}</p>
                                </div>

                                <div className="field">
                                    <label className="label">Confirm password</label>
                                    <p className="control has-icons-left">
                                        <input className={"input " + (_.get(error, 'passwordConfirm') ? ' is-danger' : '')} type="password" placeholder="Confirm password" name="passwordConfirm" onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                        <span className="icon is-small is-left">
                                            <i className="fa fa-lock"></i>
                                        </span>
                                    </p>
                                    <p className="help is-danger">{_.get(error, 'passwordConfirm')}</p>
                                </div>




                                <div className="field is-grouped">
                                    <div className="control">
                                        <button className="button is-primary" onClick={this.handleSubmit} disabled={!diableBtn}>Submit</button>
                                    </div>
                                    <div className="control">
                                        <button className="button is-text" onClick={this.resetState}>Cancel</button>
                                    </div>
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

export default ResetPass;