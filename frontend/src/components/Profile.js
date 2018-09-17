import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import axios from 'axios';
import {Hero} from './Hero';
import ProfileSettings from './ProfileSettings';
import Tabs from './Tabs';
import Applications from './Applications';
import Accounts from './Accounts';
import ProfileHome from './ProfileHome';
import Payout from './Payout';
import ProfileContact from './ProfileContact';

class Profile extends Component {
    state = {
        id: '',
        email: '',
        firstName: '',
        lastName: ''
    }

    componentDidMount = () => {        
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        // fetching user details based on jwtToken
        axios.get('http://localhost:3000/api/users')
        .then(res => {
            this.setState({
                id: res.data.user._id,
                email: res.data.user.email,
                firstName: res.data.user.firstName,
                lastName: res.data.user.lastName
            })
        })
        .catch((error) => {
            if(error) {               
                this.props.history.push('/login');
            }            
        })
    }

    logout = () => {       
        localStorage.removeItem('jwtToken');
        window.location.reload();
    }

    render () {
        const userProps = {};
        userProps.firstName = this.state.firstName;
        userProps.lastName = this.state.lastName;
        userProps.email = this.state.email;
        userProps.id = this.state.id;
      
        return (
            <div className='container'>                
                <Hero title='eWalletBooster' subtitle={'Dashboard'} color={'is-info'} />
                <Tabs id={this.state.id.slice(0,6)} />
                {/* // need to arraange components and routes for the dashboard sections */}
                <Switch> 
                    <Route 
                    exact path={this.props.match.url}
                    render={(props) => <ProfileHome {...props} email={userProps.email} />} 
                    />   
                    <Route 
                    path={`${this.props.match.url}/settings`}
                    render={(props) => <ProfileSettings {...props} props={userProps} />} 
                    />    
                    <Route 
                    path={`${this.props.match.url}/payout`}
                    render={(props) => <Payout {...props} props={userProps} />} 
                    />  
                    <Route 
                    path={`${this.props.match.url}/applications`} 
                    component={Applications}
                    />  
                    <Route 
                    path={`${this.props.match.url}/accounts`}
                    render={(props) => <Accounts {...props} props={userProps} />} 
                    /> 
                    <Route path='/profile/raf'/>    
                    <Route 
                    path={`${this.props.match.url}/contact`}
                    render={(props) => <ProfileContact {...props} props={userProps} />} 
                    /> 
                </Switch>               
                
            </div>
        )
    }
}



export default Profile;