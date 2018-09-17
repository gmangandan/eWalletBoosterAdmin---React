import React, { Component } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import _ from 'lodash';
import toastr from 'toastr';
import * as helpers from '../utils/api.queries';
import { Link } from 'react-router-dom';
class staticTextManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staticData: {
                _id: '',
                static_text_for: '',
                static_text_min_val: '',
                static_text_max_val: "",
                static_text: "",
            },
            errors: {
                static_text_for: null,
                static_text_min_val: null,
                static_text_max_val: null,
                static_text: null,
            },
            changePass: null,
            editAction: false,

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
            this.getStaticTextRow(accountid);
        }
    }

    getStaticTextRow(accountid) {

        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        axios.get('http://localhost:3000/admin/static/static-row?_id=' + accountid)
            .then(res => {
                if (res.data.success) {
                    this.setState({ staticData: res.data.results, editAction: true });
                } else {
                    toastr.error('Invalid URI', 'Error!');
                    this.props.history.push('/text-list');
                }

            })
            .catch((error) => {
                if (error) {
                    this.props.history.push('/');
                }
            })
    }

    _formValidation(fieldsToValidate = [], callback = () => { }) {
        const { staticData } = this.state;
        const allFields = {
            static_text_for: {
                message: "Please select text for.",
                doValidate: () => {
                    const value = _.trim(_.get(staticData, 'static_text_for', ""));
                    if (value.length > 0) {
                        return true;
                    }
                    return false;
                }
            },
            static_text_min_val: {
                message: "Please select min value.",
                doValidate: () => {
                    const value = _.trim(_.get(staticData, 'static_text_min_val', ""));
                    if (value.length > 0) {
                        return true;
                    }
                    return false;
                }
            },
            static_text_max_val: {
                message: "Please select max value.",
                doValidate: () => {
                    const value = _.trim(_.get(staticData, 'static_text_max_val', ""));
                    if (value.length > 0) {
                        return true;
                    }
                    return false;
                }
            }
            , static_text: {
                message: "Please enter valid static_text.",
                doValidate: () => {
                    const value = _.trim(_.get(staticData, 'static_text', ""));
                    if (value.length > 0) {
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
        const { editAction } = this.state;
        let fieldNeedToValidate = ['static_text_for', 'static_text_max_val', 'static_text', 'static_text_min_val'];
        this._formValidation(fieldNeedToValidate, (isValid) => {
            if (isValid) {
                toastr.clear();
                !editAction ? this.createstaticText() : this.updatestaticText();
            }
        });
    }
    createstaticText() {
        const { staticData } = this.state;
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        axios.post('http://localhost:3000/admin/static/create', {
            staticData: staticData,
        }).then((result) => {
            let sucMsg = result.data.msg;
            toastr.success(sucMsg, '');
            this.props.history.push('/text-list');
        }).catch(error => {
            let errorMsg = error.response.data.msg;
            toastr.error(errorMsg, 'Error!');
        });
    }
    updatestaticText() {
        const { staticData, changePass } = this.state;
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        axios.post('http://localhost:3000/admin/static/updatestatic', {
            staticData: staticData,
            changePass: changePass
        }).then((result) => {
            let sucMsg = result.data.msg;
            toastr.success(sucMsg, '');
            this.props.history.push('/text-list');
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
        const { staticData } = this.state;
        const target = e.target;
        const value = target.value;
        const name = target.name;
        staticData[name] = value;
        console.log('name', value);
        this.setState({
            staticData: staticData
        })
    }

    handleOptionValue = (value) => {
        console.log('value', value);
        var textRange = [];

        for (var i = 0; i <= 250000; i += 1000) {
            var selected = value === i ? 'selected' : '';
            textRange.push(<option selected={selected} value={i}>{i}</option>);
        }
        return (textRange)
    }


    render() {

        const { staticData, error } = this.state;



        return (
            <div className='container'>
                <NavBar />
                <div className="container" >
                    <section className="hero">
                        <div className="hero-body" style={{ 'backgroundColor': 'white' }}>
                            <div >
                                <nav className="breadcrumb is-small" aria-label="breadcrumbs">
                                    <ul>
                                        <li><a>Dashboard</a></li>
                                        <li>
                                            <Link to='/text-list' className='navbar-item' >Master Data</Link>
                                        </li>
                                        <li className="is-active"><a >Manage Turnover Static Text</a></li>
                                    </ul>
                                </nav>
                                <div className="columns is-desktop is-centered ">
                                    <div className="column">
                                        <div className="field is-grouped">
                                            <div className="control is-expanded">
                                                <label className="label">Text </label>
                                                <input className={"input " + (_.get(error, 'static_text') ? ' is-danger' : '')} name="static_text" type="text" placeholder="static_text" value={staticData.static_text} onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                                <p className="help is-danger">{_.get(error, 'static_text')}</p>
                                            </div>

                                        </div>
                                        <div className="field is-grouped">
                                            <div className="control">
                                                <div className="control  has-icons-right is-expanded"  >
                                                    <label className="label">Text For </label>
                                                    <div className={"select " + (_.get(error, 'static_text_for') ? ' is-danger' : '')} style={{ 'width': 450 }}>
                                                        <select name="static_text_for" style={{ 'width': 450 }}
                                                            data-validate="require"
                                                            onChange={this.handleInputChange}>
                                                            <option>Select Brand</option>
                                                            <option selected={`${staticData.static_text_for === 'Skrill' ? 'selected' : ''}`} value="Skrill">Skrill</option>
                                                            <option selected={`${staticData.static_text_for === 'Neteller' ? 'selected' : ''}`} value="Neteller">Neteller</option>
                                                            <option selected={`${staticData.static_text_for === 'Ecopayz' ? 'selected' : ''}`} value="Ecopayz">Ecopayz</option>
                                                        </select>
                                                        
                                                    </div>
                                                    <p className="help is-danger">{_.get(error, 'static_text_for')}</p>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="field is-grouped">
                                            <div className="control">
                                                <div className="control    has-icons-right ">
                                                    <label className="label">Min Value</label>
                                                    <div className={"select " + (_.get(error, 'static_text_min_val') ? ' is-danger' : '')} style={{ 'width': 450 }}>
                                                        <select name="static_text_min_val"
                                                            data-validate="require" style={{ 'width': 450 }}
                                                            onChange={this.handleInputChange}>
                                                            <option>Select Min Value</option>
                                                            {this.handleOptionValue(staticData.static_text_min_val)}
                                                        </select>
                                                         
                                                    </div>
                                                    <p className="help is-danger">{_.get(error, 'static_text_min_val')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="field is-grouped">
                                            <div className="control">
                                                <div className="control  has-icons-right">
                                                    <label className="label">Max Value </label>
                                                    <div className={"select " + (_.get(error, 'static_text_max_val') ? ' is-danger' : '')} style={{ 'width': 450 }}>
                                                        <select name="static_text_max_val"
                                                            data-validate="require" style={{ 'width': 450 }}
                                                            onChange={this.handleInputChange}>
                                                            <option>Select Max Value</option>
                                                            {this.handleOptionValue(staticData.static_text_max_val)}
                                                        </select>
                                                        
                                                    </div>
                                                    <p className="help is-danger">{_.get(error, 'static_text_max_val')}</p>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="field is-grouped">
                                        </div>
                                        <div className="field is-grouped">
                                            <div className="control" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <button onClick={this.handleSubmit} className="button is-info">Submit </button>
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



export default staticTextManager;