import React from 'react';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator } from 'react-material-ui-form-validator';
import {iconElementLeft,IconButton,TextField,Paper,FlatButton,RaisedButton,AppBar} from 'material-ui';

import {Spinner} from './Spinner';
import Signup from './Signup'
import {Route,Switch,Link} from 'react-router-dom';
import * as firebase from 'firebase';

const styles = {
  style : {
    height: 500,
    width: 400,
    marginTop: 200,
    marginLeft:"40%",
    marginRight: 700,
    marginBottom: 400,
    textAlign: 'center',
    display: 'inline-block',
    borderRadius:5
  },
  styleEmail:{
    marginTop: 50,
    marginLeft:40,
    marginRight: 40,
    marginBottom: 15
},
  stylePassword:{
    marginTop: 0,
    marginLeft:40,
    marginRight: 40,
    marginBottom: 0
},
  styleButton:{
    marginTop: 20
  },
};


class Login extends React.Component{
  
    constructor(props){
      super(props);
      this.SigninHandler = this.SigninHandler.bind(this);
    this.state ={
      email:"",
      password:"", 
      error: '',
      loading: false,
      loggedIn: null
    }
    }
  componentWillMount(){
      firebase.auth().onAuthStateChanged((user) => {
          if (user) {
              this.setState({ 
                  loggedIn: true,
               });
          } else {
              this.setState({ loggedIn: false });
          }
      });
  }
    SigninHandler(){
      const { email, password } = this.state;
        
        this.setState({ error: ' ', loading: true});        

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(this.onLoginSucess.bind(this))
        .catch(this.onLoginFail.bind(this))
    }
    onLoginFail() {
      this.setState(()=>{
          return{
              error: "Auth error!",
              loading : false 
          }
          });
          console.log(this.state.error)
  }

  onLoginSucess() {
    if(firebase.User){
      this.props.history.push('/dashboard');
    }
      
    this.setState({
          email: '',
          password: '',
          loading: false,
          error: ''
      });
      console.log('success')
  }
  renderButton(){
    if (this.state.loading) {
        return <Spinner/>;
    }
    return (
      <RaisedButton label="Login" primary={true}
      style={styles.styleButton} type="submit" onClick={this.SigninHandler}/>
    );
}
SignupHandler(){
  // <Redirect to="/signup" />
  <Route path="/signup" component={Signup} />
}
    render(){
      return(
        <div>
          <AppBar
                title={"Chat App"}
                iconElementLeft={<IconButton></IconButton>}
                iconElementRight={this.state.loggedIn? <RaisedButton primary={true}
                    label="Sign out" onClick={() => firebase.auth().signOut().then(()=>this.props.history.push('/'))} 
                />:<FlatButton label="Login" />}
           />
          <Paper zDepth={3} style={styles.style} >
          <ValidatorForm onSubmit={(e) => e.preventDefault()}>
            <Paper style={styles.styleEmail} >
                <TextValidator
                 hintText="Email Address" 
                underlineShow={false} fullWidth={false}
                value={this.state.email}
                onChange={ev => this.setState({email:ev.target.value})}
                name="email"
                validators={['required', 'isEmail']}
                errorMessages={['this field is required', 'email is not valid']}
                />
              </Paper>
              <Paper id="pasword" style={styles.stylePassword}>
                <TextValidator
                  value={this.state.password}
                  hintText="Password"
                  name="pass"
                  type="password"
                  validators={['required']}
                  errorMessages={['this field is required']} 
                  
                  underlineShow={false} fullWidth={false}
                  onChange={ev => this.setState({password:ev.target.value})}
                />
              </Paper>
              <p style={{color:"red"}}>{this.state.error}</p>
              {this.renderButton()}
          </ValidatorForm>
            <br />
            'OR'
            <br />
            <Link to="/signup">
             <FlatButton label="Sign up for Chat" primary={true} onClick={this.SignupHandler()} />
           </Link>
          </Paper>
        </div>
      )
    }

  }

export default Login