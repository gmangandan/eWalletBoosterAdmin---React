import React, { Component } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import Pagination from "react-js-pagination";
import toastr from 'toastr'
import * as helpers from '../utils/api.queries';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
class payoutList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payoutList: [],
            activePage: 1,
            totalRecords: 0,
            pageLimit: 20,
            loading: false,
            searchKey: '',
            searchBy: '',
            status: '',
            reason:'',
            open: false,
            _id: '',
            userId: '',
            scheme: helpers.formatBrandName(this.props.match.params.scheme)
        }
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount = () => {
        this.getCashbackslist(1);
    }
    componentWillReceiveProps(nextProps) {
        document.getElementById('searchForm').reset();
        this.setState({ scheme: helpers.formatBrandName(nextProps.match.params.scheme), searchKey: '', searchBy: '', status: '' });
        setTimeout(() => { this.getCashbackslist(1); }, 100);
    }
    getCashbackslist(page) {
        const { pageLimit, searchKey, searchBy, status } = this.state;
        this.setState({ loading: true });
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        let listUrl = 'http://localhost:3000/admin/payout/list?pageLimit=' + pageLimit + '&page=' + page + '&scheme=' + this.state.scheme;
        if (searchKey) { listUrl += '&searchKey=' + searchKey + '&searchBy=' + searchBy; }
        if (status) { listUrl += '&status=' + status; }
        axios.get(listUrl)
            .then(res => {
                this.setState({
                    payoutList: res.data.results,
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
        this.getCashbackslist(pageNumber);
    }
    handleSearch(event) {
        event.preventDefault();
        this.getCashbackslist(1);
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

    handleRejectPayout(e) {
        e.preventDefault();

        const { activePage ,_id,userId,reason} = this.state;
        if (window.confirm('Are you sure want to reject the cashback?')) {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
            axios.post('http://localhost:3000/admin/payout/reject', {
                userid: userId,
                _id: _id,
                reason:reason
            }).then((result) => {
                this.setState({ _id: '', userId: '', open: false });
                let sucMsg = result.data.msg;
                toastr.success(sucMsg, '');
                this.getCashbackslist(activePage);
            }).catch(error => {
                let errorMsg = error.response.data.msg;
                toastr.error(errorMsg, 'Error!');
            });
        }
    }

    onOpenModal(id, userId, e) {
        e.preventDefault();
        this.setState({ _id: id, userId: userId, open: true });
    }
    onCloseModal(e) {
        e.preventDefault();
        this.setState({ _id: '', userId: '', open: false });
    }
    render() {


        const { payoutList, totalRecords, pageLimit, loading, open, error } = this.state;

        var thisObj = this;
        let userList = '';
        if (loading) {
            userList = <tr><td colSpan="8" style={{ 'textAlign': 'center' }} ><a className="button is-loading">Loading</a></td></tr>
        } else if (payoutList.length > 0) {
            var sNo = (pageLimit * (this.state.activePage - 1)) + 1;
            userList = payoutList.map(function (cashbackRow, i) {
                let tagClassName = (cashbackRow.status === 'Rejected' ? ' is-danger' : (cashbackRow.status === 'Paid') ? 'is-success' : 'is-warning');

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
                            cashbackRow.status === 'Requested' && cashbackRow.belongsToUser ?
                                <div>  <Link to={`/manage-payout/${cashbackRow._id}`} className='button is-info is-small' ><i className="fa fa-thumbs-up" aria-hidden="true"></i></Link>
                                    &nbsp; <button onClick={thisObj.onOpenModal.bind(thisObj, cashbackRow._id, cashbackRow.belongsToUser)} className='button is-link is-small' ><i className="fa fa-thumbs-down" aria-hidden="true"></i></button>
                                </div>
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

                <Modal open={open} onClose={this.onCloseModal.bind(this)} center>
                    <div className="columns is-mobile is-centered ">
                        <div className="column">
                            <div className="field is-grouped">
                                <div className="control is-expanded">
                                    <label className="label">Reject Reason</label>
                                    <textarea className="textarea " rows="8" cols="57" name="reason" placeholder="Reason"  onChange={this.handleInputChange} onKeyUp={this._onTextFieldBlur} onBlur={this._onTextFieldBlur} />
                                </div>



                            </div>
                            <div className="field is-grouped">
                                <div className="control" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button onClick={this.handleRejectPayout.bind(this)} className="button is-info">Submit </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </Modal>
                <NavBar />
                <div className="container">
                    <section className="hero">
                        <div className="hero-body" style={{ 'backgroundColor': 'white' }}>
                            <div>
                                <nav className="breadcrumb is-small" aria-label="breadcrumbs">
                                    <ul>
                                        <li><a>Dashboard</a></li>
                                        <li><a>Cashback Payouts</a></li>
                                        <li className="is-active"><a >{this.state.scheme} Payouts</a></li>
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
                                                                <option value="account.accountId">Account Id</option>
                                                            </select></div>
                                                    </div>
                                                    <div className="control is-expanded">

                                                        <div className="select">
                                                            <select name="status"
                                                                onChange={this.handleInputChange}>
                                                                <option>Filter By Status</option>

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
export default payoutList;