import React, { Component } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import toastr from 'toastr'
class UserApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userAccounts: [],
            activePage: 1,
            totalRecords: 0,
            pageLimit: 20,
            loading: false,
            searchKey: '',
            searchBy: ''
        }
        this.handleSearch = this.handleSearch.bind(this);
    }
    componentDidMount = () => {
        this.getApplicationlist(1);
    }
    getApplicationlist(page) {
        const { pageLimit, searchKey, searchBy } = this.state;
        this.setState({ loading: true });
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        let listUrl = 'http://localhost:3000/admin/users/applications?pageLimit=' + pageLimit + '&page=' + page;
        if (searchKey) { listUrl += '&searchKey=' + searchKey + '&searchBy=' + searchBy; }
        axios.get(listUrl)
            .then(res => {
                this.setState({
                    userAccounts: res.data.results,
                    totalRecords: res.data.totalCount,
                    loading: false
                });
            }).catch((error) => {
                this.setState({ loading: false });
                if (error) { this.props.history.push('/'); }
            })
    }
    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber });
        this.getApplicationlist(pageNumber);
    }
    handleSearch(event) {
        event.preventDefault();
        this.getApplicationlist(1);
    }
    resetSearch(event) {
        event.preventDefault();
        document.getElementById('searchForm').reset();
        this.setState({ searchKey: '', searchBy: '' });
        setTimeout(() => { this.getApplicationlist(1); }, 100);
    }
    handleInputChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        })
    }
    updateAccount(action, id, e) {
        const { activePage } = this.state;
        if (window.confirm('Are you sure want to ' + action + ' this application?')) {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
            axios.post('http://localhost:3000/admin/users/updateapplication', {
                action: action,
                _id: id,
            }).then((result) => {
                let sucMsg = result.data.msg;
                toastr.success(sucMsg, '');
                this.getApplicationlist(activePage);
            }).catch(error => {
                let errorMsg = error.response.data.msg;
                toastr.error(errorMsg, 'Error!');
            });
        }

    }
    render() {
        const { userAccounts, totalRecords, pageLimit, loading } = this.state;
        var thisObj = this;
        let userList = '';
        if (loading) {
            userList = <tr><td colSpan="9" style={{ 'textAlign': 'center' }} ><a className="button is-loading">Loading</a></td></tr>
        } else if (userAccounts.length > 0) {
            var sNo = (pageLimit * (this.state.activePage - 1)) + 1;
            userList = userAccounts.map(function (userRow, i) {
                let tagClassName = (userRow.status === 'Pending' ? 'is-warning' : (userRow.status === 'Confirmed') ? 'is-success' : 'is-danger');
                let statusText = (userRow.status === 'Pending' ? 'Awaiting' : (userRow.status === 'Confirmed') ? 'Approved' : 'Declined');
                return <tr key={userRow._id}>
                    <td>{sNo + i}</td>
                    <td>{userRow.brand} ({userRow.linked ? 'Existing' : 'New'})</td>
                    <td>{userRow.firstName} {userRow.lastName}</td>
                    <td>{userRow.accountEmailAddress}</td>
                    <td>{userRow.accountId}<span className="help ">({userRow.accountCurrency})</span></td>
                    <td>{userRow.timestamp.slice(0, 10)}</td>
                    <td><span class={`tag ${tagClassName}`}>{statusText}</span></td>
                    <td>
                        {
                            userRow.status === 'Pending' ?
                                <span>
                                    <button onClick={thisObj.updateAccount.bind(thisObj, 'approve', userRow._id)} className='button is-info is-small' ><i class="fa fa-thumbs-up" aria-hidden="true"></i></button>
                                    &nbsp;<button onClick={thisObj.updateAccount.bind(thisObj, 'decline', userRow._id)} className='button is-link is-small' ><i class="fa fa-thumbs-down" aria-hidden="true"></i></button>
                                </span>
                                : ''
                        }
                        &nbsp;<button onClick={thisObj.updateAccount.bind(thisObj, 'delete', userRow._id)} className='button is-danger is-small' ><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                    </td>
                </tr>
            });
        } else {
            userList = <tr><td colSpan="9" style={{ 'textAlign': 'center' }} >No records found.</td></tr>
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
                                        <li><Link to='/user-accounts' className='navbar-item' >User Accounts</Link></li>
                                        <li className="is-active"><a >Turnover Registration Request</a></li>
                                    </ul>
                                </nav>
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
                                                                <option value="firstName">First Name</option>
                                                                <option value="lastName">Last Name</option>
                                                                <option value="accountEmailAddress">Email</option>
                                                                <option value="brand">Scheme</option>
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
                                                    <th>Scheme</th>
                                                    <th>User Name</th>
                                                    <th>Email</th>
                                                    <th>Account Id</th>
                                                    <th>Created</th>
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
                                        <nav className="pagination is-centered " aria-label="pagination">
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
export default UserApplications;