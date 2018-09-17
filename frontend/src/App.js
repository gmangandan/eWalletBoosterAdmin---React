import React, { Component } from 'react';
import {Route, Switch, Link} from 'react-router-dom';
import 'bulma';
import 'bulma/css/bulma.css';
import 'bulma-steps/dist/css/bulma-steps.min.css';
import 'bulma-steps/dist/css/bulma-steps.sass';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import NavBar from './components/NavBar';
import {Brand} from './components/Brand';
import {Footer} from './components/Footer';
import Login from './components/Login';
import Profile from './components/Profile';
import Contact from './components/Contact';
import ResetPass from './components/ResetPass';
import ForgotPass from './components/ForgotPass';
import Register from './components/Register';


class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Switch > 
          <Route exact path='/' />  
          <Route path='/login' component={Login}/> 
          <Route path='/contact' component={Contact}/>   
          <Route path='/profile' component={Profile}/>   
          <Route path='/register' component={Register}/> 
          <Route path='/:brand_name/cashback' component={Brand}/> 
          <Route path='/reset-password' component={ResetPass} />
          <Route path='/forgot-password' component={ForgotPass} />
          <Route component={NoMatch} />   
        </Switch> 
        <Footer />       
      </React.Fragment> 
    );
  }
}


const NoMatch = () => {
  return (
    <div>
      <h2>404: Not Found</h2>
      <Link to='/'>Go back to home ---------></Link>
    </div>
  )
}

export default App;
