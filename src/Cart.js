/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  StyleSheet, AsyncStorage, Image, Alert, Dimensions, TextInput,
  ScrollView, ActivityIndicator, ImageBackground, ToastAndroid,
  View, StatusBar, TouchableHighlight,RefreshControl
} from 'react-native';
import env from './components/env';
import { ListItem, SearchBar, Header, CheckBox, Button, FormLabel, FormInput, FormValidationMessage, Divider } from 'react-native-elements';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { HeaderBackButton } from 'react-navigation';
import { ProgressDialog } from 'react-native-simple-dialogs';

var { height, width } = Dimensions.get('window');
class Page1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progressVisible:false,
      allowCouponApply:true,
      refreshing: false,
      products: <ActivityIndicator size="large" color="#51c0c3" />
    };
  }
  static navigationOptions = ({ navigation }) => ({
    title: 'Cart',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#51c0c3'
    }
  });

  _onRefresh = () => {
    this.setState({refreshing: true});
    console.log('Refreshing');
    this.fetchData();
  }

  fetchData(){
    this.getProducts();
    this.setState({refreshing: false});
  }  

  increase(data) {
    this.setState({progressVisible:true});
    AsyncStorage.getItem('token').then((token) => {
      fetch(env.BASE_URL + "rest/cart/cart", {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + JSON.parse(token).access_token,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: data.key, quantity: parseInt(data.quantity) + 1 })
      }).then((response) => response.json())
        .then((responseData) => {
          console.log(responseData);
          if (responseData.success == 1) {
            this.getProducts();
            this.setState({progressVisible:false});
          } else{
            this.setState({progressVisible:false});
          }
        });
    })
  }
  decrease(data) {
    this.setState({progressVisible:true});
    if (parseInt(data.quantity) > 1) {
      AsyncStorage.getItem('token').then((token) => {
        fetch(env.BASE_URL + "rest/cart/cart", {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + JSON.parse(token).access_token,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ key: data.key, quantity: parseInt(data.quantity) - 1 })
        }).then((response) => response.json())
          .then((responseData) => {
            console.log(responseData);
            if (responseData.success == 1) {
              this.getProducts();
              this.setState({progressVisible:false});
            }else{
              this.setState({progressVisible:false});
            }
          });
      })
    } else {
      this.setState({progressVisible:false});
      Alert.alert(
        'Confirmation',
        'Are you sure you want to delete 1 item',
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'OK', onPress: () => this.confirmRemove(data.key) },
        ],
        { cancelable: false }
      )
    }
  }
  confirmRemove(key) {
    this.setState({progressVisible:true});
    AsyncStorage.getItem('token').then((token) => {
      fetch(env.BASE_URL + "rest/cart/cart&key=" + key, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + JSON.parse(token).access_token
        }
      }).then((response) => response.json())
        .then((responseData) => {
          this.setState({progressVisible:false});
          ToastAndroid.show('Delete Successfully', ToastAndroid.SHORT);
          this.getProducts();
        });
    });
  }

  confirm(){
    AsyncStorage.getItem('user').then((user) => {
      console.log(JSON.parse(user).name);
      if (JSON.parse(user).name == 'guest') {
        Alert.alert(
          'Login',
          'You must login or create account to save item to your wish list',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'Login', onPress: () => this.props.navigation.navigate('Login')},
          ],
          { cancelable: false }
        )
      } else {
        this.props.navigation.navigate('Confirm');
      }
    });
  }

  getProducts() {
    AsyncStorage.getItem('token').then((token) => {
      fetch(env.BASE_URL + "rest/cart/cart", {
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + JSON.parse(token).access_token
        }
      }).then((response) => response.json())
        .then((responseData) => {
          if (responseData.success == 1) {
            if (responseData.data.products != undefined) {
              var data = responseData.data.products.map((data) => {
                if (data.quantity == "1") {
                  var trash = <Text style={{ color: 'white', fontSize: 14 }}><FontAwesome>{Icons.trash}</FontAwesome></Text>;
                } else {
                  var trash = <Text style={{ color: 'white', fontSize: 14 }}>-</Text>;
                }
                return <View style={styles.card} key={data.key}>
                  <View style={styles.content}>
                    <ImageBackground source={{ uri: data.thumb }} style={styles.image}>
                    </ImageBackground>
                    <View style={styles.productContent}>
                      <Text style={styles.title}>{data.name}</Text>
                      <View style={styles.QTY}>
                        <TouchableHighlight onPress={() => this.decrease(data)} style={styles.min}>{trash}</TouchableHighlight>
                        <Text style={styles.qtyNo}>{data.quantity}</Text>
                        <TouchableHighlight onPress={() => this.increase(data)} style={styles.min}><Text style={{ color: 'white', fontSize: 14 }}>+</Text></TouchableHighlight>
                      </View>
                    </View>
                  </View>
                  <View style={styles.footer}>
                    <View style={styles.unit}><Text>Unit Price</Text><Text style={{}}>{data.price}</Text></View>
                    <View style={styles.unit}><Text>Sub Total</Text><Text style={{}}>{data.total}</Text></View>
                  </View>
                </View>;
              });
              this.setState({ continueBtn: <View style={{ width: '100%', backgroundColor: '#51c0c3', height: 50, left: 0, right: 0, padding: 0, paddingTop: 3, position: 'absolute', bottom: 0 }}><Button onPress={() => this.confirm()} title={'Continue (Rs. ' + responseData.data.total_raw + ')'} buttonStyle={{ backgroundColor: '#51c0c3', justifyContent: 'center', width: '100%', alignItems: 'center' }} /></View> });
              this.setState({ products: data });

              if (responseData.data.totals) {
                var total = responseData.data.totals.map(function (data, key) {
                  return <View style={styles.row} key={key}>
                    <View style={styles.col}><Text style={{ fontWeight: 'bold' }}>{data.title}</Text></View>
                    <View style={styles.col}><Text style={{ fontWeight: 'bold' }}>{data.text}</Text></View>
                  </View>;
                })
                this.setState({
                  total: <View><View style={styles.coupen} accessible={false}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>APPLY COUPON CODE</Text>
                    <Text>Enter your coupon code if you have one</Text>
                    <TextInput
                      editable={this.state.allowCouponApply}
                      style={{ height: 50, width: '100%' }}
                      onChangeText={(coupon) => this.setState({ coupon })}
                      placeholder="Enter Coupon Code"
                      value={this.state.coupon}
                    />
                    <Button onPress={() => this.coupenApply()} raised title='Apply' backgroundColor="#51c0c3" disabled={!this.state.allowCouponApply} />
                  </View><View style={styles.box}>{total}</View></View>
                });
              }
            } else {
              this.setState({ total: <Text></Text> });
              this.setState({ continueBtn: <View></View> });
              this.setState({
                products: <View style={styles.cartEmpty}>
                  <FontAwesome style={{ fontSize: 100, color: '#ccc' }}>{Icons.shoppingBag}</FontAwesome>
                  <Text>No Item Found</Text>
                </View>
              });
            }
          }
        })
    })
  }

  coupenApply() {
    this.setState({progressVisible:true});
    AsyncStorage.getItem('user').then((user) => {
      console.log(JSON.parse(user).name);
      if (JSON.parse(user).name == 'guest') {
        this.setState({progressVisible:false});
        Alert.alert(
          'Login',
          'You must login or create account to save item to your wish list',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'Login', onPress: () => this.props.navigation.navigate('Login')},
          ],
          { cancelable: false }
        )
      } else {
        AsyncStorage.getItem('token').then((token) => {
          fetch(env.BASE_URL + "rest/cart/coupon", {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + JSON.parse(token).access_token,
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
          }).then((response) => response.json())
            .then((responseData) => {
              if (responseData.success == 1) {
                this.getProducts();
                this.setState({progressVisible:false});
                console.log(responseData);
              } else {
                this.setState({progressVisible:false,allowCouponApply:false});
                ToastAndroid.show(responseData.error[0], ToastAndroid.SHORT);
                this.getProducts();
               // alert(this.state.allowCouponApply)
              }
            })
        });
      }
    });
  }
  componentWillMount() {
    this.getProducts();
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        } >
          <StatusBar
            backgroundColor="#51c0c3"
            barStyle="light-content"
          />
        <ProgressDialog
            visible={this.state.progressVisible}
            message="Please, wait..."
          />

          {this.state.products}

          {this.state.total}
        </ScrollView>
        {this.state.continueBtn}
      </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    paddingBottom: 50
  },
  coupen: {
    backgroundColor: '#FFFFE0',
    padding: 10,
    marginBottom: 10,
    alignItems: 'center'
  },
  cartEmpty: {
    flex: 1,
    height: height / 2 + 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    height: 200,
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 10,
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    height: 130,
    width: '100%',
    flex: 1,
    flexDirection: 'row'
  },
  image: {
    height: 130,
    width: '40%',
    backgroundColor: 'black'
  },
  productContent: {
    padding: 10,
    width: '60%'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  footer: {
    backgroundColor: '#fffaf9',
    height: 70,
    width: '100%',
    flexDirection: 'column'
  },
  unit: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  QTY: {
    flexDirection: 'row',
    marginTop: 20
  },
  min: {
    backgroundColor: '#51c0c3',
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  qtyNo: {
    height: 30,
    width: 30,
    backgroundColor: '#fffaf9',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: 5,
  },
  box: {
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    justifyContent: 'space-between',
    padding: 10,
  }
});

export default Page1;
