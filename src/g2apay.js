import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import {
    Text, ScrollView,
    View, StatusBar, StyleSheet, AsyncStorage, TouchableHighlight, ToastAndroid
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { CheckBox, Button } from 'react-native-elements';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import { ProgressDialog } from 'react-native-simple-dialogs';

export default class g2apay extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
	static navigationOptions = {
        title: 'Success',
        headerLeft: null,
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#51c0c3'
        }
    };
    
}
const styles = StyleSheet.create({
    container: {
        padding: 0,
        flex: 1,
        paddingBottom: 50
    },
    AddBox: {
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1
    },
    text: {
        paddingLeft: 5
    },
    card: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 4,
    },
    row:{
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'#f5f5f5',
        justifyContent:'space-between',
        padding:10,
      }
});