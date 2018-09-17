import React, {Component} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {isLoggedIn} from '../utils/AuthService';


class NavBar extends Component {

    state = {
        active: true
    }

    toggleClass = () => {        
        this.setState({
            active: !this.state.active
        })
    }

    logout = () => {        
        localStorage.removeItem('jwtToken');
        window.location.reload();
    }

    render () {

        const activeStyle = {
            backgroundColor: '#80CED7',
            color: 'white'
        }
        return (
            <div className='navbar' style={{marginBottom: '1rem'}}>
                <div className='container is-flex-tablet' style={{padding: '1rem'}}>
                <div className='navbar-brand' role="navigation" aria-label="main navigation">                    
                    <img src={require('../assets/images/logo.png')} alt="eWalletBooster" style={{height: '100%'}} />
                    
                    <div role="button" className={this.state.active ? 'navbar-burger' : 'navbar-burger is-active'} onClick={this.toggleClass} aria-label="menu" aria-expanded="false" data-target='navMobile'>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>                        
                    </div>          
                </div> 


                <div className={this.state.active ? 'navbar-menu': 'navbar-menu is-active'}>             
                    <div className='navbar-end'>

                                 
                        <div className='navbar-item has-dropdown is-hoverable' >
                            <NavLink to='/skrill/cashback' className='navbar-link' style={{margin: 'auto', borderRadius: 4}} activeStyle={activeStyle}><img className='is-hidden-desktop is-hidden-widescreen is-hidden-tablet' src={require('../assets/images/skrill.svg')} alt="eWalletBooster"/><span className='is-hidden-mobile'>Skrill</span></NavLink>
                            <div className='navbar-dropdown is-hidden-mobile'>
                                <Link to='/skrill/cashback' className='navbar-item' >Cashback</Link>
                                <Link to='/skrill/review' className='navbar-item'>Review</Link>
                                <Link to='/skrill/registration' className='navbar-item'>Registration</Link>
                            </div>
                        </div>
                        <div className='navbar-item has-dropdown is-hoverable'>
                            <NavLink to='/neteller/cashback' className='navbar-link' style={{margin: 'auto', borderRadius: 4}} activeStyle={activeStyle}><img className='is-hidden-desktop is-hidden-widescreen is-hidden-tablet' src={require('../assets/images/neteller.png')} alt="eWalletBooster"/><span className='is-hidden-mobile'>Neteller</span></NavLink>
                                <div className='navbar-dropdown is-info is-hidden-mobile '>
                                    <Link to='/neteller/cashback' className='navbar-item is-info'>Cashback</Link>
                                    <Link to='/neteller/review' className='navbar-item'>Review</Link>
                                    <Link to='/neteller/registration' className='navbar-item'>Registration</Link>
                                </div>
                        </div>
                        <div className='navbar-item has-dropdown is-hoverable'>
                            <NavLink to='/ecopayz/cashback' className='navbar-link' style={{margin: 'auto', borderRadius: 4}} activeStyle={activeStyle}><img className='is-hidden-desktop is-hidden-widescreen is-hidden-tablet' src={require('../assets/images/ecopayz.png')} alt="eWalletBooster"/><span className='is-hidden-mobile'>Ecopayz</span></NavLink>
                                <div className='navbar-dropdown is-hidden-mobile'>
                                    <Link to='/ecopayz/cashback' className='navbar-item'>Cashback</Link>
                                    <Link to='/ecopayz/review' className='navbar-item'>Review</Link>
                                    <Link to='/ecopayz/registration' className='navbar-item'>Registration</Link>
                                </div>
                        </div>  
                    
                    <div style={{display: 'flex', justifyContent: 'space-around'}} >
                        <div className='navbar-item'>        
                            <span>
                                {
                                    isLoggedIn() ?  
                                    <button className="button is-link" onClick={this.logout}>Log out</button>  
                                    :
                                    <button className="button is-link"><Link to='/login' style={{color: 'white'}}>Login</Link></button>
                                }
                            </span>                            
                        </div>  
                        <div className='navbar-item'>                            
                            <span>
                            {
                                isLoggedIn() === false ? 
                                <button className='button is-info'><Link to='/register' style={{color: 'white'}}>Register</Link></button>
                                :
                                <button className='button is-info'><Link to='/profile' style={{color: 'white'}}>Profile</Link></button>
                            }
                            </span>
                        </div>   
                        <div className='navbar-item'>                            
                            <span>
                            <button className='button is-primary'><Link to='/contact' style={{color: 'white'}}>Contact</Link></button>
                            </span>
                        </div>    
                    </div>                     
                    </div>
                </div> 
                </div>
            </div>            
        ) 
    }
}


export default NavBar;

