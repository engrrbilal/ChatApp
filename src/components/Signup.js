import React from 'react';
import * as firebase from 'firebase';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator } from 'react-material-ui-form-validator';
import {iconElementLeft,IconButton,Paper,FlatButton,RaisedButton,AppBar} from 'material-ui';
import {Link} from 'react-router-dom';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Spinner} from './Spinner';
import Login from './Login'

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
  },
  styleName:{
    marginTop: 50,
    marginLeft:40,
    marginRight: 40,
    marginBottom: 0
},
  styleOthers:{
    marginTop: 15,
    marginLeft:40,
    marginRight: 40,
    marginBottom: 0
},
  styleButton:{
    marginTop: 20
  },
  block: {
    maxWidth: 50
  },
  radioButton: {
    marginBottom: 16,
    display: 'inline-block',
    width: '120px'
    
  },
};
class Signup extends React.Component {
  constructor(props){
    super(props);
    this.SignupHandler = this.SignupHandler.bind(this);
    this.state ={
      fullName:"",
      email:"",
      password:"", 
      error: '',
      gender:'',
      loading: false,
      loggedIn:null
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
 
  SignupHandler(){
    
    console.log("creating account ...");
    const { email, password } = this.state;
        if(this.state.fullName.trim() && this.state.gender.trim()){
          this.setState({ error: ' ', loading: true});
          firebase.auth().createUserWithEmailAndPassword(email,password)
         .then( data =>{
           let uid = data.uid
          firebase.database().ref(`Users/${uid}`).set({
          fullName:this.state.fullName,
          email:this.state.email,
          password:this.state.password,
          gender:this.state.gender,
          createdAt:Date.now()
        }).then(()=>{
          console.log("Data saved")
          this.onSignupSucess().bind(this)
        }).catch((e) => {
          console.log("This is failed.",e)
        })
        }).catch(this.onSignupFail.bind(this))
        }
        
  }
  onSignupSucess() {
    this.props.history.push('/dashboard');
    this.setState({
        loading: false,
        error: ''
    })
  }
  onSignupFail() {
    this.setState(()=>({
            error: "Auth error!",
            loading : false 
        }));
  }
renderButton(){
  if (this.state.loading) {
      return <Spinner/>;
  }
  return (
    <RaisedButton label="Create Account" primary={true}
      style={styles.styleButton}  type="submit" onClick={this.SignupHandler}/>
  );
}
  render(){
    return (
      <div>
        <AppBar
                title={"Chat App"}
                iconElementLeft={<IconButton></IconButton>}
                iconElementRight={this.state.loggedIn? <RaisedButton primary={true}
                    label="Sign out" onClick={() => firebase.auth().signOut().then(()=>this.props.history.push("/"))} 
                />:<Link to="/"><FlatButton label="Login" /></Link>}
           />
        <Paper zDepth={3} style={styles.style}>
        <ValidatorForm onSubmit={(e)=> e.preventDefault()}>
          <Paper style={styles.styleName}>
            <TextValidator hintText="Full Name" 
            value={this.state.fullName}
            name="name"
            underlineShow={false} fullWidth={false}
            onChange={ev => this.setState({fullName: ev.target.value})}
            required
            errorMessages={['this field is required']}
            />
          </Paper>
          <Paper style={styles.styleOthers}>
            <TextValidator hintText="Email Address" 
            value={this.state.email}
            name="email"
            underlineShow={false} fullWidth={false}
            validators={['required', 'isEmail']}
            errorMessages={['this field is required', 'email is not valid']}
            onChange={ev => this.setState({email: ev.target.value})}
            />
          </Paper>
          <Paper style={styles.styleOthers}>
            <TextValidator
            value={this.state.password}
              hintText="Password"
              name="pass"
              underlineShow={false} fullWidth={false}
              type="password"
              validators={['required']}
              errorMessages={['this field is required']}
              onChange={ev => this.setState({password:ev.target.value})}
            />
          </Paper>
          <br />
          <RadioButtonGroup name="shipSpeed" >
            <RadioButton
              value="Male"
              label="Male"
              required
              style={styles.radioButton}
              checked={this.state.gender === 'Male'}
              onClick={changeEvent =>this.setState({
                gender: changeEvent.target.value
              })}
            />
            <RadioButton
              value="Female"
              label="Female"
              required
              style={styles.radioButton}
              checked={this.state.gender === 'Female'}
              onClick={changeEvent =>this.setState({
              gender: changeEvent.target.value
              })}
            />
          </RadioButtonGroup>
          <p style={{color:"red"}}>{this.state.error}</p>
          {this.renderButton()}
       </ValidatorForm>
      </Paper>
    </div>
    );
 }
}

export default Signup