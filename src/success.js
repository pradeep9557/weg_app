import React, { Component } from 'react';
import {
    Text, ScrollView,
    View, StatusBar, StyleSheet, AsyncStorage, TouchableHighlight, ToastAndroid
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { CheckBox, Button } from 'react-native-elements';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import { ProgressDialog } from 'react-native-simple-dialogs';

export default class success extends Component {

	static navigationOptions = {
        title: 'Success',
        headerLeft: null,
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#51c0c3'
        }
    };

	render(){
		console.log(this.props.navigation.state.params.data.order_id);
		console.log(this.props.navigation.state.params.data.products);
        return (
            <ScrollView>
                <View style={styles.container}>
                    <StatusBar
                        backgroundColor="#51c0c3"
                        barStyle="light-content"
                    />
                    <View>
                        <Text style={{ fontSize: 18, padding: 5, fontWeight: 'bold' }}>Thankyou your Order No:#{this.props.navigation.state.params.data.order_id} is Confirmed </Text>
                    </View>
                </View>
            </ScrollView>
        );
    }
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