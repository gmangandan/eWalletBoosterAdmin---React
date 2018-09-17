import React, { Component } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import _ from 'lodash';
import toastr from 'toastr';
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {
                _id: '',
                firstName: '',
                username: "",
                email: "",
                password: "",
                cpassword: "",
            },
            errors: {
                firstName: null,
                username: null,
                email: null,
                password: null,
                cpassword: null
            },
            changePass: null
        }
        this._handleCheckBoxChange = this._handleCheckBoxChange.bind(this);
        this._onTextFieldBlur = this._onTextFieldBlur.bind(this);
        this._formValidation = this._formValidation.bind(this);
    }

    componentDidMount = () => {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        axios.get('http://localhost:3000/admin/auth/check-auth')
            .then(res => {
                this.setState({
                    userData: {
                        _id: res.data._id,
                        firstName: res.data.firstName,
                        username: res.data.username,
                        email: res.data.email,
                    }
                })
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
        const { userData, changePass } = this.state;
        let fieldNeedToValidate = [];
        if (changePass) {
            fieldNeedToValidate = ['firstName', 'username', 'email', 'password', 'cpassword'];
        } else {
            fieldNeedToValidate = ['firstName', 'username', 'email'];
        }
        this._formValidation(fieldNeedToValidate, (isValid) => {
            if (isValid) {
                toastr.clear();
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
                axios.post('http://localhost:3000/admin/account/update-myaccount', {
                    userData: userData,
                    changePass: changePass
                }).then((result) => {
                    let sucMsg = result.data.msg;
                    toastr.success(sucMsg, '');
                }).catch(error => {
                    if (error.response.status === 401) {
                        let errorMsg = error.response.data.msg;
                        toastr.error(errorMsg, 'Error!');
                    }
                });
            }
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
        this.setState({
            userData: userData
        })
    }


    render() {

        const { userData, changePass, error } = this.state;
        const passContent = changePass ?
            <div className="field is-grouped">
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
            : null;
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
                                        <li className="is-active"><a >My Account</a></li>
                                    </ul>
                                </nav>
                                
                                        <div className="columns">
                                            <div className="column">
                                                <label className="label">Name</label>
                                                <input className={"input " + (_.get(error, 'firstName') ? ' is-danger' : '')} name="firstName" type="text" placeholder="Name" value={userData.firstName} onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                                <p className="help is-danger">{_.get(error, 'firstName')}</p>
                                            </div>
                                            <div className="column">
                                                <label className="label">Username </label>
                                                <input className={"input " + (_.get(error, 'username') ? ' is-danger' : '')} type="text" name="username" placeholder="Username" value={userData.username} onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                                <p className="help is-danger">{_.get(error, 'username')}</p>
                                            </div>
                                        </div>
                                        <div className="columns">
                                            <div className="column">
                                                <label className="label">E-Mail </label>
                                                <input className={"input " + (_.get(error, 'email') ? ' is-danger' : '')} name="email" type="text" placeholder="Email" value={userData.email} onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                                <p className="help is-danger">{_.get(error, 'email')}</p>
                                            </div>
                                        </div>
                                        <div className="columns ">
                                            <div className="column">
                                                <label className="checkbox">
                                                    <input type="checkbox" value="1" onChange={this._handleCheckBoxChange} /> Change Password?</label>

                                            </div>
                                        </div>
                                        {passContent}
                                        <div className="columns">
                                            <div className="column" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <button onClick={this.handleSubmit} className="button is-primary">Submit </button>
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



export default Dashboard;