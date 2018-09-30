/* @flow */

import React, { PureComponent } from 'react';
import { ListView, View, Text, StyleSheet, Image,TextInput, ToastAndroid, AsyncStorage, TouchableOpacity,TouchableHighlight, StatusBar, ScrollView } from 'react-native';

var SplashScreen = require('@remobile/react-native-splashscreen');
import Icon from 'react-native-vector-icons/FontAwesome';
import { ListItem, SearchBar, Header,CheckBox, Button, FormLabel, FormInput, FormValidationMessage, Divider } from 'react-native-elements';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import env from './components/env';
import { ProgressDialog,Dialog } from 'react-native-simple-dialogs';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
// var { FBLogin, FBLoginManager } = require('react-native-facebook-login');
import { LoginManager, AccessToken } from 'react-native-fbsdk';

export default class ListViewExample extends PureComponent<{}, State> {
  constructor(props){
    super(props);
    this.state = {
      loading:false,
      progressVisible:false,
      ForgotPassword:false 
    }
  }


  static navigationOptions = ({ navigation }) => ({
    title: 'Login',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#51c0c3'
    },

  })

  _toggle(event) {
    this.setState({checked: !this.state.checked});
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId:'70631952474-feshf136lhvg1qlvqfvu0icss9kch0s1.apps.googleusercontent.com'
    });
  }

   _fbAuth(){    
        LoginManager.logInWithReadPermissions(['public_profile','email']).then((result)=>{
          if(result.isCancelled){
            console.log('Login was Cancelled');
            alert("canceled by user");
          }
          else{ 
            AccessToken.getCurrentAccessToken().then((data) => {
              const { accessToken } = data
              this.initUser(accessToken)
            });
            this.props.navigation.navigate("sendRecive");
          }
        },function(error){
          console.log('An error occured:' + error);
         
        });
       
      }

  initUser(token) {
        this.setState({progressVisible:true});
        fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends,picture&access_token=' + token)
        .then((response) =>{return response.json()})
        .then((json) => {
          json.photo=json.picture.data.url;
          let params = {email: json.email, image: json.picture.data.url, name: json.name,role:'user',status:'activated',provider:'facebook'}
          console.log("this.props", this.props);
          console.log('this.params',params);
          AsyncStorage.getItem('token').then((token) => {
            fetch(env.BASE_URL+"rest/login/socialloginforapp", {
              method:'POST',
              headers:{
                Authorization: 'Bearer ' + JSON.parse(token).access_token,
                Accept  : 'application/json',
                'Content-Type' : 'application/json'
              },
              body:JSON.stringify(params)
            }).then((response) => response.json())
            .then((responseData) => {
              console.log(responseData);
              this.setState({progressVisible:false});
              console.log(responseData);
              if(responseData.success == 1)
              {
                AsyncStorage.setItem('user', JSON.stringify({ name: responseData.data.firstname }));
                AsyncStorage.setItem('user_detail', JSON.stringify(responseData.data));
                this.props.navigation.navigate('ScreenOne');
              }else if(responseData.error[0] == "User is logged."){
                this.props.navigation.navigate('ScreenOne');
              }else{
                ToastAndroid.show(responseData.error[0], ToastAndroid.SHORT);
              }
              
            }).catch(e=>console.log(e))
          }).catch(e=>console.log(e));
          /*reaquestData('user/socialAuthenticate',params,'PUT').then((response)=>{
            console.log('response',response);
            if(response.status=="success"){
              this.props.login_success(response.data);
              AsyncStorage.setItem('yearly_bonus',response.data.yearly_bonus);
              //this.props.navigation.navigate("sendRecive");
            }else if(response.status=="failed"){
              alert(response.message);
            }else{
              console.log(response);
            }         
          }).catch(error=>{
            console.log(error);
          });*/
          
        })
        .catch(() => {
          console.log('ERROR GETTING DATA FROM FACEBOOK')
        })
      }

  googleAuth() {
    
    GoogleSignin.signIn().then((user) => { alert(JSON.stringify(user));
    console.log('google',user); let params = {email: user.email, image:
    user.photo, name:
    user.givenName,role:'user',status:'activated',provider:'google'}
    console.log("this.props", this.props);

      }).catch((err) => {
        console.log(err);
      }).done();
  }

  render() {
    const { navigate } = this.props.navigation
    var _this = this;
    return (
      <View style={styles.container}>
      <ScrollView>
        <StatusBar
          backgroundColor="#51c0c3"
          barStyle="light-content"
        />        
        <ProgressDialog
            visible={this.state.progressVisible}
            message="Authentication"
          />
        <View style={styles.row}>
           
            <FormLabel>Email</FormLabel>
            <FormInput keyboardType={'email-address'} onChangeText={(email) => this.setState({email})} placeholder="Enter your email"/>

           
            <FormLabel>Password</FormLabel>
            <FormInput secureTextEntry={true} onChangeText={(password) => this.setState({password})} placeholder="Enter your password"/>
           
            <Button onPress={()=>this.submit()} raised title='Login' style={{ width: '100%' }} backgroundColor="#51c0c3" />
        </View>
        <Dialog
          visible={this.state.ForgotPassword}
          title="FORGOT YOUR PASSWORD?"
          onTouchOutside={() => this.setState({ ForgotPassword: false })} >
          <View style={{height:180}}>
            <View style={styles.row_txt}>
              <Text>Enter the e-mail address associated with your account. Click submit to have a password reset link e-mailed to you.</Text>
              <Text style={{fontWeight:'bold',fontSize:15,marginBottom:5,marginTop:5}}>Your E-Mail Address</Text>
              <TextInput
                style={{ height: 40, borderColor: '#ccc', borderWidth: 1, width: '100%',borderRadius:5,paddingLeft:15 }}
                onChangeText={(email) => this.setState({ email })}
                underlineColorAndroid='white'
                placeholder="Enter Email Id"                
                value={this.state.email}
              />
            </View>

            <View style={[styles.row, {flexDirection:'row',paddingTop:10, justifyContent: 'flex-end',marginTop:5 }]}>
              <TouchableOpacity onPress={() => this.setState({ ForgotPassword: false })} style={{ padding: 10,backgroundColor:'#51c0c3',width:'49%',marginRight:5 }}>
                <Text style={{ textAlign: 'center',color: '#fff',fontWeight:'bold',fontSize:16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.forgotPassword()} style={{ padding: 10,backgroundColor:'#51c0c3',width:'49%'}}>
                <Text style={{ textAlign: 'center', color: '#fff',fontWeight:'bold',fontSize:16 }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Dialog>
        <View style={{marginTop:30,alignItems:'center'}}>
        <TouchableOpacity onPress={ ()=>this._fbAuth()}>
            <Text>Facebook</Text>
        </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.setState({ ForgotPassword: true })}>
            <Text style={{fontWeight:'bold',padding:5}}>Forgot Password <Text style={{color:'#51c0c3'}}>Click here</Text></Text>
          </TouchableOpacity>

        </View>
        </ScrollView>
      </View>
    );
  }

  submit(){
      this.setState({progressVisible:true});
      AsyncStorage.getItem('token').then((token) => {
        fetch(env.BASE_URL+"rest/login/login", {
          method:'POST',
          headers:{
            Authorization: 'Bearer ' + JSON.parse(token).access_token,
            Accept  : 'application/json',
            'Content-Type' : 'application/json'
          },
          body:JSON.stringify(this.state)
        }).then((response) => response.json())
        .then((responseData) => {
          this.setState({progressVisible:false});
          console.log(responseData);
          if(responseData.success == 1)
          {
            AsyncStorage.setItem('user', JSON.stringify({ name: responseData.data.firstname }));
            AsyncStorage.setItem('user_detail', JSON.stringify(responseData.data));
            this.props.navigation.navigate('ScreenOne');
          }else if(responseData.error[0] == "User is logged."){
            this.props.navigation.navigate('ScreenOne');
          }else{
            ToastAndroid.show(responseData.error[0], ToastAndroid.SHORT);
          }
          
        }).catch(e=>console.log(e))
      }).catch(e=>console.log(e));
    
  }
  forgotPassword(){
    console.log('forgetpaSSWORD',this.state.email);

    if(this.state.email=='' || this.state.email==null){
      ToastAndroid.show('Please entern email id', ToastAndroid.SHORT);
      this.setState({ForgotPassword:false});
    }
    //this.setState(ForgotPassword:false});
      AsyncStorage.getItem('token').then((token) => {
        console.log(token);
        console.log(JSON.stringify(this.state));
        console.log(env.BASE_URL+"account/fpassword");
        fetch(env.BASE_URL+"rest/account/fpassword", {
          method:'POST',
          headers:{
            Authorization: 'Bearer ' + JSON.parse(token).access_token,
            Accept  : 'application/json',
            'Content-Type' : 'application/json'
          },
          body:JSON.stringify({email:this.state.email})
        }).then((response) => response.json())
        .then((responseData) => {
          console.log(response);
          console.log(responseData);
          this.setState({progressVisible:false});
          console.log(responseData);
          if(responseData.result == 'success')
          { 
            this.setState({ ForgotPassword: false });
            ToastAndroid.show(responseData.msg, ToastAndroid.SHORT);
          }else{
            ToastAndroid.show(responseData.error[0], ToastAndroid.SHORT);
          }
          
        })
      })
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    backgroundColor:'white'
  },
  heading:{
      backgroundColor:'#f5f5f5',
      fontSize:16,
      fontWeight:'bold',
      padding:5,
      borderBottomColor:'#ccc',
      borderBottomWidth:1,
      paddingLeft:20
  },
  row: {
    flex: 30,
    flexDirection: 'column',
    top: 0,
  },
  title: {
    color: '#999',
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 30,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    backgroundColor: '#ccc',

  },
  button_wrap: {
    marginTop: -20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});