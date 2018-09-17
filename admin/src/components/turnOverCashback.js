import React, { Component } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import Pagination from "react-js-pagination";
import toastr from 'toastr'
import _ from 'lodash';
import * as helpers from '../utils/api.queries';
class turnOverCashback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            turnOverCashback: [],
            activePage: 1,
            totalRecords: 0,
            pageLimit: 20,
            loading: false,
            searchKey: '',
            searchBy: '',
            status: '',
            uploadFile: '',
            scheme: helpers.formatBrandName(this.props.match.params.scheme),
            totalAmount: 0,
            totalPaidAmount: 0,
            totalUsers: 0,
            errors: {
                uploadFile: null,

            },
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this._formValidation = this._formValidation.bind(this);
    }
 
    componentDidMount = () => {
        this.getCashbackslist(1);
    }
    componentWillReceiveProps(nextProps) {
        document.getElementById('searchForm').reset();
        this.setState({ scheme: helpers.formatBrandName(nextProps.match.params.scheme), searchKey: '', searchBy: '', status: '', uploadFile: '' });
        setTimeout(() => { this.getCashbackslist(1); }, 100);
    }
    _formValidation(fieldsToValidate = [], callback = () => { }) {
        const { uploadFile } = this.state;


        const allFields = {
            uploadFile: {
                message: "Please select valid file (.csv).",
                doValidate: () => {
                    const value = _.trim(uploadFile);
                    const emailValid = /(\.csv)$/i.test(value);
                    if (emailValid) {
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
    getCashbackslist(page) {
        const { pageLimit, searchKey, searchBy, status } = this.state;
        this.setState({ loading: true });
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        let listUrl = 'http://localhost:3000/admin/cashback/list?pageLimit=' + pageLimit + '&page=' + page + '&scheme=' + this.state.scheme;
        if (searchKey) { listUrl += '&searchKey=' + searchKey + '&searchBy=' + searchBy; }
        if (status) { listUrl += '&status=' + status; }
        axios.get(listUrl)
            .then(res => {
                this.setState({
                    turnOverCashback: res.data.results,
                    totalRecords: res.data.totalCount,
                    totalAmount: res.data.totalSum.length>0?res.data.totalSum[0].sum.toFixed(2):0,
                    totalPaidAmount: res.data.totalPaidSum.length>0?res.data.totalPaidSum[0].sum.toFixed(2):0,
                    totalUsers:res.data.totalUsers.length>0?res.data.totalUsers[0].sum:0,
                    loading: false
                });
            }).catch((error) => {
                this.setState({ loading: false });
                if (error) { this.props.history.push('/'); }
            });
    }
    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber });
        this.getCashbackslist(pageNumber);
    }
    handleSearch(event) {
        event.preventDefault();
        this.getCashbackslist(1);
    }

    handleUpload(event) {
        event.preventDefault();
        let fieldNeedToValidate = ['uploadFile'];
        this._formValidation(fieldNeedToValidate, (isValid) => {
            console.log(';isValid', isValid);
            if (isValid) {
                const data = new FormData();
                const tragetFile = document.getElementById('uploadFile').files[0];
                data.append('file', tragetFile);
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
                axios.post('http://localhost:3000/admin/cashback/upload', data).then((result) => {
                    let sucMsg = result.data.message;
                    this.setState({ uploadFile: '' });
                    if (result.data.success) {
                        toastr.success(sucMsg, '');
                        setTimeout(() => { this.getCashbackslist(1); }, 300);
                    } else toastr.error(sucMsg, 'Error!');
                }).catch(error => {
                    let errorMsg = error.response.data.msg;
                    toastr.error(errorMsg, 'Error!');
                });
            }
        });

    }
    resetSearch(event) {
        event.preventDefault();
        document.getElementById('searchForm').reset();
        this.setState({ searchKey: '', searchBy: '', status: '' });
        setTimeout(() => { this.getCashbackslist(1); }, 100);
    }
    handleInputChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        })
    }

    handleConfirmCashback(id, userId, e) {
        e.preventDefault();

        const { activePage } = this.state;
        if (window.confirm('Are you sure want to confirm the cashback?')) {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
            axios.post('http://localhost:3000/admin/cashback/confirm', {
                userid: userId,
                _id: id,
            }).then((result) => {
                let sucMsg = result.data.msg;
                toastr.success(sucMsg, '');
                this.getCashbackslist(activePage);
            }).catch(error => {
                let errorMsg = error.response.data.msg;
                toastr.error(errorMsg, 'Error!');
            });
        }
    }
    render() {


        const { turnOverCashback, totalRecords, pageLimit, loading, error,totalAmount,totalPaidAmount,totalUsers } = this.state;

        var thisObj = this;
        let userList = '';
        if (loading) {
            userList = <tr><td colSpan="8" style={{ 'textAlign': 'center' }} ><a className="button is-loading">Loading</a></td></tr>
        } else if (turnOverCashback.length > 0) {
            var sNo = (pageLimit * (this.state.activePage - 1)) + 1;
            userList = turnOverCashback.map(function (cashbackRow, i) {
                let tagClassName = (cashbackRow.status === 'Pending' ? ' is-danger' : (cashbackRow.status === 'Paid') ? 'is-success' : 'is-warning');

                return <tr key={cashbackRow._id}>
                    <td>{sNo + i}</td>
                    <td>{cashbackRow.account.accountId}</td>
                    <td>{cashbackRow.account.transValue}</td>
                    <td>{cashbackRow.account.commission}</td>
                    <td>{cashbackRow.account.cashback}</td>
                    <td>{cashbackRow.account.cashbackRate}</td>
                    <td>
                        <span className={`tag ${tagClassName}`}>{cashbackRow.status}</span>
                    </td>
                    <td>
                        {
                            cashbackRow.status === 'Pending' && cashbackRow.belongsToUser ?
                                <a  className='button is-info is-small' onClick={thisObj.handleConfirmCashback.bind(thisObj, cashbackRow._id, cashbackRow.belongsToUser)}>Confirm</a>
                                : ''
                        }
                    </td>
                </tr>
            });
        } else {
            userList = <tr><td colSpan="8" style={{ 'textAlign': 'center' }} >No records found.</td></tr>
        }
        return (
            <div className="container">
                <NavBar />
                <div className="container">
                    <section className="hero">
                        <div className="hero-body" style={{ 'backgroundColor': 'white' }}>
                            <div>
                                <nav className="breadcrumb is-small" aria-label="breadcrumbs">
                                    <ul>
                                        <li><a>Dashboard</a></li>
                                        <li><a>Turnover Cashback</a></li>
                                        <li className="is-active"><a >{this.state.scheme} Cashbacks</a></li>
                                    </ul>
                                </nav>
                                <div className="columns is-mobile is-centered ">
                                    <div className="column">
                                        <div className="card">
                                            <footer className="card-footer">
                                                <span className="card-footer-item">Current Balance {totalAmount}  </span>
                                                <span className="card-footer-item">Paid Amount {totalPaidAmount}</span>
                                                <span className="card-footer-item">Total Users {totalUsers}</span>
                                            </footer>
                                        </div>
                                    </div>
                                </div>
                                {
                                    this.state.scheme === 'Ecopayz' ?

                                    <div className="columns is-mobile is-centered ">
                                        <div className="column">
                                            <form id="searchForm">
                                                <div>
                                                    <div className="field is-grouped">
                                                        <div className="file is-small has-name">
                                                            <label className="file-label">
                                                                <input className="file-input" type="file" name="uploadFile" id="uploadFile" onChange={this.handleInputChange} />
                                                              
                                                                <span className="file-cta">
                                                                    <span className="file-icon">
                                                                        <i className="fa fa-upload"></i>
                                                                    </span>
                                                                    <span className="file-label">
                                                                        {
                                                                            this.state.uploadFile ? this.state.uploadFile : 'Select CSV to upload'
                                                                        }
                                                                    </span>
                                                                </span>
                                                                
                                                            </label>
                                                            
                                                        </div>
                                                        <div className="control">
                                                            <button onClick={this.handleUpload} className="button is-primary is-small">Upload </button>
                                                        </div>
                                                        <p style={{"textAlign":'left'}} className="help is-danger">{_.get(error, 'uploadFile')}</p>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    :''

                                }
                                <div className="columns is-mobile is-centered ">
                                    <div className="column">
                                        <form id="searchForm">
                                            <div className="panel-block">
                                                <div className="field is-grouped">
                                                    <div className="control is-expanded">

                                                        <input className="input" type="text" name="searchKey" placeholder="Search Key" onChange={this.handleInputChange} />
                                                    </div>
                                                    <div className="control is-expanded">

                                                        <div className="select">
                                                            <select name="searchBy"
                                                                onChange={this.handleInputChange}>
                                                                <option>Search By</option>
                                                                <option value="account.accountId">Account Id</option>
                                                            </select></div>
                                                    </div>
                                                    <div className="control is-expanded">

                                                        <div className="select">
                                                            <select name="status"
                                                                onChange={this.handleInputChange}>
                                                                <option>Filter By Status</option>
                                                                <option value="Pending">Pending</option>
                                                                <option value="Confirmed">Confirmed</option>
                                                                <option value="Requested">Requested</option>
                                                                <option value="Paid">Paid</option>
                                                            </select></div>
                                                    </div>
                                                    <div className="control is-expanded">

                                                        <button onClick={this.handleSearch} className="button is-primary" style={{ verticalAlign: 'middle'}}>Search </button>
                                                        <a onClick={this.resetSearch.bind(this)} style={{ marginLeft: '0.5rem' }}>Clear</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="columns is-mobile is-centered ">
                                    <div className="column">
                                        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Account Id</th>
                                                    <th>Transfers</th>
                                                    <th>Commission</th>
                                                    <th>Cashback</th>
                                                    <th>Cashback Rate</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userList}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="columns is-mobile">
                                    <div className="column">
                                        <nav className="pagination is-centered"  aria-label="pagination">
                                            <Pagination
                                                innerClass="pagination-list"
                                                linkClass="pagination-link"
                                                activeLinkClass="is-current"
                                                activePage={this.state.activePage}
                                                itemsCountPerPage={pageLimit}
                                                totalItemsCount={totalRecords}
                                                pageRangeDisplayed={5}
                                                onChange={this.handlePageChange.bind(this)}
                                            />
                                        </nav>
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
export default turnOverCashback;