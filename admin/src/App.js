import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import 'bulma';
import 'bulma/css/bulma.css';
import 'bulma-steps/dist/css/bulma-steps.min.css';
import 'bulma-steps/dist/css/bulma-steps.sass';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import Login from './components/Login';
import ForgotPass from './components/ForgotPass';
import ResetPass from './components/ResetPass';
import Dashboard from './components/Dashboard';
import UserAccounts from './components/UserAccounts';
import userManager from './components/userManager';
import userView from './components/userView';
import UserApplications from './components/UserApplications';
import turnOverCashback from './components/turnOverCashback';
import payoutList from './components/payoutList';
import payoutManager from './components/payoutManager';
import staticTextList from './components/staticTextList';
import staticTextManager from './components/staticTextManager';
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch >
          <Route exact path='/' component={Login} />
          <Route exact path='/forgot-password' component={ForgotPass} />
          <Route exact path='/reset-password' component={ResetPass} />
          <Route exact path='/dashboard' component={Dashboard} />
          <Route exact path='/user-accounts' component={UserAccounts} />
          <Route exact path='/manage-user' component={userManager} />
          <Route exact path='/manage-user/:id' component={userManager} />
          <Route exact path='/view-user/:id' component={userView} />
          <Route exact path='/user-applications' component={UserApplications} />
          <Route exact path='/turn-over-cashback/:scheme' component={turnOverCashback} />
          <Route exact path='/payout/:scheme' component={payoutList} />
          <Route exact path='/manage-payout/:id' component={payoutManager} />

          <Route exact path='/text-list' component={staticTextList} />
          <Route exact path='/manage-text' component={staticTextManager} />
          <Route exact path='/manage-text/:id' component={staticTextManager} />

          <Route component={NoMatch} />
        </Switch>
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
