import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class NavBar extends Component {

    logout = () => {
        localStorage.removeItem('jwtAdminToken');
        window.location.reload();
    }
    render() {

        return (
            <div>
                <nav className="navbar is-link">
                    <div className="navbar-brand" >
                        <img src={require('../assets/images/ewb-logo.jpg')} alt="eWalletBooster" style={{ height: '100%' }} />
                        <div class="navbar-burger burger" data-target="navbarExampleTransparentExample">
                        <span></span>
                        <span></span>
                        <span></span>
                        </div>
                    </div>
                    <div className="navbar-menu" id="navbarExampleTransparentExample">
                    <div className="navbar-end">
                            <div className="navbar-item has-dropdown is-hoverable">
                                <a className="navbar-link">Users</a>
                                <div className="navbar-dropdown">
                                    <Link to='/manage-user' className='navbar-item' >Add New User</Link>
                                    <Link to='/user-accounts' className='navbar-item' >Users Accounts</Link>
                                    <Link to='/user-applications' className='navbar-item' >Turnover Registration Request</Link>
                                </div>
                            </div>
                            <div className="navbar-item has-dropdown is-hoverable">
                                <a className="navbar-link">Turnover Cashback</a>
                                <div className="navbar-dropdown">
                                    <Link to='/turn-over-cashback/skrill' className='navbar-item' >Skrill Cashback</Link>
                                    <Link to='/turn-over-cashback/neteller' className='navbar-item' >Neteller Cashback</Link>
                                    <Link to='/turn-over-cashback/ecopayz' className='navbar-item' >Ecopayz Cashback</Link>
                                </div>
                            </div>
                            <div className="navbar-item has-dropdown is-hoverable">
                                <a className="navbar-link">Cashback Payouts</a>
                                <div className="navbar-dropdown">
                                    <Link to='/payout/skrill' className='navbar-item' >Skrill Cashback Payouts</Link>
                                    <Link to='/payout/neteller' className='navbar-item' >Neteller Cashback Payouts</Link>
                                    <Link to='/payout/ecopayz' className='navbar-item' >Ecopayz Cashback Payouts</Link>
                                </div>
                            </div>
                            <div className="navbar-item has-dropdown is-hoverable">
                                <a className="navbar-link">Master Data</a>
                                <div className="navbar-dropdown">
                                    <Link to='/manage-text' className='navbar-item' >Add Turnover Static Text</Link>
                                    <Link to='/text-list' className='navbar-item' >Turnover Static Text List</Link>

                                </div>
                            </div>
                        
                        
                            <div className="navbar-item">
                                <div className="field is-grouped">
                                    <p className="control">
                                        <Link to='/dashboard' className="button is-primary is-rounded" >
                                            <span className="icon is-small">
                                                <i className={`fa fa-user`} ></i>
                                            </span>
                                        </Link>
                                    </p>
                                    <p className="control">
                                        <button className="button is-primary is-rounded" onClick={this.logout}>
                                            <span className="icon is-small">
                                                <i className={`fa fa-sign-out`} ></i>
                                            </span>
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>


            </div>
        )
    }
}


export default NavBar;

