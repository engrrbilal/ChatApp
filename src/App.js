import React, { Component } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import FlatButton from 'material-ui/FlatButton';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
class App extends Component {
  render() {
    return (
      <div >
          <BrowserRouter>
          <div>
            <switch>
              <Route exact path="/" component={Login}/>
              <Route path="/signup" component={Signup} />
              <Route path="/dashboard" component={Dashboard}/>
            </switch>
        </div>
      </BrowserRouter>
      </div>
    );
  }
}
export default App;
