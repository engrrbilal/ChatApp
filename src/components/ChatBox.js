import React from 'react';
import * as firebase from 'firebase';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
// import {List, ListItem,Card} from 'material-ui';
import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import {ButtonToolbar, Button} from 'react-bootstrap';
import {
    blue300,
    indigo900,
    orange200,
    deepOrange300,
    pink400,
    purple500,
  } from 'material-ui/styles/colors';
  import Header from './AppBar';
import { green100 } from 'material-ui/styles/colors';
import { lightBlue300 } from 'material-ui/styles/colors';
import { lightBlack } from 'material-ui/styles/colors';
import { white } from 'material-ui/styles/colors';

const styles = {
    container:{
        // display: 'flex',
        // flexDirection: 'row wrap',
        padding: 20,
        alignItem:"center"
    },
    
    styleUser:{
        marginTop: 10,
        marginLeft:10,
        marginRight: 10,
    },
    styleChat : {
        flex:2,
        height: 630,
        width:450,
        marginLeft: 400,
        visibility:"hidden"
      },
      styleSubheader:{
        backgroundColor:"darkBlue",
        height:40,
        color:"white",
        fontWeight:"bold",
        fontSize: 18
    },
    styleMessage:{
        maxWidth:250,
        margin:10,
        float:"right",
        wordBreak:' break-all',
        border:"1px solid",
        borderRadius:10,
        backgroundColor:lightBlack,
        color:white,
        padding:10,
        borderBottomRightRadius:"0px 0px",
        boxShadow: "3px 3px 3px black"
    },
    styleMessageleft:{
        maxWidth:250,
        margin:10,
        float:"left",
        color:"white",
        wordBreak:' break-all',
        border:"1px solid",
        borderRadius:10,
        backgroundColor:blue300,
        padding:10,
        borderTopLeftRadius:"0px 0px",
        boxShadow: "3px 3px 3px Black"
    },
    styleInput:{
        width:200
    },

    closeChat:{
      color: "#AA9",
      fontWeight: "bold",
      float: "right",
      cursor: "pointer",
      marginRight:10,
      fontSize: 32
    },
  
    
}
class ChatBox extends React.Component{
    constructor(props){
        super(props)
        this.state={
            message:'',
            visible:'hidden'
        }
    }
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }
      
      componentDidMount() {
        this.scrollToBottom();
      }
      
      componentDidUpdate() {
        this.scrollToBottom();
      }
    messageHandler(){
        console.log(this.props.global)
                if(this.state.message.trim()){
                    let ref1 = firebase.database().ref(`Chat/${this.props.uid}`).child(this.props.global)
                    let ref2 = firebase.database().ref(`Chat/${this.props.global}`).child(this.props.uid)
                    ref1.push({
                        message:this.state.message,
                        createdAt:Date.now(),
                        id:this.props.uid
                      }).then(()=>{
                        ref2.push({
                            message:this.state.message,
                            createdAt:Date.now(),
                            id:this.props.uid

                          })
                        console.log("Message saved")
                        this.setState({message:''})
                    }).catch(console.log("Error while saving messages")) 
      
            } 
         
    }

    
    chatHidden(){
        // alert('User Clicked')
        document.getElementById("chat").style.visibility = "hidden";
        
    }
    render(){
        return (
            <div>
                <div style={styles.container}>
                <Paper style={styles.styleChat} zDepth={3} id="chat">
                    
                        <Subheader style={styles.styleSubheader}>{this.props.globalName}<span style={styles.closeChat} 
                             onClick={this.chatHidden}>
                                &times;
                            </span>
                        </Subheader>
                        <div style={{height:'89%',overflow: 'auto'}}>
                        <div>
                            {this.props.messages.map((msg,index)=>
                            {
                                console.log(msg.id)
                                if((msg.id)===this.props.global){
                                  {  console.log('right')}
                                  return(
                                      <div style={{height:"auto",width:"100%",float:"left"}}>
                                        <p style={styles.styleMessageleft}  >
                                                 {msg.message}
                                        </p>
                                        <br/>
                                    </div>
                                  )
                                }
                               else if((msg.id)===this.props.uid){
                                   {
                                        console.log('lef')
                                    console.log(msg.message+msg.id)
                                   }
                                return(
                                    <div style={{height:"auto",width:"100%",float:"right"}}>
                                         <p  style={styles.styleMessage} >
                                              {msg.message}
                                         </p>
                                         <br/>
                                    </div>
                                )
                                }
                            }
                            )}    
                        </div>
                        <div style={{ float:"left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                    <div>
                        <form onSubmit={ev => ev.preventDefault()} id="input"y>
                             <Paper style={styles.styleInput} zDepth={3} style={{borderRadius:10}}>
                             <TextField
                                 hintText="Type Message"
                                 underlineShow={false}
                                 value={this.state.message}
                                 onChange={ev => this.setState({message:ev.target.value})}
                             />
                             <FlatButton label="Send" primary={true} 
                             type="submit" style={{marginLeft:80}} onClick={this.messageHandler.bind(this)}/>  
                             
                            </Paper>
                             
                        </form>
                        </div>
                        </Paper>
                </div>
            </div>
        )
    }
}
export default ChatBox