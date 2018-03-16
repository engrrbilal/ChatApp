import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import {List, ListItem,Subheader,iconElementLeft,IconButton,Avatar,Paper,FlatButton,RaisedButton,TextField,AppBar} from 'material-ui';
import {Link} from 'react-router-dom';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import ChatBox from './ChatBox';
import {
    blue300,
    indigo900,
    orange200,
    deepOrange300,
    pink400,
    purple500,
} from 'material-ui/styles/colors';


const styles = {
    container:{
        display: 'flex',
        flexDirection: 'row wrap',
        padding: 20,
        marginTop: 100,
        alignItem:"center"
    },
    styleUserList : {
        // flex:1,
        height: 650,
        width:300,
        marginTop:20
    },
    styleUser:{
        marginTop: 10,
        marginLeft:10,
        marginRight: 10,
    },
      styleSubheader:{
        backgroundColor:"blue",
        color:"white",
        fontWeight:"bold",
        fontSize: 18
    }
}
class Dashboard extends React.Component{  
    constructor(props){
        super(props);
        this.state={
            users:[],
            messages:[],
            message:'',
            loggedIn: null,
            uid:'',
            displayName:'',
            global:'',
            globalName:''
        };
    }
    static propTypes = {
        stayScrolled: PropTypes.func,
        scrollBottom: PropTypes.func,
      }
    componentDidMount(){

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.userId = user.uid;
                const displayName = firebase.auth().currentUser.displayName
                this.setState({ 
                    loggedIn: true,
                    uid:this.userId,
                    displayName:displayName
                 });
            } else {
                this.setState({
                    loggedIn: false,
                    uid:this.userId
                 });
                 this.props.history.push("/")
            }
        })

        firebase.database().ref('Users').on('value',(snapshot) => {
          const usersData = [];
          snapshot.forEach((childSnapshot) => {
                usersData.push({
                    id:childSnapshot.key,
                    ...childSnapshot.val()
                  })
          })
        let chatlist=[]
        let displayName=''
        usersData.map((user,index)=>{
           if(user.id!==firebase.auth().currentUser.uid){
            chatlist.push({
                fullName:user.fullName,
                id:user.id
            })
           }
            this.setState(()=>({
                users: chatlist
              }))
              if(user.id===firebase.auth().currentUser.uid){
                  displayName=user.fullName
                  this.setState({
                    displayName:displayName
                })
              }
        })
   
        })  
          
        
        firebase.database().ref(`Chat/${this.state.uid}`).on("value",(data)=>{
            this.setState({
                data:data.val()
            })
        })
    }
    
    messageReference(id,name){
        if(id){
            this.setState({
                global:id,
                globalName:name
            })   
        }  
        document.getElementById("chat").style.visibility = "visible";
        firebase.database().ref(`Chat/${this.state.uid}`).on("value",(data)=>{
            let arr = [];
            if(data.val()!==null){
                let idData = data.val()[id]
            if(idData !== undefined){
                for(let i in idData){
                    arr.push(idData[i])
                }
                console.log(arr)
                this.setState({
                    messages:arr
                })
            }else{
                this.setState({
                    messages:[]
                })
            }
            }
        })
        
}
    render(){
        return (
            <div>
                <AppBar
                    title={"Chat App"}
                    iconElementLeft={<IconButton></IconButton>}
                    iconElementRight={this.state.loggedIn? <RaisedButton primary={true}
                        label="Sign out" onClick={() => firebase.auth().signOut().then(()=>this.props.history.push("/signup"))} 
                    />:<FlatButton label="Login" />}
               />
                <h1 style={{textAlign:"center",color:"white"}}>Welcome {this.state.displayName}</h1>
                <div style={styles.container}>
                <Paper style={styles.styleUserList} zDepth={3}>
                    <Subheader style={styles.styleSubheader}>Chat</Subheader>
                    <div style={{height:'89%',overflow: 'auto'}}>
                    <List>
                        
                        {this.state.users.map((user,index)=>
                            <ListItem style={styles.styleUser}
                            key={index}
                            rightIcon={<CommunicationChatBubble />}
                            
                            leftAvatar={<Avatar 
                                color={deepOrange300}
                                backgroundColor={purple500}
                                size={40}>{user.fullName.slice(0, 1)}</Avatar>}
                                onClick={()=> {
                                    console.log(user.id)
                                    this.messageReference(user.id,user.fullName)}}
                            >
                                {user.fullName}
                            </ListItem>
                        )}  
                        </List>
                        </div>
                </Paper>
                <ChatBox messages={this.state.messages} global={this.state.global} 
                uid={this.state.uid} globalName={this.state.globalName} />
                </div>
            </div>
        )
    }
}
export default Dashboard