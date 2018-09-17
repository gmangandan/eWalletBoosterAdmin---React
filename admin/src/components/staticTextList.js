import React, { Component } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import toastr from 'toastr'
class staticTextList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staticTextList: [],
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
        this.getstaticTextList(1);
    }
    getstaticTextList(page) {
        const { pageLimit, searchKey, searchBy } = this.state;
        this.setState({ loading: true });
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
        let listUrl = 'http://localhost:3000/admin/static/list?pageLimit=' + pageLimit + '&page=' + page;
        if (searchKey) { listUrl += '&searchKey=' + searchKey + '&searchBy=' + searchBy; }
        axios.get(listUrl)
            .then(res => {
                this.setState({
                    staticTextList: res.data.results,
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
        this.getstaticTextList(pageNumber);
    }
    handleSearch(event) {
        event.preventDefault();
        this.getstaticTextList(1);
    }
    resetSearch(event) {
        event.preventDefault();
        document.getElementById('searchForm').reset();
        this.setState({ searchKey: '', searchBy: '' });
        setTimeout(() => { this.getstaticTextList(1); }, 100);
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
        if (window.confirm('Are you sure want to delete ?')) {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtAdminToken');
            axios.post('http://localhost:3000/admin/static/deletestatic', {
                action: action,
                _id: id,
            }).then((result) => {
                let sucMsg = result.data.msg;
                toastr.success(sucMsg, '');
                this.getstaticTextList(activePage);
            }).catch(error => {
                let errorMsg = error.response.data.msg;
                toastr.error(errorMsg, 'Error!');
            });
        }

    }
    render() {
        const { staticTextList, totalRecords, pageLimit, loading } = this.state;
        var thisObj = this;
        let userList = '';
        if (loading) {
            userList = <tr><td colSpan="5" style={{ 'textAlign': 'center' }} ><a className="button is-loading">Loading</a></td></tr>
        } else if (staticTextList.length > 0) {
            var sNo = (pageLimit * (this.state.activePage - 1)) + 1;
            userList = staticTextList.map(function (userRow, i) {
                return <tr key={userRow._id}>
                    <td>{sNo + i}</td>
                    <td>{userRow.static_text_for}</td>
                    <td>{userRow.static_text}</td>
                    <td>{userRow.static_text_min_val}</td>
                    <td>{userRow.static_text_max_val}</td>
                    <td>

                        &nbsp;<Link to={`/manage-text/${userRow._id}`} className='button is-link is-small' ><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Link>
                        &nbsp;<button onClick={thisObj.updateAccount.bind(thisObj, 'Delete', userRow._id)} className='button is-danger is-small' ><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                    </td>
                </tr>
            });
        } else {
            userList = <tr><td colSpan="5" style={{ 'textAlign': 'center' }} >No records found.</td></tr>
        }
        return (
            <div className="container">
                <NavBar />
                <div className="container" >
                    <section className="hero">
                        <div className="hero-body" style={{ 'backgroundColor': 'white' }}>
                            <div >
                                <nav className="breadcrumb is-small" aria-label="breadcrumbs">
                                    <ul>
                                        <li><a>Dashboard</a></li>
                                        <li>
                                            <a  className='navbar-item' >Master Data</a>
                                        </li>
                                        <li className="is-active"><a >Turnover Static Text</a></li>
                                    </ul>
                                </nav>
                                <div className="columns is-mobile is-centered ">
                                    <div className="column ">
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
                                                                <option value="static_text">Text</option>
                                                            </select></div>
                                                    </div>
                                                    <div className="control is-expanded">

                                                        <button onClick={this.handleSearch} className="button is-info">Search </button>
                                                        <a onClick={this.resetSearch.bind(this)} style={{ marginLeft: '0.5rem', margintop: '1rem' }}>Clear</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="columns is-mobile is-centered ">
                                    <div className="column ">
                                        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Text For </th>
                                                    <th>Text</th>
                                                    <th>Min Val </th>
                                                    <th>Max Val </th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userList}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="columns is-mobile is-centered ">
                                    <div className="column is-four-fifths">
                                        <nav className="pagination is-rounded" aria-label="pagination">
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
export default staticTextList;