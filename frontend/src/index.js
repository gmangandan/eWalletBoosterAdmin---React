import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from 'react-router-dom';
import '@fortawesome/fontawesome-free';


ReactDOM.render(
<BrowserRouter>
    <App style={{backgroundColor: 'white', maxWidth: '100%'}}/>
</BrowserRouter>,
document.getElementById('root'));
registerServiceWorker();

