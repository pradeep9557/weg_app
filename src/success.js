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

export default class success extends Component {
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

    handleBackButton = () => {
        console.log('Success js',this.props.navigation);
        console.log('Success js2',this.props.navigation.state.routeName);
        this.props.navigation.navigate('ScreenOne');
        return true;
    }

    redirect(){
        this.props.navigation.navigate('ScreenOne');
    }

    format(){
        console.log(this.props.navigation.state.params.data.order_id);
        console.log(this.props.navigation.state.params.data.products);
        this.setState({btn: <Button onPress={() => this.redirect()} raised title='Continue Shopping' style={{ width: '100%' }} backgroundColor="#51c0c3" />});
        var data = this.props.navigation.state.params.data.products.map(data => {
            console.log(data);
            return <View key={data.key}><View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{ padding: 5,width:'60%', fontSize: 14 }}>{data.name}</Text>
                        <Text style={{ padding: 5,width:'10%', fontSize: 14 }}>{data.quantity}</Text>
                        <Text style={{ padding: 5,width:'30%', fontSize: 14 }}>{data.total}</Text>
                    </View>
                </View>;
        })
        this.setState({ products: data });
        var total = this.props.navigation.state.params.data.totals.map(function(data, key){
            return <View style={styles.row} key={key}>
              <View style={styles.col}><Text style={{fontWeight:'bold'}}>{data.title}</Text></View>
              <View style={styles.col}><Text style={{fontWeight:'bold'}}>{data.text}</Text></View>
            </View>;
          });
          this.setState({total:total});
    }

    componentDidMount() {
        this.format();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

	render(){
        return (
            <ScrollView>
                <View style={styles.container}>
                    <StatusBar
                        backgroundColor="#51c0c3"
                        barStyle="light-content"
                    />
                    <View style={styles.card}>
                        <View style={{ flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1, justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 18, padding: 5, fontWeight: 'bold' }}>Thankyou your Order No:#{this.props.navigation.state.params.data.order_id} is Confirmed </Text>
                        </View>
                        {this.state.products}
                        {this.state.total}
                    </View>
                     {this.state.btn}
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